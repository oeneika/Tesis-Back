"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: {
        type: String,
        trim: true,
    },
    surname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    temp_secreto: Object,
    birthday: String,
    country: String,
    image: String,
    hasTwoStepsAuth: {
        type: Boolean,
        trim: false,
        required: false,
    },
    hasSetTwoSteps: {
        type: Boolean,
        trim: false,
        required: false,
    },
    roles: [{ type: Schema.ObjectId, ref: "Role", required: true }],
    user_camera: {
        type: Schema.ObjectId,
        ref: "UserCamera",
    },
    user_room: [{
        type: String,
        required: false,
    }, ],
});

module.exports = mongoose.model("User", UserSchema);