import 'reflect-metadata';
import { server } from './server';
import { getAppPort } from './common/utils/env.utils';

const port: number = getAppPort();

server
  .build()
  .listen(port, () => console.log(`Listening on http://localhost:${port}/`));
