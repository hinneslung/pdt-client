(function() {
    var app = angular.module('pdtDefect', []);

    app.directive("defectTable", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/defect-table.html",
            scope: {
                defects: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService) {

            }
        };
    });

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

function defectService() {
    var ds = {};

    ds.processDefects = function(defects) {
        defects = defects.my_defects.concat(defects.shared_defects);
        defects.sort(function(a, b){
            return new Date(b.created_dateTime) - new Date(a.created_dateTime);
        });

        return defects;
    };

    return ds;
}
