const express = require('express');
const stories = require('./stories');

const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/stories', (req, res) => {
  res.json(stories);
});

app.get('/stories/:title', (req, res) => {
  const { title } = req.params;
  const filteredStories = stories.filter(
    story => story.title.includes(title)
  );
  res.json(filteredStories);
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});