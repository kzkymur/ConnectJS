import { Middleware } from 'redux';
import logger from './logger';
import closePanel from './closePanel';
import reverseActionBranchOperator from './reverseActionBranchOperator';

const middlewares: Middleware[] = [
  reverseActionBranchOperator,
  logger,
  closePanel,
];
export default middlewares;
