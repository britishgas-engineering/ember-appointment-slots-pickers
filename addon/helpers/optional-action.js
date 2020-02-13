import {helper} from '@ember/component/helper';

// https://github.com/emberjs/rfcs/issues/90
export function optionalAction([action]) {
  return action || function () {};
}

export default helper(optionalAction);
