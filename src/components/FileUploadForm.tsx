
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from 'lucide-react';

interface FileUploadFormProps {
  onUploadSuccess: (url: string) => void;
  setUploading: (isUploading: boolean) => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE_BYTES = 2.5 * 1024 * 1024 * 1024; // 2.5 GB
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

export function FileUploadForm({ onUploadSuccess, setUploading, isUploading }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        const errorMsg = `File is too large. Max size is ${MAX_FILE_SIZE_MB / 1024}GB.`;
        setError(errorMsg);
        setFile(null);
        toast({
          title: "Upload Error",
          description: errorMsg,
          variant: "destructive",
        });
        // Clear the input field
        event.target.value = "";
        return;
      }
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      const errorMsg = 'Please select a file to upload.';
      setError(errorMsg);
      toast({
        title: "No File Selected",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed with status: ' + response.status);
      }
      
      onUploadSuccess(result.downloadURL);
      toast({
        title: "Upload Successful",
        description: "File uploaded and QR code generated.",
      });
      setFile(null); 
      const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      onUploadSuccess(''); 
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="file-upload" className="sr-only">Choose file</Label>
        {/* File input is moved here, it remains sr-only */}
        <Input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="sr-only" 
          onChange={handleFileChange} 
          disabled={isUploading} 
          accept="*/*"
        />
        
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-primary/50 hover:border-primary transition-colors duration-150 ease-in-out">
          {/* This Label now wraps the entire clickable area */}
          <Label 
            htmlFor="file-upload" 
            className="w-full flex flex-col items-center justify-center space-y-1 text-center cursor-pointer"
          >
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="flex text-sm text-muted-foreground justify-center items-center">
              <span className="font-medium text-primary hover:text-primary/80">
                Upload a file
              </span>
              <p className="pl-1 hidden sm:inline">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">Any file type, up to {MAX_FILE_SIZE_MB / 1024}GB</p>
          </Label>
        </div>
      </div>

      {file && !isUploading && (
        <div className="text-sm text-foreground truncate" title={file.name}>
          Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
        </div>
      )}
      
      {isUploading && (
        <div className="w-full flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-center text-muted-foreground mt-2">Uploading... please wait.</p>
        </div>
      )}

      {error && !isUploading && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button type="submit" className="w-full !mt-6" disabled={!file || isUploading} aria-live="polite">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload & Generate QR'
        )}
      </Button>
    </form>
  );
}
