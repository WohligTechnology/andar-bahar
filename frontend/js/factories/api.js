myApp.factory('apiService', function ($http, $q, $timeout) {
    return {
        // This is a get Players Service for POST Method.
        getAll: function (callback) {
            $http({
                url: adminurl + 'Player/getAll',
                method: 'POST'
            }).then(function (data) {
                callback(data);
            });
        },
        findWinnerlogs: function (callback) {
            $http({
                url: adminurl + 'WinnerLogs/findWinnersLogs',
                method: 'POST',
                data:{}
            }).then(function (data) {
                callback(data);
            });
        },
        randomCard: function () {
            var cardValue = cards[_.random(0, cards.length - 3)].name;
            console.log(cardValue);
            $http.post(adminurl + 'Player/randomServe', {
                card: cardValue
            }).then(function (data) {
                console.log(data.data);
            });
        },
        newGame: function (callback) {
            $http.post(adminurl + 'Player/newGame').then(function (data) {
                console.log(data);
                callback(data);
            });
        }
    };
});