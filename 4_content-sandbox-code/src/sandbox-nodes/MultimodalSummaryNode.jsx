import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import React, { useState } from 'react';

const MultimodalSummaryNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow();

  const connections = useHandleConnections({
    type: 'target',
  });
  const nodesData = useNodesData(
    connections.map((connection) => connection.source),
  );

  const [prompt, setPrompt] = useState('');

  const systemPrompt = `You are a meeting summarization assistant. Respond only in JSON. The user (whose name is Laura) will provide one or more transcripts of meetings, and a series of image frames from the meeting recordings of each of the meetings. Based on the transcript(s) of the meeting(s) provided, and the corresponding meeting frames, create a summary tailored for Laura in the form of a JSON file with the following format: 

{
    "title" : <TITLE OF SUMMARY IN 3-4 WORDS>
    "attendees" : <LIST OF ATTENDEES SEPARATED BY COMMAS>,
    "goals" : [<SHORT GOAL ACCOMPLISHED IN ONE SENTENCE UNDER 15 WORDS>, <SHORT GOAL ACCOMPLISHED IN ONE SENTENCE UNDER 15 WORDS>],
    "progress" : [<KEY DISCUSSION POINT IN ONE SENTENCE UNDER 15 WORDS>, <KEY DISCUSSION POINT IN ONE SENTENCE UNDER 15 WORDS>],
    "plans" : [<NEXT STEP 1 IN ONE SENTENCE UNDER 15 WORDS>, <NEXT STEP 2 IN ONE SENTENCE UNDER 15 WORDS>],
    "highlights" : [{"title" : <Description of key image from the provided frames>, "src" : <Index of the key image among frames in this meeting--Index of this meeting among provided meetings>}, {"title" : <Description of key image from the provided frames>, "src" : <Index of the key image among frames in this meeting--Index of this meeting among provided meetings>}, {"title" : <Description of key image from the provided frames>, "src" : <Index of the key image among frames in this meeting--Index of this meeting among provided meetings>}, {"title" : <Description of key image from the provided frames>, "src" : <Index of the key image among frames in this meeting--Index of this meeting among provided meetings>},]
}


Here is an example of the level of detail that should be present for the text fields in the JSON. In this example, the user only provides the transcript and frames for 1 meeting, hence all the image highlight src entries end with "--0" (the index of the meeting among all provided meetings). Even if more meeting transcripts and recording frame lists are provided, there should be no more than 4 highlight images in the summary.:

{
"title" : "Weekly Sync",
"attendees" : "Ben Stiller, Adam Scott, Aubrey Plaza",
"goals" : ["Decide scope of prototypes for internship projects.", "Discuss presentation strategies for the upcoming sync."],
"progress" : ["Discussion on the utility of visual components in the prototype [Ben]", "Decision to focus on two vendors for the upcoming event [Aubrey]"],
"plans" : ["Plan to instantiate the team framework with real examples before the next meeting. [Ben]", "Refine the presentation and event plan [Adam]"],
"highlights" : [{"title" : "Introduction slide", "src" : "0--0"}, {"title" : "Plan for the rearrangement", "src" : "1--0"}, {"title" : "Questions from last week", "src" : "7--0"}, {"title" : "Upcoming events", "src" : "9--0"}]

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
      <Handle style={{ width: '20px', height: '20px' }} type="target" position={Position.Left} />

      <div style={{ margin: '20px', backgroundColor: 'black' }}>
        <button onClick={fetchPrompt} style={{ margin: '10px', padding: '5px', borderRadius: '0', background: 'white' }}>
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
          }}
        >
          <div className="nowheel nodrag" style={{ whiteSpace: 'pre-wrap' }}>
            {prompt && <div>{prompt}</div>}
          </div>
        </div>
      </div>

      <Handle style={{ width: '20px', height: '20px' }} type="source" position={Position.Right} />
    </>
  );
};

export default MultimodalSummaryNode;
