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