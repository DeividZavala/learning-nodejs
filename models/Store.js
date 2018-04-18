const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: 'Por favor agrega un nombre'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type:{
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: "Proporciona coordenadas"
        }],
        address: {
            type: String,
            required: "Debes agregar una dirección"
        }
    }
});

storeSchema.pre('save', function (next) {
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model('Store', storeSchema);