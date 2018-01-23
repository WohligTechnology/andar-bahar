module.exports.serialport = {};

global.isCallApi = true;
global.currentCardId = "";
global.currentCardValue = "";

function callServe(cardName) {
    if (isCallApi) {
        global.isCallApi = false;
        Player.serve({
            card: cardName
        }, function (err, data) {
            global.isCallApi = true;
            if (err) {
                // red(err);
            } else {
                // green(data);
            }
        });
    } else {
        blue("API in progress");
    }
}


SerialPort.list(function (err, allSerial) {
    if (err) {
        red("Error Finding Serial Port");
    } else {
        var cardReaderSerial = _.find(allSerial, function (n) {
            return (n.manufacturer && n.manufacturer.search("Arduino") >= 0);
        });
        if (cardReaderSerial) {
            var port = new SerialPort(cardReaderSerial.comName, {
                baudRate: 9600
            });

            var string = "";


            port.open(function (err) {
                if (err) {}
            });

            // The open event is always emitted
            port.on('open', function () {
                console.log();
                console.log();
                console.log();
                console.log();
                console.log();
                green("Card Reader Connected");
                console.log();
                console.log();
                console.log();
                console.log();
                console.log();
            });
            port.on('error', function (error) {
                red("Error Opening Port");
                beep(5);
            });
            port.on('close', function () {
                red("Card Reader Disconnected");
                beep(3);
            });

            port.on('data', function (data) {
                string += data.toString("binary");
                var stringArr = _.split(string, "\n");
                if (stringArr.length > 1) {
                    var newCard = _.chain(stringArr).head().split(" ").join("").trim().value();
                    console.log("Card Id :" + newCard);
                    currentCardId = newCard;
                    string = "";
                    Card.getCard(newCard, function (err, data) {
                        if (err) {
                            console.log(err);
                            currentCardValue = data.name;
                        } else if (_.isEmpty(data)) {
                            console.log("No Such Card Found");
                            currentCardValue = "";
                        } else {
                            currentCardValue = data.name;
                            if (data.name.length == 2) {
                                green("Card is : " + data.name);
                                beep();
                                callServe(data.name);
                            } else {
                                beep(5);
                            }
                        }
                    });
                } else {
                    // currentCardId = "";
                }
            });
        } else {
            red("Card Reader Not Connected");
        }
    }
});