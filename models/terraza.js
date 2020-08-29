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

const getById = (pId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM terrazas WHERE id_terraza = ?', [pId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            if (rows.length !== 1) {
                resolve(null);
            }
            resolve(rows[0]);
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

const getByBarrio = (pBarrio) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM terrazas WHERE desc_barrio_local = ?', [pBarrio], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};




module.exports = { getAll, getById, getByName, getBarrios, getByBarrio };