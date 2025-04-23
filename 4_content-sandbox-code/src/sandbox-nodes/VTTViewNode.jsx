import React, { useState } from 'react';
import webvtt from 'node-webvtt';
import { Handle, Position, NodeResizeControl, useReactFlow } from '@xyflow/react';


const VTTViewNode = ( { id, data }) => {

    const { updateNodeData } = useReactFlow();

    const [transcript, setTranscript] = useState('');

    const processVTT = (vttData) => {
        const parsedVTT = webvtt.parse(vttData);
        const captions = [];
        let previousSpeaker = '';
        let currentSpeaker = '';
        let startTime = 0;
        let endTime = 0;
        let captionProcess = '';
        let currentText = '';
        let captionText = '';

        let captionArray = [];

        parsedVTT.cues.forEach((cue, index) => {


            if(cue.text.slice(-1) == '>')
            {
                captionProcess = cue.text.slice(0,-4)
                captionArray = captionProcess.split('>');
                currentText = captionArray[1].replace(/(?:\r\n|\r|\n)/g, ' ');
                currentSpeaker = captionArray[0].slice(3, captionArray[0].length) + "";
            }
            else{
                captionProcess = cue.text;
                currentText = cue.text;
                currentSpeaker = " ";
            }
            // captionProcess = cue.text.slice(0,-4);
            // captionArray = captionProcess.split('>');
            // currentText = captionArray[1].replace(/(?:\r\n|\r|\n)/g, ' ');
            // currentSpeaker = captionArray[0].slice(3, captionArray[0].length) + "";
            
            if (index === 0) {
                previousSpeaker = currentSpeaker;
                startTime = parseInt(cue.start);
            }

            if (currentSpeaker === previousSpeaker) {
                captionText += currentText + ' ';
                if (currentText.trim().endsWith('.')) {
                    captions.push(`${startTime}:${parseInt(cue.end)}:${currentSpeaker}:${captionText.trim()}`);
                    captionText = '';
                    startTime = parseInt(cue.end);
                }
            } 
            else {
                if (captionText) {
                    captions.push(`${startTime}:${parseInt(cue.start)}:${previousSpeaker}:${captionText.trim()}`);
                }
                captionText = currentText + ' ';
                previousSpeaker = currentSpeaker;
                startTime = parseInt(cue.start);
            }
        });

        if (captionText) {
            const lastCue = parsedVTT.cues[parsedVTT.cues.length - 1];
            captions.push(`${startTime} --> ${lastCue.end} [${currentSpeaker}]: ${captionText.trim()}`);
        }

        setTranscript(captions.join('\n'));
        updateNodeData(id, { text: captions.join('\n') })
    };


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.vtt')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const vttData = e.target.result;
                processVTT(vttData);
            };
            console.log("Parsing...")
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .vtt file');
        }
    };

    return (
        <>
    <div style={{ margin: '20px', backgroundColor: 'black' }}>
            <input style={{label: 'something', color: 'white', padding: '10px 0px 0px 10px', fontSize: 'small' }} type="file" accept=".vtt" onChange={handleFileUpload} />
            <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          border: '4px solid #000', 
          height: '300px',
          width: '500px', 
          overflowY: 'scroll', 
          backgroundColor: '#f9f9f9',
          userSelect: 'text',
          cursor: 'text',  
        }}>
                <div className='nowheel nodrag' style={{ whiteSpace: 'pre-wrap' }}>{transcript}</div>
            </div>
        </div>
        <Handle style={{width: '20px', height: '20px'}} type="source" position={Position.Right} />
        </>
    );
};

export default VTTViewNode;