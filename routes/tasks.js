const express = require('express');
const router = express.Router();
const db = require('../db')

router.post('/add', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const priority = req.body.priority;
    const creator_id = req.session.userId;
    const performer_id = req.body.performer;

    db.query(`INSERT INTO tasks (title, description, deadline, start_date, update_date, priority, status, creator_id, performer_id) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [title, description, deadline, new Date(), new Date(), priority, 'К выполнению', creator_id, performer_id ],
        (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
        }
    })
    res.json({
        ok: true
    })
})

router.post('/edit', (req, res) => {
    if (req.body.creator_id === req.body.user_id) {
        const task_id = req.body.task_id
        const title = req.body.title;
        const description = req.body.description;
        const deadline = req.body.deadline;
        const priority = req.body.priority;
        const performer_id = req.body.performer;
        const status = req.body.status;

        db.query(`UPDATE tasks SET title = $1, description = $2, deadline = $3, priority = $4,
                    performer_id = $5, status = $6, update_date = $7 WHERE id = $8`, [title, description, deadline,
                    priority, performer_id, status, new Date(), task_id], (err, result) => {
            res.json();
        })
    }
    else {
        const task_id = req.body.task_id
        const status = req.body.status;

        db.query('UPDATE tasks SET status = $1 WHERE id = $2', [status, task_id], (err, result) => {
            res.json();
        })
    }
})

router.get('/get_details', (req, res) => {
    db.query(`SELECT t.id, title, description, deadline, start_date, update_date, priority,
                          status, creator_id, performer_id, uc.first_name as cfirst, uc.second_name as csecond,
                          uc.patronymic as cpatr, up.first_name as pfirst, up.second_name as psecond,
                          up.patronymic as ppatr
                  FROM tasks t JOIN users uc ON uc.id = t.creator_id
                  JOIN users up ON up.id = t.performer_id
                  WHERE t.id = $1`, [req.query.task_id], (err, result) => {
        let data = result.rows;
        data[0]['user_id'] = req.session.userId;
        res.json(data);
    })
})

router.get('/group', (req, res) => {
    let condition = ''
    console.log(req.query)
    console.log(req.query.date)
    console.log(req.query.performer)

    let date = new Date()
    if (req.query.date === 'Все')
    {
        condition += ''
    }

    else if (req.query.date === 'Сегодня') {
        condition += 'WHERE status != \'Отменена\' and deadline = date(\'' + date.toLocaleDateString().replace('.', '-') + '\')'
    }

    else if (req.query.date === 'Неделя') {
        date.setDate(date.getDate() + 7)
        condition += 'WHERE status != \'Отменена\' and deadline >= date(\''  + new Date().toLocaleDateString().replace('.', '-') + '\')' + ' and deadline <= date(\'' + date.toLocaleDateString().replace('.', '-') + '\')'
    }

    else {
        condition += 'WHERE status != \'Отменена\' and  and deadline >= date(\'' + date.toLocaleDateString().replace('.', '-') + '\')'
    }

    if (req.query.performer === 'Все') {
        if (condition !== '') {
            condition += ' and (creator_id = ' + req.session.userId + ' or performer_id = ' + req.session.userId + ')'
        }
        else {
            condition += 'WHERE (creator_id = ' + req.session.userId + ' or performer_id = ' + req.session.userId + ')'
        }
    }

    else {
        if (condition !== '') {
            condition += ' and performer_id = ' + req.query.performer + " and creator_id = " + req.session.userId
        }
        else {
            condition += 'WHERE performer_id = ' + req.query.performer + " and creator_id = " + req.session.userId
        }
    }

    db.query(`SELECT id, title, status, deadline
                   FROM tasks
                   ` + condition + ' ORDER by update_date', [], (err, result) => {
            console.log(`SELECT id, title, status, deadline
                   FROM tasks
                   ` + condition + ' ORDER by update_date')
            res.json(result.rows)
    })
})

module.exports = router;