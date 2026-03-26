import { Request, Response } from "express";
import User from "../model/User.js";
import { TryCatch } from "../middlewares/trycatch.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { oauth2client } from "../config/googleConfig.js";
import axios from "axios";
dotenv.config();

export const loginUser = TryCatch(async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      message: "Authorization code is required",
    });
  }

  const googleRes = await oauth2client.getToken(code);

  oauth2client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
  );

  const { email, name, picture } = userRes.data;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      image: picture,
    });
    console.log("created user", user);
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  res.status(200).json({ message: "login Successful", user, token });
});

const allowedRoles = ["customer", "rider", "seller"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { role } = req.body as { role: Role };

    if (!allowedRoles.includes(role)) {
      return res.status(401).json({
        message: "Invalide Role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "15d",
    });

    res.json({
      user,
      token,
    });
  },
);

export const myProfile = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  res.json({
    user,
  });
};
