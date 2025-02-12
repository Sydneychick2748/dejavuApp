import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const dbFilePath = path.join(process.cwd(), 'mock/db.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Read the mock database
  const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));

  // Check if user already exists
  if (db.users.some((user) => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password before storing it
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user object
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    files: [], // Initialize with no files
  };

  // Add the new user to the database
  db.users.push(newUser);
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));

  return res.status(201).json({ message: 'User registered successfully', user: newUser });
}
