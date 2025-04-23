import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  Handle,
  Position,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import TranscriptView from './sandbox-nodes/TranscriptViewNode';
import BasicSummaryNode from './sandbox-nodes/BasicSummaryNode';
import BasicPromptNode from './sandbox-nodes/BasicPromptNode';
import VTTViewNode from './sandbox-nodes/VTTViewNode';
import BasicRecapNode from './sandbox-nodes/BasicRecapNode';
import VideoViewNode from './sandbox-nodes/VideoViewNode';
import MultimodalSummaryNode from './sandbox-nodes/MultimodalSummaryNode';
import ImageUploadNode from './sandbox-nodes/ImageUploadNode'

import Sidebar from './sandbox-nodes/Sidebar';

const nodeTypes = {
  TranscriptView,
  BasicSummaryNode,
  BasicPromptNode,
  VTTViewNode,
  BasicRecapNode,
  VideoViewNode,
  MultimodalSummaryNode,
  ImageUploadNode,
};

const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const defaultEdgeOptions = {
  animated: true,
};

function Flow() {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );
  
  return (
    <div className="dndflow">
    <Sidebar />

    <div className="reactflow-wrapper">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
        minZoom={0.1}
        maxZoom={10}
        fitView
      >
        
      
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      </ReactFlow>
    </div>

    </div>
    
  );
}

export default Flow;
