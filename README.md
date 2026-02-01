# 🎨 AI Image Enhancer

An elegant React + Vite web app that upgrades image quality using AI-powered upscaling. Upload an image, enhance it, and download the improved result — all in a clean, modern UI.

## ✨ Highlights

- 📸 Drag & drop image upload
- 🤖 Real AI upscaling with Replicate (Real-ESRGAN)
- ⚡ Fast, responsive UI with loading feedback
- 🌓 Dark/Light mode
- ⬇️ One-click download of enhanced image

## 🧩 Tech Stack

- React 18
- Vite 5
- react-dropzone
- react-toastify
- react-icons

## 🚀 Live Demo

- Add your deployed URL here once live on Vercel.

## 📦 Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create a `.env` file in the root and add your Replicate API token:

```
VITE_REPLICATE_API_TOKEN=your_replicate_token
```

### 3) Run locally

```bash
npm run dev
```

App runs at http://localhost:5173

## 🧠 How it works (AI Enhancement)

The app calls Replicate’s Real-ESRGAN model to upscale images. The logic lives in [src/App.jsx](src/App.jsx).

## 🖼️ Screenshots

Add screenshots or GIFs here for GitHub preview.

## 🌐 Deploy on Vercel

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add `VITE_REPLICATE_API_TOKEN` in Vercel → Settings → Environment Variables
4. Deploy

## 🧷 Project Structure

```
src/
├── App.jsx
├── App.css
├── main.jsx
├── index.css
index.html
vite.config.js
```

## 🔒 Notes

- Do **not** commit your `.env` file.
- Real enhancement costs Replicate credits.

## 👤 Author

Shreyansh — https://github.com/Kashyap0319

---

Made with ❤️

