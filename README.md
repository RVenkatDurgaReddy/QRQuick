# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# QRQuick

if any issues while running the application (npm install) 
some time it could show this error
C:\Users\----\Downloads\QRQuick-main>npm install
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: @tanstack-query-firebase/react@1.0.6
npm error Found: firebase@10.14.1
npm error node_modules/firebase
npm error   firebase@"^10.12.2" from the root project
npm error
npm error Could not resolve dependency:
npm error peer firebase@"^11.3.0" from @tanstack-query-firebase/react@1.0.6
npm error node_modules/@tanstack-query-firebase/react
npm error   @tanstack-query-firebase/react@"^1.0.5" from the root project
npm error
npm error Conflicting peer dependency: firebase@11.8.1
npm error node_modules/firebase
npm error   peer firebase@"^11.3.0" from @tanstack-query-firebase/react@1.0.6
npm error   node_modules/@tanstack-query-firebase/react
npm error     @tanstack-query-firebase/react@"^1.0.5" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error C:\Users\-----\AppData\Local\npm-cache\_logs\2025-05-29T09_05_55_894Z-eresolve-report.txt
npm error A complete log of this run can be found in: C:\Users\----\AppData\Local\npm-cache\_logs\2025-05-29T09_05_55_894Z-debug-0.log



so use this command instead 

npm install --legacy-peer-deps

this would resolve the issue

