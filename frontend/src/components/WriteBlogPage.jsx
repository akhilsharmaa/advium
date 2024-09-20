import { useState, useEffect } from 'react';
import MarkdownComponent from './MarkdownComponent';
import { HELLO_USER_MARKDOWN } from './constants';
import './css/WriteBlogPage.css'


const WriteBlogPage = () => {

  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState('tab1');

  const lineHeight = 20, totalLines = 60;
  const textareaHeight = totalLines * lineHeight;

  useEffect(() => {
      setText(HELLO_USER_MARKDOWN);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="blog-page">

      <div className="editor-container">

        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab1')}
          >
            Write
          </button>
          <button
            className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab2')}
          >
            Preview
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'tab1' && (
            <textarea
              value={text}
              id="writingArea"
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
      </div>
    </div>
  );
};

export default WriteBlogPage;