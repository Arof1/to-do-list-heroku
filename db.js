const pg = require('pg')

const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:{Arofmanarofman1@localhost:5432/to-do-list'/*process.env.DATABASE_URL*/,
});

module.exports = {
    query: function(text, values, cb) {
        pool.connect(function(err, client, done) {
            if (err) {
                return;
            }
            client.query(text, values, function(err, result) {
                done();
                cb(err, result);
            })
        });
    },
    pool: pool
}