import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Oauth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log("formdata", formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.fullName || !formData.password ){
      return setErrorMessage("Please fill out all fields.")
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/user/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // console.log(res)

      if (res.status === 409) {
        return setErrorMessage("User already exists");
      }

      const data = await res.json();
      console.log("data", data);
      setLoading(false);

      if(res.ok){
        navigate('/sign-in')
      }

    } catch (error) {
      setErrorMessage(error.message);
    }
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
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>

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
              <Label value="Your fullname" />
              <TextInput
                type="text"
                placeholder="Fullname"
                id="fullName"
                onChange={handleChange}
              />
            </div>

            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
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
                ) : 'Sign Up' 
              }
              
            </Button>
            <Oauth />
          </form>

          <div className="flex gap-2 text-sm mt-4">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
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
