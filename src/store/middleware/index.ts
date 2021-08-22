import { Middleware } from 'redux';
import logger from './logger';
import reverseActionBranchOperator from './reverseActionBranchOperator';

const middlewares: Middleware[] = [
  reverseActionBranchOperator,
  logger,
];
export default middlewares;
