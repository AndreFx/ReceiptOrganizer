$(document).ready(function() {
    //Validator for userSettings form.
    $('#user').validate({
        rules: {
            fName: {
                maxlength: 50
            },
            lName: {
                maxlength: 50
            },
            paginationSize: {
                required: true,
                range: [5, 25]
            }
        },

        messages: {
            fName: {
                maxlength: "First name must be under 50 characters"
            },
            lName: {
                maxLength: "Last name must be under 50 characters"
            },
            paginationSize: {
                required: "Page size required",
                range: "Page size must be between 5 and 25"
            }
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing userSettings form errors.");
            error.appendTo('div#userSettingsErrors');
            $('#userSettingsErrorContainer').show();
        },

        submitHandler: function(form) {
            $('#userSettingsErrorContainer').hide();
            form.submit();
        }
    });
});