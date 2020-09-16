const router = require('express').Router();

const apiTerrazasRouter = require('./api/terrazas');
const apiUsuariosRouter = require('./api/usuarios');
const apiFavoritosRouter = require('./api/favoritos');
const apiPuntuaciones = require('./api/puntuaciones');
const apiComentariosRouter = require('./api/comentarios');

router.use('/terrazas', apiTerrazasRouter);
router.use('/usuarios', apiUsuariosRouter);
router.use('/favoritos', apiFavoritosRouter);
router.use('/puntuaciones', apiPuntuaciones);
router.use('/comentarios', apiComentariosRouter);

module.exports = router;