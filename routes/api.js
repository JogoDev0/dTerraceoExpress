const router = require('express').Router();

const apiTerrazasRouter = require('./api/terrazas')
router.use('/terrazas', apiTerrazasRouter);


module.exports = router;