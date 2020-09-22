const express = require('express')
const router = express.Router()
const Book = require('../models/book.js')
const Author = require('../models/author.js')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const fs = require('fs')
const multer = require('multer')
const { render } = require('ejs')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        // fileFilter callback takes null and a boolean
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title) {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try {
        const books = await query.exec()
        res.render('books/index', { 
            books: books,
            searchOptions: req.query
         });
    } catch {
        res.redirect('/');
    };
});

router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

router.post('/', upload.single('cover'), async (req, res) => {
    // If no file is present, fileName = null.
    // If file is present, fileName = req.file.filename = randomly generated filename
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        // new Date(X) converts X from string into date format.
        // X is string because we made it a string with toISOString in order to split()
        // hence we need to change it back to a date format, which is what our model is expecting (publishdate: { type: Date })
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName
    })
   
    try {
        const newBook = await book.save()
        res.redirect(`books`)
    } catch {
        if (book.coverImageName) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({});
        params =  {
            book: book,
            authors: authors
        }
        if (hasError) {
            params.errorMessage = "Error creating new book!"
        }
        res.render('books/new', params)
    } catch {
        res.redirect('/');
    }
}

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), 
    err => {
        if (err) {
            console.error(err)
        }
    })
}

module.exports = router