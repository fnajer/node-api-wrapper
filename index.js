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

app.get('/topstories', (req, res, next) => {
  request('https://hacker-news.firebaseio.com/v0/topstories.json',
    (error, responce, body) => {
      if (error || responce.statusCode !== 200) {
        const err = new Error('Error requesting top stories');

        if (responce) 
          err.code = responce.statusCode;
        else 
          err.code = 500;
        
        return next(err);
      }

      const topStoriesIds = JSON.parse(body);
      const limit = 10;

      Promise.all(
        topStoriesIds.slice(0, limit).map(storyId => {
          return new Promise((resolve, reject) => {
            request(`https://hacker-news.firebadseio.com/v0/item/${storyId}.json`,
              (error, request, body) => {
                if (error || request.statusCode !== 200) {
                  const err = new Error('Error requesting story item');

                  if (responce) 
                    err.code = responce.statusCode;
                  else 
                    err.code = 500;

                  return reject(err);
                }

                resolve(JSON.parse(body));
              }
            );
          })
        })
      )
      .then(storiesData => {
        res.json(storiesData);
      })
      .catch(err => next(err));
    }
  );
})

app.use((error, req, res, next) => {
  res.status(error.code).json({
    type: 'error',
    message: error.message
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});