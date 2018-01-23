var schema = new Schema({
    name: {
        type: String,
    },
    value: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Setting', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    store: function (data, callback) {
        var Model = Setting;
        async.each(data, function (singleSetting, callback) {
            Model.findOne({
                _id: singleSetting._id
            }).exec(function (err, single) {
                if (err) {
                    callback(err);
                } else if (!data) {
                    callback("Id not found in Settings");
                } else {
                    single.value = singleSetting.value;
                    single.save(callback);
                }
            });
        }, callback);
    },
    search: function (data, callback) {
        data = {};
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;




        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };


        var Search = Model.find(data.filter)

            .order(options)
            .keyword(options)
            .page(options, callback);

    }
};
module.exports = _.assign(module.exports, exports, model);