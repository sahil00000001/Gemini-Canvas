import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { SuggestionsGrid } from "@/components/SuggestionsGrid";
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
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest("POST", "/api/analyze", {
        imageData,
        modelType,
      });
      return await response.json() as AnalyzeResponse;
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
      />

      <main className="container mx-auto px-4 py-6 pt-24 md:pt-20 max-w-[1800px]">
        <motion.div 
          className="grid lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.section 
            className="flex flex-col" 
            data-testid="section-upload"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="flex-1 flex flex-col">
              <ImageUploadZone
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                onClear={handleClearImage}
                isAnalyzing={analyzeMutation.isPending}
              />
              
              {uploadedImage && !critique && (
                <motion.div 
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending}
                    className="gap-2 px-8 glow"
                    data-testid="button-analyze"
                  >
                    <Sparkles className={`w-5 h-5 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
                    {analyzeMutation.isPending ? "Analyzing..." : "Analyze Design"}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.section>

          <motion.section 
            className="bg-card/30 rounded-2xl border border-border/50 overflow-auto"
            data-testid="section-suggestions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <SuggestionsGrid
              critique={critique}
              isLoading={analyzeMutation.isPending}
            />
          </motion.section>
        </motion.div>
      </main>
      
      {analyzeMutation.isPending && <LoadingScene />}
    </div>
  );
}
