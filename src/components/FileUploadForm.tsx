
"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, FileText, XCircle } from 'lucide-react';

interface UploadResult {
  downloadURL: string;
  originalFilename: string;
}

interface FileUploadFormProps {
  onUploadSuccess: (details: UploadResult) => void;
  setUploading: (isUploading: boolean) => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE_BYTES = 2.5 * 1024 * 1024 * 1024; // 2.5 GB
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

export function FileUploadForm({ onUploadSuccess, setUploading, isUploading }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const errorMsg = `File "${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB / 1024}GB.`;
        setUploadError(errorMsg);
        toast({
          title: "Upload Error",
          description: errorMsg,
          variant: "destructive",
        });
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setUploadError(null);
      }
      // Clear the input value to allow re-selecting the same file after an error or successful upload
      // This ensures that onChange fires even if the same file is selected again after an error.
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log('[FileUploadForm] Form submit event currentTarget:', event.currentTarget); // Diagnostic log
    event.preventDefault();
    if (!selectedFile) {
      const errorMsg = 'Please select a file to upload.';
      setUploadError(errorMsg);
      toast({
        title: "No File Selected",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || `Upload of ${selectedFile.name} failed with status: ${response.status}`;
        setUploadError(`Failed: ${selectedFile.name} - ${errorMsg}`);
        toast({
          title: `Upload Failed: ${selectedFile.name}`,
          description: errorMsg,
          variant: "destructive",
        });
        console.error(`[FileUploadForm] Upload failed for ${selectedFile.name}:`, result.error || response.statusText);
      } else {
        onUploadSuccess({ downloadURL: result.downloadURL, originalFilename: result.originalFilename });
        toast({
          title: `Upload Successful: ${selectedFile.name}`,
          description: "File uploaded and QR code generated.",
        });
        setSelectedFile(null); // Clear selection from state
        if (fileInputRef.current) { // Clear the actual file input element
          fileInputRef.current.value = "";
        }
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : `An unknown error occurred during upload of ${selectedFile.name}.`;
      setUploadError(`Error with ${selectedFile.name}: ${errorMessage}`);
      toast({
        title: `Upload Error: ${selectedFile.name}`,
        description: errorMessage,
        variant: "destructive",
      });
      console.error(`[FileUploadForm] Fetch or processing error for ${selectedFile.name}:`, err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="file-upload-input" className="sr-only">Choose file</Label>
        <Input
          id="file-upload-input"
          name="file-upload-input"
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
          accept="*/*" // Accept any file type
          ref={fileInputRef}
        />
        <Label
          htmlFor="file-upload-input"
          className="w-full flex flex-col items-center justify-center space-y-1 text-center cursor-pointer mt-1 px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-primary/50 hover:border-primary transition-colors duration-150 ease-in-out"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
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

      {selectedFile && !isUploading && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Selected file:</p>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate" title={selectedFile.name}>{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
            <Button variant="ghost" size="icon" type="button" onClick={removeFile} className="h-6 w-6 shrink-0" aria-label={`Remove ${selectedFile.name}`}>
              <XCircle className="h-4 w-4 text-destructive/70 hover:text-destructive" />
            </Button>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="w-full flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-center text-muted-foreground mt-2">Uploading {selectedFile ? selectedFile.name : 'file'}... please wait.</p>
        </div>
      )}

      {uploadError && !isUploading && (
        <div className="space-y-1">
            <p className="text-sm text-destructive text-center">{uploadError}</p>
        </div>
      )}

      <Button type="submit" className="w-full !mt-6" disabled={!selectedFile || isUploading} aria-live="polite">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          `Upload & Generate QR`
        )}
      </Button>
    </form>
  );
}
