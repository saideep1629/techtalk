import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";


export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState({});
  const [recentPosts, setRecentPosts] = useState(null);
  console.log("post from postpage", post._id);
  console.log("recentpost ", recentPosts);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(false);
        const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          setPost(data.data.posts[0]);
          setError(false);
        }
      } catch (error) {
        console.log(error.message);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
    //  console.log("slug",postSlug)
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPost = async () => {
      try {
        setLoading(false);
        const res = await fetch(`/api/post/getPosts?limit=3`);
        const data = await res.json();
        console.log("data from postpage useeffect 2",data)
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          setRecentPosts(data.data.posts);
          setError(false);
        }
      } catch (error) {
        console.log(error.message);
        setError(true);
        setLoading(false);
      }
    };
    fetchRecentPost();
  },[]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif mac-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.blogImage}
        alt="blog-image"
        className="mt-10 p-3 max-h-[600px] w-full object-cover border-solid border-2 border-sky-500"
      />
      <div className="flex justify-between p-3 border-b border-teal-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && Math.max(1, (post?.content?.length / 1000).toFixed(0))} mins
          read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap gap-3 mt-5 justify-center">
          {
            recentPosts && recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>
    </main>
  );
}
