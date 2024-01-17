import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ClockReloader extends Controller {
  @action
  onRefresh() {
    this.send('refresh', ...arguments);
  }
}
