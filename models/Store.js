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
    },
    photo: String,
    author: mongoose.Schema.Types.ObjectId
});

storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.index({
    location: "2dsphere"
});

storeSchema.pre('save',  async function (next) {
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);

    const storeRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`);
    const storesWithSlug = await  this.constructor.find({slug:storeRegex});

    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
});

storeSchema.statics.getTagsList = function(){
    return this.aggregate([
        {$unwind: '$tags'},
        {$group: {_id:'$tags', count: {$sum: 1}}},
        {$sort: {count: -1}}
    ])
};

module.exports = mongoose.model('Store', storeSchema);