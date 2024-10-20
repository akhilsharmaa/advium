import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from "axios";
import ErrorDialog from './micro-components/ErrorDialog';
import SuccessDialog from './micro-components/SuccessDialog';
import CommentBody from './micro-components/CommentBody';
import Loading from './micro-components/Loading';
import './css/comments.css'

const HOST = "http://localhost:3000";

// eslint-disable-next-line react/prop-types
function CommentSection({ blogid }) {

  const [comments, setComments] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentBlogId, setCurrentBlogId] = useState(blogid);
  const [commentLoading, setCommentLoading] = useState(null);
  const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);
  const [commentTextInput, setCommentTextInput] = useState("");

  useEffect(() => {
    setCurrentBlogId(blogid);
    fetchComments(blogid);
  }, [blogid]);

  
  const fetchComments = async (blogid) => {
    setCommentLoading(true);

    try {

      const response = await axios.get(`${HOST}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "blog": blogid,
        },
      });


      console.log("response.data: ", response.data);

      setComments(response.data);
      setCommentLoading(false);

    } catch (error) {
      
      console.log(error);
      // setErrorMessage(error.response.data);
      setCommentLoading(false);
    }

  }


  const handleSubmitNewComment = async () => {

    setCommentSubmitLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const requestData = {
        "blogId": blogid,
        "comment": commentTextInput
    };

    try {

      const response = await axios.post(`${HOST}/comment`, requestData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setSuccessMessage(response.data.message)
      setCommentSubmitLoading(false)
      setCommentTextInput("");

    } catch (error) {

      console.log(error.response);
      setErrorMessage(error.response.data.message);
      setCommentSubmitLoading(false)

    }

  }

  return (
    <div className="comment-wrapper p-2">

      <div className="p-4 max-w mx-auto">
      <h3 className="text-lg font-bold text-start mb-4">Comments</h3>

      {/* Add Comment Section */}
      <div className="flex items-center mb-4 space-x-4">
        <input type="text" placeholder="Add a public comment..."
          className="input input-bordered w-full"
          onChange={(e) => setCommentTextInput(e.target.value)} 
          value={commentTextInput}/>
        <button className="btn btn-primary" 
          onClick={handleSubmitNewComment}> 
          Comment
          {commentSubmitLoading && <span className="loading "></span>  }

        </button>
      </div>

      {errorMessage && <ErrorDialog message={errorMessage} />}
      {successMessage && <SuccessDialog message={successMessage} />}

      <div className="divider"></div>

      {/* Comment List */}

      {comments ? 
         <div className="space-y-4">
        {comments.map((comment) => (
          <CommentBody key={comment._id} 
              _id={comment._id}
              firstName={comment.authorFirstName}
              lastName={comment.authorLastName}
              content={comment.content} 
              time={comment.time}
          />
        ))}
      </div>
      : <span className='loading'> </span>}
    
    </div>
    </div>
  );
};

export default CommentSection;