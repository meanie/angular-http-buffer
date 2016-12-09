# meanie-angular-http-buffer

[![npm version](https://img.shields.io/npm/v/meanie-angular-http-buffer.svg)](https://www.npmjs.com/package/meanie-angular-http-buffer)
[![node dependencies](https://david-dm.org/meanie/angular-http-buffer.svg)](https://david-dm.org/meanie/angular-http-buffer)
[![github issues](https://img.shields.io/github/issues/meanie/angular-http-buffer.svg)](https://github.com/meanie/angular-http-buffer/issues)
[![codacy](https://img.shields.io/codacy/1acac1b2744d4c42b21301ee6625d131.svg)](https://www.codacy.com/app/meanie/angular-http-buffer)


An Angular service for buffering HTTP requests

![Meanie](https://raw.githubusercontent.com/meanie/meanie/master/meanie-logo-full.png)

## Installation

You can install this package using `npm`:

```shell
npm install meanie-angular-http-buffer --save
```

Include the script `node_modules/meanie-angular-http-buffer/release/meanie-angular-http-buffer.js` in your build process, or add it via a `<script>` tag to your `index.html`:

```html
<script src="node_modules/meanie-angular-http-buffer/release/meanie-angular-http-buffer.js"></script>
```

Add `HttpBuffer.Service` as a dependency for your app.

## Usage

Buffer failed requests in a http interceptor:

```js
//Module dependencies
angular.module('App.MyModule', [
  'HttpBuffer.Service'
])

//Config
.config(function($httpProvider) {
  $httpProvider.interceptors.push('Buffered401Interceptor');
})

//Interceptor factory
.factory('Buffered401Interceptor', function($q, $rootScope, $httpBuffer) {
  return {
    responseError: function(response) {

      //Intercept 401's
      if (response.status === 401 && !response.config.ignore401intercept) {
        var promise = $httpBuffer.store(response.config);
        $rootScope.$broadcast('auth.401', response);
        return promise;
      }

      //Return rejection
      return $q.reject(response);
    }
  };
});
```

Later retry or reject them:

```javascript
$rootScope.on('auth.401', function(event, response) {

  //Use an Auth service to login again
  Auth.doLogin().then(function() {

    //Retry all buffered requests
    $httpBuffer.retryAll();
  }, function() {

    //Reject all buffered requests
    $httpBuffer.rejectAll();
  });
});
```

## Issues & feature requests

Please report any bugs, issues, suggestions and feature requests in the [meanie-angular-http-buffer issue tracker](https://github.com/meanie/angular-http-buffer/issues).

## Contributing

Pull requests are welcome! If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## Credits

* Based on the Http Buffer service from Witold Szczerba in his [angular-http-auth](https://github.com/witoldsz/angular-http-auth) module.
* Meanie logo designed by [Quan-Lin Sim](mailto:quan.lin.sim+meanie@gmail.com)

## License

(MIT License)

Copyright 2015-2017, [Adam Reis](http://adam.reis.nz)
