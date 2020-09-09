const create = ({ username, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (username, email, password) values (?,?,?)', [username, email, password], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const getByEmail = (pEmail) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE email = ?', [pEmail], (err, rows) => {
            if (err) return reject(err);
            if (rows.length !== 1) resolve(null);
            resolve(rows[0]);
        });
    });
};

const getById = (pUsuarioId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [pUsuarioId], (err, rows) => {
            if (err) return reject(err);
            if (rows.length !== 1) resolve(null);
            resolve(rows[0]);
        });
    });
};

module.exports = { create, getByEmail, getById }