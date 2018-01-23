myApp.factory('apiService', function ($http, $q, $timeout) {
    return {
        // This is a get Players Service for POST Method.
        getall: function (callback) {
            $http({
                url: adminurl + 'Player/getAll',
                method: 'POST'
            }).then(function (data) {
                callback(data);
            });
        },
        getSettings: function (callback) {
            $http({
                url: adminurl + 'setting/search',
                method: 'POST'
            }).then(function (data) {
                callback(data);
            });
        },
        findCard: function (callback) {
            $http({
                url: adminurl + 'Card/findCard',
                method: 'POST'
            }).then(function (data) {
                callback(data);
            });
        },
        saveCard: function (shortName, callback) {
            $http({
                url: adminurl + 'Card/saveCard',
                method: 'POST',
                data: {
                    name: shortName
                }
            }).then(function (data) {
                callback(data);
            });
        },
        replaceCard: function (shortName, callback) {
            $http({
                url: adminurl + 'Card/replaceCard',
                method: 'POST',
                data: {
                    name: shortName
                }
            }).then(function (data) {
                callback(data);
            });
        }
        // This is a get Players Service for POST Method.
    };
});