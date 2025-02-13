import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const dbPath = path.join(process.cwd(), "mock", "db.json");

// Register User
export const registerUser = async ({ firstName, lastName, email, phone, password }) => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    if (db.users.some((user) => user.email === email)) {
      return { error: "User already exists" };
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      files: [],
    };

    db.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return { success: "User registered successfully!" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user" };
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const user = db.users.find((user) => user.email === email);

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return { error: "Invalid email or password" };
    }

    return { success: "Login successful!", user };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Internal server error" };
  }
};
