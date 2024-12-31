import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";

const generateAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong when generating access and refresh tokens"
    );
  }
};

const signup = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  console.log(req.body);

  if (
    [fullName, password, username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    fullName,
    password,
  });

  const checkCreatedUser = await User.findById(user._id).select("-password");

  if (!checkCreatedUser) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, checkCreatedUser, "User registered successfully")
    );
});

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "email and password are required");
  }

  const findUser = await User.findOne({ email });

  if (!findUser) {
    throw new ApiError(404, "User does not found");
  }

  // password checking (matching)
  const isPasswordValid = await findUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Password not match");
  }

  const { accessToken, refreshToken } = await generateAndAccessTokens(
    findUser._id
  );

  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        {
          message: "User successfully logged in",
        }
      )
    );
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // console.log("userid", userId);

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters.");
    }

    console.log("before password", req.body.password);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // console.log("password", req.body.password);
  }

  const usernameUpdate = req.body.username;
  // console.log("username", usernameUpdate)

  if (usernameUpdate) {
    if (usernameUpdate.length < 7 || usernameUpdate.length > 20) {
      throw new ApiError(400, "Username must be between 7 and 20 characters");
    }

    if (usernameUpdate.includes(" ")) {
      throw new ApiError(400, "Username cannot contain spaces");
    }

    if (usernameUpdate !== usernameUpdate.toLowerCase()) {
      throw new ApiError(400, "Username must be lowercase");
    }

    if (!usernameUpdate.match(/^[a-zA-Z0-9]+$/)) {
      throw new ApiError(400, "Username can only contain letters and numbers");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        username: usernameUpdate,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "User details are updated successfully"
      )
    );
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(400, "You are not allowed to delete a post");
  }

  const { userId } = req.params;
  console.log("userid", userId);

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "User account deleted successfully"));
});

const signout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUsers = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(400, "You are not allowed to delete a post");
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const users = await User.find()
    .select("-password")
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalUsers = await User.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: users,
        totalUsers,
        lastMonthUsers,
      },
      "Users are fetched successfully"
    )
  );
});

const getUserInCommentSection = asyncHandler(async (req, res) => {
  const users = await User.findById(req.params.userId).select("-password");
  // console.log(users)
  if(!users){
    throw new ApiError(400, "user not found")
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      users,
      "Users are fetched successfully in commentSection"
    )
  );
});

export {
  signup,
  signin,
  updateUserDetails,
  deleteUserAccount,
  signout,
  getUsers,
  getUserInCommentSection,
};
