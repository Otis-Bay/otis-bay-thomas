import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Stats } from "@react-three/drei";
import "./styles.css";
import { OtisBayLogo } from "./Letters";
import { EffectComposer, N8AO, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { BlendFunction } from "postprocessing";
import { BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { Leva } from "leva";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
const CameraControls = () => {
  const { camera } = useThree()
  useFrame((state) => {
    state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, 1, 0.15);
    state.camera.lookAt(0, 1, 0);
  });

  //animate camera down when scrolling gsap scrolltrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(camera.position, {
      y: -30,
      z: 50,
      duration: 1,
      scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return null;
};


function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 3, (mouse.y * viewport.height) / 3, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

export default function App() {


  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, -1, 20], fov: 40 }}
      >
        <Leva hidden />
        <Physics gravity={[0, 0, 0]}>
          <OtisBayLogo
            scale={1.1}
          />
          <Pointer />
        </Physics>
        {/* <Stats /> */}
        <CameraControls />
        <EffectComposer disableNormalPass multisampling={8}>
          <Noise premultiply blendFunction={BlendFunction.ADD} />
          <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
        </EffectComposer>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 0, 10]} intensity={0.4} color="#fff" />
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer
              form="circle"
              intensity={4}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={2}
            />
            <Lightformer
              form="circle"
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={2}
            />
            <Lightformer
              form="circle"
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, -1, -1]}
              scale={2}
            />
            <Lightformer
              form="circle"
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={8}
            />
          </group>
        </Environment>
      </Canvas>
    </>
  );
}
