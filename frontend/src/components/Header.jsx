import React, { useEffect, useState} from "react";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch} from "react-redux";
import { toggleTheme } from "../redux/theme/theme.js";
import { signOutSuccess } from "../redux/user/userSlice.js";


export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const  dispatch  = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState(' ');
  // console.log("currentUser is ",currentUser.data.user.profilePicture);
  console.log("searchterm",searchTerm)

  useEffect (() =>{
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');

      if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl);
      }
  },[location.search])

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
        DevGuru's
        </span>
        TechTalk
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className=" w-12 h-10 md:w-12 md:h-10  sm:inline" color="gray" pill onClick={()=>dispatch(toggleTheme())}>
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.data.user.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                @{currentUser.data.user.username}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.data.user.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            {/* <Link to={"/dashboard?tab=profile"}> */}
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            {/* </Link> */}

          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign in
            </Button>
          </Link>
        )}
      </div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        {/* <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link> */}
      </Navbar.Collapse>
    </Navbar>
  );
}
