import { Handle, Position, NodeResizeControl, useHandleConnections, useNodesData, useStore, useReactFlow } from '@xyflow/react';
import React, { useEffect, useState } from 'react';

const controlStyle = {
    background: 'transparent',
    border: 'none',
  };
  

const BasicRecapNode = ({ id, data }) => {

    const { updateNodeData } = useReactFlow();


    const connections = useHandleConnections({
        type: 'target',
      });
      const nodesData = useNodesData(
        connections.map((connection) => connection.source),
      );

    const [prompt, setPrompt] = useState('');

    const systemPrompt = `You are a meeting summarization assistant. Respond only in JSON. The user will provide one or more transcripts of meetings. Based on the transcript(s) of the meeting(s) provided, create a summary in the form of a JSON file with the following format: 

{
    "title" : <TITLE OF MEETING>
    "attendees" : <LIST OF ATTENDEES SEPARATED BY COMMAS>,
    "goals" : [<SHORT GOAL ACCOMPLISHED IN ONE SENTENCE>, <SHORT GOAL ACCOMPLISHED IN ONE SENTENCE>],
    "progress" : [<KEY DISCUSSION POINT FROM MEETING IN ONE SENTENCE>, <KEY DISCUSSION POINT FROM MEETING IN ONE SENTENCE>],
    "plans" : [<NEXT STEP 1>, <NEXT STEP 2>]
}


Here is an example of the level of detail that should be present for the text fields in the JSON:

{
"title" : "Weekly Sync",
"attendees" : "Ben Stiller, Adam Scott, Aubrey Plaza",
"goals" : ["Decide scope of prototypes for internship projects.", "Discuss presentation strategies for the upcoming sync."],
"this_meeting" : ["Discussion on the utility of visual components in the prototype [Ben]", "Decision to focus on two vendors for the upcoming event [Aubrey]"],
"next_steps" : ["Plan to instantiate the team framework with real examples before the next meeting. [Ben]", "Refine the presentation and event plan [Adam]"]
}`;

    const fetchPrompt = async () => {
      try {


        const messages = [
            {
                role: 'system',
                content: systemPrompt,
            },

        ];

        nodesData.forEach((node) => {
            messages.push({
              role: 'user',
              content: node.data.text,
              
            });
          });


          console.log(messages);


          const apikey = import.meta.env.VITE_OPENAI_API_KEY;

          if (!apikey) {
            throw new Error('API key is missing. Please ensure it is set in the .env file.');
          }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apikey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: messages,
            format: 'json',
          }),
        });
  
        const data = await response.json();
        setPrompt(data.choices[0].message.content.trim());
        updateNodeData(id, { text: data.choices[0].message.content.trim() });
      } catch (error) {
        console.error('Error fetching prompt:', error);
      }
    };

  return (
    <>

      <Handle style={{width: '20px', height: '20px'}} type="target" position={Position.Left} />

      <div style={{ margin: '20px', backgroundColor: 'black',  }}>
      <button onClick={fetchPrompt} style={{ margin: '10px', padding: '5px', borderRadius: '0', background: 'white',}}>
          Generate Basic Recap
        </button>
      <div 
        
        style={{ 
          padding: '10px', 
          border: '4px solid #000', 
          height: '300px',
          width: '600px', 
          overflowY: 'scroll', 
          backgroundColor: '#f9f9f9',
          userSelect: 'text',
          cursor: 'text', 
        }}>
        <div className='nowheel nodrag' style={{ whiteSpace: 'pre-wrap' }}>
        {prompt && <div>{prompt}</div>}
        </div>
      </div>
    </div>

      <Handle style={{width: '20px', height: '20px'}} type="source" position={Position.Right} />
    </>
  );
};

export default BasicRecapNode;