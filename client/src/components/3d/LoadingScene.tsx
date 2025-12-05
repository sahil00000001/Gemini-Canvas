import { Canvas } from "@react-three/fiber";
import { AnimatedOctahedron } from "./AnimatedOctahedron";
import { ParticleField } from "./ParticleField";

interface LoadingSceneProps {
  message?: string;
}

export function LoadingScene({ message = "Analyzing your design..." }: LoadingSceneProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="w-32 h-32 mb-6">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <AnimatedOctahedron scale={0.8} wireframe />
          <ParticleField count={50} spread={4} size={0.03} />
        </Canvas>
      </div>
      <div className="text-center">
        <p className="text-lg font-display font-semibold text-foreground mb-2" data-testid="text-loading-message">
          {message}
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </div>
  );
}
