import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa"

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [userList, setUserList] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // console.log("current user", currentUser.data.user);
  console.log("USERLIST IS ",userList);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/user/getusers`
        );
        const data = await res.json();
        // console.log("data is", data);
        if (res.ok) {
          setUserList(data.data.user);
          if (data.data.user.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.data.user.isAdmin) {
      fetchUsers();
    }
  }, [currentUser.data.user._id]);

  // console.log("user posts", userPosts);

  const handleShowMore = async () => {
    const startIndex = userList.length;

    try {
      const res = await fetch(
        `/api/user/getUsers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserList((prev) => [...prev, ...data.data.user]);
        if (data.data.user.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleDeleteUser = async() =>{
    setShowModal(false);

    try {
      const res = await fetch(`/api/user/delete/${userToDelete}`, {
        method: "DELETE",
      });

      // console.log("res from delete", res);
      const data = await res.json();

      // console.log("data", data);
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserList((prev) => prev.filter((user) => user._id !== userToDelete));
      }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
      {currentUser.data.user.isAdmin && (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userList && 
                userList.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white drak:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                        />
                    </Table.Cell>
                    <Table.Cell>
                      {user.username}
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.isAdmin ? (<FaCheck  className="text-green-500"/>): (<FaTimes className="text-red-500"/>)}</Table.Cell>
                    <Table.Cell>
                      <span onClick={() => {
                        setShowModal(true);
                        setUserToDelete(user._id);
                      }} 

                      className="font-medium text-red-500 hover:underline cursor-pointer">
                        Delete
                      </span>
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
              <Button color="failure" onClick={handleDeleteUser}>
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