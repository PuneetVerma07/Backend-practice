require("dotenv").config();

const express = require("express");
const connectToDB = require("./src/db/db");
const noteModel = require("./src/models/note.model");

const app = express();

app.use(express.json());
connectToDB();

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;

  await noteModel.create({
    title,
    content,
  });

  res.json({
    message: "note created successfully",
  });
});

app.get("/notes", async (req, res) => {
  const notes = await noteModel.find();

  res.json({
    message: "notes fetched successfully",
    notes,
  });
});

app.delete("/notes/:id", async (req, res) => {
  const noteId = req.params.id;

  await noteModel.findOneAndDelete({
    _id: noteId,
  });

  res.json({
    message: "note deleted successfully",
  });
});

app.patch("/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  const { title } = req.body;

  await noteModel.findOneAndUpdate(
    {
      _id: noteId,
    },
    {
      title: title,
    }
    );
    
    res.json({
        message: 'note updated successfully.'
    })
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
