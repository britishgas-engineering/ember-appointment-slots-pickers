/*jshint node:true*/
module.exports = {
  useVersionCompatibility: false,
  scenarios: [
    {
      name: 'ember-3.4',
      npm: {
        devDependencies: {
          'ember-source': '~3.4.0',
          'ember-data': '~3.4.0'
        }
      }
    },
    {
      name: 'ember-3.5',
      npm: {
        devDependencies: {
          'ember-source': '~3.5.0',
          'ember-data': '~3.5.0'
        }
      }
    },
    {
      name: 'ember-3.6',
      npm: {
        devDependencies: {
          'ember-source': '~3.6.0',
          'ember-data': '~3.6.0'
        }
      }
    },
    {
      name: 'ember-3.7',
      npm: {
        devDependencies: {
          'ember-source': '~3.7.0',
          'ember-data': '~3.7.0'
        }
      }
    },
    {
      name: 'ember-3.8',
      npm: {
        devDependencies: {
          'ember-source': '~3.8.0',
          'ember-data': '~3.8.0'
        }
      }
    }
  ]

};
