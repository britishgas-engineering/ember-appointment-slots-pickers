import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SlotsPickersName extends Controller {
  @service viewport;
  @action
  resetSlots() {}
}
