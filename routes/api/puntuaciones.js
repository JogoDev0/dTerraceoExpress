const router = require('express').Router();
const { getByUserId, getByTerrazaId, create, update, getByIdUsuarioIdTerraza } = require('../../models/puntuacion');


// Conseguir terraza y puntuación por id de usuario
router.get('/usuario/:idUsuario', async (req, res) => {
    try {
        const rows = await getByUserId(req.params.idUsuario);
        if (rows.length !== 0) {
            res.json(rows)
        } else {
            res.json({ ERROR: 'Este usuario no ha puntuado ninguna terraza' });
        }
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

// Conseguir usuario y puntuación por id de terraza
router.post('/terraza', async (req, res) => {
    try {
        const rows = await getByTerrazaId(req.body.idTerraza);
        if (rows.length !== 0) {
            res.json(rows)
        } else {
            res.json([]);
        }
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

// Crear o actualizar puntuación  de la terraza
router.post('/create', async (req, res) => {
    try {
        const result = await getByIdUsuarioIdTerraza(req.body.idUsuario, req.body.idTerraza);
        if (result.length === 0) {
            await create(req.body.puntuacion, req.body.idUsuario, req.body.idTerraza);
            res.json({ SUCCESS: 'Terraza puntuada correctamente', PUNTUACION: req.body.puntuacion })
        } else {
            await update(req.body.puntuacion, result[0].id_puntuacion);
            res.json({ SUCCESS: 'La puntuación de la terraza se ha actualizado', NUEVA_PUNTUACION: req.body.puntuacion })
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Conseguir puntuación de la terraza por Id Usuario e Id Terraza
router.post('/puntuacion', async (req, res) => {
    const rows = await getByIdUsuarioIdTerraza(req.body.idUsuario, req.body.idTerraza);
    res.json(rows);
});


module.exports = router;