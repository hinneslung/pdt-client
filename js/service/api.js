function apiService($http, $rootScope) {
    var apiUrl = "http://45.115.39.208:8000/api/";

    var api = {apiUrl : apiUrl};

    //-----------------------------------------------------------------------------User
    api.login = function(type) {
        console.log(location);
        return $http.get(apiUrl + 'authentication/' + type);
    };

    return api;
}
