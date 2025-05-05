import "./App.css";
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import dagre from "dagre";

const nodeWidth = 150;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    return {
      ...node,
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

function App() {
  const inputData = {
    structureMaster: {
      masterAccount: "Reliance Retail",
    },
    structureChildDetails: [
      // North Region
      {
        linkedAccountDetails: {
          parentAccount: "Reliance Retail",
          childAccount: "North",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "North",
          childAccount: "Punjab",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "North",
          childAccount: "Haryana",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Punjab",
          childAccount: "Ludhiana",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Punjab",
          childAccount: "Amritsar",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Haryana",
          childAccount: "Gurgaon",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Haryana",
          childAccount: "Faridabad",
        },
      },

      // South Region
      {
        linkedAccountDetails: {
          parentAccount: "Reliance Retail",
          childAccount: "South",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "South",
          childAccount: "Tamil Nadu",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "South",
          childAccount: "Karnataka",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Tamil Nadu",
          childAccount: "Chennai",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Tamil Nadu",
          childAccount: "Coimbatore",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Karnataka",
          childAccount: "Bangalore",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Karnataka",
          childAccount: "Mysore",
        },
      },

      // East Region
      {
        linkedAccountDetails: {
          parentAccount: "Reliance Retail",
          childAccount: "East",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "East",
          childAccount: "West Bengal",
        },
      },
      {
        linkedAccountDetails: { parentAccount: "East", childAccount: "Odisha" },
      },
      {
        linkedAccountDetails: {
          parentAccount: "West Bengal",
          childAccount: "Kolkata",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "West Bengal",
          childAccount: "Siliguri",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Odisha",
          childAccount: "Bhubaneswar",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Odisha",
          childAccount: "Cuttack",
        },
      },

      // West Region
      {
        linkedAccountDetails: {
          parentAccount: "Reliance Retail",
          childAccount: "West",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "West",
          childAccount: "Maharashtra",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "West",
          childAccount: "Gujarat",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Maharashtra",
          childAccount: "Mumbai",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Maharashtra",
          childAccount: "Pune",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Gujarat",
          childAccount: "Ahmedabad",
        },
      },
      {
        linkedAccountDetails: {
          parentAccount: "Gujarat",
          childAccount: "Surat",
        },
      },
    ],
  };

  const generateGraphData = (data) => {
    const nodeMap = new Map();
    const edges = [];

    const addNode = (id, label) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          id,
          type: "default",
          data: { label: `${label}\n(${id})` },
          position: { x: 0, y: 0 }, // dagre will handle layout
        });
      }
    };

    const { masterAccount } = data.structureMaster;
    addNode(masterAccount, "Master Account");

    data.structureChildDetails.forEach(({ linkedAccountDetails }) => {
      const { parentAccount, childAccount } = linkedAccountDetails;
      addNode(parentAccount, "Child of " + parentAccount);
      addNode(childAccount, "Child of " + parentAccount);
      edges.push({
        id: `e-${parentAccount}-${childAccount}`,
        source: parentAccount,
        target: childAccount,
        animated: true,
      });
    });

    return { nodes: Array.from(nodeMap.values()), edges };
  };

  const layouted = useMemo(() => {
    const rawGraph = generateGraphData(inputData);
    return getLayoutedElements(rawGraph.nodes, rawGraph.edges);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={layouted.nodes} edges={layouted.edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
