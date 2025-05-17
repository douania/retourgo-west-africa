
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImagePreview } from "@/components/ui/image-preview";
import { CameraCapture } from "@/components/ui/camera-capture";

export interface ImageUploadProps {
  onImageCapture: (file: File) => void;
  onImageRemove?: () => void;
  previewUrl?: string | null;
  allowCapture?: boolean;
  label?: string;
  description?: string;
}

export function ImageUpload({
  onImageCapture,
  onImageRemove,
  previewUrl,
  allowCapture = true,
  label = "Télécharger une image",
  description = "Formats acceptés: JPG, PNG, WebP. Max 5MB."
}: ImageUploadProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    // Vérifiez le type et la taille du fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Format non valide",
        description: "Veuillez télécharger une image JPG, PNG ou WebP.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale de l'image est de 5MB.",
        variant: "destructive"
      });
      return;
    }

    onImageCapture(file);
  };

  const handleStartCapture = () => {
    setIsCapturing(true);
  };

  const handleCancelCapture = () => {
    setIsCapturing(false);
  };

  return (
    <div className="w-full">
      {!previewUrl && !isCapturing ? (
        <ImageDropzone
          onFileDrop={handleFile}
          onCameraClick={handleStartCapture}
          allowCapture={allowCapture}
          label={label}
          description={description}
        />
      ) : isCapturing ? (
        <CameraCapture
          onCapture={handleFile}
          onCancel={handleCancelCapture}
        />
      ) : (
        <ImagePreview
          imageUrl={previewUrl || ''}
          onRemove={onImageRemove}
        />
      )}
    </div>
  );
}
