import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiLoader, FiSun, FiMoon, FiImage, FiCamera, FiEdit2, FiGithub } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const enhanceImage = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      // Call Replicate API for Real-ESRGAN image upscaling
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
          input: {
            image: image,
            scale: 4,
            face_enhance: false
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start enhancement');
      }

      let prediction = await response.json();
      
      // Poll the API until the prediction is complete
      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: { 'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}` }
          }
        );
        
        if (!statusResponse.ok) {
          throw new Error('Failed to check status');
        }
        
        prediction = await statusResponse.json();
      }

      if (prediction.status === 'succeeded' && prediction.output) {
        const outputImage = Array.isArray(prediction.output)
          ? prediction.output[0]
          : prediction.output;
        setEnhancedImage(outputImage);
        toast.success('🎉 Image enhanced successfully with AI!');
      } else {
        toast.error('❌ Enhancement failed');
      }
    } catch (error) {
      toast.error('Failed to enhance: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!enhancedImage) return;
    
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `enhanced-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <FiImage className="logo-icon" />
            <h1>AI Image Enhancer</h1>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
        <p className="subtitle">Transform your images with AI-powered enhancement</p>
        <div className="feature-stickers">
          <div className="sticker">
            <FiCamera />
            <span>High Quality</span>
          </div>
          <div className="sticker">
            <FiEdit2 />
            <span>AI Enhanced</span>
          </div>
          <div className="sticker">
            <FiImage />
            <span>Instant Results</span>
          </div>
        </div>
      </header>

      <main>
        <div className="upload-section">
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {image ? (
              <img src={image} alt="Uploaded" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <FiUpload size={48} />
                <p>{isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}</p>
              </div>
            )}
          </div>

          {image && (
            <button 
              onClick={enhanceImage} 
              disabled={loading}
              className="enhance-button"
            >
              {loading ? (
                <>
                  <FiLoader className="spinner" />
                  Enhancing...
                </>
              ) : (
                'Enhance Image'
              )}
            </button>
          )}
        </div>

        {enhancedImage && (
          <div className="result-section">
            <h2>Enhanced Image</h2>
            <img src={enhancedImage} alt="Enhanced" className="enhanced-image" />
            <button onClick={downloadImage} className="download-button">
              <FiImage />
              Download Enhanced Image
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>Created with ❤️ by Shreyansh</p>
          <div className="social-links">
            <a href="https://github.com/Kashyap0319" target="_blank" rel="noopener noreferrer">
              <FiGithub />
            </a>
          </div>
        </div>
      </footer>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App; 