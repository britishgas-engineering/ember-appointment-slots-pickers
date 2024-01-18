import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SlotsPickersName extends Controller {
  @action
  onSelect() {
    this.send('select', ...arguments);
  }
}
