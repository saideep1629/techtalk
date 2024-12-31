import React from "react";
import aboutImage from "../assets/ddd.png";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container mx-auto px-4 py-12">
        {/* Heading Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-lora md:text-5xl">
            About DevGuru's TechTalk
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mt-6 dark:text-gray-200 font-roboto">
            Welcome to DevGuru's TechTalk! Our platform is dedicated to sharing
            knowledge, insights, and tutorials on the latest in technology,
            programming, and more.
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center mb-12">
          {/* Image on the Left */}
          <div className="flex justify-center items-center md:w-2/4 mb-8 md:mb-0 mt-4">
            <img
              src={aboutImage}
              alt="Blogging"
              className="rounded-lg shadow-lg object-cover"
              style={{ height: "400px", width: "400px" }}
            />
          </div>

          {/* Text Section on the Right */}
          <div className="md:w-2/4 md:pl-8  ml-11 mr-11 md:ml-5 md:mr-11">
            <h2 className=" text-xl md:text-3xl font-bold text-gray-900 mb-4 dark:text-white font-lora ">
              Who We Are
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mt-4 dark:text-gray-200 font-roboto text-justify ">
            DevGuru's TechTalk is a platform that empowers tech enthusiasts, developers, and learners by offering a wide range of articles and tutorials to sharpen programming skills. Stay updated on the latest tech trends and explore new technologies, with content tailored for both beginners and experienced tech lovers. Built with the MERN stack (MongoDB, Express, React, Node.js), the blog provides a modern and efficient space for sharing knowledge. Join the community and be a part of the tech conversation.
            </p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="text-center mb-12 ml-7 mr-7 md:ml-5 md:mr-11">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 dark:text-white font-lora">
            What We Offer
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-4 dark:text-gray-200 font-roboto">
            At DevGuru's TechTalk, we offer a variety of content, from detailed
            tutorials to industry insights and opinion pieces. Stay tuned for
            regular updates and learn something new every day.
          </p>
          <img
            src="https://i.pinimg.com/736x/7c/8a/5c/7c8a5cc61e919dc25eb1a794460b735d.jpg"
            alt="Tech Insights"
            className="mx-auto rounded-lg shadow-lg "
            style={{ height: "600px", width: "600px" }}
          />
        </div>

        {/* Link to Home Page */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-semibold mb-4">Join Us Today</h2>
          <p className="text-lg text-gray-700 mb-6 dark:text-white">
            Sign up to contribute to our blog or simply browse through the
            wealth of knowledge. Be a part of our thriving community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
