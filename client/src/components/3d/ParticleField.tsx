import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
}

export function ParticleField({ 
  count = 200, 
  color = "#8b5cf6", 
  size = 0.02,
  spread = 10
}: ParticleFieldProps) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      speeds[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, speeds };
  }, [count, spread]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += particles.speeds[i] * 0.01;
      
      if (positions[i3 + 1] > spread / 2) {
        positions[i3 + 1] = -spread / 2;
      }
      
      positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      positions[i3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.001;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
