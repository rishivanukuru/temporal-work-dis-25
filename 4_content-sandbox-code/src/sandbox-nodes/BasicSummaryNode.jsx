import { Handle, Position, NodeResizeControl, useHandleConnections, useNodesData, useStore, useReactFlow } from '@xyflow/react';
import React, { useEffect, useState } from 'react';

const controlStyle = {
    background: 'transparent',
    border: 'none',
  };
  

const BasicSummaryNode = ({ id, data }) => {

    const { updateNodeData } = useReactFlow();


    const connections = useHandleConnections({
        type: 'target',
      });
      const nodesData = useNodesData(
        connections.map((connection) => connection.source),
      );

    const [prompt, setPrompt] = useState('');

    const systemPrompt = `You are an assistant to help users make sense of information from their past work meetings. The user will provide you with one or more meeting transcripts, and additional pieces of information relating to each transcript (such as frames from the video recording, slides discussed during the meeting, and other prompts).`;
    
      const fetchPrompt = async () => {
        try {
          const messages = [
            {
              role: 'system',
              content: systemPrompt,
            },
          ];
    
          nodesData.forEach((node) => {
            if (node.data.fullvideo !== undefined) {
              if (node.data.fullvideo) {
                messages.push({
                  role: 'user',
                  content: 'Here are the frames from the meeting:',
                });
                node.data.multiImagePrompt.forEach((framePrompt) => {
                  messages.push(framePrompt);
                });
              } else {
                messages.push(node.data.singleImagePrompt);
              }
            } else if (node.data.text) {
              messages.push({
                role: 'user',
                content: node.data.text,
              });
            }
          });
    
          console.log('Request Payload:', JSON.stringify({ model: 'gpt-4', messages }));
    
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
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from OpenAI:', errorData);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }
    
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
          Generate Output
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

export default BasicSummaryNode;