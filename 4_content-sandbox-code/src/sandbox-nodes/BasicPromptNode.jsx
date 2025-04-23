import { Position, Handle, useReactFlow } from '@xyflow/react';

function BasicPromptNode({ id, data }) {

    const { updateNodeData } = useReactFlow();
  
    return (
      <div
        style={{
          background: '#000',
          color: 'white',
          padding: 5,
          fontSize: 16,
          width: '400px',
          height: '350px',

        }}
      >
        <div>Prompt</div>
        <div >
        <textarea
      value={data.text}
      onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
      rows={1} 
      style={{ width: '400px', marginTop: '10px', height: '300px', overflowY: 'scroll'  }}
      className="auto-growing-textarea nowheel nodrag"
      placeholder="Type something..."
    />
        </div>
        <Handle type="source" style={{width: '20px', height: '20px'}} position={Position.Right} />
      </div>
    );
  }
  
  export default BasicPromptNode;