const pg = require('pg')

const pool = new pg.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'to-do-list',
    password: '{Arofmanarofman1',
    port: 5432,
});

module.exports = {
    query: function(text, values, cb) {
        pool.connect(function(err, client, done) {
            client.query(text, values, function(err, result) {
                done();
                cb(err, result);
            })
        });
    },
    pool: pool
}