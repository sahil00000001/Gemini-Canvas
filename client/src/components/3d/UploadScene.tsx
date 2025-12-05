import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Upload, ImageIcon } from "lucide-react";

interface ParticlesProps {
  count?: number;
  color?: string;
  isActive?: boolean;
}

function Particles({ count = 100, color = "#8b5cf6", isActive = false }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    
    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const intensity = isActive ? 2 : 1;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = particles.speeds[i] * intensity;
      
      positions[i3] += Math.sin(state.clock.elapsedTime * speed + i) * 0.002;
      positions[i3 + 1] += Math.cos(state.clock.elapsedTime * speed + i) * 0.002;
      positions[i3 + 2] += Math.sin(state.clock.elapsedTime * speed * 0.5 + i) * 0.002;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={isActive ? 0.9 : 0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface FloatingIconProps {
  isDragging?: boolean;
}

function FloatingIcon({ isDragging = false }: FloatingIconProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    
    if (isDragging) {
      meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={isDragging ? "#a78bfa" : "#8b5cf6"}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>
      <mesh scale={1.1}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial
          color={isDragging ? "#c4b5fd" : "#a78bfa"}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

interface UploadSceneProps {
  isDragging?: boolean;
}

export function UploadScene({ isDragging = false }: UploadSceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#8b5cf6" />
        <Particles count={80} isActive={isDragging} />
        <FloatingIcon isDragging={isDragging} />
      </Canvas>
    </div>
  );
}
