import React, { useState } from 'react';

export default () => {


  const [interactionEnabled, setInteractionEnabled] = useState(false);


  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleInteraction = () => {
    setInteractionEnabled(!interactionEnabled);
  };

  return (
    <aside >
      <div><h2>Generative AI Content Sandbox</h2></div>

      <div className="scroll-container">

      <div className="description"><h3>Nodes</h3><p>Drag nodes from here onto the canvas.</p></div>
      <div className="dndnode BasicPromptNode" onDragStart={(event) => onDragStart(event, 'BasicPromptNode')} draggable>
        Basic Prompt Node
      </div>
      <div className="dndnode TranscriptView" onDragStart={(event) => onDragStart(event, 'TranscriptView')} draggable>
        Text Transcript Node
      </div>
      <div className="dndnode VTTViewNode"  onDragStart={(event) => onDragStart(event, 'VTTViewNode')} draggable>
        VTT Transcript Node
      </div>
      <div className="dndnode VideoViewNode" onDragStart={(event) => onDragStart(event, 'VideoViewNode')} draggable>
        Video Node
      </div>
      <div className="dndnode ImageUploadNode"  onDragStart={(event) => onDragStart(event, 'ImageUploadNode')} draggable>
      Image Node
      </div>
      <div className="dndnode BasicSummaryNode" onDragStart={(event) => onDragStart(event, 'BasicSummaryNode')} draggable>
        Basic Output Node
      </div>
      <div className="dndnode MultimodalSummaryNode" onDragStart={(event) => onDragStart(event, 'MultimodalSummaryNode')} draggable>
        Recap Template Node
      </div>
      <br></br>
      </div>
    </aside>
  );
};