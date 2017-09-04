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
            title: "required",
            numItems: "digits",
            receiptAmount: {
                number: true
            }
        },

        messages: {
            title: "Title is required",
            numItems: "# of Items must be a whole number",
            receiptAmount: "Receipt Amount must be a valid number"
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing editReceipt form errors.");
            error.appendTo('div#receiptErrors');
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
});