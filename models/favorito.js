const getByUserId = (idUsuario) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT fk_terraza FROM favoritos WHERE fk_usuario = ?', [idUsuario], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const getByUserAndTerraza = (idUsuario, idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM favoritos WHERE fk_usuario = ? AND fk_terraza = ?', [idUsuario, idTerraza], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const create = (idUsuario, idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO favoritos (fk_usuario, fk_terraza) VALUES (?,?)', [idUsuario, idTerraza], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const remove = (idUsuario, idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM favoritos WHERE fk_usuario = ? AND fk_terraza = ?', [idUsuario, idTerraza], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = { getByUserId, getByUserAndTerraza, create, remove }