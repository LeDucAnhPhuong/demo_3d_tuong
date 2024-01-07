"use client";
import * as THREE from "three";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { TextureLoader } from "three";
function randomPos() {
  const min = -5;
  const max = 5;
  return Math.random() * (max - min) + min;
}
function randomType() {
  const min = 1;
  const max = 8;
  return Math.round(Math.random() * (max - min) + min);
}
function Moment({ data, zoomToView, typeHover, setTypeHover }) {
  const meshRef = useRef();
  let image = [];
  image[1] = useLoader(TextureLoader, "/asset/images/1.png");
  image[2] = useLoader(TextureLoader, "/asset/images/2.png");
  image[3] = useLoader(TextureLoader, "/asset/images/3.png");
  image[4] = useLoader(TextureLoader, "/asset/images/4.png");
  image[5] = useLoader(TextureLoader, "/asset/images/5.png");
  image[6] = useLoader(TextureLoader, "/asset/images/6.png");
  image[7] = useLoader(TextureLoader, "/asset/images/7.png");
  image[8] = useLoader(TextureLoader, "/asset/images/8.png");

  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "grab";
  }, [hover]);

  useLayoutEffect(() => {
    meshRef.current.position.x = data.position[0];
    meshRef.current.position.y = data.position[1];
    meshRef.current.position.z = data.position[2];
  });
  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        setTypeHover(data.type);
        setHover(true);
      }}
      onPointerOut={(e) => {
        setTypeHover(0);
        setHover(false);
      }}
      onClick={() => {
        setClicked(!clicked);
        zoomToView(meshRef);
      }}
    >
      <boxGeometry attach="geometry" args={[0.3, 0.3, 0.3]} />
      {typeHover !== data.type ? (
        <meshStandardMaterial map={image[data.type]} />
      ) : (
        <meshStandardMaterial color={"red"} />
      )}
    </mesh>
  );
}

function Cloud({ momentsData }) {
  const [typeHover, setTypeHover] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [focus, setFocus] = useState({ x: 0, y: 0, z: 0 });
  const vec = new THREE.Vector3();
  useFrame((state) => {
    const step = 0.05;

    /*
    Need to find some way to lerp the lookAt
    */

    zoom ? vec.set(focus.x, focus.y, focus.z + 0.2) : vec.set(0, 0, 5);
    //
    // !zoom ? state.camera.position.lerp(vec, step) : "";
    state.camera.lookAt(0, 0, 0);
    // Update to new position/lookAt
    state.camera.updateProjectionMatrix();
  });

  // controls.setLookAt( positionX, positionY, positionZ, targetX, targetY, targetZ, true)

  const zoomToView = (focusRef) => {
    setZoom(!zoom);
    setFocus(focusRef.current.position);
  };
  return (
    <instancedMesh>
      {momentsData?.map((moment, i) => {
        // Set position here so it isn't reset on state change
        // for individual moment.
        return (
          <Moment
            key={i}
            data={moment}
            zoomToView={zoomToView}
            typeHover={typeHover}
            setTypeHover={setTypeHover}
          />
        );
      })}
    </instancedMesh>
  );
}

function App() {
  const [momentsArray, setMomentsArray] = useState([]);
  /*
  momentsArray is data that comes from elsewhere in the app
  but for this demo I just generate it here.
  */
  useEffect(() => {
    let array = [];
    for (let i = 0; i < 500; i++) {
      array = [
        ...array,
        {
          type: randomType(),
          position: [randomPos(), randomPos(), randomPos()],
        },
      ];
    }
    setMomentsArray(array);
  }, []);
  return (
    <div className="w-[100vw] h-[100vh]">
      <Canvas
        flat
        linear
        camera={{
          position: [-10, 0, 5],
        }}
      >
        <axesHelper args={[100]} position={[-5, -5, -5]} />
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[150, 150, 150]} intensity={0.5} />
        <Cloud momentsData={momentsArray} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
