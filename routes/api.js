const router = require('express').Router();

const apiTerrazasRouter = require('./api/terrazas');
const apiUsuariosRouter = require('./api/usuarios');

router.use('/terrazas', apiTerrazasRouter);
router.use('/usuarios', apiUsuariosRouter);


module.exports = router;