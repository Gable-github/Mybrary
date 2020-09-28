const express = require('express')
const router = express.Router()
const Book = require('../models/book.js')
const Author = require('../models/author.js')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

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

// Book show page
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', {
            book: book
        })
    } catch {
        res.redirect('/')
    }
})

// Edit book details
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
            res.redirect('/')
    }

})

router.post('/', async (req, res) => {
    // If no file is present, fileName = null.
    // If file is present, fileName = req.file.filename = randomly generated filename
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        // new Date(X) converts X from string into date format.
        // X is string because we made it a string with toISOString in order to split()
        // hence we need to change it back to a date format, which is what our model is expecting (publishdate: { type: Date })
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
    })
    // for uploading file into book model
    saveCover(book, req.body.cover)
    
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch {
        renderNewPage(res, book, true)
    }
})

// Update Book route
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        // check if any cover is inputed so that we dont delete the old cover and save an empty cover
        if (req.body.cover) {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if (!book) {
            renderEditPage(res, book, 'edit', true)
        } else {
            res.redirect('/')
        }
    }
})

// Delete book route
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (!book) {
            res.render('book/show', {
                book: book,
                errorMessage: 'Could not delete book!'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        params =  {
            book: book,
            authors: authors
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = "Error updating book!"
            } else {
                params.errorMessage = "Error creating new book!"
            }
        }
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('/');
    }
}

// function to check if encoded data is present and then to save it
function saveCover(book, coverEncoded) {
    // if null then end process
    if (!coverEncoded) return
    // unencode the cover by changing it from a string to a JSON object
    const cover = JSON.parse(coverEncoded)
    // check if cover const is parsed correctly
    if (cover && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router