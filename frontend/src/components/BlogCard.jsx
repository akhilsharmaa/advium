import '../components/css/blogcard.css'

/* eslint-disable react/prop-types */
const BlogCard = ({ image, title, text, authorImage, authorName, date }) => {

  const TITLE_LEN = 80; 
  const TEXT_LEN = 100;

  const titlesuff = title.length >= TITLE_LEN ? "..." : "";
  const textsuff = text.length >= TEXT_LEN ? "..." : "";
  title = title.substring(0, TITLE_LEN) + titlesuff;
  text = text.substring(0, TEXT_LEN) + textsuff;

  return (
    <article className="text-start overflow-hidden transform transition flex flex-col h-full">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {/* Medium Logo and Text */}
        <div className="absolute top-2 left-2 bg bg-opacity-80 p-1 rounded-md flex items-center z-10">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/medium-round-icon.png"
            alt="Medium Logo"
            className="w-6 h-6 mr-1"
          />
          <span className="text-xs text-white font-semibold">Published on Medium</span>
        </div>

        {/* Image with Gradient */}
        <div className="relative">
          <img
            src={image}
            alt="banner"
            className="w-full h-60 object-cover transform transition duration-500 hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-t from-transparent to-gray-600"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="blogcard-footer flex flex-col justify-between flex-grow bg-white">
        <div>
          <a href="#">
            <h3 className="blog-heading transition mb-2 font-semibold">
              {title}
            </h3>
          </a>

          <p className="blog-description text-gray-500 mb-4 ">
            {text}
          </p>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between pb-2 items-center">
          {/* Author Info */}
          <div className="flex items-center">
            <img
              src={authorImage}
              alt="author"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <a href="#">
                <h4 className="text-gray-700 font-medium hover:text-gray-500 transition text-base">
                  {authorName}
                </h4>
              </a>
              <p className="text-gray-400 text-sm">{date}</p>
            </div>
          </div>

          {/* Share Button */}
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-300 transition">
            <ion-icon name="arrow-redo"></ion-icon>
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;