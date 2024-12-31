import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [userList, setUserList] = useState({});
  const [likes, setLikes] = useState(comment.likes);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.numberOfLikes);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const currentUser = useSelector((state) => state.user);
  //console.log("currentuser", currentUser);
  // console.log("userlist from comment section", userList)
  console.log("comment",comment)
  // console.log("likes from comment",likes);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment?.userId}`);
        const data = await res.json();

        if (res.ok) {
          setUserList(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  // Helper function to check if the current user has liked the comment
  const hasLiked = likes.includes(currentUser?.currentUser?.data.user._id);
  // console.log("hasliked function", hasLiked);

  // Handle like/dislike toggle
  const handleLike = async (commentId) => {
    try {
      await onLike(commentId);

      if (hasLiked) {
        // If already liked, remove the like (dislike action)
        setLikes(
          likes.filter((id) => id !== currentUser?.currentUser?.data.user._id)
        );
        setNumberOfLikes(numberOfLikes - 1);
      } else {
        // If not liked yet, add the like
        setLikes([...likes, currentUser?.currentUser?.data.user._id]);
        setNumberOfLikes(numberOfLikes + 1);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={userList.data?.profilePicture}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {userList ? `@${userList.data?.username}` : "unknown user"}
          </span>
          <span>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => handleLike(comment._id)}
                className={`${hasLiked ? "text-blue-500" : "text-gray-400"}`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-500">
                {numberOfLikes > 0 &&
                  `${numberOfLikes} ${numberOfLikes === 1 ? "like" : "likes"}`}
              </p>
              {currentUser &&
                (currentUser?.currentUser?.data.user._id === comment.userId ||
                  currentUser?.currentUser?.data.user.isAdmmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={ ()=>onDelete(comment._id) }
                      className="text-gray-500 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
