const router = require('express').Router();
const { getByUserId, getByTerrazaId, getByUserAndTerraza, create, remove } = require('../../models/favorito');

router.get('/:idUsuario', async (req, res) => {
    try {
        const rows = await getByUserId(req.params.idUsuario);
        if (rows) {
            res.json(rows);
        } else {
            res.json({ ERROR: 'No se han encontrado favoritos para ese perfil de usuario.' });
        }

    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

router.post('/terraza', async (req, res) => {
    try {
        const rows = await getByTerrazaId(req.body.idTerraza);
        res.json(rows.length);
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

router.post('/getAll', async (req, res) => {
    try {
        const rows = await getByUserAndTerraza(req.body.idUsuario, req.body.idTerraza);

        if (rows.length === 0) {
            res.json({ NONE: 'No existe favorito con esa dupla usuario/terraza.', BOOLEAN: false });
        } else {
            res.json({ EXISTE: 'Ya existe favorito con esa dupla usuario/terraza.', BOOLEAN: true });
        }

    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        await create(req.body.idUsuario, req.body.idTerraza);
        res.json({ SUCCESS: 'Favorito dado de alta correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/delete', async (req, res) => {
    try {
        await remove(req.body.idUsuario, req.body.idTerraza);
        res.json({ SUCCESS: 'Favorito dado de baja correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


module.exports = router;