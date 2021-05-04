import { Middleware } from 'redux';
import logger from './logger';
import closePanel from './closePanel';

const middlewares: Middleware[] = [
  logger,
  closePanel,
];
export default middlewares;
