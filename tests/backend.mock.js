"use strict";
const expect = require("chai").expect;
const request = require("request");
const server = require('../server');

const TestPort = 9085;

// Optional errors invoked by tests
let BadBodyError, FatalError, APIError;

describe("Back-end Mock/E2E Test Suite", function () {
  it("should start the server", function (done) {
    server(TestPort, function MOCK_REQUEST(options, callback) {
      if (FatalError) return callback(FatalError);
      
      if ((options.url === "https://api.home.nest.com/oauth2/access_token") && (options.method === "POST")) {
        // Validate form data
        if (options.form.grant_type !== "authorization_code") return callback(new Error("Invalid value for grant_type"));
        if (options.form.client_secret !== process.env.NESTSECRET) return callback(new Error("Invalid Nest product secret. Make sure you set your env variable NESTSECRET to Nest's developer product secret."));
        if ((!options.form.client_id) || (options.form.client_id.length < 5)) return callback(new Error("Invalid client_id"));
        
        if (BadBodyError) return callback(null, { statusCode: 200 }, "{sfs:f..");
        if (APIError) return callback(null, { statusCode: 200 }, JSON.stringify({ error: "E22", error_description: "Some error"}));
        
        // Generate mock response
        callback(null, {
          statusCode: 200
        }, JSON.stringify({ access_token: "helloworld", expires: 10000 }));
      } else {
        callback(new Error(`Bad request. Mock has not implemented → ${options.method} - ${options.url}`));
      }
    }, function SERVER_CALLBACK(port) {
      expect(port).to.be.equal(TestPort);
      request(`http://localhost:${TestPort}`, function (error, response) {
        if (error) throw error;
        expect(response.statusCode).to.be.equal(200);
        done();
      });
    });
  });
  it("should successfully convert a client token", function (done) {
    request(`http://localhost:${TestPort}/get_token/nest?code=testcode`, function (error, response, body) {
      if (error) throw error;
      expect(JSON.parse(body)).to.have.property("access_token", "helloworld");
      done();
    });
  });
  it("should deny an unimplemented interface/service", function (done) {
    request(`http://localhost:${TestPort}/get_token/philips?code=testcode`, function (error, response, body) {
      if (error) throw error;
      expect(JSON.parse(body)).to.have.property("error", "Invalid service.");
      done();
    });
  });
  it("should respond with error with a bad body", function (done) {
    BadBodyError = true;
    request(`http://localhost:${TestPort}/get_token/nest?code=testcode`, function (error, response, body) {
      if (error) throw error;
      expect(JSON.parse(body)).to.not.have.property("access_token");
      expect(JSON.parse(body)).to.have.property("error");
      BadBodyError = false;
      done();
    });
  });
  it("should respond with error when a fatal error occurs", function (done) {
    FatalError = new Error("sample");
    request(`http://localhost:${TestPort}/get_token/nest?code=testcode`, function (error, response, body) {
      if (error) throw error;
      expect(JSON.parse(body)).to.not.have.property("access_token");
      expect(JSON.parse(body)).to.have.property("error", "sample");
      FatalError = false;
      done();
    });
  });
  it("should respond with error when an API error occurs", function (done) {
    APIError = true;
    request(`http://localhost:${TestPort}/get_token/nest?code=testcode`, function (error, response, body) {
      if (error) throw error;
      expect(JSON.parse(body)).to.not.have.property("access_token");
      expect(JSON.parse(body)).to.have.property("error", "Some error");
      APIError = false;
      done();
    });
  });
});
