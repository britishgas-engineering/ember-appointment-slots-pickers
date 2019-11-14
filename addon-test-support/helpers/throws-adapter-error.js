import Ember from 'ember';

export async function throwsAdapterError(assert, closure) {
  //https://github.com/emberjs/ember.js/pull/15871 (Ember 2.18 and more)
  const emberOnError = Ember.onerror;
  let exceptionThrown = false;
  Ember.onerror = function () {
    exceptionThrown = true;
  };
  await closure.apply();

  assert.equal(true, exceptionThrown);
  Ember.onerror = emberOnError;
}
