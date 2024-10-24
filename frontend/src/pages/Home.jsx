import BlogCard from "../components/BlogCard"
import '../App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import "../components/css/home.css"

const HOST = "http://localhost:3000";

function Home() {
      
      const [loadedBlogCount, setLoadedBlogCount] = useState(0);
      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(false);

      const fetchBlogsList = async () => {

        const result = await axios.get(`${HOST}/blogs/sortbytime`, {
          headers: {
            "Content-Type": "application/json",
            "skip" : `${loadedBlogCount}`
          },
        });
        
        // console.log(result.data.body);
        setData((prevData) => [...prevData, ...result.data.body]);
        setLoading(false);
      };

      useEffect(() => {
        setLoading(true);
      }, []);

      useEffect(() => {
        if (loading == true) {
          fetchBlogsList();
          setLoadedBlogCount((prevCount) => prevCount + 6);
        }
      }, [loading]);
      
      const handleScroll = () => {
        if (document.body.scrollHeight - 300 < window.scrollY + window.innerHeight) {
          setLoading(true);
        }
      };

      function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      }

      window.addEventListener("scroll", debounce(handleScroll, 500));

      return (
        <home className="flex justify-center">
          <div className=" min-h-screen w-full lg:w-4/5">


          {/* GLOBAL SEARCH */}
          <div className="bg-blue-00 rounded-md">
            <div className="container h-96 w-full flex justify-center items-center">
                <div>
                    <p className="text-start text-gray-300 pl-8 pb-2 text-sm">Utilizing <span className="text-red-300">ElasticSearch </span>  </p>
                    <input type="text" 
                            id="global-searchbar"
                            className="rounded z-0 focus:shadow focus:outline-none" 
                            placeholder="Search anything..." />
                    <div className="absolute top-4 right-3">
                        <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
                    </div>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {data.map((blog, index) => (
                <BlogCard
                  key={index}
                  image={blog.image}
                  title={blog.title}
                  text={blog.markdown_body}
                  authorImage={blog.authorImage}
                  authorName={blog.authorName}
                  date={blog.time}
                />
              ))}
            </div>
            {loading && <p className="loading loading-lg m-10  p-10"></p>}
          </div>
        </home>
      );
}


export default Home