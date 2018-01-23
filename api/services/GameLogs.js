var schema = new Schema({
    players: Schema.Types.Mixed,
    cards: Schema.Types.Mixed
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('GameLogs', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    create: function (callback) {
        var gameObject = GameLogs();
        async.parallel({
            players: function () {
                Player.find({}).lean().exec(function (err, data) {
                    gameObject.players = data;
                    gameObject.save(callback);
                });
            },
            cards: function () {
                CommunityCards.find({}).lean().exec(function (err, data) {
                    gameObject.cards = data;
                    gameObject.save(callback);
                });
            }
        }, callback);
    },
    undo: function (callback) {
        async.waterfall([
            function (callback) { // Remove last 
                GameLogs.findOne({}).sort({
                    _id: -1
                }).exec(function (err, data) {
                    if (!_.isEmpty(data)) {
                        data.remove(callback);
                    } else {
                        callback("No Undo Data Found");
                    }
                });
            },
            function (data, callback) { // Open Last Now
                GameLogs.findOne({}).sort({
                    _id: -1
                }).lean().exec(function (err, data) {
                    if (err) {
                        callback(err);
                    } else if (_.isEmpty(data)) {
                        callback("Undo Not Possible");
                    } else {
                        async.parallel({
                            players: function (callback) {
                                async.concat(data.players, function (player, callback) {
                                    Player.findOne({
                                        _id: player._id
                                    }).exec(function (err, playerObj) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            delete player._id;
                                            delete player.__v;
                                            playerObj = _.assign(playerObj, player);
                                            playerObj.save(callback);
                                        }
                                    });
                                }, callback);
                            },
                            cards: function (callback) {
                                async.concat(data.cards, function (card, callback) {
                                    CommunityCards.findOne({
                                        _id: card._id
                                    }).exec(function (err, commuCardObj) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            delete card._id;
                                            delete card.__v;
                                            commuCardObj = _.assign(commuCardObj, card);
                                            commuCardObj.save(callback);
                                        }
                                    });
                                }, callback);
                            }
                        }, callback);

                    }
                });
            }
        ], function (err, data) {
            if (err) {
                callback(err);
            } else {
                Player.blastSocket({}, true);
                callback(err, data);
            }
        });
    },
    flush: function (callback) {
        GameLogs.collection.drop(callback);
    }
};
module.exports = _.assign(module.exports, exports, model);