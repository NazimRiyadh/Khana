import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import axios from "axios";

import { TryCatch } from "../middlewares/trycatch.js";
import Restaurant from "../models/restaurant.js";
import getBuffer from "../config/dataturi.js";

export const addRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const existingRestaurant = await Restaurant.findOne({
      ownerId: user._id,
    });

    if (existingRestaurant) {
      return res.status(400).json({
        message: "Restaurant already exists",
      });
    }

    const { name, description, latitude, longtitude, formatedAddress, phone } =
      req.body;

    if (!name || !latitude || !longtitude) {
      return res.status(400).json({
        message: "Please provide name, latitude and longitude",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Please provide image",
      });
    }

    const filebuffer = getBuffer(file);

    if (!filebuffer) {
      return res.status(500).json({
        message: "Failed to create image buffer",
      });
    }

    const { data: uploadRes } = await axios.post(
      `${process.env.UTIL_SERVICE}/api/upload`,
      {
        buffer: filebuffer.content,
      },
    );

    const restaurant = await Restaurant.create({
      name,
      description,
      phone,
      autoLocation: {
        type: "Point",
        coordinates: [Number(longtitude), Number(latitude)],
        formatedAddress,
      },
      image: uploadRes.url,
      ownerId: user._id,
    });

    return res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  },
);
