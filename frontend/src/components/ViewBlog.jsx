import { useState, useEffect } from 'react';
import { HELLO_USER_MARKDOWN } from './constants';
import './css/WriteBlogPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEye } from '@fortawesome/free-solid-svg-icons'; // Import icons
import Markdown from 'react-markdown';
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from "axios";
import ErrorDialog from './micro-components/ErrorDialog';
import SuccessDialog from './micro-components/SuccessDialog';
import CommentSection from './commentSection';
import Loading from './micro-components/Loading';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { useLocation } from 'react-router-dom';

const HOST = "http://localhost:3000";

const ViewBlog = () => {

  const navigate = useNavigate(); // Initialize useNavigate
  const { blogid } = useLocation();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingBlog, setIsFetchingBlog] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [titleInput, setTitleInput] = useState("This is Title of the Blog");
  const [thumbnailImageSrc, setThumbnailImageSrc] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {

    // To get search parameters
    const queryParams = new URLSearchParams(location.search);
    const blogid = queryParams.get('blogid');
    setBlogId(blogid);

    getBlogDetails();
  }, []);

  const getBlogDetails = async () => {

    // To get search parameters
    const queryParams = new URLSearchParams(location.search);
    const blogid = queryParams.get('blogid');
    setBlogId(blogid);

    if (blogid === undefined || blogid === null || blogid === "")
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
      setIsFetchingBlog(false);

    } catch (error) {

      console.log(error.response);
      setErrorMessage(error.response.data.message);
      setIsFetchingBlog(false);

    }

  }

  return (
    <div className="blog-page">

      {errorMessage && <ErrorDialog message={errorMessage} />}
      {successMessage && <SuccessDialog message={successMessage} />}
      {isFetchingBlog && <Loading />}



      <div className="editor-condtainer">


        {thumbnailImageSrc && (
          <div className="thumbnail-container" style={{ position: 'relative', display: 'inline-block' }}>
            <div className="image-wrapper">
              <img
                src={thumbnailImageSrc}
                className="thumbnail"
                id="thumbnail-image"
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <p
              className="text-7xl px-12 text-bold text-end input-bordered w-full max-w my-4"
              style={{
                position: 'absolute',
                top: '50%', // Center vertically
                left: '50%', // Center horizontally
                transform: 'translate(-50%, -50%)', // Adjust to keep text centered
                color: '#fff', // Ensure text stands out on top of the image
                fontFamily: 'Georgia, serif',
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)', // Add shadow for better readability
              }}
            >
              {titleInput}
            </p>
          </div>
        )}

        <div className="markdown-preview markdown-preview-viewing">
          <MarkdownComponent body={text} />
        </div>
      </div>
      {errorMessage && <ErrorDialog message={errorMessage} />}
      <CommentSection blogid={blogId} />

    </div>
  );
};

const MarkdownComponent = (text) => {
  return (
    <Markdown>{text.body}</Markdown>
  );
};


export default ViewBlog;