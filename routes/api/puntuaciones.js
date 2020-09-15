const router = require('express').Router();
const { getByUserId, getByTerrazaId, create, remove, update } = require('../../models/puntuacion');

// Conseguir terraza y puntuación por id de usuario
router.get('/usuario/:idUsuario', async (req, res) => {
    try {
        const rows = await getByUserId(req.params.idUsuario);
        if (rows.length !== 0) {
            res.json(rows)
        } else {
            res.status(400).json({ ERROR: 'Este usuario no ha puntuado ninguna terraza' });
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
            res.status(400).json({ ERROR: 'Esta terraza no ha sido puntuada por ningún usuario' });
        }
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

// Poner puntuación a la terraza
router.post('/create', async (req, res) => {
    try {
        await create(req.body.puntuacion, req.body.idUsuario, req.body.idTerraza);
        res.json({ SUCCESS: 'Terraza puntuada correctamente' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Borrar puntuación de la terraza
router.delete('/delete', async (req, res) => {
    try {
        await remove(req.body.idUsuario, req.body.idTerraza);
        res.json({ SUCCESS: 'Puntuación de la terraza borrada correctamente' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Actualizar puntuación de la terraza
router.put('/update', async (req, res) => {
    try {
        const result = await update(req.body);
        if (result['affectedRows'] === 1) {
            res.json({ SUCCESS: 'Se ha actualizado la puntuación', NUEVA_PUNTUACION: req.body.puntuacion });
        } else {
            res.status(422).json({ ERROR: 'No se ha podido actualizar la puntuación, compruebe si el usuario ya ha puntuado' });
        }
    } catch (err) {
        res.status(500).json({ ERROR: error.message });
    }
});


module.exports = router;