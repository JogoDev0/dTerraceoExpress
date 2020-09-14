const router = require('express').Router();
const { getAll, getByName, getById, getBarrios, getByBarrio, getByCalle } = require('../../models/terraza');
const utm = require('utm');
const geo = require('node-geo-distance');
const CERCA_DE_MI = 250;
const axios = require('axios');

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

router.post('/id/:terrazaId', async (req, res) => {
    try {
        const row = await getById(req.params.terrazaId);
        const posicionActual = req.body;
        if (row) {
            addStreetView(row);
            row.distancia = calcularDistancia(posicionActual, row);
            row.googlePlacesData = await getGooglePlacesData(row);
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

        row.streetView = `https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${cords.latitude},${cords.longitude}&fov=90&source=outdoor&pitch=0&key=${process.env.GOOGLE_API_KEY}`;
    }
    else {
        row.streetView = '../../assets/no-imagen.jpg';
    }
};

// Método para obtener información de una terraza desde la api de google places.
const getGooglePlacesData = async (row) => {
    const placeId = await getPlaceId(row);
    if (placeId) {
        const urlGooelPlaces = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,adr_address,business_status,rating,formatted_phone_number,photos&key=${process.env.GOOGLE_API_KEY}`;
        const { data } = await axios.get(urlGooelPlaces);

        const tlf = data.result.formatted_phone_number;
        const fotos = data.result.photos;
        const arrImg = [];
        const googlePlacesdata = {};

        if (tlf) {
            console.log('TLF:', tlf);
            googlePlacesdata.telefono = tlf;
        }
        if (fotos) {
            for (const foto of fotos) {
                const img = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${foto.photo_reference}&key=${process.env.GOOGLE_API_KEY}`;
                arrImg.push(img);
            }
            console.log('FOTOS:', arrImg);
            googlePlacesdata.imagenes = arrImg;
        }
        return googlePlacesdata;
    } else {
        return '';
    }

};

// Método para obtener el place_id de un sitio, que es necesario para atacar el api de google places.
const getPlaceId = async (row) => {
    const direccion = `${getCleanedString(row.rotulo.trim())},${getCleanedString(row.desc_clase.trim())} ${getCleanedString(row.desc_nombre.trim())}`;
    console.log('direccion: ', direccion);
    const urlPlaceId = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${direccion}&inputtype=textquery&fields=place_id&key=${process.env.GOOGLE_API_KEY}`;
    const { data } = await axios.get(urlPlaceId);
    const placeId = data.candidates[0].place_id;
    if (placeId) {
        console.log('PLACEID: ', placeId);
        return placeId;
    } else {
        return null;
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

// Método para limpiar una cadena de texto de caracteres que nos pueden afectar al formar una url para atacar al api de Google Places
function getCleanedString(cadena) {

    cadena = cadena.toLowerCase();
    if (cadena.includes(',')) {
        cadena = cadena.replace(/\,/gi, "");
        cadena = cadena.replace(/\ /gi, "");
    }
    // if (espacios === "sinEspacios") {
    //     cadena = cadena.replace(/\ /gi, "");
    // }
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ä/gi, "a");
    cadena = cadena.replace(/ë/gi, "e");
    cadena = cadena.replace(/ï/gi, "i");
    cadena = cadena.replace(/ö/gi, "o");
    cadena = cadena.replace(/ü/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");
    cadena = cadena.replace(/\./gi, "");
    cadena = cadena.replace(/\'/gi, "");
    cadena = cadena.replace(/\´/gi, "");

    return cadena;
}

module.exports = router;

