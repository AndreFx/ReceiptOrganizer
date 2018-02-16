$(function() {

    $('#lg_username').trigger("focus");

    var $loginForm = $('#loginForm');

    //Validator for editReceipt form.
    $loginForm.validate({
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
            var $errorContainer = $('#form-errors-container'),
                $submissionStatus = $('.submission-status');

            if ($submissionStatus.length) {
                $submissionStatus.remove();
            }
            console.log("Trying to add show class.");
            if ($errorContainer.hasClass('success')) {
                $errorContainer.removeClass('success').addClass('invalid');
            }
            if (!$errorContainer.hasClass('show')) {
                $errorContainer.addClass('show');
            }
            console.log("Finished placing login form errors.");
            error.appendTo('#form-errors-container');
        },

        submitHandler: function(form) {
            console.log("Valid login form submitted, sending to server.");
            $('#form-errors-container').removeClass('show');
            $loginForm.find('[type=submit]').addClass('success clicked').html('<i class="fa fa-check"></i>');
            form.submit();
        }
    });
});