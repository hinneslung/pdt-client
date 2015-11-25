(function() {
    var app = angular.module('pdtDefect', []);
    app.directive("defectForm", function() {
        return {
            restrict: 'E',
            templateUrl: "templates/defect-form.html",
            scope: {
                delegate: '='
            },
            controller: function($window, $rootScope, $scope, $location, apiService) {
                $scope.iterations = [];

                $scope.type = "";
                $scope.description = "";
                $scope.phase = "";
                $scope.activity = "";

                $scope.create = function() {
                    console.log($scope.type + $scope.description + $scope.phase, $scope.activity);
                    apiService.reportDefect($rootScope.userId);
                };
            }
        };
    });
})();
