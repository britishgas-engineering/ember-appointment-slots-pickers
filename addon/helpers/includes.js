import {helper} from '@ember/component/helper';
import {assert} from '@ember/debug';

export function includes(params/*, hash*/) {
  assert('Must pass an array as the first param', params[0] instanceof Array);

  return params[0].includes(params[1]);
}

export default helper(includes);
