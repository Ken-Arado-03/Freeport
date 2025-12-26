import { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';
import '../../styles/cropper.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface ImageCropDialogProps {
  open: boolean;
  imageFile: File | null;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void> | void;
  aspect?: number;
}

export default function ImageCropDialog({
  open,
  imageFile,
  onOpenChange,
  onCancel,
  onConfirm,
  aspect = 1,
}: ImageCropDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  useEffect(() => {
    if (!open || !imageFile || !imageRef.current) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
      return;
    }

    const image = imageRef.current;

    // Initialize cropper after image is loaded
    const initializeCropper = () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      cropperRef.current = new Cropper(image, {
        aspectRatio: aspect,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
        zoomable: true,
        zoomOnWheel: true,
        zoomOnTouch: true,
        minZoom: 0.5,
        maxZoom: 3,
      } as any);

      // Set initial zoom
      if (cropperRef.current) {
        (cropperRef.current as any).zoomTo(zoom);
      }
    };

    // Read the selected file as a data URL so the <img> can display it reliably
    const reader = new FileReader();
    reader.onload = () => {
      if (!image) return;
      image.src = reader.result as string;
      image.onload = initializeCropper;
    };
    reader.readAsDataURL(imageFile);

    return () => {
      // Destroy cropper instance when dialog closes or image changes
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
      if (image) {
        image.src = '';
      }
    };
  }, [open, imageFile, aspect, zoom]);

  useEffect(() => {
    if (cropperRef.current) {
      (cropperRef.current as any).zoomTo(zoom);
    }
  }, [zoom]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  const handleConfirm = async () => {
    if (!cropperRef.current || !imageFile) {
      onCancel();
      return;
    }

    try {
      setSubmitting(true);
      
      // Get cropped canvas and convert to blob
      const canvas = (cropperRef.current as any).getCroppedCanvas({
        maxWidth: 1024,
        maxHeight: 1024,
        fillColor: '#fff',
      });

      // Handle cropping errors gracefully
      if (!canvas) {
        throw new Error('Failed to generate cropped image');
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to blob failed'));
            }
          },
          imageFile.type || 'image/jpeg',
          0.9
        );
      });

      const croppedFile = new File([blob], imageFile.name, {
        type: imageFile.type || 'image/jpeg',
        lastModified: Date.now(),
      });

      await onConfirm(croppedFile);
    } catch (error) {
      // Error will be handled by the calling component
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adjust Photo</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-96 bg-gray-900 rounded-md overflow-hidden mb-4">
          <img
            ref={imageRef}
            className="w-full h-full object-contain"
            alt="Crop image"
          />
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs text-gray-600 w-16">Zoom</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={zoom}
            onChange={handleZoomChange}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-12 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
