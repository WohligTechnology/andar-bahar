var updateSocketFunction;

angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })


  .controller('HomeCtrl', function ($scope, $stateParams, $ionicPopup, $state) {
    $scope.youlose = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Sorry",
        template: "You Lose",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

    $scope.youwin = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Hurray",
        template: "You Won",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

    $scope.fold = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Fold",
        template: "Your cards are folded",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

  })

  .controller('DealerCtrl', function ($scope, $stateParams, apiService, $state, $timeout, $ionicModal) {

    io.socket.on("ShowWinner", function (data) {
      console.log("Winner", data);
    });
    $scope.randomCard = function () {
      apiService.randomCard();
    };

    updateSocketFunction = function (data) {
      console.log(data);
      $scope.communityCards = data.communityCards;
      $scope.playersChunk = _.chunk(data.playerCards, 8);
      $scope.extra = data.extra;
      $scope.hasTurn = data.hasTurn;
      $scope.isCheck = data.isCheck;
      $scope.showWinner = data.showWinner;
      $scope.remainingPlayers = _.filter(data.playerCards, function (n) {
        return (n.isActive && !n.isFold);
      }).length;
      console.log($scope.remainingPlayers);
      $scope.$apply();
    };

    io.socket.on("Update", updateSocketFunction);


    // $scope.pageChange = function () {};


    $scope.updatePlayers = function () {
      apiService.getAll(function (data) {
        // check whether dealer is selected or not

        var dealerIndex = _.findIndex(data.data.data.playerCards, function (player) {
          return player.isDealer;
        });
        if (dealerIndex < 0) {
          // $scope.noDealer = true;
          $state.go("table");
        }

        $scope.communityCards = data.data.data.communityCards;
        $scope.playersChunk = _.chunk(data.data.data.playerCards, 8);
        $scope.hasTurn = data.data.data.hasTurn;
        $scope.isCheck = data.data.data.isCheck;
        $scope.showWinner = data.data.data.showWinner;
        $scope.remainingPlayers = _.filter(data.data.data.playerCards, function (n) {
          return (n.isActive && !n.isFold);
        }).length;
      });
    };

    $scope.updatePlayers();
    $scope.showCards = function () {
      apiService.revealCards(function (data) {});
    };

    var count = 0;
    var counter = 0;
    $scope.selected = '0-0';

    $scope.currentPlayer = 0;




    // Modal Actions
    $ionicModal.fromTemplateUrl('templates/modal/sure.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.confirmModalClose = function () {
      $scope.modal.hide();
    };

    $scope.showConfirmationModal = function (value) {
      switch (value) {
        case "allIn":
          $scope.confirmModalOk = $scope.allIn;
          $scope.modelActionFor = "All In";
          break;
        case "fold":
          $scope.confirmModalOk = $scope.fold;
          $scope.modelActionFor = "Fold";
          break;
        case "newGame":
          $scope.confirmModalOk = $scope.newGame;
          $scope.modelActionFor = "Start New Game";
          break;
        case "undo":
          $scope.confirmModalOk = $scope.undo;
          $scope.modelActionFor = "Undo";
          break;
      }
      $scope.modal.show();
    };

    // Turn Actions
    $scope.allIn = function () {
      apiService.allIn(function (data) {});
    };
    $scope.fold = function () {
      apiService.fold(function (data) {});
    };
    $scope.raise = function () {
      apiService.raise(function (data) {});
    };
    $scope.move = function () {
      apiService.move(function (data) {});
    };
    $scope.call = function () {
      apiService.call(function (data) {});
    };
    $scope.check = function () {
      apiService.check(function (data) {});
    };

    // New Game
    $scope.newGame = function () {
      $state.go("table");
    };

    // Undo
    $scope.undo = function () {
      apiService.undo(function (data) {});
    };

    // Remove Cards
    $scope.removeCard = function (cardNo) {
      apiService.removeCard(cardNo);
    };
    $scope.showRemove = function (cardNo) {
      if ($scope.communityCards && $scope.communityCards.length == 8) {
        if (cardNo === 0) {
          if ($scope.communityCards[0].cardValue !== "" && $scope.communityCards[4].cardValue === "") {
            return true;
          }
        } else if (cardNo === 4) {
          if ($scope.communityCards[4].cardValue !== "" && $scope.communityCards[6].cardValue === "") {
            return true;
          }
        } else if (cardNo === 6) {
          if ($scope.communityCards[6].cardValue !== "") {
            return true;
          }
        }
      }
    };
  })

  .controller('TableCtrl', function ($scope, $stateParams, apiService, $state) {
    io.socket.off("Update", updateSocketFunction);
    $scope.newGame = function () {
      $scope.winnerData = {};
      apiService.newGame(function (data) {
        $scope.updatePlayers();
      });
    };

    $scope.newGame();

    $scope.updatePlayers = function () {
      apiService.getAll(function (data) {
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


    $scope.makeDealer = function (tabId) {
      apiService.makeDealer({
        "tabId": tabId,
        straddle: $scope.form.straddle,
        removeSmallBlind: $scope.form.removeSmallBlind
      }, function (data) {
        $state.go("dealer");
      });
    };

    $scope.activePlayers = function () {
      var players = _.flatten($scope.playersChunk);

      var activePlayers = _.filter(players, function (player) {
        return player.isActive;
      });
      $scope.maxStraddle = _.times(activePlayers.length - 3, function (n) {
        return n + 1;
      });
      return activePlayers;
    };

    $scope.isDealerPlayerInActive = function (dealerPlayer) {
      var players = _.flatten($scope.playersChunk);
      var dealerPlayerIndex = _.findIndex(players, function (player) {
        return (player.isActive && player.playerNo == dealerPlayer);
      });
      if (dealerPlayerIndex >= 0) {
        return true;
      } else {
        return false;
      }
    };
    $scope.form = {
      straddle: 0,
      adminurl: apiService.getAdminUrl(),
      removeSmallBlind: false,
    };

    //Settings
    apiService.getSettings(function (data) {
      $scope.settings = data.data.results;
    });
    $scope.storeSetting = function () {
      apiService.storeSettings($scope.settings, function () {});
    };

    $scope.settingShow = false;
    $scope.toggleSettingShow = function () {
      $scope.settingShow = !$scope.settingShow;
    };

    $scope.saveAdminUrl = function () {
      apiService.saveAdminUrl($scope.form.adminurl);
      window.location.href = window.location.href.split("#")[0];
    };

    $scope.showRemoveSmallBlind = function () {
      console.log($scope.dealer.dealerPlayer);
      var nextPlayer = (parseInt($scope.dealer.dealerPlayer) + 1) % 8;
      console.log(nextPlayer);
      if ($scope.allPlayers[nextPlayer - 1].isActive === false) {
        return true;
      } else {
        return false;
      }

    };



  })

  .controller('WinnerCtrl', function ($scope, $stateParams, apiService) {
    io.socket.off("Update", updateSocketFunction);
    $scope.showWinner = function () {
      apiService.showWinner(function (data) {
        $scope.players = data.data.data.winners;
        $scope.winners = _.filter($scope.players, function (player) {
          return player.winner;
        });
        $scope.communityCards = data.data.data.communityCards;
        $scope.winnerString = _.join(_.map($scope.winners, function (n) {
          return "Player-" + n.playerNo;
        }), " , ");
      });
    };
    $scope.showWinner();
    $scope.showPlayerCard = function (player) {
      player.showCard = true;
      apiService.showPlayerCard(player, function (data) {

      });
    };

  });