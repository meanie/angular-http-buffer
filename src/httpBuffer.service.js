
/**
 * Module definition and dependencies
 */
angular.module('Utility.HttpBuffer.Service', [])

/**
 * Service definition
 */
.factory('$httpBuffer', function($q, $injector) {

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
  return {

    /**
     * Store a new request in the buffer
     */
    store: function(config) {
      var deferred = $q.defer();
      buffer.push({
        config: config,
        deferred: deferred
      });
      return deferred.promise;
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
      this.clear();
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
      this.clear();
    }
  };
});
