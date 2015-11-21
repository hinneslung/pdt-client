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

	api.developer = function(id) {
		return $http.get(apiUrl + 'developer/' + id + '/' + jsonQuery);
	};

	api.developers = function() {
		return $http.get(apiUrl + 'developer/' + jsonQuery);
	};

	api.projectManager = function(id) {
		return $http.get(apiUrl + 'projectmanager/' + id + '/' + jsonQuery);
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

	//-----------------------------------------------------------------------------Project
	api.createProject = function(managerId, title, description, developerIds, iterationNumbers) {
		return $http.post(apiUrl + 'project' + "/", {
			title: title,
			description: description,
			developers: developerIds,
			managed_by: managerId,
			number_of_iterations:{
				inception: iterationNumbers[0],
				elaboration: iterationNumbers[1],
				construction: iterationNumbers[2],
				transition: iterationNumbers[3]
			}
		});
	};

	api.updateProject = function(id, iterationNumbers) {
		return $http.put(apiUrl + 'project/' + id + "/", {
			number_of_iterations:{
				inception: iterationNumbers[0],
				elaboration: iterationNumbers[1],
				construction: iterationNumbers[2],
				transition: iterationNumbers[3]
			}
		});
	};

    return api;
}
