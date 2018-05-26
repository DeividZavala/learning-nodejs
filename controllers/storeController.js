const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerConfig = {
  store: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null, true);
    }else{
      next('El tipo de archivo no esta permitido', false);
    }

  }
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Agregar Store'})
};

exports.upload = multer(multerConfig).single('photo');

exports.resize = async (req, res, next) => {
  if(!req.file){
    next();
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  const photo = await jimp.read(req.file.buffer);

  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();

};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save();
  req.flash("success", `Se guardo con éxito ${store.name}`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req,res) => {
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores})
};

const confirmOwner = (store, user) => {
  if(!store.author.equals(user._id)){
    throw Error("Epale morro esta no es tu tienda");
  }
};

exports.editStore = async (req, res) => {
    // 1.- Obtener el store dado el ID
  const store = await Store.findOne({_id : req.params.id});
  // 2.- Checar si eres dueño del store TODO
  confirmOwner(store, req.user);
  res.render('editStore', {title: `Editando ${store.name}`, store});
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body,{
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `<strong>${store.name}</strong> editado con éxito, <a href="/stores/${store.slug}">Ver Store →</a>`);
  res.redirect(`/store/${store._id}/edit`);
};


exports.getStoresBySlug = async (req, res, next) => {
  const store = await Store.findOne({slug:req.params.slug});
  if(!store) return next();
  res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || {$exists:true};
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({tags: tagQuery});

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

    res.render('tag', { tags, title: 'Tags', tag, stores });

};

exports.searchStore = async (req,res) => {
  const stores = await Store.find({
      $text: {
        $search: req.query.q
      }
  },{
      score: {
        $meta: 'textScore'
      }
  })
  .sort({
      score: {$meta: 'textScore'}
  })
  .limit(5);
    res.json(stores);
};

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates
            },
            $maxDistance: 10000
        }
    }
  };

  const stores = await Store.find(q).select("slug name description location");
  res.json(stores);

};

exports.mapPage = (req, res) => {
    res.render("map", {title:"Map"});
};