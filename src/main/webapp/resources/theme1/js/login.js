$(document).ready(function() {

    $('#lg_username').focus();

    //Validator for editReceipt form.
    $('#loginForm').validate({
        rules: {
            username: "required",
            password: "required"
        },

        messages: {
            username: "Username is required",
            password: "Password is required"
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing login form errors.");
            if ($('.submission-status').length) {
                $('.submission-status').remove();
            }
            console.log("Trying to add show class.");
            if ($('#form-errors-container').hasClass('success')) {
                $('#form-errors-container').removeClass('success').addClass('invalid');
            }
            if (!$('#form-errors-container').hasClass('show')) {
                $('#form-errors-container').addClass('show');
            }
            console.log("Finished placing login form errors.");
            error.appendTo('#form-errors-container');
        },

        submitHandler: function(form) {
            console.log("Valid login form submitted, sending to server.");
            $('#form-errors-container').removeClass('show');
            form.submit();
        }
    });
});