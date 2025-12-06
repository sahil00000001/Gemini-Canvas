import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadScene } from "./3d/UploadScene";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadZoneProps {
  onImageUpload: (imageData: string) => void;
  uploadedImage: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function ImageUploadZone({
  onImageUpload,
  uploadedImage,
  onClear,
  isAnalyzing,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          onImageUpload(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isAnalyzing,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  if (uploadedImage) {
    return (
      <motion.div 
        className="relative w-full h-full flex items-center justify-center p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div 
          className="relative max-w-full max-h-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <motion.div 
            className="absolute -inset-3 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl"
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <div className="relative bg-card rounded-xl overflow-hidden shadow-3d border border-card-border">
            <motion.div 
              className="absolute top-2 right-2 z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                disabled={isAnalyzing}
                data-testid="button-clear-image"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.img
              src={uploadedImage}
              alt="Uploaded design"
              className="max-w-full max-h-[500px] object-contain"
              data-testid="img-uploaded-design"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative w-full h-full min-h-[400px] flex flex-col items-center justify-center
        border-2 border-dashed rounded-2xl cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        ${isDragActive || isDragging
          ? "border-primary bg-primary/5 scale-[1.02] glow-intense"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/30"
        }
        ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}
      `}
      data-testid="zone-image-upload"
    >
      <input {...getInputProps()} data-testid="input-file-upload" />
      
      <UploadScene isDragging={isDragActive || isDragging} />
      
      <div className={`
        relative z-10 flex flex-col items-center gap-4 p-8 text-center
        transition-transform duration-300
        ${isDragActive ? "scale-110" : ""}
      `}>
        <div className="h-32" />
        
        <div className="space-y-2">
          <p className="text-lg font-display font-semibold text-foreground" data-testid="text-upload-title">
            {isDragActive ? "Drop your design here" : "Drop your design here or click to upload"}
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-upload-formats">
            PNG, JPG, WebP up to 10MB
          </p>
        </div>
      </div>
      
      {isDragActive && (
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl" />
          <div className="absolute inset-0 border-4 border-primary/30 rounded-2xl animate-pulse" />
        </div>
      )}
    </div>
  );
}
