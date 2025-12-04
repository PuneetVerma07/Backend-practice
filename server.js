const express = require("express");

const app = express();

app.use(express.json());

let notes = [];

app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);

  res.json({
    message: "note created successfullyf",
  });
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.delete("/notes/:index", (req, res) => {
  const index = req.params.index;

  delete notes[index];

  res.json({
    message: "note deleted",
  });
});

app.patch("/notes/:index", (req, res) => {
  const index = req.params.index;
  const { title } = req.body;

  notes[index].title = title;

  res.json({
    message: "note updated successfully.",
  });
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
