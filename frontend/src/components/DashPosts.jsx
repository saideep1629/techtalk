import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // console.log("current user", currentUser.data.user);
  // console.log("posttoDELETE",postToDelete);
  console.log("user post ", userPosts)

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser.data.user._id}`
        );
        const data = await res.json();
        // console.log("data is", data.data.posts);
        if (res.ok) {
          setUserPosts(data.data.posts);
          if (data.data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPostsAll = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts`
        );
        const data = await res.json();
        // console.log("data is", data.data.posts);
        if (res.ok) {
          setUserPosts(data.data.posts);
          if (data.data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // fetchPosts();
    if (currentUser.data.user.isAdmin) {
      fetchPostsAll();
    }
    else fetchPosts();
    
  }, [currentUser.data.user._id]);

  // console.log("user posts", userPosts);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser.data.user._id}&&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.data.posts]);
        if (data.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);

    try {
      const res = await fetch(`/api/post/deletePost/${postToDelete}/${currentUser.data.user._id}`, {
        method: "POST",
      });

      // console.log("res from delete", res);
      const data = await res.json();

      // console.log("data", data);
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postToDelete));
      }
    } catch (error) {
        console.log(error);
    }

  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
      { userPosts.length > 0 ?(
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts && 
                userPosts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white drak:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.blogImage}
                          alt="Post image"
                          className="h-20 w-20 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span onClick={() => {
                        setShowModal(true);
                        setPostToDelete(post._id);
                      }} 

                      className="font-medium text-red-500 hover:underline cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 hover:underline">
                        Edit
                      </span></Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ):(<p className="font-semibold text-lg">You have no posts yet!</p>)}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              {" "}
              Sure!! Are you want to delete this post ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
