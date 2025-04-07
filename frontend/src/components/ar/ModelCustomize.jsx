import { useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ModelCustomize = ({ url, onSelectPart, setParts, setOriginalParts }) => {
  const group = useRef();
  const { scene, nodes, materials } = useGLTF(url);
  const [hovered, setHovered] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [originalMaterials, setOriginalMaterials] = useState({});
  const [dragStartPos, setDragStartPos] = useState(null);

  // Map parts by name for easier access
  useEffect(() => {
    let parts = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        parts = [...parts, child];
      }
    });
    setParts(parts);
    setOriginalParts(parts);
    console.log("All parts:", parts);
  }, [scene]);

  // Store original materials when component mounts
  useEffect(() => {
    const origMats = {};
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Deep clone the material to preserve all properties
        if (Array.isArray(child.material)) {
          // Handle multi-material objects
          origMats[child.uuid] = child.material.map((mat) => mat.clone());
        } else {
          origMats[child.uuid] = child.material.clone();
        }

        // Debug material properties
        console.log(`Material for ${child.name}:`, child.material);
      }
    });
    setOriginalMaterials(origMats);
  }, [scene]);

  // Update cursor only when hovering over the model
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "auto";
    }
  }, [hovered]);

  // Change cursor while dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else if (hovered) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "auto";
    }
  }, [isDragging, hovered]);

  // Handle mouse down on model part
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up - finish dragging
  const handlePointerUp = (e) => {
    e.stopPropagation();

    // Only count as a click if it was a small drag or no drag
    if (isDragging && dragStartPos) {
      const deltaX = Math.abs(e.clientX - dragStartPos.x);
      const deltaY = Math.abs(e.clientY - dragStartPos.y);

      // If the drag distance is small, consider it a click
      if (deltaX < 5 && deltaY < 5) {
        const part = e.object;
        console.log("Selected part:", part.name, part);

        // If clicking on already selected part, deselect it
        if (selectedPart && selectedPart.uuid === part.uuid) {
          setSelectedPart(null);
          onSelectPart(null);
        } else {
          setSelectedPart(part);
          onSelectPart(part);
        }
      }
    }

    setIsDragging(false);
    setDragStartPos(null);
  };

  // Handle hover states
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(e.object);
  };

  const handlePointerOut = () => {
    setHovered(null);
  };

  return (
    <group ref={group} dispose={null} onClick={(e) => e.stopPropagation()}>
      <primitive
        object={scene}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
};

export default ModelCustomize;
