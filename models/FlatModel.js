var mongoose = require("mongoose");

var FlatSchema = new mongoose.Schema({
	address: [{
        houseNumber: {type: Number, required: true},
        streetName: {type: String, required: true},
        locale: {type: String, required: true},
        lga: {type: String, required: true},
        city: {type: String, required: true},
        postCode: {type: String, required: true}
    }],
    flatType: {type: Number, required: true},
    comment: {type: String, required: true},
    price: {type: Number, required: true},
    agentID: {type:String, required: true},
    available: {type: Boolean, required: true, default: 1},
    pix:{type: String}
}, {timestamps: true});

module.exports = mongoose.model("Flat", FlatSchema);