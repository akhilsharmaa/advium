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
import Loading from './micro-components/Loading';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { useLocation } from 'react-router-dom';

const HOST = "http://localhost:3000"; 

const WriteBlogPage = () => {

  const navigate = useNavigate(); // Initialize useNavigate
  const { blogid } = useLocation();

  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState('tab1');
  const [loading,   setLoading] = useState(false);
  const [isFetchingBlog,   setIsFetchingBlog] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [isEditing,   setIsEditing] = useState(false);
  const [titleInput,   setTitleInput] = useState("This is Title of the Blog");
  const [thumbnailImageSrc, setThumbnailImageSrc] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const lineHeight = 20, totalLines = 60;
  const textareaHeight = totalLines * lineHeight;

  useEffect(() => {
      getBlogDetails();
      setText(HELLO_USER_MARKDOWN);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  
  const getBlogDetails = async () => {      

      // To get search parameters
      const queryParams = new URLSearchParams(location.search);
      const blogid = queryParams.get('blogid');

      if(blogid === undefined || blogid === null || blogid === "")
        return; 

      console.log(blogid);
      setIsFetchingBlog(true);

      try {

        const response = await axios.get(`${HOST}/blog`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`, 
            "blog": `${blogid}`, 
          },
        });

        // setSuccessMessage(response.data.message)
        setTitleInput(response.data.result.title)
        setText(response.data.result.markdown_body)
        setThumbnailImageSrc(response.data.result.thumbnailBase64)
        setIsEditing(true);
        setBlogId(blogid);

    } catch (error) {
        
        console.log(error.response);
        setErrorMessage(error.response.data.message);

    }

    setIsFetchingBlog(false);
    
  }

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
        title: titleInput, 
        tags: [], 
        markdown_body: text,
        thumbnailBase64: thumbnailImageSrc, 
        secondaryThumbnailBase64 : thumbnailImageSrc
      };
  
      try {

          const response = await axios.post(`${HOST}/write/new`, requestData, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`, 
            },
          });

          console.log(response);
          setSuccessMessage(response.data.message)
          setLoading(false);

      } catch (error) {
          
          console.log(error.response);
          setErrorMessage(error.response.data.message);
          setLoading(false);

            
      }    
  }

  const handleEditing = async () => {      

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  
    const requestData = {
      blogId: blogId, 
      title: titleInput, 
      tags: [], 
      markdown_body: text,
      thumbnailBase64: thumbnailImageSrc, 
      secondaryThumbnailBase64 : thumbnailImageSrc
    };

    try {

        const response = await axios.post(`${HOST}/write/edit`, requestData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`, 
          },
        });

        console.log(response);
        setSuccessMessage(response.data.message)
        setLoading(false);

    } catch (error) {
        
        console.log(error.response);
        setErrorMessage(error.response.data.message);
        setLoading(false);
    }    
}

  return (
    <div className="blog-page">

      {errorMessage && <ErrorDialog message={errorMessage}/>}
      {successMessage && <SuccessDialog message={successMessage}/>}
      {isFetchingBlog && <Loading/> }

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

      <input 
             type="text" placeholder="Your Blog Title..." 
             className="input text-2xl text-bold input-bordered w-full max-w p-8 my-4"
             onChange={(e) => setTitleInput(e.target.value)}
             value={titleInput}
      />

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

        <div className="flex p-2 justify-end items-center bg-gray-200">
        { isEditing ? 
            <button className="btn btn-warning mb-2"
              onClick={handleEditing}>
              {loading && <span className="loading loading-spinner"></span>}
              Save Edit
            </button>
            : 
            <button className="btn btn-success text-white mb-2"
              onClick={handleSubmit}>
              {loading && <span className="loading loading-spinner"></span>}
              Create Blog
            </button> 
          }
        </div>

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