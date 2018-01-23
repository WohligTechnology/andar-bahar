// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider

      .state('table', {
        url: '/table',
        templateUrl: 'templates/table.html',
        controller: 'TableCtrl'
      })

      .state('winner', {
        url: '/winner',
        templateUrl: 'templates/winner.html',
        controller: 'WinnerCtrl'
      })

      .state('dealer', {
        url: '/dealer',
        templateUrl: 'templates/dealer.html',
        controller: 'DealerCtrl'
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/table');
  })


  .directive('card', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        card: "@",
        width: "@",
        height: "@"
      },
      templateUrl: 'templates/directive/card.html',
      link: function ($scope, element, attr) {
        function calc() {
          $scope.style = {
            width: $scope.width + "px",
            height: $scope.height + "px"
          };
          $scope.cardFile = "img/cards/" + _.toUpper($scope.card) + ".svg";
        }
        calc();
        $scope.$watch("card", function () {
          calc();
        });
      }
    };
  })
  .directive('player', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        player: "=ngPlayer"
      },
      templateUrl: 'templates/directive/player.html',
      link: function ($scope, element, attr) {}
    };
  })
  .directive('community', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        communityCard: "=ngCommunityCard"
      },
      templateUrl: 'templates/directive/communityCard.html',
      link: function ($scope, element, attr) {

      }
    };
  })

  .directive('winnerPlayer', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        player: "=ngPlayer",
        method: "="
      },
      templateUrl: 'templates/directive/winnerPlayer.html',
      link: function ($scope, element, attr) {}
    };
  })

  .directive('tab', function (apiService) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        player: "=ngPlayer",
      },
      templateUrl: 'templates/directive/tab.html',
      link: function ($scope, element, attr) {
        $scope.makeActive = function (tabId, status) {
          $scope.player.isActive = status;
          if (status) {
            apiService.addTab({
              "tabId": tabId
            }, function (data) {});
          } else {
            apiService.removeTab({
              "tabId": tabId
            }, function (data) {});
          }
        };
      }
    };
  });