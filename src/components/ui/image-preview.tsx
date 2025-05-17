
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove?: () => void;
}

export function ImagePreview({ imageUrl, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative border rounded-lg overflow-hidden">
      <img 
        src={imageUrl} 
        alt="Aperçu" 
        className="w-full h-64 object-contain"
      />
      {onRemove && (
        <Button 
          type="button"
          variant="destructive" 
          size="sm"
          className="absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
