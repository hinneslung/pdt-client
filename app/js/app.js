(function() {
    var app = angular.module('pdt',
        ['ngRoute']
    );

    //API factory
    app.factory('apiService', apiService);

    //Routing
    app.config(function ($routeProvider, $locationProvider) {

        //$locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'views/home.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

    //separate this later
    app.controller('HomeController', function($scope, $rootScope, apiService){
        $scope.self = $scope;
        $scope.dict = dictionary;
        $scope.media = [];
        $scope.shops = [];

        console.log($rootScope.clientType);

        $scope.getMedia = function() {
            apiService.getMedia().success(function(data) {
                $scope.media = data.data;
            });
        };

        $scope.getShops = function() {
            apiService.getShops().success(function(data) {
                $scope.shops = data.data;
            });
        };

        $scope.searchFieldChanged = function(text) {
            console.log(text);
            if (text.length != 0) {
                apiService.searchMedia(text).success(function(data){
                    console.log(data.data[0]);
                    $scope.media = data.data;
                });
                apiService.searchShops(text).success(function(data) {
                    $scope.shops = data.data;
                });
            } else {
                $scope.getMedia();
                $scope.getShops();
            }
        };

        $scope.getMedia();
        $scope.getShops();
    });


})();
