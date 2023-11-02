const express = require('express');
const router = express.Router();
const {list, recomended,detail,add,create,edit,update,destroy} = require('../controllers/moviesController');
const multer = require('../middlewares/upload')

router.get('/movies', list);
/* router.get('/movies/new',new); */
router.get('/movies/recommended', recomended);
router.get('/movies/detail/:id', detail);

//Rutas exigidas para la creación del CRUD
router.get('/movies/add', add);
router.post('/movies/create', multer.single("image"), create);
router.get('/movies/edit/:id', edit);
router.put('/movies/update/:id',multer.single("image"), update);
router.delete('/movies/delete/:id', destroy);

module.exports = router;