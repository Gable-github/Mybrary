const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        required: true,
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

// virtual as we want to be able to use book.coverImagePath but we dont actually want to store that in the database as a proprty
// when we call book.coverImagePath, it goes to get and the function within get()
// get() tells book.coverImagePath to execute the function within
bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage && this.coverImageType) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Books', bookSchema)