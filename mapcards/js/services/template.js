myApp.service('TemplateService', function () {
    this.title = "Home";
    this.meta = "";
    this.metadesc = "";

    var d = new Date();
    this.year = d.getFullYear();

    this.init = function () {
        this.header = "views/template/header.html";
        this.menu = "views/template/menu.html";
        this.content = "views/content/content.html";
        this.footer = "views/template/footer.html";
    };

    this.getHTML = function (page) {
        this.init();
        var data = this;
        data.content = "views/" + page;
        return data;
    };

    this.init();

    this.getAllCard = function (card) {
        var number = _.head(card);
        var color = _.tail(card);
        var allColorsObj = [

            {
                shortName: "s",
                fullName: "Spade"
            }, {
                shortName: "h",
                fullName: "Heart"
            }, {
                shortName: "d",
                fullName: "Diamond"
            }, {
                shortName: "c",
                fullName: "Club"
            }
        ];
        var allNumbersObj = [{
                shortName: "A",
                fullName: "Ace"
            },
            {
                shortName: "2",
                fullName: "Two"
            },
            {
                shortName: "3",
                fullName: "Three"
            },
            {
                shortName: "4",
                fullName: "Four"
            },
            {
                shortName: "5",
                fullName: "Five"
            },
            {
                shortName: "6",
                fullName: "Six"
            },
            {
                shortName: "7",
                fullName: "Seven"
            },
            {
                shortName: "8",
                fullName: "Eight"
            },
            {
                shortName: "9",
                fullName: "Nine"
            },
            {
                shortName: "T",
                fullName: "Ten"
            },
            {
                shortName: "J",
                fullName: "Jack"
            },
            {
                shortName: "Q",
                fullName: "Queen"
            },
            {
                shortName: "K",
                fullName: "King"
            }
        ];
        var allCards = [];
        _.each(allColorsObj, function (color) {
            _.each(allNumbersObj, function (number) {
                allCards.push({
                    shortName: number.shortName + color.shortName,
                    fullName: number.fullName + " " + color.fullName,
                    colorShort: color.shortName,
                    colorFull: color.fullName,
                    numberShort: number.shortName,
                    numberFull: number.fullName
                });
            });
        });
        return allCards;


    };

});