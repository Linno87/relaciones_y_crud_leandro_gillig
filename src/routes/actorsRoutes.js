const express = require('express');
const router = express.Router();
const {list, detail, add, create, edit, update, destroy} = require('../controllers/actorsController');

router.get('/actors', list)
    .get('/actors/detail/:id', detail)
    .get('/actors/add', add)
    .post('/actors/create',create)
    .get('/actors/edit/:id', edit)
    .put('/actors/update/:id', update)
    .delete('/actors/delete/:id', destroy)

module.exports = router;