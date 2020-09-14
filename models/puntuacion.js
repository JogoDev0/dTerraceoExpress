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

module.exports = {
    getByUserId,
    getByTerrazaId
}