const express = require('express');
const request = require('request');
const stories = require('./stories');

const app = express();

app.use((req, res, next) => {
  console.log(`Request details. 
    Method: ${req.method}. Original url: ${req.originalUrl}`
  );
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

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
});

app.get('/topstories', (req, res) => {
  request('https://hacker-news.firebaseio.com/v0/topstories.json',
    (error, req, body) => {
      res.send(JSON.parse(body));
    }
  );
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});