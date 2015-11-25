(function() {
    var app = angular.module('pdtDefect', []);
    app.directive("defectForm", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/defect-form.html",
            scope: {
                project: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService) {
                //form
                $scope.typeCode = "";
                $scope.description = "";
                $scope.iterationId = "";
                $scope.iterationActivityTypeCode = "";
                $scope.isShared = false;

                $scope.phaseIndex = "";

                $scope.itemHasStarted = function(item) {
                    return item.status != 'N';
                };

                $scope.phaseChanged = function() {
                    $scope.iterationId = "";
                };

                $scope.create = function() {
                    apiService.reportDefect($rootScope.userId, $scope.typeCode, $scope.description,
                        $scope.iterationId, $scope.project.active_iteration.id, $scope.iterationActivityTypeCode, $scope.isShared).success(function(data) {

                        $scope.typeCode = "";
                        $scope.description = "";
                        $scope.iterationId = "";
                        $scope.iterationActivityTypeCode = "";
                        $scope.isShared = false;
                        $scope.phaseIndex = "";

                        console.log(data);
                    });
                };
            }
        };
    });
})();
