import React, { useEffect, useState } from "react";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const {postId} = useParams();
  // console.log("postId",post)
  // console.log("formdata",formData)
  // console.log("current user in update",currentUser)

  useEffect(() => {
    try {
        const fetchPost = async() =>{
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            // console.log("data from res",data.data)

            if(!res.ok){
                console.log(data.message);
                setPublishError(data.message);
                return;
            }

            if(res.ok){
                setPublishError(null);
                setFormData(data.data.posts[0]);
            }
        }
        fetchPost();
    } catch (error) {
        console.log(error.message);
    }
  }, [postId])
  

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please select an image");
        return;
      }

      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, filename);
      // console.log("formdata", formData)

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Image upload failed");
          setImageFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadError(null);
            setImageFileUploadProgress(null);
            setFormData({ ...formData, blogImage: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image upload failed");
      setImageFileUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      return;
    }

    try {
      const res = await fetch(`/api/post/update-post/${formData._id}/${currentUser.data.user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // console.log("res", res);

      const data = await res.json();
      // console.log("slug is ", data.data.post.slug)

      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.data.post.slug}`)
      }
      
    } catch (error) {
      setPublishError('Something went wrong');
    }

  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            id="title"
            type="text"
            placeholder="Title"
            required
            className="flex-1"
            onChange={(e) => {
              setFormData({...formData, title: e.target.value});
            }}

            value={formData.title}
          />

          <Select onChange={(e) => {
              setFormData({...formData, category: e.target.value})
            }}
            value={formData.category}
            >
            <option value="uncategorized">Select a category</option>
            <option value="JavaScript">JavaScript</option>
            <option value="python">python</option>
            <option value="C Language">C Language</option>
            <option value="React">React</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
           {
            imageFileUploadProgress ? (
            <div className="w-14 h-14">
              <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress  || 0 }%`} />
            </div> ) : (
              'Upload Image'
            )
           }
          </Button>
        </div>

        {imageFileUploadError && <Alert color='failure'>{ imageFileUploadError }</Alert>}
        {
          formData.blogImage && (
            <img 
            src={formData.blogImage}
            alt='upload'
            className="w-full h-80 object-contain"/>
          )
        }
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          value={formData.content}
          onChange={(value) => {
            setFormData({...formData, content: value});
          }}

        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {
          publishError && <Alert className="my-5" color='failure'>{publishError}</Alert>
        }
      </form>
    </div>
  );
}

