import { Header } from "@/components/Header";
import { BackgroundScene } from "@/components/3d/BackgroundScene";
import { AboutSection } from "@/components/AboutSection";
import { useState } from "react";

export default function About() {
  const [modelType, setModelType] = useState<"light" | "heavy">("light");

  return (
    <div className="min-h-screen bg-background">
      <BackgroundScene />
      
      <Header
        modelType={modelType}
        onModelChange={setModelType}
      />

      <AboutSection />
    </div>
  );
}
