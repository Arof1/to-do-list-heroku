const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const salt = 10;
const db = require('../db')

router.post('/register', (req, res) => {
    const login = req.body.login.toLowerCase();
    const password = req.body.password;
    const first_name = req.body.first_name;
    const second_name = req.body.second_name;
    const patronymic = req.body.patronymic;
    const manager_id = req.body.manager_id;

    let hash = bcrypt.hashSync(password, salt);
    db.query("INSERT INTO users (login, password, first_name, second_name, patronymic, manager_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [login, hash, first_name, second_name, patronymic, manager_id], (err, res) => {
            console.log(err, res);
            db.query("SELECT id FROM users WHERE login=($1)", [login], (err, result) => {
                req.session.userId = result.rows[0].id;
                req.session.userLogin = login;
            });
        });
    res.json({
        ok: true
    })
});

router.post('/login', (req, res) => {
    const login = req.body.login.toLowerCase();
    const password = req.body.password;

    db.query("SELECT login, password, id FROM users WHERE login=($1)", [login], (err, result) => {
        const user = result.rows[0]
        if (err) {
            console.log(err);
        }
        if (user == null) {
            res.json({
                login: false
            })
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                req.session.userId = user.id;
                req.session.userLogin = user.login;
                res.json({
                    login: true,
                    password: true
                })
            } else {
                res.json({
                    login: true,
                    password: false
                })
            }
        }
    });
})

router.get('/logout', ((req, res) => {
    if (req.session) {
        req.session.destroy();
    }
    res.end();
}))

module.exports = router;