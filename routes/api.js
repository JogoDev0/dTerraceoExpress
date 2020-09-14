const router = require('express').Router();

const apiTerrazasRouter = require('./api/terrazas');
const apiUsuariosRouter = require('./api/usuarios');
const apiFavoritosRouter = require('./api/favoritos')

router.use('/terrazas', apiTerrazasRouter);
router.use('/usuarios', apiUsuariosRouter);
router.use('/favoritos', apiFavoritosRouter);

module.exports = router;