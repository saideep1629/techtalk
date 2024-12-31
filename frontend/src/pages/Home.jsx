import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  console.log("post from home", posts);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        setPosts(data.data.posts);
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Weclome to Technology World</h1>
        <p className="text-gray-500 text-xs sm:text-sm text-justify">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6">Recents Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts &&
                posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
