(function() {
    var app = angular.module('pdt',
        ['ngRoute', 'ui.bootstrap',
        'pdtHome', 'pdtAdmin']
    );

    //API factory
    app.factory('apiService', apiService);

    //Routing
    app.config(function ($routeProvider, $locationProvider) {

        //$locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'views/login.html'
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login.html'
            })
            .when('/admin', {
                controller: 'AdminController',
                templateUrl: 'views/admin.html'
            })
            .when('/admin/createuser', {
                controller: 'CreateUserController',
                templateUrl: 'views/createuser.html'
            })
            .when('/projectmanager', {
                controller: 'ProjectManagerController',
                templateUrl: 'views/projectmanager.html'
            })
            .when('/developer', {
                controller: 'DeveloperController',
                templateUrl: 'views/developer.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})();
