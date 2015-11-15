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
            .when('/admin/create-user', {
                controller: 'CreateUserController',
                templateUrl: 'views/create-user.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})();
