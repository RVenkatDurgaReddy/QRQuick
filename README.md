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

so use this command instead 

npm install --legacy-peer-deps

this would resolve the issue
and then " npm run dev "


mainly fill the api keys through the google cloud firebase as mentioned in 

#.env file 
