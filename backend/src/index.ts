import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CollectionModel, ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const { JWT_SECRET } = process.env as { JWT_SECRET?: string };

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
 
// POST /signin placeholder (empty logic to keep original intent)
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  const user = await UserModel.findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  return res.json({ token });
});

// POST /signup
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.create({ username, password });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (e: any) {
    if (e?.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error(e);
    res.status(500).json({ message: "Internal error" });
  }
});

// Content placeholders
app.post(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
   // inside POST /api/v1/content
const { title, link, type, collectionId, collectionName } = req.body as {
  title: string;
  link: string;
  type?: "youtube" | "twitter" | "article";
  collectionId?: string;
  collectionName?: string;   // <— new input from the drawer
};

// guard
if (!title || !link) {
  return res.status(400).json({ message: "title and link are required" });
}

// prefer explicit id if present
let resolvedCollectionId = collectionId;

// fallback: translate name -> id for this user
if (!resolvedCollectionId && typeof collectionName === "string" && collectionName.trim()) {
  const col = await CollectionModel.findOne({
    // @ts-ignore
    userId: req.userId,
    name: collectionName.trim(),
  }).select("_id");
  if (!col) {
    return res.status(400).json({ message: "collection not found" });
  }
  resolvedCollectionId = String(col._id);
}

await ContentModel.create({
  title,
  link,
  ...(type ? { type } : {}),
  ...(resolvedCollectionId ? { collectionId: resolvedCollectionId } : {}),
  // @ts-ignore
  userId: req.userId,
});

return res.status(201).json({ message: "Content created" });

  }
);

app.get(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
      userId,
    }).populate("userId", "username")
      .populate("collectionId", "name color")
    res.json({
      content,
    });
  }
);
app.delete(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
      contentId,
      //@ts-ignore
      userId: req.userId,
    });

    res.json({
      message: "deleted",
    });
  }
);

app.put("/api/v1/content", (_req: Request, res: Response) =>
  res.json({ placeholder: true })
);

// Brain share placeholders
app.post(
  "/api/v1/brain/share",
  userMiddleware,
  async (req: Request, res: Response) => {
    const share = req.body.share;
    //@ts-ignore
    const userId = req.userId;

    if (share) {
      let link = await LinkModel.findOne({ userId });

      if (!link) {
        link = await LinkModel.create({
          hash: random(10),
          userId,
        });
      }

      return res.json({
        message: "Share link created",
        link: `/api/v1/brain/${link.hash}`,
      });
    } else {
      await LinkModel.deleteOne({ userId });
      return res.json({ message: "Share link removed" });
    }
  }
);

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({
    hash,
  });
  if (!link) {
    return res.status(404).json({ message: "Share link not found" });
  }
  const content = await ContentModel.find({
    //@ts-ignore
    userId: link.userId,
  });
  const user = await UserModel.findById(
    //@ts-ignore
    link.userId
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    username: user.username,
    content: content,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

app.post(
  "/api/v1/collections",
  userMiddleware,
  async (req: Request, res: Response) => {
    // @ts-ignore set by userMiddleware
    const userId = req.userId;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const color = req.body.color;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    try {
      const collection = await CollectionModel.create({
        name,
        color: color ?? "#ffffffff",
        userId,
        isSystem: false,
      });

      return res.status(201).json({
        message: "Collection created",
        collectionId: collection._id,
        name: collection.name,
        color: collection.color,
        isSystem: collection.isSystem,
    
      });
    } catch (e: any) {
      if (e?.code === 11000) {
        return res.status(409).json({ message: "Collection already exists" });
      }
      console.error(e);
      return res.status(500).json({ message: "Internal error" });
    }
  }
);

app.get(
  "/api/v1/collections",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.userId;

      const collections = await CollectionModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .select("_id name color isSystem createdAt updatedAt");

      return res.json({ collections });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal error" });
    }
  }
);

app.delete(
  "/api/v1/collections",
  userMiddleware,
  async (req: Request, res: Response) => {
    const collectionId = req.body.collectionId;
    
    if (!collectionId) {
      return res.status(400).json({ message: "collectionId is required" });
    }

    const outcome = await CollectionModel.deleteOne({
  _id: collectionId,
        //@ts-ignore
      userId: req.userId,
    });
    //
      if (outcome.deletedCount === 0) {
    return res.status(404).json({ message: "Collection not found" });
  }
    res.json({
      message: "deleted",
    });
  })