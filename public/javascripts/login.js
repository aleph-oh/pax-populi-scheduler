$(document).ready(function () {
    $('#verify-button').click(function () {
        var username = $('#username').val();
        var verificationToken = $('#verificationToken').val();
        var csrf = $('#csrf').val();

        $.ajax({
            url: '/verify/'+username+'/'+verificationToken,
            type: 'PUT',
            data: {username: username, verificationToken: verificationToken, _csrf: csrf},
            success: function(data) {
                if (data.success) {
                    addMessage(data.message, true);
                    if (typeof data.redirect === 'string') {
                        setTimeout(function(){
                            window.location = data.redirect;
                        }, 2500);   
                    }
                } else {
                    addMessage(data.message, false);
                }
            },
            error: function(err) {
                addMessage('A network error might have occurred. Please try again.', false);
            }
        });
    });

    $('.reset-button').click(function () {
        var validForm = {};

        var username = $('#username').val();
        var resetToken = $('#resetToken').val();
        var csrf = $('#csrf').val();

        var notAllowedPattern = new RegExp (JSON.parse($("#notAllowedRegexReset").val()));
        var pw = $("#new-password-box").val();
        var passwordPattern = new RegExp(JSON.parse($("#passwordRegexReset").val()));


        validForm.password = true;
        $('#npwErrors').empty();

        if ( pw.legnth < 8 || !(passwordPattern.test(pw))){
            validForm.password = false;
            $('#npwErrors').empty();
            $("#npwErrors").append("<p>A valid password contains at least 8 characters, and at least one uppercase character, one lowercase character, a number and one special character.</p>");

        }
        if (notAllowedPattern.test(pw)) {
            validForm.password = false;
            $('#npwErrors').append('<p>Password contains disallowed special characters.</p>');

        }

        var allValid = true;
        // console.log(validForm);
        for (var key in validForm){
            if (validForm[key] === false){
                allValid = false;
                //// console.log(key);
            }

        }
        if (allValid){
            $.ajax({
                url: '/verify/'+username+'/'+resetToken,
                type: 'PUT',
                data: {username: username, resetToken: resetToken, _csrf: csrf, newPassword: pw}, // AND THE NEW PASSWORD
                success: function(data) {
                    if (data.success) {
                        addMessage(data.message, true);
                        if (typeof data.redirect === 'string') {
                            setTimeout(function(){
                                window.location = data.redirect;
                            }, 2500);
                        }
                    } else {
                        addMessage(data.message, false);
                    }
                },
                error: function(err) {
                    addMessage('A network error might have occurred. Please try again.', false);
                }
            });
        }
    });

    $("#new-password-box").blur(function(){

        var pw = $("#new-password-box").val();

        var passwordPattern = new RegExp(JSON.parse($("#passwordRegexReset").val()));
        var notAllowedPattern = new RegExp (JSON.parse($("#notAllowedRegexReset").val()));

        if ( pw.legnth < 8 || !(passwordPattern.test(pw))){
            $('#npwErrors').empty();
            $("#npwErrors").append("<p>A valid password contains at least 8 characters, and at least one uppercase character, one lowercase character, a number and one special character.</p>");
            $("#password-register-box").css({"border-color":"red"});
        }

        if (pw.length >= 8 && passwordPattern.test(pw)){
            $('#npwErrors').empty();

            if (notAllowedPattern.test(pw)) {
                $('#npwErrors').append('<p>Password contains disallowed special characters.</p>');
                $("#new-password-box").css({"border-color":"red"});
            }

            else{
                $('#npwErrors').empty();
                $("#new-password-box").css({"border-color":"green"});
            }
        }
    });

    $('.approve-button, .reject-button, .waitlist-button').click(function () {
        var id = $(this).attr('id').split('-').slice(-1)[0];
        var username = $('#username-' + id).val();
        var requestToken = $('#requestToken-' + id).val();
        var csrf = $('#csrf').val();
        var action = $(this).attr('id').split('-')[0];

        $.ajax({
            url: '/'+action+'/'+username+'/'+ requestToken,
            type: 'PUT',
            data: {username: username, requestToken: requestToken, _csrf: csrf},
            success: function(data) {
                if (data.success) {
                    addMessage(data.message, true);
                    if (typeof data.redirect === 'string') {
                        setTimeout(function(){
                            window.location = data.redirect;
                        }, 2500);   
                    }
                } else {
                    addMessage(data.message, false);
                }
            },
            error: function(err) {
                addMessage('A network error might have occurred. Please try again.', false);
            }
        });
    });
});