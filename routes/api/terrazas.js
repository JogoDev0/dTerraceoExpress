const router = require('express').Router();
const { getAll, getByName, getById, getBarrios, getByBarrio } = require('../../models/terraza');
const utm = require('utm');

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

router.get('/name/:terrazaName', async (req, res) => {
    try {
        const rows = await getByName(req.params.terrazaName);

        if (rows) {
            for (const row of rows) {
                // Puede haber más de una terraza con el mismo nombre, así que se añade un nuevo campo a mostrar en eñ buscador antes de enviar la respuesta, con el nombre de la terraza y el nombre de la calle:
                row.mostrarEnBusqueda = `${row.rotulo} - ${row.desc_nombre}`;
            }
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/id/:terrazaId', async (req, res) => {
    try {
        const row = await getById(req.params.terrazaId);

        if (row) {

            // Vamos a tranformar las coordenadas UTM que tenemos en la BBDD a latitud y longitud, para así poder trabajas con el api de google maps, y agregar a las terrazas su imagen de street view:
            console.log(row.coordenada_x_local);
            if (row.coordenada_x_local !== '0' && row.coordenada_y_local !== '0') {
                row.coordenada_x_local = row.coordenada_x_local.replace(/\,/g, '.');
                row.coordenada_y_local = row.coordenada_y_local.replace(/\,/g, '.');
                const cords = utm.toLatLon(row.coordenada_x_local, row.coordenada_y_local, 30, 'T');
                row.coordenada_x_local = cords.latitude;
                row.coordenada_y_local = cords.longitude;

                row.streetView = `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${cords.latitude},${cords.longitude}&fov=90&source=outdoor&pitch=0&key=${process.env.GOOGLE_API_KEY}`;
            }
            else {
                row.streetView = '../../assets/no-imagen.jpg';
            }
            res.json(row);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/barrio/:terrazaBarrio', async (req, res) => {
    try {
        const rows = await getByBarrio(req.params.terrazaBarrio);

        if (rows) {
            for (const row of rows) {
                // Vamos a tranformar las coordenadas UTM que tenemos en la BBDD a latitud y longitud, para así poder trabajas con el api de google maps, y agregar a las terrazas su imagen de street view:
                if (row.coordenada_x_local !== '0' && row.coordenada_y_local !== '0') {
                    row.coordenada_x_local = row.coordenada_x_local.replace(/\,/g, '.');
                    row.coordenada_y_local = row.coordenada_y_local.replace(/\,/g, '.');
                    const cords = utm.toLatLon(row.coordenada_x_local, row.coordenada_y_local, 30, 'T');
                    row.coordenada_x_local = cords.latitude;
                    row.coordenada_y_local = cords.longitude;

                    row.streetView = `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${cords.latitude},${cords.longitude}&fov=90&source=outdoor&pitch=0&key=${process.env.GOOGLE_API_KEY}`;
                } else {
                    row.streetView = '../../assets/no-imagen.jpg';
                }
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