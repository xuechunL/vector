/**!
 *
 *  Copyright 2015 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
(function () {
  'use strict';

  /**
   * @name DiskIOFlameGraphService
   */
  function DiskIOFlameGraphService($log, $rootScope, $http, toastr) {

    /**
     * @name generate
     * @desc
     */
    function generate(seconds, poll) {
      $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_store?name=vector.task.diskioflamegraph&value=' + seconds)
        .success(function () {
          toastr.success('vector.task.diskioflamegraph requested.', 'Success');
          poll("REQUESTED");
        }).error(function (err) {
          toastr.error('Failed requesting vector.task.diskioflamegraph: ' + err, 'Error');
          poll("ERROR " + err);
        });
    }

    function pollStatus(refresh) {
      $http.get($rootScope.properties.protocol + '://' + $rootScope.properties.host + ':' + $rootScope.properties.port + '/pmapi/' + $rootScope.properties.context + '/_fetch?names=vector.task.diskioflamegraph')
        .success(function (data) {
          if (angular.isDefined(data.values[0])) {
            var message = data.values[0].instances[0].value;
            refresh(message);
          }
        }).error(function () {
          refresh("ERROR fetching status");
        });
    }

    return {
      generate: generate,
      pollStatus: pollStatus
    };
  }

  angular
    .module('diskioflamegraphtask')
    .factory('DiskIOFlameGraphService', DiskIOFlameGraphService);

})();
