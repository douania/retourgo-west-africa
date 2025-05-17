
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
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
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

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

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleStartCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCapturing(true);
    } catch (error) {
      console.error("Erreur d'accès à la caméra:", error);
      toast({
        title: "Erreur de caméra",
        description: "Impossible d'accéder à votre caméra. Veuillez vérifier les permissions.",
        variant: "destructive"
      });
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onImageCapture(file);
        handleStopCapture();
      }
    }, "image/jpeg", 0.95);
  };

  const handleStopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  return (
    <div className="w-full">
      {!previewUrl && !isCapturing ? (
        <div
          className={`border-2 border-dashed rounded-lg ${
            dragActive ? "border-retourgo-orange bg-retourgo-orange/10" : "border-gray-300"
          } transition-colors duration-200 p-6 flex flex-col items-center justify-center cursor-pointer`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/jpeg,image/png,image/webp"
          />
          <div className="flex flex-col items-center text-center">
            <Image className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
            <p className="text-xs text-gray-500 mt-1">Glissez-déposez ou cliquez pour sélectionner</p>
            
            {allowCapture && (
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCapture();
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Prendre une photo
              </Button>
            )}
          </div>
        </div>
      ) : isCapturing ? (
        <div className="relative border rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            className="w-full h-64 object-cover"
            autoPlay 
            playsInline
          />
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-2">
            <Button 
              type="button" 
              variant="outline"
              className="bg-white" 
              onClick={handleStopCapture}
            >
              <X className="mr-1 h-4 w-4" /> Annuler
            </Button>
            <Button 
              type="button" 
              className="bg-retourgo-green hover:bg-retourgo-green/90"
              onClick={handleCapturePhoto}
            >
              <Camera className="mr-1 h-4 w-4" /> Capturer
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img 
            src={previewUrl || ''} 
            alt="Aperçu" 
            className="w-full h-64 object-contain"
          />
          {onImageRemove && (
            <Button 
              type="button"
              variant="destructive" 
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onImageRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
