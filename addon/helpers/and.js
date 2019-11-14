import {helper} from '@ember/component/helper';

export function and(params) {
  let bool = true;
  params.forEach((param) => {
    bool = bool && param;
  });
  return bool;
}

export default helper(and);
