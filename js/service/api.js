function apiService($http, $rootScope) {
    var apiUrl = "http://45.115.39.208:8000/";
    var jsonQuery = "/?format=json";

    var api = {apiUrl : apiUrl};

    //-----------------------------------------------------------------------------User
    api.login = function(username, password) {
        return $http.get(apiUrl + 'docs');
    };

	api.developers = function() {
		return $http.get(apiUrl + 'developer' + jsonQuery);
	};

    api.projectManagers = function() {
        return $http.get(apiUrl + 'projectmanager' + jsonQuery);
    };

    return api;
}
