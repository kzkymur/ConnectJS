import { Middleware } from 'redux';
import logger from './logger';
import closePanel from './closePanel';
import reverseActionBranchOperator from './reverseActionBranchOperator';

const middlewares: Middleware[] = [
  logger,
  closePanel,
  reverseActionBranchOperator,
];
export default middlewares;
