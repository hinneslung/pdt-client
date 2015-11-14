(function() {
    var app = angular.module('pdt',
        ['ngRoute', 'ui.bootstrap',
        'pdtHome']
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
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})();
