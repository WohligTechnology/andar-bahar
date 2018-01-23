myApp.factory('NavigationService', function () {
    var navigation = [{
        name: "Map Cards",
        classis: "active",
        anchor: "home",
    }, {
        name: "Read Cards",
        classis: "active",
        anchor: "read",
    }];
    return {
        getNavigation: function () {
            return navigation;
        }
    };
});