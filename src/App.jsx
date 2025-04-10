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
      // Here you would typically call your AI image enhancement API
      // For now, we'll simulate the enhancement
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEnhancedImage(image);
      toast.success('Image enhanced successfully!');
    } catch (error) {
      toast.error('Failed to enhance image');
      console.error(error);
    } finally {
      setLoading(false);
    }
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