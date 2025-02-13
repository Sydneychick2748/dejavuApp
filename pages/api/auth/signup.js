import { registerUser } from "@/services/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { firstName, lastName, email, phone, password } = req.body;

  // Use auth service
  const result = await registerUser({ firstName, lastName, email, phone, password });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ message: result.success });
}
