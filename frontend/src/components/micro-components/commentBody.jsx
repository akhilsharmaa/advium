import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
function CommentBody({id, author, firstName, lastName, content, time }) {
  return (
    <div className="card bg-base-100 rounded-lg p-6 max-w-xl mx-auto my-4">
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
    </div>
  );
}
export default CommentBody