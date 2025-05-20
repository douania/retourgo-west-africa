
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image } from "lucide-react";

interface ImageDropzoneProps {
  onFileDrop: (file: File) => void;
  onCameraClick: () => void;
  allowCapture?: boolean;
  label: string;
  description: string;
}

export function ImageDropzone({
  onFileDrop,
  onCameraClick,
  allowCapture = true,
  label,
  description
}: ImageDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const file = e.dataTransfer.files[0];
      console.log("File dropped:", file.name);
      onFileDrop(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File selected:", file.name);
      onFileDrop(file);
    }
  };

  const openFileDialog = () => {
    // This function directly triggers the file input click
    console.log("Opening file dialog");
    inputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg ${
        dragActive ? "border-retourgo-orange bg-retourgo-orange/10" : "border-gray-300"
      } transition-colors duration-200 p-6 flex flex-col items-center justify-center cursor-pointer`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
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
              onCameraClick();
            }}
          >
            <Camera className="mr-2 h-4 w-4" />
            Prendre une photo
          </Button>
        )}
      </div>
    </div>
  );
}
