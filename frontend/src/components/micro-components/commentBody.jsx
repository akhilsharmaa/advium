import { useState } from 'react';
import axios from "axios";
import ErrorDialog from './ErrorDialog';
import SuccessDialog from './SuccessDialog';

const HOST = "http://localhost:3000";

// eslint-disable-next-line react/prop-types
function CommentBody({id, author, firstName, lastName, content, time }) {

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyTextInput, setReplyTextInput] = useState("");
  const [replySubmitLoading, setReplySubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const handleOnReplyButton = () => {
      setIsReplyDialogOpen(!isReplyDialogOpen); 
  }

  const handleSubmitNewReply = async ()  => {
      
      setReplySubmitLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const requestData = {
          "parentCommentOrReplyId": id,
          "comment": replyTextInput
      };

      try {

        const response = await axios.post(`${HOST}/reply`, requestData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        setSuccessMessage(response.data.message)
        setReplySubmitLoading(false)
        setReplyTextInput("");

      } catch (error) {

        console.log(error.response);
        setErrorMessage(error.response.data.message);
        setReplySubmitLoading(false)
      }
  }

  return (

    <div className="ml-10 max mx text-black">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-500">{author}</p>
          </div>
          <p className="text-sm text-gray-400">{time}</p>
        </div>
          
        <div className="text-start" >
          <p className="text-xl text-gray-800 leading-relaxed">{content}</p>
        </div>

        <div className='flex justify-end mb-4'>
          <button className='font-bold flex items-center justify-center py-2 bg-white rounded-full'
            onClick={handleOnReplyButton}>
            <img src="https://www.kindpng.com/picc/m/25-258178_dropdown-icon-png-free-download-arrow-down-icon.png" className='w-8 pr-2' ></img>
            <span className='text-blue-600'>Reply</span>
          </button>
        </div>

        {errorMessage && <ErrorDialog message={errorMessage} />}
        {successMessage && <SuccessDialog message={successMessage} />}

        {/* Add Reply Section */}
        {isReplyDialogOpen && 
          <div className="flex items-center ml-10 mb-4 space-x-4">
            <input type="text" placeholder="Add a public comment..."
              className="input bg-white input-bordered w-full"
              onChange={(e) => setReplyTextInput(e.target.value)} 
              value={replyTextInput}/>
            <button className="btn btn-primary" 
              onClick={handleSubmitNewReply}> 
              Comment {replySubmitLoading && <span className="loading "></span>  }
            </button>

          </div>
        }
        

        <div className='divider'></div>
    </div>
  );
}
export default CommentBody