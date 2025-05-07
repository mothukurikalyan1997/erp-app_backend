const db = require('../DB/database')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signups = async (req, res) => {
  const { email, password, role, company_id} = req.body;

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    db.query(
      "INSERT INTO users (email, password,role,company_id) VALUES (?, ?, ?, ?)",
      [email, hashedPassword,role,company_id],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to register" });
        res.status(201).json({ success: true });
      }
    );
  });
};

module.exports = {signups}