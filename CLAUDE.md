# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Three.js WebGL application for displaying SOLK shoe models in wireframe format with interactive scroll-based rotation and orbit controls. The project is a client-side web application with no build system or package management - it uses direct script includes.

## Development Commands

### Starting the Development Server
```bash
node server.js
```
This starts a local HTTP server on port 3000 serving files with appropriate MIME types for GLB models and permissive CORS headers.

### No Build System
This project has no build process, package.json, or dependency management. All dependencies are included as standalone JavaScript files or loaded from CDN.

## Architecture

### Core Application Structure

- **server.js**: Simple HTTP server that serves static files with proper MIME types for GLB models
- **app.js**: Main Three.js application logic with model loading, scene setup, and animation loop
- **working.html**: Primary entry point (served as default route `/`)
- **index.html**: Alternative entry point with slightly different styling approach
- **final.html**: Clean version with CSP headers

### Model Loading System

The application uses a fallback system for GLB model loading:
1. Attempts to load specific SOLK shoe GLB files with multiple filename variations
2. Falls back to wireframe cube if model loading fails
3. Supports both DRACO-compressed and uncompressed GLB files

Available GLB models:
- `shoe.glb` / `shoe-nodraco.glb`: Standard shoe model
- `shoe_anim.glb`: Animated version
- `shoe_retopo6.glb`: Retopologized version

### Key Components

- **Three.js Scene**: Black background with ambient and directional lighting
- **Model Rendering**: All loaded meshes converted to wireframe materials
- **Scroll Integration**: Model rotation tied to page scroll position
- **Orbit Controls**: Mouse/touch interaction for camera movement
- **Responsive Design**: Canvas resizes with window dimensions

### File Organization

- HTML files represent different viewer variations and debugging versions
- JavaScript loaders (`GLTFLoader.js`, `OrbitControls.js`, etc.) are standalone Three.js modules
- GLB files are 3D shoe models in different formats/compressions
- `simple.js` contains minimal Three.js setup for testing

### Debugging Pages

Multiple HTML files exist for testing different aspects:
- `debug-*.html`: Various debugging scenarios
- `test-*.html`: Feature testing pages
- `simple.html`: Minimal Three.js setup
- `wireframe-test.html`: Wireframe rendering tests

### Server Configuration

The server includes:
- Permissive CSP headers for Three.js and WebGL
- CORS headers for cross-origin requests
- Proper MIME type for `.glb` files (`model/gltf-binary`)
- Default route serves `working.html`

## Development Notes

- No linting, testing, or build commands exist
- All code is vanilla JavaScript with direct Three.js usage
- Models should be placed in the root directory
- Server must be running to properly load GLB files due to CORS restrictions