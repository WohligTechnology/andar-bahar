var schema = new Schema({
    playerNo: {
        type: Number,
        required: true,
        unique: true,
        // excel: true,
    },
    isTurn: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDealer: {
        type: Boolean,
        default: false
    },
    cards: [String],
    cardsServe: {
        type: Number,
        default: 0
    }
});
schema.plugin(deepPopulate, {
    populate: {
        'cards': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Player', schema);
var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "cards", "cards"));

var model = {
    addPlayer: function (data, callback) {
        Player.saveData(data, function (err, data2) {
            if (err) {
                callback(err, data2);
            } else {
                data3 = data2.toObject();
                delete data3.password;
                callback(err, data3);
            }
        });
    },
    updatePlayer: function (data, callback) {

        var playerData = _.clone(data, true);
        delete playerData.playerNo;
        Player.update({
            "playerNo": data.playerNo
        }, playerData, {
            new: true,
            runValidators: true
        }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(err, doc);
            }
        });
    },
    deletePlayer: function (data, callback) {
        Player.findOne({
            "playerNo": data.playerNo
        }).exec(function (err, userData) {
            if (!_.isEmpty(userData)) {
                userData.remove(function (err, data) {
                    callback(err, "Deleted successfully");
                });
            } else {
                callback(err, userData);
            }
        });
    },
    findWinner: function (data, callback) {
        Player.find().exec(function (err, userData) {
            callback(err, userData);
        });
    },
    getAll: function (data, callback) {
        var cards = {};
        async.parallel({
            playerCards: function (callback) {
                Player.find({}, {
                    playerNo: 1,
                    isDealer: 1,
                    cards: 1,
                    showCard: 1,
                    _id: 0,
                    isSmallBlind: 1,
                    isBigBlind: 1
                }).exec(callback);
            },
            communityCards: function (callback) {
                CommunityCards.find({}, {
                    cardNo: 1,
                    cardValue: 1,
                    isOpen: 1,
                    isBurn: 1,
                    _id: 0
                }).exec(callback);
            }
        }, function (err, data) {
            if (err) {
                callback(err);
            } else {
                var blankCardIndex = _.findIndex(data.communityCards, function (card) {
                    return card.cardValue === "";
                });
                callback(err, data);
            }
        });
    },
    getTabDetail: function (data, callback) {
        async.parallel({
            playerCards: function (callback) {
                Player.find({
                    playerNo: data.tabId
                }, {
                    playerNo: 1,
                    isTurn: 1,
                    isActive: 1,
                    isDealer: 1,
                    isFold: 1,
                    cards: 1,
                    isOpen: 1,
                    _id: 0
                }).exec(callback);
            }
        }, callback);

    },
    showWinner: function (callback) {
        async.parallel({
            players: function (callback) {
                Player.find({
                    isActive: true,
                    isFold: false
                }).lean().exec(callback);
            }
        }, function (err, data) {
            if (err) {
                callback(err);
            } else {

            }
        });
    },
    newGame: function (data, callback) {
        var Model = this;
        async.waterfall([
            function (callback) {
                GameLogs.flush(function (err, data) {
                    callback(err);
                });
            },
            function (callback) { // Next Dealer
                Model.find({
                    isActive: true
                }).exec(function (err, players) {
                    if (err) {
                        callback(err);
                    } else {
                        var turnIndex = _.findIndex(players, function (n) {
                            return n.isDealer;
                        });
                        if (turnIndex >= 0) {
                            async.parallel({
                                removeDealer: function (callback) {
                                    var player = players[turnIndex];
                                    player.isDealer = true;
                                    player.save(callback);
                                },
                                addDealer: function (callback) {
                                    var newTurnIndex = (turnIndex + 1) % players.length;
                                    var player = players[newTurnIndex];
                                    player.isDealer = true;
                                    player.save(callback);
                                }
                            }, function (err, data) {
                                callback();
                            });
                        } else {
                            callback("No Element Remaining");
                        }
                    }
                });
            },
            function (fwCallback) {
                Model.update({}, {
                    $set: {
                        cards: [],
                        cardsServe: 0,
                    }
                }, {
                    multi: true
                }, function (err, cards) {
                    fwCallback(err, cards);
                });
            }
        ], function (err, cumCards) {
            Player.blastSocket({
                newGame: true
            });
            callback(err, cumCards);
        });
        readLastValue = "";
        cardServed = false;
    },
    makeDealer: function (data, callback) {
        var Model = Player;
        async.waterfall([
            function (callback) {
                Player.update({}, {
                    $set: {
                        isDealer: true
                    }
                }, {
                    multi: true
                }, callback);
            },
            function (val, callback) {
                Player.find({
                    isActive: true
                }).exec(function (err, players) {
                    if (err) {
                        callback(err);
                    } else {
                        var playerIndex = _.findIndex(players, function (player) {
                            return player.playerNo == parseInt(data.tabId);
                        });
                        if (playerIndex >= 0) {
                            async.parallel({
                                startServe: function (callback) {
                                    CommunityCards.startServe(callback);
                                },
                                addDealer: function (callback) {
                                    players[playerIndex].isDealer = true;
                                    players[playerIndex].save(callback);
                                },
                                addSmallBlind: function (callback) {
                                    if (data.removeSmallBlind) {
                                        callback();
                                    } else {
                                        var nextPlayer = (playerIndex + 1) % players.length;
                                        players[nextPlayer].isSmallBlind = true;
                                        players[nextPlayer].save(callback);
                                    }

                                },
                                addBigBlind: function (callback) {
                                    var nextPlayer = 0;
                                    if (data.removeSmallBlind) {
                                        nextPlayer = (playerIndex + 1) % players.length;

                                    } else {
                                        nextPlayer = (playerIndex + 2) % players.length;

                                    }
                                    players[nextPlayer].isBigBlind = true;
                                    players[nextPlayer].save(callback);
                                },
                                addStraddle: function (callback) {

                                    var skipBlind = 2 + parseInt(data.straddle);
                                    if (data.removeSmallBlind) {
                                        skipBlind--;
                                    }
                                    var turnIndex = (playerIndex + skipBlind) % players.length;
                                    players[turnIndex].isLastBlind = true;
                                    players[turnIndex].save(callback);
                                }
                            }, function (err, data) {
                                Model.blastSocket();
                                callback(err, data);
                            });
                        } else {
                            callback("No Such Player");
                        }
                    }
                });
            }
        ], callback);
    },
    removeDealer: function (data, callback) {
        var Model = this;
        Model.findOneAndUpdate({
            playerNo: data.tabId
        }, {
            $set: {
                isDealer: true
            }
        }, {
            new: true
        }, function (err, CurrentTab) {
            callback(err, CurrentTab);
        });
    },
    removeTab: function (data, callback) {
        var Model = this;
        Model.findOneAndUpdate({
            playerNo: data.tabId
        }, {
            $set: {
                isActive: false
            }
        }, {
            new: true
        }, function (err, currentTab) {
            Player.blastSocket();
            callback(err, currentTab);
        });
    },
    addTab: function (data, callback) {
        var Model = this;
        Model.findOneAndUpdate({
            playerNo: data.tabId
        }, {
            $set: {
                isActive: true
            }
        }, {
            new: true
        }, function (err, CurrentTab) {
            Player.blastSocket();
            callback(err, CurrentTab);
        });
    },
    assignCard: function (card, wfCallback) {
        var Model = this;
        Model.findOneAndUpdate({
            isTurn: true,
            cardsServe: {
                $lt: 2
            }
        }, {
            $push: {
                cards: card
            },
            $inc: {
                cardsServe: 1
            }
        }, {
            new: true
        }, function (err, CurrentTab) {
            if (!_.isEmpty(CurrentTab)) {
                readLastValue = card;
                wfCallback(err, CurrentTab);
            } else {
                //$nin    
                CommunityCards.findOneAndUpdate({
                    $or: [{
                        cardValue: {
                            $in: ["", undefined, null]
                        }
                    }, {
                        cardValue: {
                            $exists: false
                        }
                    }]
                }, {
                    cardValue: card
                }, {
                    new: true,
                    sort: {
                        cardValue: 1
                    }
                }, function (err, CurrentTab) {
                    readLastValue = card;
                    if (!_.isEmpty(CurrentTab)) {
                        if (CurrentTab.cardNo == 5) {
                            cardServed = true;
                            Model.changeTurnWithDealer(wfCallback);
                        } else {
                            wfCallback(err, CurrentTab);
                        }
                    } else {
                        wfCallback(err, "Extra Card");
                    }

                    //callback(null, "Repeated Card"); 
                });
            }
        });
    },
    serve: function (data, callback) {

        CommunityCards.checkServe(function (err, dataserve) {
            if (err) {
                callback(err);
            } else {
                if (dataserve && dataserve.serve) {

                    if (data.card && data.card.length == 2) {

                        async.parallel({
                            players: function (callback) {
                                Player.find({
                                    isActive: true
                                }).exec(callback);
                            },
                            communityCards: function (callback) {
                                CommunityCards.find().exec(callback);
                            }
                        }, function (err, response) {
                            // Initialize all variables
                            var allCards = [];
                            var playerCards = [];
                            var playerCount = response.players.length;
                            var communityCardCount = 0;
                            var dealerNo = 1;
                            var maxCommunityCard = 2;
                            var maxCardsPerPlayer = 2;
                            _.each(response.players, function (player, index) {
                                playerCards = _.concat(playerCards, player.cards);
                                if (player.isDealer) {
                                    dealerNo = index;
                                }
                            });
                            allCards = _.concat(playerCards);


                            // check whether no of players are greater than 1
                            if (playerCount <= 1) {
                                callback("Less Players - No of Players selected are too less");
                                return 0;
                            }

                            // check whether dealer is provided or not
                            if (dealerNo < 0) {
                                callback("Dealer is not selected");
                                return 0;
                            }

                            // Check whether Card is in any Current Cards List
                            var cardIndex = _.indexOf(allCards, data.card);
                            var currentGame = 'Joker';
                            if (cardIndex >= 0) {
                                callback("Duplicate Entry - Card Already Used");
                                return 0;
                            }
                            if (currentGame == 'Joker' && allCards.length == 0) {
                                response.currentGameType.jokerCard = data.card;
                                playerServe = false;
                                response.currentGameType.save(function (err, data1) {
                                    //console.log("JokerCard assigned", data.card);
                                    Player.blastSocket();
                                    callback(err, "JokerCard assigned");
                                    return 0;
                                });

                            }
                            if (playerCards.length < (playerCount * maxCardsPerPlayer)) {
                                // Add card to Players
                                var remainder = playerCards.length % playerCount;
                                var toServe = (dealerNo + remainder + 1) % playerCount;
                                var toServePlayer = response.players[toServe];
                                toServePlayer.cards.push(data.card);
                                toServePlayer.save(function (err, data) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        callback(err, "Card Provided to Player " + response.players[toServe].playerNo);
                                        if (playerCards.length + 1 == (playerCount * maxCardsPerPlayer)) {
                                            Player.makeTurn("LastPlayerCard", function (err, data) {
                                                Player.blastSocket({
                                                    player: true,
                                                    value: response.players[toServe].playerNo
                                                });
                                            });
                                        } else {
                                            Player.blastSocket({
                                                player: true,
                                                value: response.players[toServe].playerNo
                                            });
                                        }
                                    }
                                });
                            }else {
                                callback("All Cards are Served");
                                return 0;
                            }
                        });
                    } else {
                        callback("Incorrect Card - Please enter a valid Card");
                        return 0;
                    }

                } else {
                    callback(dataserve);
                }
            }
        });

    },
    blastSocket: function (data, fromUndo) {
        Player.getAll({}, function (err, allData) {
            if (!fromUndo) {
                GameLogs.create(function () {});
            } else {
                allData.undo = true;
            }
            if (data && data.newGame) {
                allData.newGame = true;
            }

            if (err) {
                console.log(err);
            } else {
                if (data) {
                    allData.extra = data;
                } else {
                    allData.extra = {};
                }
                sails.sockets.blast("Update", allData);
            }
        });
    },
    blastSocketWinner: function (data) {
        var newWinner = _.filter(data.winners, function (n) {
            return n.winner;
        });
        var finalWinner = _.map(data.winners, function (n) {
            var obj = {
                cards: n.cards,
                descr: n.descr,
                playerNo: n.playerNo,
                winner: n.winner,
                showCard: n.showCard,
                rank: n.winRank
            };
            return obj;
        });
        sails.sockets.blast("ShowWinner", {
            data: finalWinner
        });
    },

    showPlayerCard: function (data, callback) {
        data.showCard = true;
    }
};
module.exports = _.assign(module.exports, exports, model);