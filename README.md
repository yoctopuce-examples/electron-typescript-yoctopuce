### Introduction

This project is a sample Electron application using Yoctopuce sensors, 
written in Typescript.

It uses our custom build tools described in more details in our
[electron-typescript-preact boilerplate](https://github.com/yoctopuce-examples/electron-typescript-preact-boilerplate).

### Usage

You can start a development version with hot-reload using:  

    npm run start-dev

To make a production application, download [Electron
distributable binaries](https://github.com/electron/electron/releases), 
unzip them in the `dist/` directory, and run

    npm run build-prod

This will automatically create the application-specific bundle in
`dist/resources/app.asar`, and you will have a stand-alone application.
