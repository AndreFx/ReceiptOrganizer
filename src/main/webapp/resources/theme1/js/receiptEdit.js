$(document).ready(function() {
    $('#editLabels').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
        disableIfEmpty: true,
        disableText: 'No labels available',
        maxHeight: 250
    });

    //Validator for editReceipt form.
    $('#receipt').validate({
        rules: {
            title: {
                required: true,
                notAllSpace: true,
                maxlength: 50
            },
            numItems: {
                integer: true,
                min: 0
            },
            receiptAmount: {
                number: true,
                min: 0.0
            },
            date: "validUSDate",
            description: {
                maxlength: 500
            }
        },

        messages: {
            title: {
                required: "Title is required",
                notAllSpace: "Title is required",
                maxlength: "Title must be under 50 characters"
            },
            numItems: {
                integer: "# of Items must be a whole number",
                min: "# of Items cannot be negative"
            },
            receiptAmount: {
                number: "Receipt Amount must be a valid number",
                min: "Receipt Amount cannot be negative"
            },
            date: "Please enter a date in the format of MM/dd/yyyy",
            description: {
                maxlength: "Description must be under 500 characters"
            }
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing editReceipt form errors.");
            error.appendTo('div#editReceiptErrors');
            $('#editReceiptErrorContainer').show();
        },

        submitHandler: function(form) {
            $('#editReceiptErrorContainer').hide();
            form.submit();
        }
    });

    //Multiselect and datepicker

    $('#labels').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
        disableIfEmpty: true,
        disableText: 'No labels available',
        maxHeight: 250
    });

    //Create datepicker
    $('#editDate').datepicker();

    //Delete Modal
    $('#deleteReceipt').on('shown.bs.modal', function() {
        $("#cancelDeleteReceipt").focus();
    });

});