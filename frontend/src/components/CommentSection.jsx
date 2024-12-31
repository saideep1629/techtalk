import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  // console.log("currentuser in commentsection", currentUser?.data.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  // console.log("comment list from comment section", commentList);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment?.length > 200) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser.data.user._id,
        }),
      });

      const data = await res.json();
      // console.log("data from commentsection", data)

      if (res.ok) {
        setComment("");
        setCommentError(null);
        setCommentList((prevComments) => [data.data, ...prevComments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments/${postId}`);
        // console.log("res from comment section", res)
        const data = await res.json();
        // console.log("data from comment section", data)
        if (res.ok) {
          setCommentList(data.data.comments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await fetch(`/api/comment/like-comments/${commentId}`, {
        method: "PUT",
      });

      const data = await res.json();
      // console.log("data from commentsection now",data)
      if (!res.ok) {
        setCommentList(
          commentList.map((comment) => {
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.data.likes,
                  numberOfLikes: data.data.numberOfLikes,
                }
              : comment;
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setCommentList(
      commentList.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    try {
      if(!currentUser){
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
        method: "DELETE",
      });

      console.log("res from comment", res);
      const data = await res.json();

      // console.log("data", data);
      if (!res.ok) {
        console.log(data.message);
      } else {
        setCommentList((prev) =>
          prev.filter((comment) => comment._id !== commentToDelete)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.data.user.profilePicture}
            alt={currentUser.data.user.username}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.data.user.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />

          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - (isNaN(comment?.length) ? 0 : comment.length)} characters
              remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {commentList == null || commentList.length === 0 ? (
        <p className="text-sm my-5">No comments yet!!!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{commentList.length}</p>
            </div>
          </div>
          {commentList.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
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
              Sure!! Are you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
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
