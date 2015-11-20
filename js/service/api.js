function apiService($http, $rootScope) {
    var apiUrl = "http://45.115.39.208:8000/";
    var jsonQuery = "?format=json";

    var api = {apiUrl : apiUrl};

    //-----------------------------------------------------------------------------User
    api.login = function(username, password) {
        return $http.post(apiUrl + 'auth/login/', {
            username: username, password: password
        });
    };

	api.developers = function() {
		return $http.get(apiUrl + 'developer/' + jsonQuery);
	};

    api.projectManagers = function() {
        return $http.get(apiUrl + 'projectmanager/' + jsonQuery);
    };

    api.createUser = function(type, username, displayName, email, password) {
        return $http.post(apiUrl + type + "/", {
            username: username,
            display_name: displayName,
            email: email,
            password: password
        });
    };

    return api;
}
