module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
      findWinnersLogs: function (req, res) {
       WinnerLogs.find({}).sort({
            createdAt: -1
        }).limit(50).exec(
            function (err, data) {
                
                if (err) {
                    res.callback(err);
                } else {
                    res.callback(null,data);
                }
            }
        );
    }
};
module.exports = _.assign(module.exports, controller);
