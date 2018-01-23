module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    store: function (req, res) {
        Setting.store(req.body, function (err, data) {
            Player.blastSocket({
                newGame: true
            });
            res.callback(err, data);
        });
    }
};
module.exports = _.assign(module.exports, controller);