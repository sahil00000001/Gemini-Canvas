import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AnimatedOctahedronProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  wireframe?: boolean;
}

export function AnimatedOctahedron({
  position = [0, 0, 0],
  color = "#8b5cf6",
  scale = 1,
  wireframe = false,
}: AnimatedOctahedronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.7;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.15;
    }
    
    if (wireRef.current) {
      wireRef.current.rotation.x = time * 0.5;
      wireRef.current.rotation.y = time * 0.7;
      wireRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {wireframe && (
        <mesh ref={wireRef} scale={scale * 1.1}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
