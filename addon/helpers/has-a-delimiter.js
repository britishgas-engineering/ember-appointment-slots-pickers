import { helper } from '@ember/component/helper';

//only used for slot-picker components, will be moved with them in separate addon ultimately
export function hasADelimiter(params) {
  const rows = params[0];
  const currentIndex = params[1];
  const previousRow = rows[currentIndex - 1];
  const currentRow = rows[currentIndex];
  return previousRow && currentRow && previousRow.get('group') !== currentRow.get('group');
}

export default helper(hasADelimiter);
