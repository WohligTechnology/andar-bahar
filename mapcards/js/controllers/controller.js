var updateSocketFunction = {};
var allIntervals = [];
var intervalObj;
myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, apiService, $uibModal, $timeout, toastr, $interval) {

    $interval.cancel(intervalObj);
    var changingCardTime = 500;
    var retryApiTime = 200;
    var savingCardInterval, verifingCardInterval, nextCardInterval;
    $scope.template = TemplateService.getHTML("content/home.html");
    $scope.navigation = NavigationService.getNavigation();
    TemplateService.title = "Home"; //This is the Title of the Website
    $scope.allCards = TemplateService.getAllCard();
    $scope.mapCard = {
        selected: _.head($scope.allCards),
        isSaving: "",
        isVerifing: "",
        isNextCard: ""
    };

    $scope.savingCard = function () {
        console.log("Pending ----- ");
        $scope.mapCard.isSaving = "Pending";
        console.log($scope.mapCard.selected.shortName);
        apiService.saveCard($scope.mapCard.selected.shortName, function (data) {
            if (data.status == 200 && data.data.value) {
                $scope.mapCard.isSaving = "Complete";
                $scope.changeCard();
            } else {
                console.log("Error");
                $scope.mapCard.isSaving = "Error";
                console.log(data);
            }
        });
    };

    $scope.changeCard = function () {
        var indexCard = _.findIndex($scope.allCards, function (n) {
            return n.shortName == $scope.mapCard.selected.shortName;
        });
        if (indexCard == ($scope.allCards.length - 1)) {
            $scope.completedDeck = true;
            toastr.success("Desk Mapping Completed");
            return false;
        } else {
            $scope.mapCard.selected = $scope.allCards[++indexCard];
            $scope.mapCard.isSaving = "";
            $scope.mapCard.isVerifing = "";
            $scope.mapCard.isNextCard = "";
            return true;
        }
    };

    //initializing all calls
    $scope.restartApp = function () {
        $scope.mapCard.isSaving = "";
        $scope.mapCard.isVerifing = "";
        $scope.mapCard.isNextCard = "";
        // $scope.savingCard();
    };

    $scope.startReading = function () {
        $scope.restartApp();
    };

});
myApp.controller('ReadCtrl', function ($scope, TemplateService, NavigationService, apiService, $uibModal, $timeout, toastr, $interval) {
    var retryApiTime = 300;
    var savingCardInterval, verifingCardInterval, nextCardInterval;
    $scope.template = TemplateService.getHTML("content/read.html");
    $scope.navigation = NavigationService.getNavigation();
    TemplateService.title = "Navigation"; //This is the Title of the Website
    $scope.allCards = TemplateService.getAllCard();
    $scope.mapCard = {
        selected: {
            shortName: "NONE"
        },
        isSaving: "",
        isVerifing: "",
        isNextCard: "",
    };

    $scope.replaceWith = {
        value: {}
    };


    $scope.replaceCard = function () {
        if ($scope.replaceWith.value.shortName) {
            apiService.replaceCard($scope.replaceWith.value.shortName, function () {
                toastr.success("Card Replaced Successfully");
            });
            $scope.replaceWith.value = {};
        }
    };

    $scope.startReading = function () {
        intervalObj = $interval(function () {
            apiService.findCard(function (data) {
                if (data.status == 200 && data.data.value) {
                    $scope.mapCard.selected = _.find($scope.allCards, function (n) {
                        return n.shortName == data.data.data.cardValue;
                    });
                    $scope.mapCard.rfidValue = data.data.data.cardId;
                } else {
                    console.log("Error");
                    $scope.mapCard.selected = {
                        shortName: "NONE"
                    };
                }
            });
        }, retryApiTime);
        allIntervals.push(intervalObj);
    };



    $scope.stopAll = function () {
        _.each(allIntervals, function (n) {
            $interval.cancel(n);
        });
        $scope.allIntervals = [];
    };



    //initializing all calls
    $scope.restartApp = function () {
        $scope.stopAll();
        $scope.startReading();
    };
    $scope.restartApp();


    // apiService.changeCard("");

});