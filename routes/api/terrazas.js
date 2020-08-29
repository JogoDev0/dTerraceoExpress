const router = require('express').Router();
const { getAll, getByName, getBarrios } = require('../../models/terraza');

router.get('/', async (req, res) => {
    try {
        const rows = await getAll();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: error.message });
    }

});

router.get('/barrios', async (req, res) => {
    try {
        const rows = await getBarrios();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: error.message });
    }

});

router.get('/:name', async (req, res) => {
    try {
        const rows = await getByName(req.params.name);
        // Puede haber más de una terraza con el mismo nombre, así que se añade un nuevo campo a mostrar en eñ buscador antes de enviar la respuesta, con el nombre de la terraza y el nombre de la calle.
        if (rows) {
            for (const row of rows) {
                row.mostrarEnBusqueda = `${row.rotulo} - ${row.DESC_NOMBRE}`;
            }
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;