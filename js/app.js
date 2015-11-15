(function() {
    var app = angular.module('pdt',
        ['ngRoute', 'ui.bootstrap',
        'pdtHome', 'pdtAdmin']
    );

    //API factory
    app.factory('apiService', apiService);

	app.config(function($httpProvider) {
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
		delete $httpProvider.defaults.headers.common["X-Requested-With"];
		$httpProvider.defaults.headers.common["Accept"] = "application/json";
		$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
	});

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
            .when('/admin', {
                controller: 'AdminController',
                templateUrl: 'views/admin.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})();
