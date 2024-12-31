import React, { useState } from "react";
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
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  // console.log(formData)
  

  const handleUploadImage = async () => {
    try {
      // console.log("file",file)
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
          // setImageFile(null);
          // setImageFileUrl(null);
          // setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadError(null);
            setImageFileUploadProgress(null);
            setFormData({ ...formData, blogImage: downloadURL });
            // setImageFileUrl(downloadURL);
            // setFormData({ ...formData, profilePicture: downloadURL });
            // setImageFileUploading(false);
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
      // setUpdateUserError("No changes made");
      return;
    }

    try {
      const res = await fetch(`/api/post/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // console.log("res", res);

      const data = await res.json();
      console.log("slug is ", data.data.post.slug)

      if (!res.ok) {
        // dispatch(updateFailure(data.message));
        // setUpdateUserError(data.message);
        setPublishError(data.message);
        return;
      } else {
        // dispatch(updateSuccess(data));
        // setUpdateUserSuccess("User's profile updated successfully");
        setPublishError(null);
        navigate(`/post/${data.data.post.slug}`)
      }
      
    } catch (error) {
      setPublishError('Something went wrong');
    }

  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
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
          />
          <Select onChange={(e) => {
              setFormData({...formData, category: e.target.value})
            }}>
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
          onChange={(value) => {
            setFormData({...formData, content: value});
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {
          publishError && <Alert className="my-5" color='failure'>{publishError}</Alert>
        }
      </form>
    </div>
  );
}
