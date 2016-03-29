"use strict";

const express = require("express");
const app = express();
const request = require('request');

module.exports = function SERVER(port) {
  const PORT = port || 8080;
  
  app.get('/get_token', function (req, res, next) {
    if (!req.query.code) return res.json({ error: "OAuth2 Code was not found." });

    request({
      method: "POST",
      url: "https://api.home.nest.com/oauth2/access_token",
      form: {
        code: req.query.code,
        client_id: "3b0cea1d-8ff8-405f-a673-57e8e41a4d7d",
        client_secret: process.env.NESTSECRET,
        grant_type: "authorization_code"
      }
    }, function (error, response, body) {
      if (error) return res.json({ error: error });
      
      try {
        let result = JSON.parse(body);
        if (result.error) {
          res.json({
            error: result.error_description
          });
        } else {
          res.json(result);
        }
      } catch (e) {
        return res.json({ error: error });
      }
    });
  });
  
  // Serve static files
  app.use(express.static('public'));
  
  // Listen on given or default port
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};