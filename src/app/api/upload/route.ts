
import { NextResponse, type NextRequest } from 'next/server';
import { storage, db } from '@/lib/firebase'; // Import db
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore functions

// Configure API route for larger file sizes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '3gb', // Set to a value slightly larger than your MAX_FILE_SIZE
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const MAX_FILE_SIZE = 2.5 * 1024 * 1024 * 1024; 
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File size exceeds ${MAX_FILE_SIZE / (1024*1024*1024)}GB.` }, { status: 413 });
    }
    
    const timestamp = Date.now();
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFilename = `${timestamp}_${sanitizedOriginalName}`;
    
    const storageRef = ref(storage, uniqueFilename);

    const snapshot = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Prepare data for Firestore
    const fileData = {
      downloadURL: downloadURL,
      originalFilename: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: serverTimestamp(), // Use server timestamp
      storagePath: snapshot.ref.fullPath, // Store the path in Firebase Storage
    };

    // Save metadata to Firestore in 'uploads' collection
    try {
      const docRef = await addDoc(collection(db, "uploads"), fileData);
      console.log("File metadata saved to Firestore with ID: ", docRef.id);
    } catch (firestoreError) {
      console.error('Error saving metadata to Firestore:', firestoreError);
      // Optionally, you could decide if this error should prevent the upload from being "successful"
      // For now, we'll log it and continue, as the file is already in Storage.
    }

    return NextResponse.json({ downloadURL });

  } catch (error: any) { // Use 'any' to access potential Firebase error properties
    console.error('Upload error object raw:', error);
    console.error('Upload error object stringified:', JSON.stringify(error, null, 2));

    let errorMessage = 'Failed to upload file. Please check server logs for more details.';
    let statusCode = 500;

    if (error.code) { // Firebase errors often have a .code property
      switch (error.code) {
        case 'storage/unauthorized':
          errorMessage = 'Permission denied. Please check your Firebase Storage rules in the Firebase Console to allow uploads.';
          statusCode = 403;
          break;
        case 'storage/canceled':
          errorMessage = 'Upload canceled by the user or a network issue.';
          statusCode = 400;
          break;
        case 'storage/object-not-found':
           errorMessage = 'File or bucket not found. This can happen if the Firebase Storage bucket is misconfigured or does not exist. Please verify NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your .env.local file (e.g., YOUR-PROJECT-ID.appspot.com).';
           statusCode = 404;
           break;
        case 'storage/bucket-not-found':
           errorMessage = 'Firebase Storage bucket not found. Please verify NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your .env.local file (e.g., YOUR-PROJECT-ID.appspot.com).';
           statusCode = 404;
           break;
        case 'storage/project-not-found':
           errorMessage = 'Firebase project not found. Please verify your Firebase project configuration.';
           statusCode = 404;
           break;
        case 'storage/quota-exceeded':
          errorMessage = 'Storage quota exceeded. Please check your Firebase plan and usage.';
          statusCode = 413;
          break;
        case 'storage/retry-limit-exceeded':
          errorMessage = 'Upload failed after multiple attempts. Please check your network connection and try again.';
          statusCode = 503; // Service Unavailable or Gateway Timeout might be appropriate
          break;
        case 'storage/unknown':
           errorMessage = `Firebase Storage: An unknown error occurred. Original message: ${error.message}.`;
           if (error.serverResponse) {
             errorMessage += ` Server response: ${JSON.stringify(error.serverResponse)}`;
           }
           errorMessage += ' Please verify your NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local (e.g., YOUR-PROJECT-ID.appspot.com) and check Firebase Storage rules.';
           break;
        default: // Other Firebase errors
          errorMessage = `Firebase Storage error (${error.code}): ${error.message}`;
          if (error.serverResponse) {
            errorMessage += ` Server response: ${JSON.stringify(error.serverResponse)}`;
          }
          break;
      }
    } else if (error instanceof Error) { // Generic JavaScript errors
        errorMessage = error.message;
        // Check for Next.js/server-related body size errors (type might be specific)
        const errAsAny = error as any;
        if (errorMessage.includes('maxBodyLength') || 
            errorMessage.includes('PayloadTooLarge') || 
            errAsAny.code === 'ENOBUFS' || 
            errAsAny.type === 'entity.too.large' || // Common for body-parser errors
            (errAsAny.status === 413 && errAsAny.name === 'PayloadTooLargeError')) {
            errorMessage = 'File is too large for the server to process. Please try a smaller file. The configured limit is approx 2.5GB.';
            statusCode = 413;
        }
    }

    console.error('Processed upload error message to be sent to client:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
