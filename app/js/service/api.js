function apiService($http, $rootScope) {
    var apiUrl = "http://45.115.39.208/api/";
    var apiUploadUrl = apiUrl + 'upload';

    var api = {apiUrl : apiUrl, apiUploadUrl:apiUploadUrl};

    //-----------------------------------------------------------------------------User
    api.login = function(type) {
        console.log(location);
        return $http.get(apiUrl + 'authentication/' + type);
    };

    return api;
}
