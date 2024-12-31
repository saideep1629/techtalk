import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser, HiAnnotation, HiChartPie } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

export default function Dashsidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  // console.log("current user", currentUser.data.user.isAdmin);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    // console.log(tabFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });

      const data = await res.json();
      // console.log(data)

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
        {currentUser.data.user.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash"}
                icon={HiChartPie}
                labelColor="dark"
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.data.user.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>

          {currentUser.data.user.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                labelColor="dark"
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}


            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>

          <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
