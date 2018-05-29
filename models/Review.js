const mongoose = require('mongoose');
mongoose.promise = global.Promise;

const ReviewSchema = mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: "Debes mandar un id de tienda"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: "Debes mandar un usuario"
    },
    created: {
        type: Date,
        default: Date.now()
    },
    text: {
        type: String,
        required: "Debes mandar un comentario mijo"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
});

function autopopulate(next){
    this.populate('author');
    next();
}

ReviewSchema.pre("find", autopopulate);
ReviewSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Review", ReviewSchema);