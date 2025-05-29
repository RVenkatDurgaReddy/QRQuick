# **App Name**: QRQuick

## Core Features:

- File Upload: File upload functionality allowing users to select files up to 2.5GB from their local storage.
- Cloud Storage Integration: Files uploaded by users will be transferred to Firebase Cloud Storage using this tool. Filenames should incorporate a timestamp to maintain uniqueness and file organization.
- Download Link Generation: Secure URLs that are public and directly downloadable should be obtained using the cloud storage after uploads. No database required, only use Nextjs's api to implement file uploads to firebase storage.
- QR Code Generator: The app dynamically generates QR codes from the uploaded file URLs so users can immediately scan and download.
- Copy to Clipboard: The link for sharing can easily be put on your device's clipboard, increasing productivity and accessibility to cloud content.
- Theme Customization: System-controlled appearance choices with themes.
- Loading spinner: A preloader animation makes file transfer smoother and tells user feedback without visual delay.

## Style Guidelines:

- Primary color: Muted teal (#63B5AF) to reflect both the technological aspects and user-friendliness.
- Background color: Light gray (#F0F4F3), to facilitate focusing attention without eyestrain
- Accent color: Soft coral (#E9907D), in an attempt to create balance for call to action or prompts
- Clean, sans-serif font throughout the app to ensure maximum legibility.
- The file transfer icons will need to communicate actions precisely so clarity is important, combined with minimalist icon styling.
- The responsive structure is simple and scalable: a centralized display which seamlessly conforms to different display formats so that customers are able to view this across all of the screens.
- Transitions must happen subtly across app, to draw the visitor to it so that a sleek, modern look for interaction exists as intended, improving both intuitiveness with UI.