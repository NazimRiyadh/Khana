import mongoose, { Schema, Document } from "mongoose";

export interface IResturant extends Document {
  name: string;
  description: string;
  image: string;
  ownerId: string;
  phone: number;
  isVerified: boolean;

  autoLocation: {
    //user for the location of the restaurant
    type: "Point";
    coordinates: [number, number]; //longtitude, latitude
    formatedAddress: string;
  };
  isOpen: boolean;
  createdAt: Date;
}

const schema = new Schema<IResturant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    image: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    autoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        require: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      formatedAddress: {
        type: String,
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ autoLocation: "2dsphere" }); //used for nearby search

const Restaurant = mongoose.model<IResturant>("Restaurant", schema);
export default Restaurant;
