
/**
 * Module definition and dependencies
 */
angular.module('Utility.HttpBuffer.Service', [])

/**
 * Service definition
 */
.factory('HttpBuffer', function($injector) {

  //Requests buffer
  var buffer = [];

  //HTTP service, initialized later due to circular dependency
  var $http;

  /**
   * Helper to retry a http request
   */
  function retryHttpRequest(config, deferred) {

    //Get the http service now
    $http = $http || $injector.get('$http');

    //Retry the request
    $http(config).then(function(response) {
      deferred.resolve(response);
    }, function(reason) {
      deferred.reject(reason);
    });
  }

  /**
   * Service class
   */
  var HttpBuffer = {

    /**
     * Append a new request
     */
    append: function(config, deferred) {
      buffer.push({
        config: config,
        deferred: deferred
      });
    },

    /**
     * Clear the buffer (without rejecting requests)
     */
    clear: function() {
      buffer = [];
    },

    /**
     * Reject all the buffered requests
     */
    rejectAll: function(reason) {

      //Loop all buffered requests and reject them
      for (var i = 0; i < buffer.length; i++) {
        buffer[i].deferred.reject(reason);
      }

      //Clear the buffer
      HttpBuffer.clear();
    },

    /**
     * Retry all buffered requests
     */
    retryAll: function(configUpdater) {

      //Loop all buffered requests
      for (var i = 0; i < buffer.length; i++) {

        //Config updater provided? Use it
        if (configUpdater && angular.isFunction(configUpdater)) {
          buffer[i].config = configUpdater(buffer[i].config);
        }

        //Retry the request
        retryHttpRequest(buffer[i].config, buffer[i].deferred);
      }

      //Clear the buffer
      HttpBuffer.clear();
    }
  };

  //Return it
  return HttpBuffer;
});
