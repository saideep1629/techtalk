import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Projects from "./pages/projects";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route> */}
        </Routes>
        <FooterCom />
      </BrowserRouter>
    </>
  );
}

export default App;
