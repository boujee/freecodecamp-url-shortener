'use strict';

import {api} from '..';

const env = (key, def) => process.env.hasOwnProperty(key) ? process.env[key] : def;
const port = env('PORT', 8080);
const app = api().set('trust proxy', env('TRUST_PROXY', false));

app.listen(port, () => {
  console.log(`Listening on ${port}.`);
  console.log(`using trust proxy: ${app.get('trust proxy')}`);
});