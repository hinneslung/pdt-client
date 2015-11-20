(function() {
    var app = angular.module('pdt',
        ['ngRoute', 'ui.bootstrap',
        'pdtCommon', 'pdtHome', 'pdtAdmin', 'pdtProjectManager', 'pdtDeveloper']
    );

    //API factory
    app.factory('apiService', apiService);

	//user info
	app.run(function($rootScope) {
		var userType = localStorage.getItem('userType');
		var userId = localStorage.getItem('userId');
		if (userType && userId) {
			console.log('localStorage ' + userType + ' ' + userId);
			$rootScope.userType= userType;
			$rootScope.userId = userId;
		}
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
            .when('/admin/createuser', {
                controller: 'CreateUserController',
                templateUrl: 'views/createuser.html'
            })

            .when('/projectmanager', {
                controller: 'ProjectManagerController',
                templateUrl: 'views/projectmanager.html'
            })
	        .when('/projectmanager/createproject', {
		        controller: 'CreateProjectController',
		        templateUrl: 'views/createproject.html'
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
