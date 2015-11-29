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
	api.project = function(id) {
		return $http.get(apiUrl + 'project/' + id + '/' + jsonQuery);
	};

	api.createProject = function(managerId, title, description, developerIds, iterationNumbers, defectPercentage) {
		return $http.post(apiUrl + 'project/', {
			title: title,
			description: description,
			developers: developerIds,
			managed_by: managerId,
			num_of_iterations:{
				I: iterationNumbers[0],
				E: iterationNumbers[1],
				C: iterationNumbers[2],
				T: iterationNumbers[3]
			},
			percentage: defectPercentage
		});
	};

	api.updateProject = function(id, iterationNumbers) {
		return $http.put(apiUrl + 'project/' + id + "/", {
			num_of_iterations:{
				I: iterationNumbers[0],
				E: iterationNumbers[1],
				C: iterationNumbers[2],
				T: iterationNumbers[3]
			}
		});
	};

	//-----------------------------------------------------------------------------Iteration
	api.closeIteration = function(projectId, sloc) {
		return $http({ url: apiUrl + 'project/' + projectId + '/iteration/close/',
			method: 'DELETE',
			data: {lines_of_codes: sloc},
			headers: {"Content-Type": "application/json;charset=utf-8"}
		})
	};
	api.addIteration = function(projectId, sloc) {
		return $http({ url: apiUrl + 'project/' + projectId + '/iteration/close/',
			method: 'DELETE',
			data: {lines_of_codes: sloc},
			headers: {"Content-Type": "application/json;charset=utf-8"}
		})
	};

	//-----------------------------------------------------------------------------Activity
	api.startActivity = function(developerId, projectId, typeCode) {
		return $http.post(apiUrl + 'developer/' + developerId + '/activity/start/', {
			project: projectId,
			activity_type: typeCode
		});
	};

	api.endActivity = function(developerId) {
		return $http.delete(apiUrl + 'developer/' + developerId + '/activity/close/');
	};

	//-----------------------------------------------------------------------------Activity
	api.sendDefect = function(developerId, typeCode, description,
								injectedIterationId, removedIterationId, activityTypeCode, isShared, idBeingEdited) {
		var defect = {
			developer: developerId,
			defect_type: typeCode,
			description: description,
			injected_in_iteration: injectedIterationId,
			removed_in_iteration: removedIterationId,
			iteration_activity_type: activityTypeCode,
			is_shared: isShared
		};
		return idBeingEdited == undefined ? $http.post(apiUrl + 'defect/', defect) : $http.put(apiUrl + 'defect/' + idBeingEdited + '/', defect);
	};

	api.reportDefect = function(developerId, typeCode, description,
								injectedIterationId, removedIterationId, activityTypeCode, isShared) {
		return $http.post(apiUrl + 'defect/', {
			developer: developerId,
			defect_type: typeCode,
			description: description,
			injected_in_iteration: injectedIterationId,
			removed_in_iteration: removedIterationId,
			iteration_activity_type: activityTypeCode,
			is_shared: isShared
		});
	};

	api.defects = function(userType, userId, projectId) {
		return $http.get(apiUrl + userType + '/' + userId + '/project/' + projectId + '/defect/' + jsonQuery);
	};

    return api;
}
