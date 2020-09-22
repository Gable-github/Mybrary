const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.get('/', async (req, res) => {
    // declare books as a variable in the parent function first so that we can reference it later in the res.render
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', {
        books: books
    });
});

module.exports = router;
