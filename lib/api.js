'use strict';

import express from 'express';
import urlRegex from 'url-regex';
import {db} from '..';

const URL_REGEX = urlRegex({exact: true, strict: false});

const getFullURL = req => `${req.protocol}://${req.get('host')}`;

const VerifyURL = (req, res, next) => 
  URL_REGEX.test(req.params[0]) ? next() : res.json({error: 'Invalid url'});

const New = (req, res) =>
  req.app.get('db')
    .save(req.params[0])
    .then(id => getFullURL(req) + '/' + id)
    .then(short_url => res.json({original_url: req.params[0], short_url}));

const Redirect = (req, res) =>
  req.app.get('db')
    .findOne(req.params[0])
    .then(res.redirect.bind(res))
    .catch(() => res.json({error: 'url does not exist in database'}));

export default () =>
  express()
    .set('db', new db())
    .get(/^\/new\/(.+)$/, VerifyURL, New)
    .get(/^\/(\d+)$/, Redirect)
;