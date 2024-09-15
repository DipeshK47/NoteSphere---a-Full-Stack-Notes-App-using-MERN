require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully');
  })
  .catch((err) => {
    console.error(err);
  });

const jwt = require("jsonwebtoken");
const { authenticateToken } = require('./utilities');

const User = require("./models/user.model");
const Note = require("./models/note.model");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.json({ data: "Hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "FullName is required" }); // Corrected "FUllName" to "FullName"
  }

  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists"
    });
  }

  const user = new User({
    fullName,
    email,
    password
  });
  await user.save();

  const accessToken = jwt.sign({ user },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30000min" }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful" // Corrected "Successfull" to "Successful"
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" }); // Corrected "reauired" to "required"
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30000h"
    });
    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken
    });
  }
  else {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials"
    });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: { 
      fullName: isUser.fullName,
      email: isUser.email,
      "_id": isUser._id
    },
    message: ""
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title, 
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note added successfully"
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to add note",
      error
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  // Check if no update fields are provided
  if (!title && !content && !tags && isPinned === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    // Find the note by its ID and ensure it belongs to the logged-in user
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)  // Note not found, return 404 instead of 400
        .json({ error: true, message: "Note not found" });
    }

    // Update fields if they exist
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to update note",
    });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => { // Removed trailing slash for consistency
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id })
      .sort({ isPinned: -1, updatedAt: -1 }); // Ensured sorting by isPinned and updatedAt

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved" // Corrected "retreived" to "retrieved"
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server Error"
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(400)
        .json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({
      error: false, // Changed from true to false
      message: "Note deleted" // Optionally change to "Note deleted successfully" for consistency
    });
  
  } catch (error) {
    return res.status(500).json({ // Changed status from 400 to 500 for server error
      error: true,
      message: "Internal Server Error"
    });
  }
});

// Update isPinned Value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  // Check if isPinned is provided
  if (isPinned === undefined) { // Changed condition to allow false
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    // Find the note by its ID and ensure it belongs to the logged-in user
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)  // Note not found, return 404 instead of 400
        .json({ error: true, message: "Note not found" });
    }

    // Update isPinned value
    note.isPinned = isPinned || false;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Pinned Value updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to update note",
    });
  }
});

// Search Notes - Corrected Endpoint
app.get("/search-notes", authenticateToken, async (req, res) => { // Changed from "/search-note/:noteId" to "/search-notes"
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { content: { $regex: new RegExp(query, 'i') } },
      ]
    }).sort({ isPinned: -1, updatedAt: -1 }); // Ensured sorting by isPinned and updatedAt

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching with search query found!!"
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

module.exports = app;