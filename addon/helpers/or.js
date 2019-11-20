import {helper} from '@ember/component/helper';

export function or(params) {
  let bool = false;
  params.forEach((param) => {
    bool = bool || param;
  });
  return bool;
}

export default helper(or);
