$(document).ready(function () {
    $('#navbar-userSearch').addClass('active');

    $('.archive-button').click(function () {
        var id = $(this).attr('id').split('-').slice(-1)[0];
        // console.log('id', id);
        var username = $('#username-' + id).val();
        var csrf = $('#csrf').val();
        var action = $(this).attr('id').split('-')[0];
        // console.log('username', username);

        $.ajax({
            url: '/' + action + '/' + username,
            type: 'PUT',
            data: {username: username, _csrf: csrf},
            success: function (data) {
                if (data.success) {
                    addMessage(data.message, true);
                    if (typeof data.redirect === 'string') {
                        setTimeout(function () {
                            window.location = data.redirect;
                        }, 2500);
                    }
                } else {
                    addMessage(data.message, false);
                }
            },
            error: function (err) {
                addMessage('A network error might have occurred. Please try again.', false);
            }
        });
    });
    $('.delete-button').click(function () {
        alert('delete pressed');
        const id = $(this).attr('id').split('-').slice(-1)[0];
        const username = $('#username-' + id).val();
        var formattedID = 'ObjectID(' + id + ')';
        alert(formattedID);
        /**the below should pass formattedID to the function inside registrationDelete called userDelete, deleting the user object matching the ID
         * it's interesting that it doesn't work b/c if the callback is alert, the callback runs, whereas if it's the anonymous function currently
         * present, it doesn't run (even the alert before the call to userDelete
         */
        $.getScript("registrationDelete.js", function() {
            alert("here's the code");
            userDelete(formattedID);
        })
    });
});