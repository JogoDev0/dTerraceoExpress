const router = require('express').Router();
const { getAll, getByName, getById, getBarrios, getByBarrio, getByCalle } = require('../../models/terraza');
const utm = require('utm');
const geo = require('node-geo-distance');
const CERCA_DE_MI = 250;

router.post('/', async (req, res) => {
    try {
        const posicionActual = req.body;
        console.log(posicionActual);
        const rows = await getAll();
        for (const row of rows) {
            // Se transforman coordenadas y se añade streetview
            addStreetView(row);
            // Se añade distancia
            row.distancia = calcularDistancia(posicionActual, row);
        }
        // Se filtra el resultado para que aparezcan solo las terrazas en un radio menor al valor de la constante CERCA_DE_MI
        result = rows.filter(row => row.distancia <= CERCA_DE_MI);
        // Se ordena el resultado por distancia
        result.sort(ordenarResultado('distancia'));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.get('/barrios', async (req, res) => {
    try {
        const rows = await getBarrios();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.get('/name/:terrazaName', async (req, res) => {
    try {
        const rows = await getByName(req.params.terrazaName);

        if (rows) {
            for (const row of rows) {
                // Puede haber más de una terraza con el mismo nombre, así que se añade un nuevo campo a mostrar en el buscador antes de enviar la respuesta, con el nombre de la terraza y el nombre de la calle:
                row.mostrarEnBusqueda = `${row.rotulo} - ${row.desc_nombre}`;
            }
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/id/:terrazaId', async (req, res) => {
    try {
        const row = await getById(req.params.terrazaId);

        if (row) {
            addStreetView(row);
            res.json(row);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/barrio/:terrazaBarrio', async (req, res) => {
    try {
        const rows = await getByBarrio(req.params.terrazaBarrio);
        const posicionActual = req.body;
        if (rows) {
            for (const row of rows) {
                addStreetView(row);
                row.distancia = calcularDistancia(posicionActual, row);
            }
            rows.sort(ordenarResultado('distancia'));
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/calle/:terrazaCalle', async (req, res) => {
    try {
        const rows = await getByCalle(req.params.terrazaCalle);
        const posicionActual = req.body;
        if (rows) {
            for (const row of rows) {
                addStreetView(row);
                row.distancia = calcularDistancia(posicionActual, row);
            }
            rows.sort(ordenarResultado('desc_nombre'));
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se han encontrado terrazas con ese nombre' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// HELPERS

// Método para tranformar las coordenadas UTM que tenemos en la BBDD a latitud y longitud, para así poder trabajar con el api de google maps. Posteriormente se agrega a las terrazas su imagen de street view:
const addStreetView = (row) => {
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
};

// Método para calcular la distancia desde la posición actual hasta una terraza:
const calcularDistancia = (posicionActual, row) => {

    if (row.coordenada_x_local !== '0' && row.coordenada_y_local !== '0') {
        posicionTerraza = {
            latitude: row.coordenada_x_local,
            longitude: row.coordenada_y_local
        }
        // const distancia = geo.haversine(posicionActual, posicionTerraza, function (dist) {
        //     return dist;
        // });
        // console.log(posicionActual);
        // console.log(posicionTerraza);
        const distancia = parseInt(geo.haversineSync(posicionActual, posicionTerraza));
        return distancia;
    }
};

// Método para ordenar los valores del resultado
function ordenarResultado(key, orden = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparacion = 0;
        if (varA > varB) {
            comparacion = 1;
        } else if (varA < varB) {
            comparacion = -1;
        }
        return (
            (orden === 'desc') ? (comparacion * -1) : comparacion
        );
    };
}

module.exports = router;