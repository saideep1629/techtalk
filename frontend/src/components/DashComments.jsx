import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [commentsList, setCommentsList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentsToDelete, setCommentsToDelete] = useState(null);

  console.log("current user", currentUser.data.user);
// console.log("USERLIST IS ",commentsList);
console.log("commentlist from sai",commentsList)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getUserPostsComments/${currentUser.data.user._id}`);
        console.log("res is ", res);
        const data = await res.json();
        console.log("data after res is", data.data.comments);
        if (res.ok) {
          setCommentsList(data.data.comments);
          if (data.data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchCommentsAll = async () => {
      try {
        const res = await fetch(`/api/comment/getcommentsAll`);
        const data = await res.json();
        // console.log("data is", data.data.comments);
        if (res.ok) {
          setCommentsList(data.data.comments);
          if (data.data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // fetchComments();

    if (currentUser.data.user.isAdmin) {
      fetchCommentsAll();
    }
    else fetchComments();

  }, [currentUser.data.user._id]);

  // console.log("user posts", userPosts);

  // const handleShowMore = async () => {
  //   const startIndex = commentsList.length;
  //   console.log("startIndex from handle", startIndex)

  //   try {
  //     const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
  //     const data = await res.json();
  //     if (res.ok) {
  //       setCommentsList((prev) => [...prev, ...data.data.comments]);
  //       if (data.data.comments.length < 9) {
  //         setShowMore(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  
  const handleShowMore = async () => {
    const startIndex = commentsList.length; // Get the current number of comments
    console.log("startIndex from handle", startIndex);
  
    try {
      let url;
      // Choose the appropriate route based on the user role
      if (currentUser.data.user.isAdmin) {
        url = `/api/comment/getcommentsAll?startIndex=${startIndex}`;
      } else {
        url = `/api/comment/getUserPostsComments/${currentUser.data.user._id}?startIndex=${startIndex}`;
      }
  
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCommentsList((prev) => [...prev, ...data.data.comments]); // Append new comments
  
        // Disable "Show More" if fewer than 9 comments are returned
        if (data.data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComments = async () => {
    setShowModal(false);

    try {
      const res = await fetch(`/api/comment/delete-comment/${commentsToDelete}`, {
        method: "DELETE",
      });

      console.log("res from delete", res);
      const data = await res.json();

      // console.log("data", data);
      if (!res.ok) {
        console.log(data.message);
      } else {
        setCommentsList((prev) => prev.filter((comment) => comment._id !== commentsToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
 
{ commentsList.length > 0 ? (
    <>
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Date Created</Table.HeadCell>
          <Table.HeadCell>Comment content</Table.HeadCell>
          <Table.HeadCell>Number of likes</Table.HeadCell>
          <Table.HeadCell>Post Id</Table.HeadCell>
          <Table.HeadCell>UserId</Table.HeadCell>
          {currentUser.data.user.isAdmin && (
            <Table.HeadCell>Delete</Table.HeadCell>
          )}
        </Table.Head>
        <Table.Body className="divide-y">
          {commentsList.map((comment) => (
            <Table.Row
              key={comment._id}
              className="bg-white drak:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{comment.content}</Table.Cell>
              <Table.Cell>{comment.numberOfLikes}</Table.Cell>
              <Table.Cell>{comment.postId}</Table.Cell>
              <Table.Cell>{comment.userId}</Table.Cell>
              {currentUser.data.user.isAdmin && (
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setCommentsToDelete(comment._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                </Table.Cell>
              )}
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
  ) : (
    <p className="font-semibold text-lg">You have no comments yet!</p>
  )}



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
              Sure!! Are you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComments}>
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
