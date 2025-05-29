
"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, ExternalLink, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DownloadDisplayProps {
  downloadURL: string;
  originalFilename?: string;
}

export function DownloadDisplay({ downloadURL, originalFilename }: DownloadDisplayProps) {
  console.log('[DownloadDisplay] Props received:', { downloadURL, originalFilename });
  console.log('[DownloadDisplay] typeof downloadURL:', typeof downloadURL);

  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = () => {
    if (typeof downloadURL !== 'string') {
      console.error('[DownloadDisplay] Attempted to copy non-string downloadURL:', downloadURL);
      toast({ title: "Copy Failed", description: "Invalid download link format.", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(downloadURL)
      .then(() => {
        setCopied(true);
        toast({ title: "Link Copied!", description: "The download link has been copied to your clipboard." });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('[DownloadDisplay] Failed to copy: ', err);
        toast({ title: "Copy Failed", description: "Could not copy the link.", variant: "destructive" });
      });
  };

  if (!downloadURL || typeof downloadURL !== 'string') {
    // If downloadURL is not a valid string, don't render the component or render a message
    if (isClient) { // Only show this error message on client-side to avoid hydration issues
        console.error('[DownloadDisplay] Invalid downloadURL prop:', downloadURL);
        return (
            <Card className="w-full shadow-xl rounded-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-destructive">
                        Error
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-6">
                    <p className="text-muted-foreground">Could not display QR code: Invalid download link provided.</p>
                </CardContent>
            </Card>
        );
    }
    return null; // Or some placeholder during SSR if URL is invalid
  }

  return (
    <Card className="w-full shadow-xl rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl font-semibold">
          File Ready!
        </CardTitle>
        {originalFilename && (
          <CardDescription className="text-center text-muted-foreground flex items-center justify-center space-x-2 pt-1">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate" title={originalFilename}>{originalFilename}</span>
          </CardDescription>
        )}
        <CardDescription className="text-center text-muted-foreground pt-1">
          Scan the QR code or use the link to download your file.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-6">
        {isClient ? (
          <div className="p-3 bg-white rounded-lg shadow-inner inline-block border border-muted">
            <QRCode
              value={downloadURL}
              size={256}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#0A0A0A"
            />
          </div>
        ) : (
          <div className="w-[256px] h-[256px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading QR Code...</p>
          </div>
        )}

        <div className="w-full space-y-2">
          <Label htmlFor={`download-link-${originalFilename?.replace(/\s+/g, '-') || 'default'}`} className="sr-only">Download Link</Label>
          <div className="flex items-center space-x-2">
            <Input id={`download-link-${originalFilename?.replace(/\s+/g, '-') || 'default'}`} type="text" value={downloadURL} readOnly className="flex-grow bg-muted/50 border-muted focus-visible:ring-primary" aria-label="Download link"/>
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy link" title="Copy link">
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" asChild aria-label="Open link in new tab" title="Open link in new tab">
              <a href={downloadURL} target="_blank" rel="noopener noreferrer" download={originalFilename}>
                <ExternalLink className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <Button asChild className="w-full !mt-4" size="lg">
          <a href={downloadURL} target="_blank" rel="noopener noreferrer" download={originalFilename}>
             <ExternalLink className="mr-2 h-5 w-5" />
             Open/Download File
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
