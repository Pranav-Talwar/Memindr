// db.ts
import "dotenv/config";
import mongoose, { Schema, model } from "mongoose";

const { MONGO_URI } = process.env as { MONGO_URI?: string };

if (!MONGO_URI) {
  throw new Error("Missing env var: MONGO_URI");
}

mongoose
  .connect(MONGO_URI)          
  .then(() => console.log("Mongo connected"))
  .catch(err => console.error("Mongo connection error:", err));

interface IUser {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},
{ timestamps: true });

export const UserModel = model<IUser>("User", UserSchema);
type Source = "youtube" | "twitter" | "article";

interface IContent {
  title: string;
link: string;
  collectionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; 
  type?: Source;
  }
const ContentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  //@ts-ignore
  collectionId: { type: mongoose.Types.ObjectId, ref: "Collection" , },
// @ts-ignore
  userId: { type: mongoose.Types.ObjectId, ref : "User" , required: true },
  type: { type: String, enum: ["youtube", "twitter", "article"] },

},
{ timestamps: true }
);

export const ContentModel = model<IContent>("Content", ContentSchema);

interface ILink {
  hash: string;
}
const LinkSchema = new Schema<ILink> ({
  hash : String,
    //@ts-ignore
  userId : { type: mongoose.Types.ObjectId, ref: "User" , required: true , unique:true }} ,
  { timestamps: true })

  export  const LinkModel = model<ILink>("ShareLink", LinkSchema)

interface ICollection {
  name: string;
  color: string;
  isSystem: boolean;
  userId: mongoose.Types.ObjectId;
}

const CollectionSchema = new Schema<ICollection>({
  name: { type: String, required: true , unique: true },
  color: { type: String, required: true },
  isSystem: { type: Boolean, default: false },
  //@ts-ignore
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
},
{ timestamps: true });

export const CollectionModel = model<ICollection>("Collection", CollectionSchema);