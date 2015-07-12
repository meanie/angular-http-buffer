# Meanie - Angular Http Buffer

[![npm version](https://img.shields.io/npm/v/meanie-angular-http-buffer.svg)](https://www.npmjs.com/package/meanie-angular-http-buffer)
[![node dependencies](https://david-dm.org/meanie/angular-http-buffer.svg)](https://david-dm.org/meanie/angular-http-buffer)
[![github issues](https://img.shields.io/github/issues/meanie/angular-http-buffer.svg)](https://github.com/meanie/angular-http-buffer/issues)
<!--
[![codacy](https://img.shields.io/codacy/abcdefgh.svg)](https://www.codacy.com/app/meanie/angular-http-buffer)
-->
[![Join the chat at https://gitter.im/meanie/meanie](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/meanie/meanie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Http Buffer service for [Meanie](https://github.com/meanie/meanie) projects.

## Installation
Install using the [Meanie CLI](https://www.npmjs.com/package/meanie):
```shell
meanie install angular-http-buffer
```

## Usage
Buffer failed requests in a http interceptor:
```js

//Module dependencies
angular.module('App.MyModule', [
  'Utility.HttpBuffer.Service'
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
Then later retry or reject them:
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
Please report any bugs, issues, suggestions and feature requests in the appropriate issue tracker:
* [Angular Http Buffer issue tracker](https://github.com/meanie/angular-http-buffer/issues)
* [Meanie Boilerplate issue tracker](https://github.com/meanie/boilerplate/issues)
* [Meanie CLI issue tracker](https://github.com/meanie/meanie/issues)

## Contributing
If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## Credits
Based on the Http Buffer service from Witold Szczerba in his [angular-http-auth](https://github.com/witoldsz/angular-http-auth) module.

## License
(MIT License)

Copyright 2015, [Adam Buczynski](http://adambuczynski.com)
