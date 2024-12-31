import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import Oauth from "../components/OAuth.jsx";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log("formdata", formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password ){
      return dispatch(signInFailure("Please fill all the fields"))
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/user/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // console.log(res)

      if (!res.ok) {
        // return setErrorMessage("User not exist!!!");
        return dispatch(signInFailure("User not exist!!!"));
      }

      const data = await res.json();
      console.log("data", data);
      // setLoading(false);

      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
    // }finally {
    //   setLoading(false);  // Stop loading
    // }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              DevGuru's
            </span>
            TechTalk
          </Link>
          <p className="text-sm mt-5 mb-5">
            Discover insightful stories and expert perspectives tailored to your
            interests, all in one place
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="*****"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
                  </>
                ) : 'Sign In' 
              }
              
            </Button>
            <Oauth/>
          </form>

          <div className="flex gap-2 text-sm mt-4">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
}

