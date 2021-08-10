// Require the mongoose module
var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Pease enter your name.",
        trim: true,
        // unique: "The title must be unique.",
    },
    email: {
        type: String,
        required: "email is required.",
        trim: true,
        // validate: {
        //   validator: function (v) {
        //     return v.length > 10;
        //   },
        //   message: (props) => `${props.value} is body is too short.`,
        // },
    },
    comment: {
        type: String,
        required: "Please enter your comment",
        trim: true,
    },
    //   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // more fields defined below
});

contactSchema.plugin(uniqueValidator);

module.exports.Contact = mongoose.model("ContactUs", contactSchema);


