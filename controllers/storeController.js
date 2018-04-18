const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Agregar Store'})
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash("success", `Se guardo con éxito ${store.name}`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req,res) => {
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores})
};

exports.editStore = async (req, res) => {
    // 1.- Obtener el store dado el ID
  const store = await Store.findOne({_id : req.params.id});
  // 2.- Checar si eres dueño del store TODO
  res.render('editStore', {title: `Editando ${store.name}`, store});
};

exports.updateStore = async (req, res) => {
  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body,{
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `<strong>${store.name}</strong> editado con éxito, <a href="/stores/${store.slug}">Ver Store →</a>`);
  res.redirect(`/store/${store._id}/edit`);
};