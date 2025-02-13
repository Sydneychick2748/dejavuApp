import { loginUser } from "@/services/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  // Use auth service
  const result = await loginUser(email, password);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  return res.status(200).json({ message: "Login successful!", user: result.user });
}
