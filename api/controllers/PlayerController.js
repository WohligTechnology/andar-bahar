module.exports = _.cloneDeep(require("sails-wohlig-controller"));

var controller = {
    addPlayer: function (req, res) {
        Player.addPlayer(req.body, res.callback);
    },
    updatePlayer: function (req, res) {
        Player.updatePlayer(req.body, res.callback);
    },
    deletePlayer: function (req, res) {
        Player.deletePlayer(req.body, res.callback);
    },
    getPlayers: function (req, res) {
        Player.getPlayers(res.callback);
    },
    findWinner: function (req, res) {
        Player.findWinner(req.body, res.callback);
    },
    newGame: function (req, res) {
        Player.newGame(req.body, res.callback);
        // var license = getmid({
        //     original: true,
        // });
        // red(license);
        // Config.findOne({
        //     "name": "Licenses",
        //     value: license
        // }).exec(function (err, data) {
        //     if (err || _.isEmpty(data)) {
        //         red("License Invalid");
        //         sails.lower();
        //     } else {
        //         // green("License Verified");
        //     }
        // });

    },
    serve: function (req, res) {
        Player.serve(req.body, res.callback);
    },
    randomServe: function (req, res) {
        if (envType != "production") {
            Player.serve(req.body, res.callback);
        } else {
            res.callback();
        }
    },
    revealCards: function (req, res) {
        Player.revealCards(req.body, res.callback);
    },
    showWinner: function (req, res) {
        Player.showWinner(res.callback);
    },
    getTabDetail: function (req, res) {
        Player.getTabDetail(req.body, res.callback);
    },
    getAll: function (req, res) {
        Player.getAll(req.body, res.callback);
    },
    // moveTurn: function (req, res) {
    //     Player.changeTurn(res.callback);
    // },

    showPlayerCard: function (req, res) {
        Player.showPlayerCard(req.body, res.callback);
    }
    //getTabDetail
};

module.exports = _.assign(module.exports, controller);