const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM terrazas', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const getByName = (pName) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM terrazas WHERE rotulo LIKE ? ? ?', ['%', pName, '%'], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const getBarrios = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT DISTINCT desc_barrio_local FROM terrazas ORDER BY desc_barrio_local', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};




module.exports = { getAll, getByName, getBarrios };