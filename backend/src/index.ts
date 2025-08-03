import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const { JWT_SECRET } = process.env as { JWT_SECRET?: string };

const app = express();
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
    const title = req.body.title;

    const link = req.body.link;
    await ContentModel.create({
      title,
      link,
      //@ts-ignore
      userId: req.userId,
      // tags: [],
    })
    res.status(201).json({
      message: "Content created",
    });
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
    }).populate("userId", "username");
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
  })
  const user = await UserModel.findOne({
    // @ts-ignore
    userId:link.userId, 
  })
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
  username: user.username,
    content:content
  }); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
