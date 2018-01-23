myApp.directive('img', function ($compile, $parse) {
    return {
        restrict: 'E',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            if (!attrs.noloading) {
                $element.after("<img src='img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function () {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
})

.directive('hideOnScroll', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var lastScrollTop = 0;
            $(window).scroll(function (event) {
                var st = $(this).scrollTop();
                if (st > lastScrollTop) {
                    $(element).addClass('nav-up');
                } else {
                    $(element).removeClass('nav-up');
                }
                lastScrollTop = st;
            });
        }
    };
})

.directive('fancybox', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var target;
            if (attr.rel) {
                target = $("[rel='" + attr.rel + "']");
            } else {
                target = element;
            }

            target.fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                closeBtn: true,
                padding: 0,
                helpers: {
                    media: {}
                }
            });
        }
    };
})

.directive('autoHeight', function ($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            var windowHeight = $(window).height();
            $element.css("min-height", windowHeight);
        }
    };
})

.directive('replace', function () {
    return {
        require: 'ngModel',
        scope: {
            regex: '@replace',
            with: '@with'
        },
        link: function (scope, element, attrs, model) {
            model.$parsers.push(function (val) {
                if (!val) {
                    return;
                }
                var regex = new RegExp(scope.regex);
                var replaced = val.replace(regex, scope.with);
                if (replaced !== val) {
                    model.$setViewValue(replaced);
                    model.$render();
                }
                return replaced;
            });
        }
    };
})

.directive('players', function ($document) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: "views/directives/players.html",
            scope: {
                player: "="
            },
            link: function (scope, element, attr) {
                // console.info(scope.person);
            }
        };
    })
    // .directive('cards', function ($document) {
    //     return {
    //         restrict: 'EA',
    //         replace: true,
    //         templateUrl: "views/directives/cards.html",
    //         link: function (scope, element, attr) {
    //         }
    //     };
    // })

.directive('card', function () {
    return {
        restrict: 'E',
        replace: false,
        scope: {
            card: "@",
            width: "@",
            height: "@"
        },
        templateUrl: 'views/directives/cards.html',
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

.directive('joker', function () {
    return {
        restrict: 'E',
        replace: false,
        scope: {
            gameType: "=ngGameType"
        },
        templateUrl: 'views/directives/jokerCard.html',
        link: function ($scope, element, attr) {}
    };
})

.directive('playerCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "views/directives/player-cards.html",
        link: function (scope, element, attr) {
            // console.info(scope.person);
        }
    };
});