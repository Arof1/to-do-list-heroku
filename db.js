const pg = require('pg')

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
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