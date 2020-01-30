$(document).ready(function(){
    
    var validForm = {};
    console.log("Hello");

    //checks for some validation on required fields. Will not allow form to be submitted if any of these conditions aren't met.
    $("#reset-password-button").click(function(){
        console.log("Hello");

        var notAllowedPattern = new RegExp (JSON.parse($("#notAllowedRegexReset").val()));

        var email = $("#email-reset-box").val();
        var emailRegEx = new RegExp(JSON.parse($("#emailRegexReset").val()));

        validForm.email = true;
        $("#emailResetErrors").empty();

        if( !email || !(emailRegEx.test(email))) {
            validForm.email = false;
            $("#emailResetErrors").empty();
            $("#emailResetErrors").append("<p>Please enter a valid email address.</p>");
        }

        else if(email.slice(-3) == "edu"){
            validForm.email = false;
            $("#emailResetErrors").empty();
            $("#emailResetErrors").append("<p>Please use a non .edu email address.</p>");
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
            $("#forgot-password-form").submit();
        }
    });

    
    // THE FOLLOWING BLUR ALERTS ARE ONLY TO VISUALLY ALERT USER TO MISSING FIELDS
    // DOES NOT PREVENT USER FROM SUBMITTING FORM (that validation is done above)
    //alerts user in realtime to possible registration errors on signup form. Does not actually enforce requirements though.


    $("#email-reset-box").blur(function(){
        var email = $("#email-reset-box").val();
        var emailRegEx = new RegExp(JSON.parse($("#emailRegexReset").val()));
        var notAllowedPattern = new RegExp (JSON.parse($("#notAllowedRegexReset").val()));

        if( !(emailRegEx.test(email))) {
            $("#emailResetErrors").empty();
            $("#emailResetErrors").append("<p>Please enter a valid email address</p>");
            $("#email-reset-box").css({"border-color":"red"});
        }

        else if(email.slice(-3) == "edu"){
            $("#emailResetErrors").empty();
            $("#emailResetErrors").append("<p>Please use a non .edu email address.</p>");
            $("#email-reset-box").css({"border-color":"red"});
        }

        else{
            $("#emailResetErrors").empty();

            if (notAllowedPattern.test(email)) {
                $('#emailResetErrors').append('<p>Email contains disallowed special characters.</p>');
                $("#email-reset-box").css({"border-color":"red"});
            }

            else{
                $('#emailResetErrors').empty();
                $("#email-reset-box").css({"border-color":"green"});
            }   
        }
    });
});