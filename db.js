const pg = require('pg')

const pool = new pg.Pool({
    connectionString: "postgres://saiequfwlduifr:5e76a30aba2b5488a1ede50b25a93326ed3eaf8deea2d7644ab50e40b8fa00e1@ec2-54-246-87-132.eu-west-1.compute.amazonaws.com:5432/d4l293ulgpuu17",
    ssl: {
        rejectUnauthorized: false
    }
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