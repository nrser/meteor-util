Package.describe({
  name: 'nrser:util',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: "nrser's meteor utils",
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/nrser/meteor-util',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use([
    'ecmascript',
    'underscore',
    'check',
  ]);
  api.mainModule('index.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('nrser:util');
  api.mainModule('util-tests.js');
});
