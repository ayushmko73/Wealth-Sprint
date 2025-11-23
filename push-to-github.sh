#!/bin/bash
# Script to push all files to GitHub

echo "🚀 Pushing all files to GitHub..."

# Stage all files
git add .gitattributes
git add client/public/sounds/
git add client/public/images/
git add client/public/avatars/
git add client/public/icons/
git add client/public/geometries/
git add client/public/*.png
git add client/public/*.svg
git add client/public/*.webp
git add client/public/*.glb
git add client/public/*.gltf
git add .

# Commit changes
git commit -m "Add all asset files (sounds, images, 3D models) and bug fixes"

# Push to GitHub
git push origin main

echo "✅ Done! All files should now be on GitHub"
