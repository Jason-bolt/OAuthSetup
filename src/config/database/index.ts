import promise from 'bluebird';
import pg from 'pg-promise';
import monitor from 'pg-monitor';
import envs from '../envs';

const options = {
  promiseLib: promise,
};

monitor.setTheme('invertedMonochrome');
monitor.attach(options);

const pgp = pg(options);
const db = pgp(envs.DATABASE_URL as string);

export default db;
export type DatabaseType = typeof db;