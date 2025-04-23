import React from 'react';
import { useCallback, useState } from 'react';
import { Handle, Position, NodeResizeControl, useReactFlow } from '@xyflow/react';

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

const TranscriptView = ({ id }) => {
  const { updateNodeData } = useReactFlow();
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        
        updateNodeData(id, { text: content });
      };
      reader.readAsText(file);
    }
  };

  return (
    <>


      <div style={{ margin: '20px', backgroundColor: 'black' }}>
        <input
          style={{ color: 'white', padding: '10px 0px 0px 10px', fontSize: 'small' }}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
        />
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '4px solid #000',
            height: '300px',
            width: '500px',
            overflowY: 'scroll',
            backgroundColor: '#f9f9f9',
            userSelect: 'text',
            cursor: 'text',
          }}
        >
          <div className="nowheel nodrag" style={{ whiteSpace: 'pre-wrap' }}>
            {fileContent}
          </div>
        </div>
      </div>

      <Handle style={{ width: '20px', height: '20px' }} type="source" position={Position.Right} />
    </>
  );
};

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#ff0071"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

export default TranscriptView;
