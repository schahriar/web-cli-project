"use strict";

const express = require("express");
const app = express();
const request = require('request');

const NestClientID = "3b0cea1d-8ff8-405f-a673-57e8e41a4d7d";

// Service options
const kServices = {
  "nest": {
      method: "POST",
      url: "https://api.home.nest.com/oauth2/access_token",
      form: {
        client_id: NestClientID,
        client_secret: process.env.NESTSECRET,
        grant_type: "authorization_code"
      }
    }
};

module.exports = function SERVER(port) {
  const PORT = port || 8080;
  
  // GET Route for converting OAuth2 codes to access_tokens
  app.get('/get_token/:service', function (req, res, next) {
    // Verify Code & Selected Service
    if (!req.query.code) return res.json({ error: "OAuth2 Code was not found." });
    if (!req.params.service || (!kServices[req.params.service])) return res.json({ error: "Invalid service." });
    
    // Set options
    let options = kServices[req.params.service];
    // Assign code
    options.form.code = req.query.code;

    request(options, function (error, response, body) {
      if (error) return res.json({ error: error.message });
      
      // Parse request
      try {
        let result = JSON.parse(body);
        // If Nest has returned an error log it
        if (result.error) {
          res.json({
            error: result.error_description
          });
        } else {
          // Log access_token
          res.json(result);
        }
      } catch (e) {
        // Parsing error
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