import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";

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

const google = asyncHandler(async (req, res) => {
  const { email, name, googlePhotoUrl } = req.body;
  //console.log("details", req.body);

  if (!email && !name && !googlePhotoUrl) {
    return ApiError(400, "All fields are mandatory");
  }

  const findUser = await User.findOne({ email });
  //console.log("is already user", findUser);

  if (findUser) {
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
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
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
  } else {
    const generatePassword = Math.random().toString(36).slice(-8);
    const hashedPaswword = await bcrypt.hash(generatePassword, 10);

    console.log("generated password", generatePassword)
    console.log("hash password", hashedPaswword)

    const newUser = await User.create({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-3),
      email,
      password: hashedPaswword,
      profilePicture: googlePhotoUrl,
    });

    console.log("newUser", newUser)

    await newUser.save({validateBeforeSave: false})

    const checkedUser = User.findById(newUser._id).select("-password");
    if(!checkedUser){
        return new ApiError(500, "Something went wrong")
    }

    const { accessToken, refreshToken } = await generateAndAccessTokens(
        newUser._id
      );
  
      const loggedInUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
      );
  
      const options = {
        httpOnly: true,
        // secure: true
      };
  
      return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
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

  }


});

export { google };
