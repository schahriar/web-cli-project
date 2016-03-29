"use strict";

const express = require("express");
const app = express();

module.exports = function SERVER(port) {
  const PORT = port || 8080;
  
  // Serve static files
  app.use(express.static('public'));
  
  // Listen on given or default port
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};