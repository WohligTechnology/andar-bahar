var schema = new Schema({
    logs: JSON
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('WinnerLogs', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    findWinnersLogs: function (data, callback) {
        WinnerLogs.find({
            
        }).sort({
            createdAt: -1
        }).limit(50).exec(
            function (err, data) {
                console(data);
                if (err) {
                    callback(err);
                } else {
                    callback(data);
                }
            }
        );
    }

};
module.exports = _.assign(module.exports, exports, model);