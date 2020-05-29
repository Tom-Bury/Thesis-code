const functions = require('firebase-functions');
const express = require('express');


/**
 * This app's main routes. (start at /)
 */
const mainApp = express();

mainApp.get('/s/student', (req, res) => {
  res.send('NO!');
});

mainApp.get('/s/student/kibana', (req, res) => {
  res.send('NO!');
});


mainApp.get('/test', (req, res) => {
  res.json({
    hello: 'world'
  });
});




/*
============================================================
===================== CONNECT THE DOTS =====================
============================================================
*/
// Import other express apps:
const api = require('./api-main.js');

// "main" function to host all other top-level functions
mainApp.use('/api', api);
// mainApp.use('', revproxy);

exports.mainApp = functions.https.onRequest(mainApp);

