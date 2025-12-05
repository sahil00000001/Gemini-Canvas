import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface FloatingCubeProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
}

export function FloatingCube({
  position = [0, 0, 0],
  color = "#8b5cf6",
  scale = 1,
  speed = 1,
}: FloatingCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.4;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.2;
    
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[1, 1, 1]}
      radius={0.1}
      smoothness={4}
      position={position}
      scale={scale}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.9}
      />
    </RoundedBox>
  );
}
