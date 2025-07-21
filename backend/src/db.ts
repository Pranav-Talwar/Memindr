// db.ts
import "dotenv/config";
import mongoose, { Schema, model } from "mongoose";

const { MONGO_URI } = process.env as { MONGO_URI?: string };

if (!MONGO_URI) {
  throw new Error("Missing env var: MONGO_URI");
}

mongoose
  .connect(MONGO_URI)            // now guaranteed to be a string
  .then(() => console.log("Mongo connected"))
  .catch(err => console.error("Mongo connection error:", err));

interface IUser {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model<IUser>("User", UserSchema);


interface IContent {
  title: string;
link: string;
tags: string[];
  }
const ContentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  tags: { type: mongoose.Types.ObjectId, ref: "Tag"},
  userId: { type: mongoose.Types.ObjectId, ref : "User", required: true },
});

export const ContentModel = model<IContent>("Content", ContentSchema);