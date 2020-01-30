$(document).ready(function(){
    
    var validForm = {};
    console.log("Hello");

    //checks for some validation on required fields. Will not allow form to be submitted if any of these conditions aren't met.
    $("#reset-password-button").click(function(){

        var notAllowedPattern = new RegExp (JSON.parse($("#notAllowedRegex").val()));

        var email = $("#email-register-box").val();
        var emailRegEx = new RegExp(JSON.parse($("#emailRegex").val()));

        validForm.email = true;
        $("#emailErrors").empty();

        if( !email || !(emailRegEx.test(email))) {
            validForm.email = false;
            $("#emailErrors").empty();
            $("#emailErrors").append("<p>Please enter a valid email address.</p>");
        }

        else if(email.slice(-3) == "edu"){
            validForm.email = false;
            $("#emailErrors").empty();
            $("#emailErrors").append("<p>Please use a non .edu email address.</p>");
        }

        if (notAllowedPattern.test(email)) {
            validForm.email = false;
            $("#altEmailErrors").empty();
            $('#altEmailErrors').append('<p>Email contains disallowed special characters.</p>');
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
            $("#register-form").submit();
        }
    });

    
    // THE FOLLOWING BLUR ALERTS ARE ONLY TO VISUALLY ALERT USER TO MISSING FIELDS
    // DOES NOT PREVENT USER FROM SUBMITTING FORM (that validation is done above)
    //alerts user in realtime to possible registration errors on signup form. Does not actually enforce requirements though.


    $("#email-register-box").blur(function(){
        var email = $("#email-register-box").val();
        var emailRegEx = new RegExp(JSON.parse($("#emailRegex").val()));
        var notAllowedPattern = new RegExp (JSON.parse($("#notAllowedRegex").val()));

        if( !(emailRegEx.test(email))) {
            $("#emailErrors").empty();
            $("#emailErrors").append("<p>Please enter a valid email address</p>");
            $("#email-register-box").css({"border-color":"red"});
        }

        else if(email.slice(-3) == "edu"){
            $("#emailErrors").empty();
            $("#emailErrors").append("<p>Please use a non .edu email address.</p>");
            $("#email-register-box").css({"border-color":"red"});
        }


        else{
            $("#emailErrors").empty();

            if (notAllowedPattern.test(email)) {
                $('#emailErrors').append('<p>Email contains disallowed special characters.</p>');
                $("#email-register-box").css({"border-color":"red"});
            }

            else{
                $('#emailErrors').empty();
                $("#email-register-box").css({"border-color":"green"});
            }   
        }
    });
});