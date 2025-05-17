
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Erreur d'accès à la caméra:", error);
        toast({
          title: "Erreur de caméra",
          description: "Impossible d'accéder à votre caméra. Veuillez vérifier les permissions.",
          variant: "destructive"
        });
        onCancel();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, onCancel]);

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
        onCapture(file);
      }
    }, "image/jpeg", 0.95);
  };

  const handleStopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    onCancel();
  };

  return (
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
  );
}
