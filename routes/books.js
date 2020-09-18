const express = require('express')
const router = express.Router()
const Book = require('../models/book.js')
const Author = require('../models/author.js')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const multer = require('multer')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback
    }
})

router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const books = await Book.find(searchOptions);
        res.render('books/index', { 
            books: books,
            searchOptions: req.query
         });
    } catch {
        res.redirect('/');
    };
});

router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({});
        res.render('books/new', {
            book: new Book(),
            authors: authors
        })
    } catch {
        res.redirect('/');
    }
})

router.post('/', upload.single('cover'), async (req, res) => {
    //setting fileName with conditions
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName
    })
    const authors = await Author.find({})
    try {
        const newBook = await book.save()
        res.redirect(`books`)
    } catch {
        res.render('books/new', {
            authors: authors,
            book: book,
            errorMessage: 'Error creating book!'
        })
    }
})

module.exports = router