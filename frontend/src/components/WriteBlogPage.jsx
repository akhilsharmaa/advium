import { useState, useEffect } from 'react';
import { HELLO_USER_MARKDOWN } from './constants';
import './css/WriteBlogPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEye } from '@fortawesome/free-solid-svg-icons'; // Import icons
import Markdown from 'react-markdown';
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import axios from "axios";
import ErrorDialog from './micro-components/ErrorDialog';
import SuccessDialog from './micro-components/SuccessDialog';

const HOST = "http://localhost:3000"; 

const WriteBlogPage = () => {

  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState('tab1');
  const [loading,   setLoading] = useState(false);
  const [thumbnailImageSrc, setThumbnailImageSrc] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const lineHeight = 20, totalLines = 60;
  const textareaHeight = totalLines * lineHeight;

  useEffect(() => {
      setText(HELLO_USER_MARKDOWN);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  function resizeBase64Img(base64, newWidth, newHeight) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.src = base64;

        img.onload = () => {
            const imageAspectRatio = img.width / img.height;
            const targetAspectRatio = newWidth / newHeight;

            let cropX = 0;
            let cropY = 0;
            let cropWidth = img.width;
            let cropHeight = img.height;

            if (imageAspectRatio > targetAspectRatio) {
                // Image is wider than target, so crop the sides
                cropWidth = img.height * targetAspectRatio;
                cropX = (img.width - cropWidth) / 2;
            } else if (imageAspectRatio < targetAspectRatio) {
                // Image is taller than target, so crop the top and bottom
                cropHeight = img.width / targetAspectRatio;
                cropY = (img.height - cropHeight) / 2;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;
            const context = canvas.getContext("2d");
            context.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, newWidth, newHeight);
            resolve(canvas.toDataURL());
        };
    });
}



  const onDrop = useCallback((acceptedFiles) => {
    
    const IMAGE_QUALITY = 25;

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        
        setThumbnailImageSrc(reader.result); // setting the image to the image tag 

        resizeBase64Img(reader.result, 16*IMAGE_QUALITY, 10*IMAGE_QUALITY)
        .then((result)=>{
          setThumbnailImageSrc(result);
          console.log(result);
          
        });
      }
      reader.readAsDataURL(file);
    })
    
  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const handleSubmit = async () => {      

      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    
      const requestData = {
        name: "John Doe",
        email: "john@example.com",
      };
  
      try {

          const response = await axios.post(`${HOST}/write/new`, requestData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setSuccessMessage(response.response.data.message)

      } catch (error) {
          
          console.log(error.response);
          setErrorMessage(error.response.data.message);

      }
  
    
      setLoading(false);
  }

  return (
    <div className="blog-page">

      {errorMessage && <ErrorDialog message={errorMessage}/>}
      {successMessage && <SuccessDialog message={errorMessage}/>}
      
      {/* <errorDialog></errorDialog> */}
      <div className='thumbnail-container'>
        {thumbnailImageSrc ? (
          <div  {...getRootProps()} className="image-wrapper">
            <img 
              src={thumbnailImageSrc} 
              alt="Dropped file preview" 
              className="thumbnail" 
              id='thumbnail-image'
            />
              <input {...getInputProps()} />
            <div className="overlay">
              <div>
                <p className='text-2xl'>Choose / Drop New Thumbnail</p>
                <p className='text-sm text-gray-300'>Image will be automatically resize to almost <span className='text-red-600'>300KB</span> .</p>
              </div>

            </div>
          </div>
        ) : (
          <div {...getRootProps()} className="drag-area  thumbnail">
            <input {...getInputProps()} />
            <div>
              <p className='text-2xl'>Choose / Drop Thumbnail</p>
              <p className='text-sm text-gray-500'>Image will be automatically resize to almost <span className='text-red-600'>300KB</span> .</p>
            </div>
          </div>
        )}
      </div>


    <div className="editor-container">

        <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab1')}
        >
          <FontAwesomeIcon color='black' icon={faPen} /> {/* Write icon */}
        </button>
        <button
          className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab2')}
        >
          <FontAwesomeIcon color='black' icon={faEye} /> {/* Preview icon */}
        </button>
        </div>

        <div >
          {activeTab === 'tab1' && (
            <textarea
              value={text}
              id="writinsgArea"
              onChange={(e) => setText(e.target.value)}
              style={{
                height: `${textareaHeight}px`,
                lineHeight: `${lineHeight}px`,
              }}
              placeholder="Start typing..."
              className="editor-textarea"
            />
          )}

          {activeTab === 'tab2' && (
            <div className="markdown-preview">
              <MarkdownComponent body={text} />
            </div>
          )}
        </div>
        <button className="btn btn-warning mb-2"
            onClick={handleSubmit}>
            {loading && <span className="loading loading-spinner"></span>}
            Publish
        </button>
      </div>
      {errorMessage && <ErrorDialog message={errorMessage}/>}
      {successMessage && <SuccessDialog message={successMessage}/>}
    </div>
  );
};

const MarkdownComponent = (text) => {
  return (
    <Markdown>{text.body}</Markdown>
  );
};


export default WriteBlogPage;