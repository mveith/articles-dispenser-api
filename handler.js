let consumerKey = process.env.CONSUMER_KEY;
let redirectUrl = "https://getpocket.com/a/queue/list/";
let config = {
  headers: {
    "X-Accept": "application/json"
  }
};

function createResponse(resultObject, statusCode) {
  return {
    body: JSON.stringify(resultObject),
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_URL,
      "Access-Control-Allow-Credentials": true
    },
    isBase64Encoded: false
  };
}

const axios = require('axios');
const parser = require('./parser.js')

exports.getRequestToken = function getRequestToken(event, context, callback) {
  let request = axios.post("https://getpocket.com/v3/oauth/request", {
    "consumer_key": consumerKey,
    "redirect_uri": redirectUrl
  }, config);

  request.then((response) => {
    callback(null, createResponse({ requestToken: response.data.code }, 200));
  }).catch((err) => {
    callback(null, createResponse({ error: err.response.statusText }, err.response.status));
  });
};

exports.getAccessToken = function getAccessToken(event, context, callback) {
  let request = axios.post("https://getpocket.com/v3/oauth/authorize", {
    "consumer_key": consumerKey,
    "code": event.queryStringParameters.key,
    "redirect_uri": redirectUrl
  }, config);

  request.then((response) => {
    callback(null, createResponse({ accessToken: response.data.access_token, userName: response.data.username }, 200));
  }).catch((err) => {
    callback(null, createResponse({ error: err.response.statusText }, err.response.status));
  });
};

exports.getArticles = function getArticles(event, context, callback) {
  let request = axios.post("https://getpocket.com/v3/get", {
    "consumer_key": consumerKey,
    "access_token": event.queryStringParameters.accesstoken,
    "sort": "newest",
    "detailType": "complete"
  }, config);

  request.then((response) => {
    let articles = parser.convertArticles(response.data.list);
    callback(null, createResponse(articles, 200));
  }).catch((err) => {
    callback(null, createResponse({ error: err.response.statusText }, err.response.status));
  });
};
