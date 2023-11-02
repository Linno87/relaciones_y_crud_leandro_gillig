const express = require('express');
const router = express.Router();
const {list, detail, add} = require('../controllers/actorsController');

router.get('/actors', list)
    .get('/actors/detail/:id', detail)
    .get('/actors/add', add)



module.exports = router;