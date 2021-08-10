// Require the mongoose module
var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const db = mongoose.connection;
/// To log the Mongoose erros to the console directly
db.on("error", console.error.bind(console, "connection error:"));

const registerSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: "First Name is required.",
        trim: true,
    },

    lname: {
        type: String,
        required: "Last Name is required.",
        trim: true,
    },
    username: {
        type: String,
        required: "Username is required.",
        trim: true,
        unique: "The username must be unique.",
        lowercase: true,
    },
    email: {
        type: String,
        required: "Email is required.",
        trim: true,
        validate: {
            validator: function (v) {
                return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(v);
            },
            message: (props) => `${props.value} is not a valid Email address.`,
        },

    },
    password: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{6,}$/.test(
                    v
                );
            },
            message: (props) =>
                `Password should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 6 characters.`,
        },

    },
    //   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address1: {
        type: String,
        trim: true,
    },

    address2: {
        type: String,
        trim: true,
    },

    zcode: {
        type: String,
        required: "Please enter a valid post code.",
        trim: true,
    },

    newsletter: {
        type: String,
        trim: true,
    },

    role: {
        type: String,
        trim: true,
        default: "customer"
    },
    customerId: { type: Number, ref: "Customer", default: null },
    agentId: { type: Number, ref: "Agent", default: null },
});

registerSchema.virtual("registerDetails").get(async function () {
    if (this.role === "customer") {
        return await Customer.findById(this.customerId);
    } else {
        return await Agent.findById(this.agentId);
    }
});


registerSchema.plugin(uniqueValidator);
module.exports.Register = mongoose.model("Registered_User", registerSchema);
