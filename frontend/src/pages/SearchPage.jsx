import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useEffect } from "react";
import "../assets/styles/pages/SearchPage.scss"
const colors = {
  Black: "#000000",
  Blue: "#0000FF",
  Brown: "#8B4513",
  Green: "#008000",
  Grey: "#808080",
  Pink: "#FFC0CB",
  Purple: "#800080",
  White: "#FFFFFF",
};

const Model = ({ selectedColor, selectedPart ,setSelectedPart}) => {
  const { scene } = useGLTF("/models/uploads_files_4278121_Nike_Air_Shoes.glb");
  const clonedScene = scene.clone();

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && selectedColor && selectedPart === child.name) {
        child.material.color.set(selectedColor);
      }

      // if (child.material?.map) {
        // child.material.map = null; // Xóa texture để cho phép đổi màu
        
        child.material.needsUpdate = true; // Cập nhật lại material
          // }
    
          if(child.isMesh){
            console.log("la Mesh" , child.material)
          }else{
            console.log("khong la Mesh", child.material)
          }
          console.log(selectedColor + " " + selectedPart);


    });

  }, [selectedColor]);

  return (
    <primitive
      object={clonedScene}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPart(e.object.name);
      }}
    />
  );
};

const SearchPage = () => {
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedPart, setSelectedPart] = useState(null);


  useEffect(() => {
    console.log("selected  part: " , selectedPart)
  }, [selectedPart]);


  return (
    <div className="product-search">
      <div className="filters">
        <h3>Customize Your Product</h3>
        <div className="filter-group">
          <h4>Color</h4>
          <div className="color-options">
            {Object.entries(colors).map(([name, hex]) => (
              <span
                key={name}
                style={{ backgroundColor: hex }}
                onClick={() => setSelectedColor(hex)}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <div className="product-preview">
        <h2>3D Product Preview</h2>
        <Canvas camera={{ position: [0, 0.5, 1], fov: 75 }}>
          <ambientLight intensity={1.2} />
          <Model selectedColor={selectedColor} setSelectedPart={setSelectedPart} selectedPart={selectedPart}/>
          <OrbitControls  enableRotate />
        </Canvas>
      </div>
    </div>
  );
};

export default SearchPage;
