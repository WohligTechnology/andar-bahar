myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, apiService, $http) {
    $scope.template = TemplateService.getHTML("content/home.html");
    TemplateService.title = "Home"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";
    $scope.navigation = NavigationService.getNavigation();

    $scope.submitForm = function (data) {
        console.log("This is it");
        return new Promise(function (callback) {
            $timeout(function () {
                callback();
            }, 5000);
        });
    };
    $scope.jokerCard = "JD";
    $scope.andarcards = ["2C", "2D", "2H", "2S", "8C", "8D", "6H", "2C", "2D", "2H", "2S", "8C", "8D", "6H", "2C", "2D", "2H", "2S", "8C", "8D", "6H", "2C", "2D"];
    $scope.baharcards = ["6C", "6D", "6H", "6S", "4C", "4D", "2S", "2C", "2D", "2H", "2S", "8C", "8D", "6H", "2C", "2D", "2H", "2S", "8C", "8D", "6H", "2C", "2D"];
    $scope.randomCard = function () {
        apiService.randomCard();
    };

    $scope.newGame = function () {
        $scope.winnerData = {};
        apiService.newGame(function (data) {
            $scope.updatePlayers();
        });
    };

    $scope.updatePlayers = function () {
        apiService.getAll(function (data) {
            console.log(data);
            $scope.allPlayers = data.data.data.playerCards;
            $scope.playersChunk = _.chunk(data.data.data.playerCards, 2);
            _.each($scope.allPlayers, function (n) {
                if (n.isDealer) {
                    $scope.dealer = {
                        dealerPlayer: 1
                    };
                }
            });
        });
    };
})

.controller('LinksCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/links.html");
    TemplateService.title = "Links"; // This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
})

// Example API Controller
.controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
    apiService.getDemo($scope.formData, function (data) {
        console.log(data);
    });
});