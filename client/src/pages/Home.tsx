import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { SuggestionsGrid } from "@/components/SuggestionsGrid";
import { AboutModal } from "@/components/AboutModal";
import { LoadingScene } from "@/components/3d/LoadingScene";
import { BackgroundScene } from "@/components/3d/BackgroundScene";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles } from "lucide-react";
import type { DesignCritique, AnalyzeResponse } from "@shared/schema";

export default function Home() {
  const [modelType, setModelType] = useState<"light" | "heavy">("light");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [critique, setCritique] = useState<DesignCritique | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest("POST", "/api/analyze", {
        imageData,
        modelType,
      });
      return response as AnalyzeResponse;
    },
    onSuccess: (data) => {
      if (data.success && data.critique) {
        setCritique(data.critique);
        toast({
          title: "Analysis Complete",
          description: `Design analyzed using ${data.modelUsed} in ${(data.processingTime / 1000).toFixed(1)}s`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = useCallback((imageData: string) => {
    setUploadedImage(imageData);
    setCritique(null);
  }, []);

  const handleClearImage = useCallback(() => {
    setUploadedImage(null);
    setCritique(null);
  }, []);

  const handleAnalyze = useCallback(() => {
    if (uploadedImage) {
      analyzeMutation.mutate(uploadedImage);
    }
  }, [uploadedImage, analyzeMutation]);

  return (
    <div className="min-h-screen bg-background">
      <BackgroundScene />
      
      <Header
        modelType={modelType}
        onModelChange={setModelType}
        onAboutClick={() => setIsAboutOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 min-h-[calc(100vh-12rem)]">
          <section className="flex flex-col" data-testid="section-upload">
            <div className="flex-1 flex flex-col">
              <ImageUploadZone
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                onClear={handleClearImage}
                isAnalyzing={analyzeMutation.isPending}
              />
              
              {uploadedImage && !critique && (
                <div className="mt-6 flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending}
                    className="gap-2 px-8 glow"
                    data-testid="button-analyze"
                  >
                    <Sparkles className="w-5 h-5" />
                    {analyzeMutation.isPending ? "Analyzing..." : "Analyze Design"}
                  </Button>
                </div>
              )}
            </div>
          </section>

          <section 
            className="bg-card/30 rounded-2xl border border-border/50 overflow-auto max-h-[calc(100vh-12rem)]"
            data-testid="section-suggestions"
          >
            <SuggestionsGrid
              critique={critique}
              isLoading={analyzeMutation.isPending}
            />
          </section>
        </div>
      </main>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      
      {analyzeMutation.isPending && <LoadingScene />}
    </div>
  );
}
