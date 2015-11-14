//separate this later
(function() {
    var app = angular.module('pdtHome', [])

    app.controller('HomeController', function($scope, $rootScope, apiService){
        $scope.self = $scope;

        console.log($rootScope.clientType);

        $scope.getMedia = function() {
            apiService.getMedia().success(function(data) {
                $scope.media = data.data;
            });
        };

        $scope.getMedia();
    });
})();