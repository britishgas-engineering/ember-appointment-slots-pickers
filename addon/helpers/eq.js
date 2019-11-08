import {helper} from '@ember/component/helper';
import {isEqual} from '@ember/utils';

export function eq(params/*, hash*/) {
  return isEqual(params[0], params[1]);
}

export default helper(eq);
