$(document).ready(function() {

    $('#newLabel').validate({
        rules: {
            name: {
                required: true
            }
        },

        messages: {
            name: {
                required: "Label name is required"
            }
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing newLabel form errors.");
            error.appendTo('div#labelErrors');
            $('#labelErrorContainer').show();
        }
    });

    //Validator for newReceipt form.
    $('#newReceipt').validate({
        rules: {
            title: "required",
            multipartFile: "required",
            numItems: "digits",
            receiptAmount: {
                number: true
            },
            date: "validUSDate"
        },

        messages: {
            title: "Title is required",
            multipartFile: "Receipt upload is required",
            numItems: "# of Items must be a whole number",
            receiptAmount: "Receipt Amount must be a valid number",
            date: "Please enter a date in the format of MM/dd/yyyy"
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing newReceipt form errors.");
            error.appendTo('div#receiptErrors');
            $('#receiptErrorContainer').show();
        },

        submitHandler: function(form) {
            $('#receiptErrorContainer').hide();
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
    $('#date').datepicker();

    //Edit Functionality for Labels

    $('.dropdown-item-edit').click(function(event) {
        console.log("Dropdown edit item selected.");
        event.stopPropagation();
        event.preventDefault();

        if ($('#editor').length) {
            $('#editor').prev().show();
            $('#editor').remove();
        }

        var manager = $('#editManager').clone().attr("id", "editor");
        var labelName = $(this).parent().parent().parent().prev().contents().filter(function() {
            return this.nodeType == 3;
        }).text();

        $(manager).find("[name='oldLabelName']").attr("value", labelName);
        $(manager).find("[name='newLabelName']").attr("value", labelName);
        $(manager).find("[type='button']").attr("id", "stopEdit");
        $(manager).find(".btn.btn-send").attr("id", "submitEdit");
        $(this).parent().parent().parent().parent().parent().parent().parent().hide().after(manager);
        $(manager).show();
        $(manager).find("form").attr("id", "editLabelForm");
        $(manager).find("[name='newLabelName']").focus();
        $('#editLabelForm').validate({
            rules: {
                oldLabelName: "required",
                newLabelName: {
                    required: true,
                    notAllSpace: true
                }
            },

            messages: {
                oldLabelName: "Don't mess around in the dev console",
                newLabelName: {
                    required: "Cannot enter empty label",
                    notAllSpace: "Cannot enter empty label"
                }
            },

            onkeyup: false,

            onfocusout: false,

            errorContainer: "#labelEditErrorContainer",

            errorLabelContainer: "#labelEditErrorContainer ul",

            wrapper: "li"
        });
    });

    $('.sm-side').on('click', "#stopEdit", function(event) {
        //Delete form, show original li
        console.log("Canceling edit action.");
        event.stopPropagation();
        $('#editor').prev().show();
        $('#editor').remove();

        //Stop the dropdown from reopening. Is there some other issue here?
        $('body').click();
    });

    //AJAX Submission for creating a label
    $('#createLabel').submit(function(event) {
        event.preventDefault();
        var success = false;
        var fd = $(this).serialize();

        $.ajax({
            url : '/ReceiptOrganizer/labels/create',
            type: "POST",
            data : $(this).serialize(),
            success : function(res) {

                if(res.success){
                    //TODO Add new li
                    $('#labelErrorContainer').hide();
                    $('#addLabel').modal('hide');
                    $('.snackbar').addClass('show').text('Label successfully created.');
                    setTimeout(function(){
                        $('.snackbar').removeClass('show').text('');
                    }, 5000);
                    success = true;
                } else {
                    //Set error messages
                    $('.snackbar').addClass('show').text(res.errorMessage);
                    setTimeout(function(){
                        $('.snackbar').removeClass('show').text('');
                    }, 5000);
                    success = false;
                }

                return success;
            }
        });
    });

    //AJAX Submission for editing a label
    $('.sm-side').on('submit', "#editor", function(event) {
        event.preventDefault();
        var success = false;

        $.ajax({
            url : '/ReceiptOrganizer/labels/update',
            type: "POST",
            data : {
                oldLabelName: $('#editor').find("input[name='oldLabelName']").val(),
                newLabelName: $('#editor').find("input[name='newLabelName']").val()
            },
            success : function(res) {

                if(res.success){
                    $('#labelEditErrorContainer').hide();
                    //Update text
                    $('#editor').prev().show().find('.label-name').contents().filter(function() {
                        return this.nodeType == 3;
                    }).each(function(){
                        this.textContent = $('#editor').find('input[name="newLabelName"]').val();
                    });
                    $('#editor').remove();

                    $('.snackbar').addClass('show').text('Label successfully changed.');
                    setTimeout(function(){
                            $('.snackbar').removeClass('show').text('');
                        }, 5000);
                    success = true;
                } else {
                    //Set error messages
                    $('.snackbar').addClass('show').text(res.errorMessage);
                    setTimeout(function(){
                        $('.snackbar').removeClass('show').text('');
                    }, 5000);
                    success = false;
                }

                return success;
            }
        });
    });

    //AJAX Delete for Labels
    $('#deleteLabel').submit(function(event) {
        event.preventDefault();
        var success = false;
        var labelName = $(this).find('input[name="labelName"]').val();

        $.ajax({
            url : '/ReceiptOrganizer/labels/delete',
            type: "POST",
            data : $(this).serialize(),
            success : function(res) {

                if(res.success){
                    $('.label-name').contents().filter(function() {
                        return this.nodeType == 3;
                    }).each(function() {
                        if (this.textContent === labelName) {
                            $(this).parent().parent().parent().parent().remove();
                        }
                    });
                    $('#deleteLabelModal').modal('hide');

                    $('.snackbar').addClass('show').text('Label successfully deleted.');
                    setTimeout(function(){
                        $('.snackbar').removeClass('show').text('');
                    }, 5000);
                    success = true;
                } else {
                    //Set error messages
                    $('.snackbar').addClass('show').text(res.errorMessage);
                    setTimeout(function(){
                        $('.snackbar').removeClass('show').text('');
                    }, 5000);
                    success = false;
                }

                return success;
            }
        });
    });

    $(".dropdown-item-delete").click(function(event) {
        console.log("Dropdown delete item selected.");
        event.stopPropagation();
        var questionText = 'Are you sure you want to delete the label: ';
        var labelName = $(this).parent().parent().parent().prev().contents().filter(function() {
            return this.nodeType == 3;
        }).text();

        $('#deleteLabelNameValue').val(labelName);
        $('#deleteLabelNameText').text(questionText.concat(labelName, '?'));
        $('#deleteLabelModal').modal('show');
    });

    /* Modals */

    /* On show events */

    $('#addReceipt').on('shown.bs.modal', function() {
        $("#title").focus();
    });

    $('#addLabel').on('shown.bs.modal', function() {
        $("#name").focus();
    });

    $('#deleteLabelModal').on('shown.bs.modal', function() {
        $("#deleteCancelButton").focus();
    });

    /* On hide events */

    $('#addReceipt').on('hidden.bs.modal', function() {
        console.log('Receipt modal closed.');

        //Hide error messages
        $('div#receiptErrors').empty();
        $('#receiptErrorContainer').hide();
        $('#multipartFile').parent().next().html("No file chosen");

        //Clear any user input
        $(this).find('form')[0].reset();
    });

    $('#addLabel').on('hidden.bs.modal', function() {
        console.log('Label modal closed.');

        $('div#labelErrors').empty();
        $('#labelErrorContainer').hide();

        //Clear any user input
        $(this).find('form')[0].reset();
    });

    $('#deleteLabelModal').on('hidden.bs.modal', function() {
        console.log('Edit Label modal closed.');

        $('#deleteLabelNameText').empty();
    });
});