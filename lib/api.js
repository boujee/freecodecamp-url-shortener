'use strict';

import express from 'express';
import urlRegex from 'url-regex';
import {db} from '..';

const URL_REGEX = urlRegex({exact: true, strict: false});
const valid_url = URL_REGEX.test.bind(URL_REGEX);
const NEW_ROUTE_REGEX = /^\/new\/(.+)$/;
const REDIRECT_ROUTE_REGEX = /^\/(\d+)$/;

function fullURL(req) {
  const {protocol} = req;
  const hostname = req.get('host');
  return `${protocol}://${hostname}`;
}

const mkShortURL = req => id => fullURL(req) + '/' + id;

function New(req, res) {
  const original_url = req.params[0];
  const db = req.app.get('db');
  const shorten = mkShortURL(req);
  if (!valid_url(original_url)) 
    return res.json({error: 'Invalid url'});
  db
    .save(original_url)
    .then(shorten)
    .then(short_url => res.json({original_url, short_url}));
}

function redirect(req, res) {
  const id = Number(req.params[0]);
  const db = req.app.get('db');
  db.findOne(id)
    .then(url => res.redirect(url))
    .catch(() => res.json({error: 'url does not exist in database'}));
}

export default () =>
  express().set('db', new db()).get(NEW_ROUTE_REGEX, New).get(REDIRECT_ROUTE_REGEX, redirect);