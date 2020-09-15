const getByUserId = (idUsuario) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT fk_terraza, puntuacion FROM puntuaciones WHERE fk_usuario = ?', [idUsuario], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

const getByTerrazaId = (idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT fk_usuario, puntuacion FROM puntuaciones WHERE fk_terraza  = ?', [idTerraza], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

const create = (puntuacion, idUsuario, idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO puntuaciones (puntuacion,fk_usuario,fk_terraza) VALUES (?,?,?)', [puntuacion, idUsuario, idTerraza], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const remove = (idUsuario, idTerraza) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM puntuaciones WHERE fk_usuario = ? AND fk_terraza = ?', [idUsuario, idTerraza], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const update = ({ puntuacion, idUsuario, idTerraza }) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE puntuaciones SET puntuacion=? WHERE fk_usuario=? AND fk_terraza=? ', [puntuacion, idUsuario, idTerraza], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}


module.exports = {
    getByUserId,
    getByTerrazaId,
    create,
    remove,
    update
}