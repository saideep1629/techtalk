import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import {Button, Table} from 'flowbite-react';
import {Link} from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  // console.log("currentuser from dashboard", currentUser.data.user)
  // console.log("user",users);
  // console.log("user total",totalUsers);
  // console.log("user last",lastMonthUsers);
  // console.log("comments",comments);
  // console.log("comments total",totalComments);
  // console.log("comments last",lastMonthComments);
  // console.log("comm from dahsboardcomp",comments)
  console.log("post from dashboardcomp", posts)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        // console.log("data from dashboard",data)
        if (res.ok) {
          setUsers(data.data.user);
          setTotalUsers(data.data.totalUsers);
          setLastMonthUsers(data.data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?limit=5`);
        const data = await res.json();
        // console.log("post data from dashboard", data);
        if (res.ok) {
          setPosts(data.data.posts);
          setTotalPosts(data.data.totalPosts);
          setLastMonthPosts(data.data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcommentsAll?limit=5`);
        const data = await res.json();
        console.log("comment data from dashboard", data);
        if (res.ok) {
          setComments(data.data.comments);
          setTotalComments(data.data.totalComments);
          setLastMonthComments(data.data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.data.user.isAdmin) {
      fetchUser();
      fetchComments();
      fetchPosts();
    }
  }, []);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center mt-5">
      <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
            <p className="text-2xl">{totalUsers}</p>
          </div>
          <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastMonthUsers}
          </span>
          <div className="text-gray-500">Last month</div>
        </div>
      </div>

      <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
            <p className="text-2xl">{totalComments}</p>
          </div>
          <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastMonthComments}
          </span>
          <div className="text-gray-500">Last month</div>
        </div>
      </div>

      <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
            <p className="text-2xl">{totalPosts}</p>
          </div>
          <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastMonthPosts}
          </span>
          <div className="text-gray-500">Last month</div>
        </div>
      </div>
      </div>
      <div>
        <div className="flex-wrap flex gap-4 justify-center mt-5">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className="text-center">
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users && users.map((user) =>(
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
                  <Table.Cell>
                    <img src={user.profilePicture}
                    alt="user" className="rounded-full w-10 h-10"/>
                  </Table.Cell>
                  <Table.Cell>
                    {user.username}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className="text-center">
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && comments.map((comment) =>(
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
                  {comment.content}
                  <Table.Cell>
                    {comment.numberOfLikes}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head className="text-center">
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell >Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
            </Table.Head>
            {posts && posts.map((post) =>(
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
                  <Table.Cell>
                    <img src={post.blogImage}
                    alt="user" className="rounded-full w-10 h-10"/>
                  </Table.Cell>
                  <Table.Cell>
                    {post.title}
                  </Table.Cell>
                  <Table.Cell>
                    {post.category}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        </div>

      </div>
    </div>
  );
}
