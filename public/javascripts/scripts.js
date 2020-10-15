$('#register-button').click(function (e) {
    e.preventDefault();
    $('.modal-register').show();
});

$('.login-button').each(function (index) {
    $(this).click(function (e) {
        $('.modal-login').show();
    });
});

$('.task-list__add').click(function (e) {
    e.preventDefault();
    $('.modal-add').show();
})

$('.task-detail__edit-button').on('click', function (e) {
    e.preventDefault();

    $('.modal-edit').show();
    let creator_id = $('.task-detail__edit-button').attr('creator_id')
    let user_id = $('.task-detail__edit-button').attr('user_id')
    if (creator_id === user_id) {
        $('.only-manager').show();
        $('#edit-title').val($('.task-detail__header-title__title').text());
        $('#edit-description').val($('.task-detail__description').text());
        $('#edit-deadline').val($('.task-detail__deadline').text());
        $('#edit-priority').val($('.task-detail__priority').text());
        $('#edit-status').val($('.task-detail__header-title__status').text());
        let performer_name = $('.task-detail__performer').text();
        let performer_id = $('#edit-performer option').filter(function () { return $(this).html() == performer_name; }).val();
        $('#edit-performer').val(performer_id);
    }
    else {
        $('.only-manager').hide();
        $('#edit-status').val($('.task-detail__header-title__status').text());
    }
})

$(function () {
    let form = $('#register-form')
    form.validate({
        rules: {
            'user-login': {
                required: true,
                minlength: 4,
                maxlength: 64,
            },
            password: {
                required: true,
                minlength: 6,
            },
            'first_name': {
                required: true,
                minlength: 2,
                maxlength: 20,
            },
            'second_name': {
                required: true,
                minlength: 2,
                maxlength: 20,
            },
            'patronymic': {
                required: false,
                minlength: 2,
                maxlength: 20,
            }
        },
        messages: {
            'user-login': {
                required: "Это поле обязательно для заполнения",
                minlength: "Логин должен быть минимум 4 символа",
                maxlength: "Максимальное число символов - 64",
            },
            password: {
                required: "Это поле обязательно для заполнения",
                minlength: "Пароль должен быть минимум 6 символа",
            },
            'first_name': {
                required: "Это поле обязательно для заполнения",
                minlength: "Имя должно быть минимум 2 символа",
                maxlength: "Имя не должно быть длиннее 20 символов"
            },
            'second_name': {
                required: "Это поле обязательно для заполнения",
                minlength: "Фамилия должна быть минимум 2 символа",
                maxlength: "Фамилия не должна быть длиннее 20 символов"
            },
            'patronymic': {
                maxlength: "Отчество не должно быть длиннее 20 символов"
            }
        },
        submitHandler: function() {

            let user_data = {
                login: $('#register-login').val(),
                password: $('#register-password').val(),
                first_name: $('#register-first_name').val(),
                second_name: $('#register-second_name').val(),
                patronymic: $('#register-patronymic').val(),
                manager_id: $('#register-manager').val()
            };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(user_data),
                contentType: 'application/json',
                url: '/auth/register',
                success: function () {
                    console.log(this.data);
                }
            }).done(function (data) {
                $(location).attr('href', '/');
                console.log(data);
            });
        }
    })
})

$(function() {
    $('#add-form').validate({
        rules: {
            title: {
                required: true,
                maxlength: 64,
            },
            deadline: {
                required: true,
            },
        },
        messages: {
            title: {
                required: "Это поле обязательно для заполнения",
                maxlength: "Максимальное число символов - 64",
            },
            deadline: {
                required: "Это поле обязательно для заполнения",
            },
        },

        submitHandler: function () {

            let user_data = {
                title: $('#add-title').val(),
                description: $('#add-description').val(),
                deadline: $('#add-deadline').val(),
                priority: $('#add-priority').val(),
                performer: $('#add-performer').val()
            };

            $.ajax({
                type: 'POST',
                data: JSON.stringify(user_data),
                contentType: 'application/json',
                url: '/tasks/add',
                success: function () {
                    $(location).attr('href', '/');
                }
            })
        }
    })
})

$(function () {
    $('#edit-form').validate({
        rules: {
            'edit-title': {
                required: true,
                maxlength: 64,
            },
            'edit-deadline': {
                required: true,
            },
        },
        messages: {
            'edit-title': {
                required: "Это поле обязательно для заполнения",
                maxlength: "Максимальное число символов - 64",
            },
            'edit-deadline': {
                required: "Это поле обязательно для заполнения",
            },
        },

        submitHandler: function() {
            let user_data = {
                title: $('#edit-title').val(),
                description: $('#edit-description').val(),
                deadline: $('#edit-deadline').val(),
                priority: $('#edit-priority').val(),
                performer: $('#edit-performer').val(),
                status: $('#edit-status').val(),
                task_id: $('.task-detail__edit-button').attr('task_id'),
                creator_id: $('.task-detail__edit-button').attr('creator_id'),
                user_id: $('.task-detail__edit-button').attr('user_id')
            }


            $.ajax({
                type: 'POST',
                data: JSON.stringify(user_data),
                contentType: 'application/json',
                url: '/tasks/edit',
                success: function () {
                    $(location).attr('href', '/');
                }
            })
        }
    })
})


$(".modal-container").click(function (e) {
    if (e.target === this) {
        $('.modal-register').hide();
        $('.modal-login').hide();
        $('.modal-add').hide();
        $('.modal-edit').hide();
        $('.modal-group').hide();
    }
});

$('.task-detail').hide()

$('.task-list__item').on('click', function (e) {
    e.preventDefault();

    $('.task-detail').show()
    $.ajax({
        type: 'GET',
        url: '/tasks/get_details',
        data: {task_id: $(this).attr('value')},
        success: function (data) {
            $('.task-detail__header-title__title').text(data[0].title)
            $('.task-detail__header-title__status').text(data[0].status)
            $('.task-detail__description').text(data[0].description)
            $('.task-detail__creation-date').text(data[0].start_date.slice(0, 10))
            $('.task-detail__deadline').text(data[0].deadline.slice(0, 10))
            $('.task-detail__update-date').text(data[0].update_date.slice(0, 10))
            $('.task-detail__priority').text(data[0].priority)
            $('.task-detail__performer').text(data[0].pfirst + " " + data[0].psecond)
            $('.task-detail__creator').text(data[0].cfirst + " " + data[0].csecond)
            $('.task-detail__edit-button').attr('task_id', data[0].id)
            $('.task-detail__edit-button').attr('creator_id', data[0].creator_id)
            $('.task-detail__edit-button').attr('user_id', data[0].user_id)

        }
    })

})


$('#login-send-button').on('click', function(e) {
    e.preventDefault();

    $('#login-login-error').remove()
    $('#login-password-error').remove()

    let user_data = {
        login: $('#login-login').val(),
        password: $('#login-password').val(),
    };

    $.ajax({
        type: 'POST',
        data: JSON.stringify(user_data),
        contentType: 'application/json',
        url: '/auth/login',
        success: function (res) {
            if (!res.login) {
                $('#login-login').after('<label id="login-login-error" ' +
                    'class="error" for="login-login">Неправильный логин</label>')
            }
            else if (res.login && !res.password) {
                $('#login-password').after('<label id="login-password-error" ' +
                    'class="error" for="login-password">Неправильный пароль</label>')
            }

            else {
                $(location).attr('href', '/');
            }
        }
    })
} )

$('#group-send-button').on('click', function (e) {
    e.preventDefault();

    let user_data = {
        date: $('#group-date').val(),
        performer: $('#group-performer').val()
    }

    $('.task-detail').hide()

    $.ajax({
        type: 'GET',
        data: user_data,
        url: '/tasks/group',
        success: function (res) {
            $('.task-list__item').remove()
            for (let i = 0; i < res.length; i++) {
                let color = res[i].status === 'К выполнению' ? '#C0C0C0' : (res[i].status === 'Выполняется' ? "#0078D7" : (
                    res[i].status === 'Выполнена' ? "#50C67F" : "#ED6060"))
                if (new Date(res[i].deadline) < new Date() && res[i].status !== 'Выполнена' && res[i].status !== 'Отменена') {
                    color = "#ED6060";
                }
                $('.task-list__list').append('<button value="' + res[i].id + '" class="task-list__item"' +
                    ' style="background-color: ' + color + '">' + res[i].title + '</button>')

                $('.task-list__item').on('click', function (e) {
                    e.preventDefault();

                    $('.task-detail').show()
                    $.ajax({
                        type: 'GET',
                        url: '/tasks/get_details',
                        data: {task_id: $(this).attr('value')},
                        success: function (data) {
                            $('.task-detail__header-title__title').text(data[0].title)
                            $('.task-detail__header-title__status').text(data[0].status)
                            $('.task-detail__description').text(data[0].description)
                            $('.task-detail__creation-date').text(data[0].start_date.slice(0, 10))
                            $('.task-detail__deadline').text(data[0].deadline.slice(0, 10))
                            $('.task-detail__update-date').text(data[0].update_date.slice(0, 10))
                            $('.task-detail__priority').text(data[0].priority)
                            $('.task-detail__performer').text(data[0].pfirst + " " + data[0].psecond)
                            $('.task-detail__creator').text(data[0].cfirst + " " + data[0].csecond)
                            $('.task-detail__edit-button').attr('task_id', data[0].id)
                            $('.task-detail__edit-button').attr('creator_id', data[0].creator_id)
                            $('.task-detail__edit-button').attr('user_id', data[0].user_id)

                        }
                    })

                })
            }
        }
    })
    $('.modal-group').hide()
})

$('#logout-button').on('click', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'GET',
        url: '/auth/logout'
    }).done(function() {
        $(location).attr('href', '/');
    });
})

$('.group-button').on('click', function (e) {
    e.preventDefault();

    $('#modal-group').show();
})
