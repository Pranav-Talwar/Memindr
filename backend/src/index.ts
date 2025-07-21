import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

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
app.post("/api/v1/content", (_req: Request, res: Response) =>
  res.json({ placeholder: true })
);
app.get("/api/v1/content", (_req: Request, res: Response) =>
  res.json({ placeholder: true })
);
app.delete("/api/v1/content", (_req: Request, res: Response) =>
  res.json({ placeholder: true })
);
app.put("/api/v1/content", (_req: Request, res: Response) =>
  res.json({ placeholder: true })
);

// Brain share placeholders
app.get("/api/v1/brain/share", (_req: Request, res: Response) =>
  res.json({ placeholder: true })
);
app.get("/api/v1/brain/:shareLink", (req: Request, res: Response) =>
  res.json({ shareLink: req.params.shareLink, placeholder: true })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
