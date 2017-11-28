import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from 'axios';
import { RequestResponseData, PocketArticle, PocketTag } from './PocketModel';
import { Article, convertArticle, getList } from './ArticlesParser';

let consumerKey = process.env.CONSUMER_KEY;
let redirectUrl = "https://getpocket.com/a/queue/list/";
let config: AxiosRequestConfig = {
  headers: {
    "X-Accept": "application/json"
  }
};

export function getRequestToken(event, context, callback) {
  let request = axios.post("https://getpocket.com/v3/oauth/request", {
    "consumer_key": consumerKey,
    "redirect_uri": redirectUrl
  }, config);

  request.then((response: AxiosResponse) => {
    callback(null, {
      body: response.data.code,
      statusCode: 200,
      headers: {},
      isBase64Encoded: false
    });
  })
    .catch((err: AxiosError) => {
      callback(null, {
        body: err.response.statusText,
        statusCode: err.response.status,
        headers: {},
        isBase64Encoded: false
      });
    });
};

export function getAccessToken(event, context, callback) {
  let request = axios.post("https://getpocket.com/v3/oauth/authorize", {
    "consumer_key": consumerKey,
    "code": event.queryStringParameters.key,
    "redirect_uri": redirectUrl
  }, config);

  request.then((response: AxiosResponse) => {
    callback(null, {
      body: response.data,
      statusCode: 200,
      headers: {},
      isBase64Encoded: false
    });
  })
    .catch((err: AxiosError) => {
      callback(null, {
        body: err.response.statusText,
        statusCode: err.response.status,
        headers: {},
        isBase64Encoded: false
      });
    });
};

export function getArticles(event, context, callback) {
  let request = axios.post("https://getpocket.com/v3/get", {
    "consumer_key": consumerKey,
    "access_token": event.queryStringParameters.accesstoken,
    "sort": "newest",
    "detailType": "complete"
  }, config);

  request.then((response: AxiosResponse) => {
    let responseArticles = getList<PocketArticle>(response.data.list);
    let articles = responseArticles.map(convertArticle)
    callback(null, {
      body: articles,
      statusCode: 200,
      headers: {},
      isBase64Encoded: false
    });
  })
    .catch((err: AxiosError) => {
      callback(null, {
        body: err.response.statusText,
        statusCode: err.response.status,
        headers: {},
        isBase64Encoded: false
      });
    });
};