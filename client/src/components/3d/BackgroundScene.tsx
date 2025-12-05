import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { FloatingCube } from "./FloatingCube";

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        <ParticleField count={100} spread={15} size={0.015} />
        <FloatingCube position={[-4, 2, -2]} scale={0.4} color="#8b5cf6" speed={0.5} />
        <FloatingCube position={[4, -2, -3]} scale={0.3} color="#a78bfa" speed={0.7} />
        <FloatingCube position={[3, 3, -4]} scale={0.25} color="#c4b5fd" speed={0.6} />
      </Canvas>
    </div>
  );
}
