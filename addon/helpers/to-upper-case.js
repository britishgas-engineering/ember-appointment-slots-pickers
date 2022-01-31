import { helper } from '@ember/component/helper';

export function toUpperCase(params) {
  return params[0] && params[0].toUpperCase();
}

export default helper(toUpperCase);
