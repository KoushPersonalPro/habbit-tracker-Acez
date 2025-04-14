"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { uploadFile, resizeImage, dataURLtoFile } from "@/utils/upload";

interface PhotoVerificationProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (imageUrl: string | null, note: string | null) => void;
  habitName: string;
}

export default function PhotoVerification({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  habitName = "habit",
}: PhotoVerificationProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [verifyWithNote, setVerifyWithNote] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Could not access camera. Please check permissions or try uploading a photo instead.",
      );
      setIsCapturing(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const resizedImage = await resizeImage(file);
      setCapturedImage(resizedImage);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Could not process the image. Please try again.");
    }
  };

  // Submit verification
  const handleSubmit = async () => {
    if (!capturedImage && !verifyWithNote) return;
    if (verifyWithNote && !note.trim()) {
      setError("Please enter a note to verify your habit");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      let imageUrl = null;

      // If we have an image, upload it
      if (capturedImage) {
        // Convert data URL to file
        const file = dataURLtoFile(
          capturedImage,
          `${habitName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.jpg`,
        );

        // Upload to Supabase
        imageUrl = await uploadFile(file);
      }

      // Submit the URL and/or note
      onSubmit(imageUrl, verifyWithNote ? note : null);

      // Reset and close
      setCapturedImage(null);
      setNote("");
      onClose();
    } catch (err) {
      console.error("Error uploading verification:", err);
      setError("Could not upload verification. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Reset the state
  const handleReset = () => {
    setCapturedImage(null);
    setError(null);
  };

  // Clean up on close
  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Verify "{habitName}"</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 text-destructive text-sm p-3 rounded-md"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!capturedImage && !verifyWithNote ? (
              <motion.div
                key="capture-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {isCapturing ? (
                  <div className="relative overflow-hidden rounded-lg bg-muted aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button
                        onClick={capturePhoto}
                        size="lg"
                        className="rounded-full w-12 h-12 p-0"
                      >
                        <Camera size={20} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={startCamera}
                      variant="outline"
                      className="h-32 flex flex-col gap-2"
                    >
                      <Camera size={24} />
                      <span>Take a Photo</span>
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="h-32 flex flex-col gap-2"
                    >
                      <Upload size={24} />
                      <span>Upload a Photo</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </Button>
                    <Button
                      onClick={() => setVerifyWithNote(true)}
                      variant="outline"
                      className="h-32 flex flex-col gap-2 col-span-2"
                    >
                      <span className="text-sm">
                        Or verify with a note instead
                      </span>
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : verifyWithNote ? (
              <motion.div
                key="note-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative rounded-lg bg-muted p-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={`Write a note about how you completed "${habitName}" today...`}
                    className="w-full h-32 p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setVerifyWithNote(false);
                      setNote("");
                    }}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </motion.div>
            ) : capturedImage ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-video">
                  <img
                    src={capturedImage}
                    alt="Verification"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          {capturedImage || verifyWithNote ? (
            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Submit Verification</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="ghost"
              disabled={!isCapturing}
              className="gap-2"
            >
              <RefreshCcw size={18} />
              <span>Reset</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
