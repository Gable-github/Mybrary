const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.get('/', async (req, res) => {
    let books
    let displayText
    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
        if (books = []) {
            displayText = "No recently added titles!"
        }
    } catch {
        books = []
        displayText = "Something went wrong loading recent titles 🤔"
    }
    res.render('index', { books: books, displayText: displayText })
});

module.exports = router;
