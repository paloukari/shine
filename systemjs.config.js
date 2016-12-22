/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {

   // map tells the System loader where to look for things

   var map = {
      'app': 'app',
      'angular2-notifications': 'angular2-notifications',
      'ng2-bootstrap/ng2-bootstrap': 'ng2-bootstrap/bundles/ng2-bootstrap.umd.js',
   };

   // packages tells the System loader how to load when no filename and/or no extension
   var packages = {
      '@angular': { configured: true, defaultExtension: false },
      'app': { configured: true, main: 'main.js' },
      'util': { main: 'util.js' },
      'angular2-notifications': { main: 'components.js', defaultExtension: 'js' },
      '@angular/material': { format: 'cjs', main: 'material.umd.js' },
      'handsontable': { main: 'dist/handsontable.full.js' },
      rxjs: { defaultExtension: 'js' }
   };

   var ngPackageNames = [
      'common',
      'compiler',
      'core',
      'forms',
      'http',
      'platform-browser',
      'platform-browser-dynamic',
      'router',
      'router-deprecated',
      'upgrade',
   ];

   // Individual files (~300 requests):
   function packIndex(pkgName) {
      packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js', configured: true };
   };

   // Bundled (~40 requests):
   function packUmd(pkgName) {
      packages['@angular/' + pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js', configured: true };
   };
   // Most environments should use UMD; some (Karma) need the individual index files
   var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

   // Add package entries for angular packages
   ngPackageNames.forEach(setPackageConfig);

   var config = {
      defaultJSExtensions: true,
      map: map,
      paths: {
         '*': 'node_modules/*',
         'app*': 'app*',
         // 'rxjs*': 'node_modules/rxjs/bundles/Rx.js',
      },
      packages: packages,
      packageConfigPaths: [
         'xml-lexer/package.json',
         'eventemitter3/package.json',
         'util/package.json',
         'inherits/package.json',
         'lodash/package.json',
         'systemjs-builder/package.json',
         'browser-sync/package.json',
         'material2/package.json',
         'hammerjs/package.json',
         'rxjs/package.json',
         'dotenv/package.json',
         'fs/package.json'
      ],
   };

   System.config(config);


})(this);
