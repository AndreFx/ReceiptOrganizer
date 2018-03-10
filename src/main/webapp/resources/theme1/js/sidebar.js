$(function() {

    /* Sidebar scrolling */
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

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

    $('#createLabel').validate({
        rules: {
            name: {
                required: true,
                notAllSpace: true,
                maxlength: 50
            }
        },

        messages: {
            name: {
                required: "Label name is required",
                notAllSpace: "Label name is required",
                maxlength: "Label name must be under 50 characters"
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
            //Remove any errors set by  Ajax call. Only works because there is only one jquery validation rule.
            $('#labelErrors').empty();
            console.log("Placing newLabel form errors.");
            error.appendTo('div#labelErrors');
            $('#labelErrorContainer').show();
        },

        submitHandler: function(form) {
            $.ajax({
                url : '/ReceiptOrganizer/labels/create',
                type: "POST",
                data : $(form).serialize(),
                success : function(res) {
                    var success = false;
                    if(res.success){
                        var labelName = $('#createLabel').find("input[name='name']").val().trim();
                        insertLabelListSorted(labelName);
                        addLabelMultiselect(labelName);

                        $('#labelErrorContainer').hide();
                        $('#addLabel').modal('hide');
                        showSnackbarMessage('Label successfully created.', defaultLabelNotifTimeout);
                        success = true;
                    } else {
                        //Set error messages
                        $('#labelErrors').empty().append("<div id=\"name-error\" class=\"error\">" + res.errorMessage + "</div>");
                        $('#labelErrorContainer').show();
                        success = false;
                    }

                    return success;
                }
            });

            //Prevent default
            return false;
        }
    });

    //Validator for newReceipt form.
    $('#finishReceiptForm').validate({
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
            console.log("Placing finishReceiptForm form errors.");
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

    /* Add new item functionality for new receipt */

    var currentRowNum = 1;
    var maxRowNum = 0;

    $('body').on('click', "#receiptAddItemBtn", function(event) {
        event.stopPropagation();
        console.log("Adding new item row in new receipt modal");

        //Create copy of row
        var newRow = $("<div class=\"form-group\" id=\"itemRow1\">\n" +
            "        <label id=\"itemDeleteLabel1\" class=\"col-lg-2 control-label item-label\">Item #1</label>\n" +
            "        <div id=\"itemDeleteDiv1\" class=\"col-lg-2\" style=\"display: none;\">\n" +
            "            <button type=\"button\" class=\"btn btn-send new-item-delete-button\"><span id=\"close\" class=\"delete-icon\">&times;</span> Delete</button>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"items0.name\" name=\"items[0].name\" type=\"text\" placeholder=\"\" value=\"\" maxlength=\"50\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"items0.quantity\" name=\"items[0].quantity\" type=\"text\" placeholder=\"\" value=\"0\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"items0.unitPrice\" name=\"items[0].unitPrice\" type=\"text\" placeholder=\"\" value=\"0.00\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"items0.warrantyLength\" name=\"items[0].warrantyLength\" type=\"text\" placeholder=\"\" value=\"0\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <select id=\"items0.warrantyUnit\" name=\"items[0].warrantyUnit\" placeholder=\"\" value=\"\" class=\"form-control\">\n" +
            "                <option selected=\"selected\" value=\"d\">Day(s)</option>\n" +
            "                <option value=\"m\">Month(s)</option>\n" +
            "                <option value=\"y\">Year(s)</option>\n" +
            "            </select>\n" +
            "        </div>\n" +
            "    </div>");

        //Clear and update values of row
        $(newRow).attr("id", "itemRow" + currentRowNum);
        $(newRow).find("#itemDeleteLabel1").attr("id", "itemDeleteLabel" + currentRowNum);
        $(newRow).find("#itemDeleteDiv1").attr("id", "itemDeleteDiv" + currentRowNum);
        $(newRow).find('label.control-label').text("Item #" + currentRowNum);
        $(newRow).find("input[id='items0.name']").attr("id", "items" + (currentRowNum - 1) + ".name")
            .attr("name", "items[" + (currentRowNum - 1) + "].name");
        $(newRow).find("input[id='items0.quantity']").attr("id", "items" + (currentRowNum - 1) + ".quantity")
            .attr("name", "items[" + (currentRowNum - 1)+ "].quantity");
        $(newRow).find("input[id='items0.unitPrice']").attr("id", "items" + (currentRowNum - 1) + ".unitPrice")
            .attr("name", "items[" + (currentRowNum - 1) + "].unitPrice");
        $(newRow).find("input[id='items0.warrantyLength']").attr("id", "items" + (currentRowNum - 1) + ".warrantyLength")
            .attr("name", "items[" + (currentRowNum - 1) + "].warrantyLength");
        $(newRow).find("select[id='items0.warrantyUnit']").attr("id", "items" + (currentRowNum - 1) + ".warrantyUnit")
            .attr("name", "items[" + (currentRowNum - 1) + "].warrantyUnit");

        //Enable multiselect
        $(newRow).find("select[id='items" + (currentRowNum - 1) + ".warrantyUnit']").multiselect();

        //Insert row
        if (currentRowNum == 1) {
            $(newRow).insertAfter("#itemRowNames");
        } else {
            $(newRow).insertAfter("#itemRow" + (currentRowNum - 1));
        }

        //Enable validation
        $('input[name="items[' + (currentRowNum - 1) + '].name"]').rules('add', {
            maxlength: 50,
            messages: {
                maxlength: "Item names must be under 50 characters"
            }
        });

        $('input[name="items[' + (currentRowNum - 1) + '].quantity"]').rules('add', {
            integer: true,
            min: 0,
            messages: {
                integer: "Quantity must be a whole number",
                min: "Quantity cannot be negative"
            }
        });

        $('input[name="items[' + (currentRowNum - 1) + '].unitPrice"]').rules('add', {
            number: true,
            messages: {
                number: "Unit Price must be a number"
            }
        });

        $('input[name="items[' + (currentRowNum - 1) + '].warrantyLength"]').rules('add', {
            integer: true,
            min: 0,
            messages: {
                integer: "Warranty Length must be a whole number",
                min: "Warranty Length cannot be negative"
            }
        });

        //Only bind delete button hovers once
        //This works becuase it will never create handlers for a currentRowNum more than once.
        if (currentRowNum > maxRowNum) {
            createItemDeleteButtonHandlers("body", "itemDeleteLabel", "itemDeleteDiv", currentRowNum);
            maxRowNum = currentRowNum;
        }

        currentRowNum++;
    });

    /* Delete item functionality */

    //Delete button functionality
    $('body').on("click", ".new-item-delete-button", function(event) {
        var rowNum = Number($(this).parent().parent().attr('id').slice(-1));
        console.log("Deleting item row " + rowNum);

        //delete row
        $(this).parent().parent().remove();

        //Update rows after rowNum
        decrementItemRowAttributes(rowNum + 1);
        currentRowNum--;
    });

    function decrementItemRowAttributes(rowNumStart) {
        var i = rowNumStart;

        //Start after deleted row
        for (i; i < currentRowNum; i++) {
            var row = $("#itemRow" + i);

            //Decrease the value of all attributes of the rows
            $(row).attr('id', "itemRow" + (i - 1));
            $(row).find("label.control-label").text("Item #" + (i - 1));

            //reassign id
            $(row).find("#itemDeleteLabel" + i).attr("id", "itemDeleteLabel" + (i - 1));
            $(row).find("#itemDeleteDiv" + i).attr("id", "itemDeleteDiv" + (i - 1));
        }
    }

    /* Edit functionality for labels */

    function insertLabelListSorted(labelName) {
        console.log('Inserting list item: ' + labelName);

        //Find position to insert into current ul
        var labelNameList = [];
        var liIndex = 0;
        $('.label-name').find('span').each(function() {
            //Ignore 'All Receipts'
            if (liIndex !== 0) {
                labelNameList.push($(this).text());
            }
            liIndex++;
        });

        var index = 0;
        while (index < labelNameList.length && labelName.toLowerCase() > labelNameList[index].toLowerCase()) {
            index++;
        }

        //Insert and show
        $('#labelSubmenu > li:eq(' + index + ')').after("<li class=\"nav-item\">\n" +
            "                <table class=\"table table-label table-hover\">\n" +
            "                    <tbody>\n" +
            "                        <tr class=\"clickable-row\" data-href=\"/ReceiptOrganizer/home/?label=" + labelName + "\">\n" +
            "                            <td class=\"vertical-align-text label-name\"><i class=\"fa fa-sign-blank text-info\"></i><span>" + labelName + "</span></td>\n" +
            "                            <td class=\"vertical-align-text menu\">\n" +
            "                                <div class=\"dropdown\">\n" +
            "                                    <a class=\"dropdown-toggle label-dropdown-toggle full-width\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
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
        $('.dropdown-item-edit').on("click", editClickEvent);
        $('.dropdown-item-delete').on("click", deleteClickEvent);
    }

    function addLabelMultiselect(labelName) {
        console.log('Adding label multiselect for: ' + labelName);

        //Find position to insert into current ul
        var labelNameList = [];
        var liIndex = 0;
        $('#labels').find('option').each(function() {
            //Ignore 'All Receipts'
            if (liIndex !== 0) {
                labelNameList.push($(this).text());
            }
            liIndex++;
        });

        var index = 0;
        while (index < labelNameList.length && labelName.toLowerCase() > labelNameList[index].toLowerCase()) {
            index++;
        }

        //Insert and show
        if (index === 0) {
            $('#labels').prepend("<option value=\"" + labelName + "\">" + labelName + "</option>");

            //Update receiptEdit page if open
            if ($('#editLabels').length !== 0) {
                $('#editLabels').prepend("<option value=\"" + labelName + "\">" + labelName + "</option>");
            }
        } else {
            $('#labels > option:eq(' + index + ')').after("<option value=\"" + labelName + "\">" + labelName + "</option>");

            //Update receiptEdit page if open
            if ($('#editLabels').length !== 0) {
                $('#editLabels > option:eq(' + index + ')').after("<option value=\"" + labelName + "\">" + labelName + "</option>");
            }
        }

        refreshMultiselect();
    }

    function removeLabelMultiselect(labelName) {
        console.log('Deleting label multiselect for: ' + labelName);

        //Find label to delete
        $('#labels').find('option').each(function() {
            //Ignore 'All Receipts'
            if ($(this).text() === labelName) {
                $(this).remove();
            }
        });

        //Update receiptEdit page as well.
        if ($('#editLabels').length !== 0) {
            $('#editLabels').find('option').each(function() {
                //Ignore 'All Receipts'
                if ($(this).text() === labelName) {
                    $(this).remove();
                }
            });
        }

        refreshMultiselect();
    }

    function updateLabelMultiselect(oldLabelName, newLabelName) {
        console.log('Updating label multiselect for: ' + oldLabelName + " to: " + newLabelName);

        removeLabelMultiselect(oldLabelName);
        addLabelMultiselect(newLabelName);

        refreshMultiselect();
    }

    function refreshMultiselect() {
        //Update multiselect.
        $('#labels').multiselect('destroy').multiselect({
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            includeSelectAllOption: true,
            disableIfEmpty: true,
            disableText: 'No labels available',
            maxHeight: 250
        });

        if ($('#editLabels').length !== 0) {
            $('#editLabels').multiselect('destroy').multiselect({
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true,
                includeSelectAllOption: true,
                disableIfEmpty: true,
                disableText: 'No labels available',
                maxHeight: 250
            });
        }
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

        var $editor = $('#editor');

        if ($editor.length) {
            $editor.prev().show();
            $editor.remove();
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
                    notAllSpace: true,
                    maxlength: 50
                }
            },

            messages: {
                oldLabelName: "Don't mess around in the dev console",
                newLabelName: {
                    required: "Label name is required",
                    notAllSpace: "Label name is required",
                    maxlength: "Label name must be under 50 characters"
                }
            },

            onkeyup: false,

            onfocusout: false,

            errorContainer: "#labelEditErrorContainer",

            errorLabelContainer: "#labelEditErrorContainer div",

            errorElement: 'div'
        });
    }

    //Create editor and hide and li for the selected label.
    $('.dropdown-item-edit').on("click", editClickEvent);

    //Cancel edit button functionality. Must use .on because the button is dynamically created.
    $('#sidebar').on('click', "#stopEdit", function(event) {
        //Delete form, show original li
        console.log("Canceling edit action.");
        event.stopPropagation();

        var $editor = $('#editor');
        $editor.prev().show();
        $editor.remove();

        //Stop the dropdown from reopening. Is there some other issue here?
        $('body').trigger('click');
    });

    //AJAX Submission for editing a label
    $('#sidebar').on('submit', "#editor", function(event) {
        event.preventDefault();
        var success = false,
            $editor = $('#editor');

        $.ajax({
            url : '/ReceiptOrganizer/labels/update',
            type: "POST",
            data : {
                oldLabelName: $editor.find("input[name='oldLabelName']").val(),
                newLabelName: $editor.find("input[name='newLabelName']").val()
            },
            success : function(res) {

                if(res.success){
                    $('#labelEditErrorContainer').hide();
                    //Update text
                    var labelName = $editor.find('input[name="newLabelName"]').val().trim();
                    var oldLabelName = $editor.find("input[name='oldLabelName']").val();
                    $editor.prev().remove();
                    $editor.remove();
                    insertLabelListSorted(labelName);
                    updateLabelMultiselect(oldLabelName, labelName);

                    showSnackbarMessage('Label successfully changed', defaultLabelNotifTimeout);
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
    $('#deleteLabel').on("submit", function(event) {
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
                    removeLabelMultiselect(labelName);
                    $('#deleteLabelModal').modal('hide');

                    showSnackbarMessage('Label successfully deleted', defaultLabelNotifTimeout);
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
    $(".dropdown-item-delete").on("click", deleteClickEvent);

    /*
    MODAL VIEW EVENTS
    */

    $('#addReceiptOcr').on('hidden.bs.modal', function() {
        if (moveToReceiptForm) {
            $('body').addClass('modal-open');
            moveToReceiptForm = false;
        }
        resetVisionForm();
    });

    $('#addReceipt').on('shown.bs.modal', function() {
        $("#title").trigger("focus");
    })
        .on('hidden.bs.modal', function() {
            console.log('Receipt modal closed.');

            //Hide error messages
            $('div#receiptErrors').empty();
            $('#receiptErrorContainer').hide();
            $('#multipartFile').parent().next().html("No file chosen");

            //Clear additional rows for items
            for (var i = 0; i <= currentRowNum; i++) {
                $('#itemRow' + i).remove();
            }

            //Reset rowNum
            currentRowNum = 1;

            //Clear any user input
            $(this).find('form')[0].reset();
            $('.receipt-image-file-name').text('');
            $(this).find('.has-error').removeClass('has-error');
            $(this).find('input').removeAttr('aria-describedby');

            //Refresh multiselect
            $("select[id='items0.warrantyUnit']").multiselect('refresh');
        });

    $('#addLabel').on('shown.bs.modal', function() {
        $("#name").trigger("focus");
    })
        .on('hidden.bs.modal', function() {
            console.log('Label modal closed.');

            $('div#labelErrors').empty();
            $('#labelErrorContainer').hide();

            //Clear any user input
            $(this).find('form')[0].reset();
            $(this).find('.has-error').removeClass('has-error');
            $(this).find('input').removeAttr('aria-describedby');
        });

    $('#deleteLabelModal').on('shown.bs.modal', function() {
        $("#deleteCancelButton").trigger("focus");
    })
        .on('hidden.bs.modal', function() {
            console.log('Edit Label modal closed.');

            $('#deleteLabelNameText').empty();
        });

    /*
    VISION FORM COMPONENTS
     */

    //Checks for required components of drag and drop upload.
    var isAdvancedUpload = function() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    };

    var $visionForm     = $('.receipt-ocr-form'),
        $visionInput    = $('.receipt-ocr-form input[type="file"]'),
        $label          = $('.receipt-ocr-form label'),
        $spinner        = $('.spinner'),
        $restart        = $('.receipt-ocr-form-restart'),
        $visionErrorMsg = $('#receiptOcrFormError span'),
        moveToReceiptForm = false,
        showFileName = function(files) {
            $label.text(files[0].name);
        },
        resetVisionForm = function() {
            $label.html('<strong>Choose a file</strong><span class="ocr-drag-and-drop"> or drag it here</span>.');
            $visionForm[0].reset();
            $visionForm.removeClass('is-error');
            droppedFile = false;
        };

    //Drag and drop file support
    if (isAdvancedUpload) {
        $visionForm.addClass('has-advanced-upload');

        var droppedFile = false,
            dragCounter = 0;

        $visionForm.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
            .on('dragenter', function() {
                dragCounter++;
                $visionForm.addClass('has-dragover');
            })
            .on('dragleave dragend drop', function() {
                dragCounter--;
                if (dragCounter === 0) {
                    $visionForm.removeClass('has-dragover');
                }
            })
            .on('drop', function(e) {
                droppedFile = e.originalEvent.dataTransfer.files;
                showFileName(droppedFile);
                $visionForm.trigger('submit');
            });
    }

    $visionForm.on('change', function(e) {
        $visionForm.trigger('submit');
    });
    $visionInput.on('change', function(e) {
        showFileName(e.target.files);
    });

    $visionForm.on('submit', function(e) {
        console.log('Submitting OCR form.');

        if (!$spinner.hasClass('hidden')) return false;

        $spinner.removeClass('hidden');

        if (isAdvancedUpload) {
            e.preventDefault();
            var ajaxData = new FormData();

            if (droppedFile) {
                ajaxData.append($visionInput.attr('name'), droppedFile[0]);
            } else {
                ajaxData.append($visionInput.attr('name'), $visionInput[0].files[0]);
            }

            $.ajax({
                url: $visionForm.attr('action'),
                type: $visionForm.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function() {
                    $spinner.addClass('hidden');
                },
                success: function(res) {
                    if (res.success) {
                        moveToReceiptForm = true;
                        $('#addReceiptOcr').modal('hide');

                        $('.receipt-image-file-name').text(res.data.originalFileName);
                        $('#finishReceiptForm').attr('action', '/ReceiptOrganizer/receipts/' + res.data.receiptId);
                        $('#title').val(res.data.title);
                        $('#description').val(res.data.description);

                        $('#addReceipt').modal('show');
                    } else {
                        $visionForm.addClass('is-error');
                        $visionErrorMsg.text(res.errorMessage);
                    }
                },
                error: function() {
                    $visionForm.addClass('is-error');
                    $visionErrorMsg.text('Unable to process request.');
                }
            });
        } else {
            e.preventDefault();
            // TODO Maybe support older browsers
        }
    });

    $restart.on('click', function(e) {
       e.preventDefault();
       resetVisionForm();
       $visionInput.trigger('click');
    });
});