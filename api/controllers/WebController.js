module.exports = {
    index: function (req, res) {
        res.metaView();
    },
    download: function (req, res) {
        Config.readUploaded(req.param("filename"), null, null, null, res);
    },
    backend: function (req, res) {
        var env = require("../../config/env/" + sails.config.environment + ".js");
        res.view("production/backend", {
            jsFiles: jsFilesBackend,
            title: "Backend",
            description: "Backend",
            keywords: "Backend",
            adminurl: env.realHost + "/api/",
        });
    },
    gitPull: function (req, res) {
        function gitPull() {
            exec('git pull', function (error, stdout, stderr) {
                if (error) {
                    return;
                }
                res.callback(error, {
                    stdout: stdout,
                    stderr: stderr
                });
            });
        }

        function decryptData(text) {
            if (text) {
                if (moment.unix(text).isBetween(moment().add(-1, "minute"), moment().add(1, "minute"))) {
                    gitPull();
                } else {
                    res.notFound();
                }
            } else {
                res.notFound();
            }
        }
        if (req.params && req.params.data) {
            decryptData(req.params.data);
        } else {
            res.notFound();
        }
    },
    demo: function (req, res) {
        sails.renderView('email/welcome', {
            name: "Tushar",
            lastname: "Sachde",
            hobbies: ["cricket", "name", "email", "phone"]
        }, function (err, view) {
            res.send(view);
        });
    },
    orderReturn: function (req, res) {
        async.waterfall([
            function (callback) { // order has to be refunded back
                async.parallel({
                    removeOrderFromUser: Order.removeOrder(req.body.order._id, callback),
                    addUserBalance: User.addBalance(req.body.order.amount)
                }, callback);
            },
            function (callback) { // product quanity has to be added
                Product.modifyQuantity(req.body.order.product._id, req.body.order.product.quantity);
            }
        ], callback);
    }
};