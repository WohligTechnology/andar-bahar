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
            $scope.updatePlayers();
    };

    $scope.newGame = function () {
        $scope.winnerData = {};
        apiService.newGame(function (data) {
            $scope.updatePlayers();
        });
    };

    $scope.updatePlayers = function () {
        apiService.getAll(function (data) {
            console.log(data.data.data.playerCards[0]);
            $scope.cardServed = data.data.data.cardServed;
            $scope.gameType = data.data.data.currentGameType;
            $scope.playerOneCards = data.data.data.playerCards[0].cards;
            $scope.playerTwoCards = data.data.data.playerCards[1].cards;
            $scope.showWinner = data.data.data.showWinner;
        });
    };
    $scope.updatePlayers();
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