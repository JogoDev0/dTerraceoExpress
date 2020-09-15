const router = require('express').Router();
const { getByUserId, getByTerrazaId } = require('../../models/puntuacion');

// Conseguir terraza y puntuación por id de usuario
router.get('/usuario/:idUsuario', async (req, res) => {
    try {
        const rows = await getByUserId(req.params.idUsuario);
        if (rows.length !== 0) {
            res.json(rows)
        } else {
            res.status(400).json({ ERROR: 'Este usuario no ha puntuado ninguna terraza' })
        }
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

// Conseguir usuario y puntuación por id de terraza
router.get('/terraza/:idUsuario', async (req, res) => {
    try {
        const rows = await getByTerrazaId(req.params.idUsuario);
        if (rows.length !== 0) {
            res.json(rows)
        } else {
            res.status(400).json({ ERROR: 'Esta terraza no ha sido puntuada por ningún usuario' })
        }
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});


module.exports = router;