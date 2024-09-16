import { useState } from 'react';
// import marked from 'marked';
import MarkdownComponent from './MarkdownComponent';

const WriteBlogPage = () => {

  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState('tab1');

  const lineHeight = 20, totalLines = 60;
  const textareaHeight = totalLines * lineHeight;


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (

    <div>
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab1')}>
          Tab 1
        </button>
        <button
          className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab2')} >
          Tab 2
        </button>
      </div>
    
      <div>
      <h1>Text Editor</h1>  

      
      <div className="tab-content">
        {activeTab === 'tab1' && <div>
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
        </div>}
        {activeTab === 'tab2' && 
          <div>
            <MarkdownComponent body={text} />
          </div>}
        </div>

      </div>
    </div>
  );
};

export default WriteBlogPage;
