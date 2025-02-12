import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const dbPath = path.join(process.cwd(), "mock", "db.json");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    // Read the database file
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    // Find user by email
    const user = db.users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare hashed password with entered password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
