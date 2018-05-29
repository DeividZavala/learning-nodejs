const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.addReview = async (req,res) => {
    req.body.author = req.user._id;
    req.body.store = req.params.id;
    Review.create(req.body)
        .then(()=>{
            req.flash('success', 'Review Saved!');
            res.redirect('back');
        })
};