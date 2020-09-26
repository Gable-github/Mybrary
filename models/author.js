const mongoose = require('mongoose');
const Book = require('./book')

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, book) => {
        // if err Book.find-ing
        if (err) {
            // next(err) passes the code on to the next function after the remove function
            next(err)
        } else if (book.length > 0) {
            next(new Error('This author has books still'))
        } else {
            // next with no parameter declared will execute the remove function (the function appending the ".pre(" ).
            next()
        }
    })
})

module.exports = mongoose.model('Author', authorSchema);