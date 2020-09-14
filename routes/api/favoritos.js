const router = require('express').Router();
const { getByUserId, create, remove } = require('../../models/favorito');

router.get('/:idUsuario', async (req, res) => {
    try {
        const rows = await getByUserId(req.params.idUsuario);
        console.log(req.params.idUsuario);

        if (rows) {
            res.json(rows);
        } else {
            res.status(400).json({ ERROR: 'No se han encontrado favoritos para ese perfil de usuario' });
        }

    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        await create(req.body.idUsuario, req.body.idTerraza);
        res.json({ SUCCESS: 'Favorito dado de alta correctamente' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        await remove(req.body.idUsuario, req.body.idTerraza);
        res.json({ SUCCESS: 'Favorito dado de baja correctamente' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


module.exports = router;