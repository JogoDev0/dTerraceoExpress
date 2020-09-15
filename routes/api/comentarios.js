const router = require('express').Router();
const { getByTerrazaId, getByUserAndTerraza, create, remove, patch } = require('../../models/comentario');

router.get('/:idTerraza', async (req, res) => {
    try {
        const rows = await getByTerrazaId(req.params.idTerraza);
        if (rows) {
            res.json(rows);
        } else {
            res.status(400).json({ NONE: 'No se han encontrado comentarios para esa terraza.' });
        }

    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

router.post('/getAll', async (req, res) => {
    try {
        const rows = await getByUserAndTerraza(req.body.idUsuario, req.body.idTerraza);
        // console.log('rows', rows);
        console.log(rows.length);
        if (rows.length === 0) {
            res.json({ NONE: 'No existen comentarios con esa dupla usuario/terraza.', BOOLEAN: false });
        } else {
            res.json(rows);
        }
    } catch (err) {
        res.status(500).json({ ERROR: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        await create(req.body.idUsuario, req.body.idTerraza, req.body.comentario);
        res.json({ SUCCESS: 'Comentario dado de alta correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/delete', async (req, res) => {
    try {
        await remove(req.body.id_comentario);
        res.json({ SUCCESS: 'Comentario dado de baja correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.patch('/', async (req, res) => {
    try {
        await patch(req.body.comentario, req.body.id_comentario);
        res.json({ SUCCESS: 'Comentario actualizado correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;