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
            receiptAmount: {
                number: true,
                min: 0.0
            },
            multipartFile: {
                accept: "image/*,application/pdf"
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
            receiptAmount: {
                number: "Receipt Amount must be a valid number",
                min: "Receipt Amount cannot be negative"
            },
            date: "Please enter a date in the format of MM/dd/yyyy",
            description: {
                maxlength: "Description must be under 500 characters"
            },
            multipartFile: {
                accept: "File must be an image or pdf"
            }
        },

        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },

        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
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

    //Initialize current row multiselects and validators
    for (var i = 0; i < editCurrentRowNum; i++) {
        $("select[id='edititems" + i + ".warrantyUnit']").multiselect();

        $('input[name="edititems[' + i + '].name"]').rules('add', {
            maxlength: 50,
            messages: {
                maxlength: "Item names must be under 50 characters"
            }
        });

        $('input[name="edititems[' + i + '].quantity"]').rules('add', {
            integer: true,
            min: 0,
            messages: {
                integer: "Quantity must be a whole number",
                min: "Quantity cannot be negative"
            }
        });

        $('input[name="edititems[' + i + '].unitPrice"]').rules('add', {
            number: true,
            messages: {
                number: "Unit Price must be a number"
            }
        });

        $('input[name="edititems[' + i + '].warrantyLength"]').rules('add', {
            integer: true,
            min: 0,
            messages: {
                integer: "Warranty Length must be a whole number",
                min: "Warranty Length cannot be negative"
            }
        });
    }

    /* Add new item functionality for new receipt */

    //TODO Validate data properly

    //TODO Test with backend

    //TODO Way to remove rows?

    $('.inbox-body').on('click', "#editReceiptAddItemBtn", function(event) {
        event.stopPropagation();
        console.log("Adding new item row in edit receipt view");
        var row = $('#editItemRow' + editCurrentRowNum);
        editCurrentRowNum++;

        //Create copy of row
        var newRow = row.clone().attr("id", "editItemRow" + editCurrentRowNum);

        //Clear and update values of row
        $(newRow).find('label.control-label').text("Item #" + editCurrentRowNum);
        $(newRow).find("input[id='edititems" + (editCurrentRowNum - 2) + ".name']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".name")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].name").val("");
        $(newRow).find("input[id='edititems" + (editCurrentRowNum - 2) + ".quantity']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".quantity")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].quantity").val("0");
        $(newRow).find("input[id='edititems" + (editCurrentRowNum - 2) + ".unitPrice']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".unitPrice")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].unitPrice").val("");
        $(newRow).find("input[id='edititems" + (editCurrentRowNum - 2) + ".warrantyLength']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".warrantyLength")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].warrantyLength").val("0");
        $(newRow).find("select[id='edititems" + (editCurrentRowNum - 2) + ".warrantyUnit']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".warrantyUnit")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].warrantyUnit").next('div').remove();

        var temp = $(newRow).find("select[id='edititems" + (editCurrentRowNum - 1) + ".warrantyUnit']");
        var newParent = $(newRow).find("select[id='edititems" + (editCurrentRowNum - 1) + ".warrantyUnit']").parent().parent();
        temp.parent().remove();
        newParent.append(temp);

        //Enable multiselect
        $(newRow).find("select[id='edititems" + (editCurrentRowNum - 1) + ".warrantyUnit']").multiselect();

        //Insert row
        row.after(newRow);

        //Enable validation
        $('input[name="edititems[' + (editCurrentRowNum - 1) + '].name"]').rules('add', {
            maxlength: 50,
            messages: {
                maxlength: "Item names must be under 50 characters"
            }
        });

        $('input[name="edititems[' + (editCurrentRowNum - 1) + '].quantity"]').rules('add', {
            integer: true,
            min: 0,
            messages: {
                integer: "Quantity must be a whole number",
                min: "Quantity cannot be negative"
            }
        });

        $('input[name="edititems[' + (editCurrentRowNum - 1) + '].unitPrice"]').rules('add', {
            number: true,
            messages: {
                number: "Unit Price must be a number"
            }
        });

        $('input[name="edititems[' + (editCurrentRowNum - 1) + '].warrantyLength"]').rules('add', {
            integer: true,
            min: 0,
            messages: {
                integer: "Warranty Length must be a whole number",
                min: "Warranty Length cannot be negative"
            }
        });
    });

    //Create datepicker
    $('#editDate').datepicker();

    //Delete Modal
    $('#deleteReceipt').on('shown.bs.modal', function() {
        $("#cancelDeleteReceipt").focus();
    });

});