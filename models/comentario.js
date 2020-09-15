const getByUserId = (idUsuario) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM comentarios WHERE fk_usuario = ?', [idUsuario], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const getByUserAndTerraza = (idUsuario, idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM comentarios WHERE fk_usuario = ? AND fk_terraza = ?', [idUsuario, idTerraza], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const create = (idUsuario, idTerraza, comentario) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO comentarios (fk_usuario, fk_terraza, comentario) VALUES (?,?,?)', [idUsuario, idTerraza, comentario], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const remove = (id_comentario) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM comentarios WHERE id_comentario = ?', [id_comentario], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const update = (comentario, id_comentario) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE comentarios SET comentario=? WHERE id_comentario=?', [comentario, id_comentario], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = { getByUserId, getByUserAndTerraza, create, remove, update }