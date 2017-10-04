$(document).ready(function() {

    var defaultLabelNotifTimeout = 10000;

    /* Snackbar notifications */

    function showSnackbarMessage(message, snackbarTimeout) {
        $('.snackbar').addClass('show');
        $('#snackbarText').text(message);

        setTimeout(function(){
            $('.snackbar').removeClass('show');
            $('#snackbarText').text('');
        }, snackbarTimeout);
    }

    /* Validators */

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

    /* Multiselect and datepicker for create receipt form */

    $('#labels').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
        disableIfEmpty: true,
        disableText: 'No labels available',
        maxHeight: 250
    });

    $('#date').datepicker();

    /* Edit functionality for labels */

    function insertLabelListSorted(labelName) {
        console.log('Inserting list item: ' + labelName);

        //Find position to insert into current ul
        var labelNameList = [];
        var liIndex = 0;
        $('.label-name').find('span').each(function() {
            //Ignore 'All Receipts'
            if (liIndex != 0) {
                labelNameList.push($(this).text());
            }
            liIndex++;
        });

        var index = 0;
        while (index < labelNameList.length && labelName.toLowerCase() > labelNameList[index].toLowerCase()) {
            index++;
        }

        //Insert and show
        $('#labelList > li:eq(' + (index + 1) + ')').after("<li class=\"nav-item\">\n" +
            "                <table class=\"table table-label table-hover\">\n" +
            "                    <tbody>\n" +
            "                        <tr class=\"clickable-row\" data-href=\"/ReceiptOrganizer/home/?label=" + labelName + "\">\n" +
            "                            <td class=\"vertical-align-text label-name\"><i class=\"fa fa-sign-blank text-info\"></i><span>" + labelName + "</span></td>\n" +
            "                            <td class=\"vertical-align-text menu\">\n" +
            "                                <div class=\"dropdown\">\n" +
            "                                    <a class=\"dropdown-toggle full-width\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
            "                                        <i class=\"fa fa-ellipsis-v menu-icon\" aria-hidden=\"true\"></i>\n" +
            "                                    </a>\n" +
            "                                    <ul class=\"dropdown-menu dropdown-menu-right\">\n" +
            "                                        <li class=\"dropdown-item-edit\"><a href=\"#\">Edit Label</a></li>\n" +
            "                                        <li class=\"dropdown-item-delete\"><!-- TODO Remove anchors --><a href=\"#deleteLabelModal\" data-toggle=\"modal\"  title=\"Delete Label\">Delete Label</a></li>\n" +
            "                                    </ul>\n" +
            "                                </div>\n" +
            "                            </td>\n" +
            "                        </tr>\n" +
            "                    </tbody>\n" +
            "                </table>\n" +
            "            </li>");

        //Re register click events.
        $('.dropdown-item-edit').click(editClickEvent);
        $('.dropdown-item-delete').click(deleteClickEvent);
    }

    function deleteClickEvent(event) {
        console.log("Dropdown delete item selected.");
        event.stopPropagation();
        var questionText = 'Are you sure you want to delete the label: ';
        var labelName = $(this).parent().parent().parent().prev().find('span').text();

        $('#deleteLabelNameValue').val(labelName);
        $('#deleteLabelNameText').text(questionText.concat(labelName, '?'));
        $('#deleteLabelModal').modal('show');
    }

    function editClickEvent(event) {
        console.log("Dropdown edit item selected.");
        event.stopPropagation();
        event.preventDefault();

        if ($('#editor').length) {
            $('#editor').prev().show();
            $('#editor').remove();
        }

        var manager = $('#editManager').clone().attr("id", "editor");
        var labelName = $(this).parent().parent().parent().prev().find('span').text();

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
    }

    //Create editor and hide and li for the selected label.
    $('.dropdown-item-edit').click(editClickEvent);

    //Cancel edit button functionality. Must use .on because the button is dynamically created.
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
                    insertLabelListSorted($('#createLabel').find("input[name='name']").val());
                    $('#labelErrorContainer').hide();
                    $('#addLabel').modal('hide');
                    showSnackbarMessage('Label successfully created.', defaultLabelNotifTimeout);
                    success = true;
                } else {
                    //Set error messages
                    showSnackbarMessage(res.errorMessage, defaultLabelNotifTimeout);
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
                    var editor = $('#editor');
                    var labelName = $(editor).find('input[name="newLabelName"]').val()
                    $(editor).prev().remove();
                    $(editor).remove();
                    insertLabelListSorted(labelName);

                    showSnackbarMessage('Label successfully changed.', defaultLabelNotifTimeout);
                    success = true;
                } else {
                    //Set error messages
                    showSnackbarMessage(res.errorMessage, defaultLabelNotifTimeout);
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
                    $('.label-name').find('span').each(function() {
                        if (this.textContent === labelName) {
                            $(this).parent().parent().parent().parent().parent().remove();
                        }
                    });
                    $('#deleteLabelModal').modal('hide');

                    showSnackbarMessage('Label successfully deleted.', defaultLabelNotifTimeout);
                    success = true;
                } else {
                    showSnackbarMessage(res.errorMessage, defaultLabelNotifTimeout);
                    success = false;
                }

                return success;
            }
        });
    });

    //Delete the selected label, but first bring up a modal box to ensure this selection was desired.
    $(".dropdown-item-delete").click(deleteClickEvent);

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