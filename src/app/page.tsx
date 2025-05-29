"use client";

import React, { useState } from 'react';
import { FileUploadForm } from '@/components/FileUploadForm';
import { DownloadDisplay } from '@/components/DownloadDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QrQuickLogo } from '@/components/icons/Logo';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, Title, Desc as they are not used directly here

export default function HomePage() {
  const [downloadURL, setDownloadURL] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUploadSuccess = (url: string) => {
    setDownloadURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <header className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </header>
      
      <main className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <QrQuickLogo className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            QRQuick
          </h1>
          <p className="text-md sm:text-lg text-muted-foreground">
            Upload your file, get a QR code, and share instantly.
          </p>
        </div>

        <Card className="shadow-xl rounded-xl overflow-hidden border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <FileUploadForm 
              onUploadSuccess={handleUploadSuccess} 
              setUploading={setIsUploading}
              isUploading={isUploading}
            />
          </CardContent>
        </Card>

        {downloadURL && !isUploading && (
          <div className="mt-8 w-full animate-in fade-in-50 duration-500">
            <DownloadDisplay downloadURL={downloadURL} />
          </div>
        )}
         {isUploading && (
          <div className="mt-8 w-full text-center text-muted-foreground">
            {/* Placeholder while uploading before DownloadDisplay shows. FileUploadForm handles its own spinner. */}
          </div>
        )}
      </main>

      <footer className="pt-12 pb-6 text-center text-muted-foreground text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} QRQuick. Secure & Simple File Sharing.
      </footer>
    </div>
  );
}
