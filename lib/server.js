'use strict';

import {api} from '..';

const env = (key, def) => process.env.hasOwnProperty(key) ? process.env[key] : def;

const port = env('PORT', 8080);
const trustProxy = env('TRUST_PROXY', null);

const app = api();

if (trustProxy !== null) {
  app.set('trust proxy', trustProxy);
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
  if (trustProxy !== null) {
    console.log(`trust proxy: ${trustProxy}`);
  }
});