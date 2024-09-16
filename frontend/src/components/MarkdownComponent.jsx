import Markdown from 'react-markdown';

const MarkdownComponent = (text) => {
  return (
    <Markdown>{text.body}</Markdown>
  );
};

export default MarkdownComponent;