'use strict';

import request from 'supertest';
import {api} from 'freecodecamp-url-shortener';

describe('api', () => {
  test('I can pass a URL as a parameter and I will receive a shortened URL in the JSON response', () =>
    request(api().enable('trust proxy'))
      .get('/new/http://www.google.com')
      .set('Host', 'example.dev')
      .expect(200)
      .expect(({body}) => {
        expect(body).toHaveProperty('original_url');
        expect(body).toHaveProperty('short_url');
        expect(body.original_url).toBe('http://www.google.com');
        expect(body.short_url).toMatch(/^https?:\/\/example.dev\/\d+$/);
      })
  );
  test('If I pass an invalid URL that doesn\'t follow the valid http://www.example.com format, the JSON response will contain an error instead', () =>
    request(api())
      .get('/new/test')
      .expect({error: 'Invalid url'})
  );
  test('When I visit that shortened URL, it will redirect me to my original link', () => {
    const app = api();
    const url = 'http://www.google.com';
    return request(app)
      .get(`/new/${url}`)
      .expect(({body}) => expect(body).toHaveProperty('short_url'))
      .then(({body}) => body.short_url)
      .then(url => {
        // get last fragment
        const parts = url.split('/');
        return parts[parts.length-1];
      })
      .then(uri =>
        request(app)
          .get('/' + uri)
          .expect(302)
          .expect('Location', url)
      );
  });
  test('I receive an error on entries that are nonexistent', () =>
    request(api()).get('/3').expect(200, {error: 'url does not exist in database'})
  );
});