'use strict';

const express = require('express');
const expressApp = express();
const path = require('path');

expressApp.get('/api', (req, res) => {
  res.send('Hello Worldd!');
});

expressApp.use(express.static(path.join(__dirname, '..', 'public')));

expressApp.listen(8080);
