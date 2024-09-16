import { useState } from 'react';

const WriteBlogPage = () => {

    const [text, setText] = useState("");

    const lineHeight = 20, totalLines = 60; 
    const textareaHeight = totalLines * lineHeight; 
  
    return (
      <div>
        <h1>Text Editor</h1>
        <textarea
          value={text}
          id='writingArea'
          onChange={(e) => setText(e.target.value)}
          style={{
            height: `${textareaHeight}px`, 
            lineHeight: `${lineHeight}px`,
            // resize: "none", // Disable manual resizing
            padding: "10px",
            fontSize: "18px"
          }}
          placeholder="Start typing..."
        />
      </div>
    );
};

export default WriteBlogPage;
