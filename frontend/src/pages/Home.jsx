import BlogCard from "../components/BlogCard"
import '../App.css';
import { useState, useEffect } from 'react';
import axios from "axios";

const HOST = "http://localhost:3000";

function Home() {

    const [blogs, setBlogs] = useState([]);
  
    useEffect(() => {
      fetchBlogsByDate();
    }, []);

  const fetchBlogsByDate = async () => {

    try {

      const result = await axios.get(`${HOST}/blogs/sortbytime`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log(result.data.body);
      setBlogs(result.data.body);

      let tempBlog = result.data.body; 
      let final = [];
      tempBlog.map((blog, index) => {
          final.push({
              title : blog.title, 
              text : blog.markdown_body, 
              image: 'https://i.postimg.cc/Zq6vZ4D1/drawers.jpg',
              authorImage: 'https://i.postimg.cc/GmLb9r2W/avatar-michelle.jpg',
              authorName: 'Akhilesh Sharma',
              date: blog.time
          }); 
      });

      console.log(tempBlog);
      setBlogs(final);

    } catch (error) {

      console.log(error);

    }
  } 

  // blogs = [
  //   {
  //     image: 'https://i.postimg.cc/Zq6vZ4D1/drawers.jpg',
  //     title: 'Shift the overall look and feel by adding these wonderful touches to furniture in your home',
  //     text: `Ever been in a room and felt like something was missing? Perhaps it felt slightly bare and uninviting. I've got some simple tips to help you make any room feel complete.`,
  //     authorImage: 'https://i.postimg.cc/GmLb9r2W/avatar-michelle.jpg',
  //     authorName: 'Akhilesh Sharma',
  //     date: '17 Oct 2024',
  //   },
  //   {
  //     image: 'https://cdn-images-1.medium.com/max/2400/1*PhE4MapvxsuKXJ3Z6O4Ijg.jpeg',
  //     title: 'Learning Javascript in Depth after learning it casually.',
  //     text: `My journey of learning the javascript in depth. I'm following this udemy course "The Complete JavaScript Course 2024 -by Jonas Schmedtmann"`,
  //     authorImage: 'https://i.postimg.cc/GmLb9r2W/avatar-michelle.jpg',
  //     authorName: 'Jane Smith',
  //     date: '20 Oct 2024',
  //   },
  //   {
  //     image: 'https://i.postimg.cc/Zq6vZ4D1/drawers.jpg',
  //     title: 'Enhance your kitchen with modern decor',
  //     text: `A kitchen is more than a place to cook—make it a beautiful and functional space.`,
  //     authorImage: 'https://i.postimg.cc/GmLb9r2W/avatar-michelle.jpg',
  //     authorName: 'Chris Johnson',
  //     date: '22 Oct 2024',
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {blogs.map((blog, index) => (
          <BlogCard
            key={index}
            image={blog.image}
            title={blog.title}
            text={blog.text}
            authorImage={blog.authorImage}
            authorName={blog.authorName}
            date={blog.date}
          />
        ))}
      </div>
    </div>
  );
  
}

export default Home