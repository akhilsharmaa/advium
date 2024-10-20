import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from "axios";
import ErrorDialog from './micro-components/ErrorDialog';
import SuccessDialog from './micro-components/SuccessDialog';
import Loading from './micro-components/Loading';
import './css/comments.css'

const HOST = "http://localhost:3000";


// Sample comment data
const initialComments = [
  {
    id: 1,
    username: 'JohnDoe',
    text: 'This is an awesome video!',
    likes: 10,
    replies: [
      {
        id: 11,
        username: 'JaneDoe',
        text: 'Totally agree!',
        likes: 5,
      }
    ]
  },
  {
    id: 2,
    username: 'User123',
    text: 'Great content as always!',
    likes: 7,
    replies: []
  }
];


// eslint-disable-next-line react/prop-types
function CommentSection({ blogid }) {

  const [comments, setComments] = useState(initialComments);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentBlogId, setCurrentBlogId] = useState(blogid);
  const [commentLoading, setCommentLoading] = useState(null);
  const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);
  const [commentTextInput, setCommentTextInput] = useState(null);

  useEffect(() => {
    console.log("comment section blogid:", blogid);
    setCurrentBlogId(blogid);
    fetchCommetsComments();
  }, []);

  const fetchCommetsComments = async () => {

    if (blogid === undefined || blogid === null || blogid === "")return;

    try {

      const response = await axios.get(`${HOST}/blog`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "blog": `${blogid}`,
        },
      });

      // setSuccessMessage(response.data.message)

    } catch (error) {

      console.log(error.response);
      setErrorMessage(error.response.data.message);

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
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="card bg-base-100 shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{comment.username}</span>
              <span className="text-sm text-gray-500">Likes: {comment.likes}</span>
            </div>
            <p>{comment.text}</p>
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline"
                // onClick={() => handleLike(comment.id)}
              >
                Like
              </button>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="mt-4 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="ml-8 card bg-base-200 shadow-sm p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{reply.username}</span>
                      <span className="text-sm text-gray-500">Likes: {reply.likes}</span>
                    </div>
                    <p>{reply.text}</p>
                    <button className="btn btn-sm btn-outline mt-2">
                      Like
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    

    </div>
  );
};

export default CommentSection;