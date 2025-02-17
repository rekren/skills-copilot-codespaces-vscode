// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const commentsPath = path.join(__dirname, 'comments.json');

app.get('/comments', (req, res) => {
  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments file');
      return;
    }

    res.json(JSON.parse(data));
  });
});

app.post('/comments', (req, res) => {
  const { body } = req;
  const comment = {
    id: uuidv4(),
    text: body.text,
    timestamp: new Date()
  };

  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments file');
      return;
    }

    const comments = JSON.parse(data);
    comments.push(comment);

    fs.writeFile(commentsPath, JSON.stringify(comments), err => {
      if (err) {
        res.status(500).send('Error writing comments file');
        return;
      }

      res.json(comments);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

