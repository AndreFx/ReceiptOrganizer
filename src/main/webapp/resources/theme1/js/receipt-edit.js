$(function() {
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
                number: true
            },
            tax: {
                number: true
            },
            date: "validUSDate",
            description: {
                maxlength: 2000
            }
        },

        messages: {
            title: {
                required: "Title is required",
                notAllSpace: "Title is required",
                maxlength: "Title must be under 50 characters"
            },
            receiptAmount: {
                number: "Receipt Amount must be a valid number"
            },
            tax: {
                number: "Tax amount must be a valid number"
            },
            date: "Please enter a date in the format of MM/dd/yyyy",
            description: {
                maxlength: "Description must be under 2000 characters"
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

    //Initialize current row multiselects, delete buttons, and validators
    for (var i = 0; i < editCurrentRowNum; i++) {
        $("select[id='edititems" + i + ".warrantyUnit']").multiselect();

        createItemDeleteButtonHandlers("body", "editItemDeleteLabel", "editItemDeleteDiv", i);

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

    /* Add new item functionality for edit receipt */

    var maxRowNum = editCurrentRowNum - 1;

    $('.content-body').on('click', "#editReceiptAddItemBtn", function(event) {
        event.stopPropagation();
        console.log("Adding new item row " + editCurrentRowNum + " in edit receipt view");

        //Create copy of row
        var newRow = $("<div class=\"form-group\" id=\"editItemRow0\">\n" +
            "        <label id=\"editItemDeleteLabel1\" class=\"col-lg-2 control-label item-label\">Item #1</label>\n" +
            "        <div id=\"editItemDeleteDiv1\" class=\"col-lg-2\" style=\"display: none;\">\n" +
            "            <button type=\"button\" class=\"btn btn-send edit-item-delete-button\"><span id=\"close\" class=\"delete-icon\">&times;</span> Delete</button>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"edititems0.name\" name=\"items[0].name\" type=\"text\" placeholder=\"\" value=\"\" maxlength=\"50\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"edititems0.quantity\" name=\"items[0].quantity\" type=\"text\" placeholder=\"\" value=\"0\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"edititems0.unitPrice\" name=\"items[0].unitPrice\" type=\"text\" placeholder=\"\" value=\"0.00\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <input id=\"edititems0.warrantyLength\" name=\"items[0].warrantyLength\" type=\"text\" placeholder=\"\" value=\"0\" class=\"form-control\"/>\n" +
            "        </div>\n" +
            "        <div class=\"col-lg-2\">\n" +
            "            <select id=\"edititems0.warrantyUnit\" name=\"items[0].warrantyUnit\" placeholder=\"\" value=\"\" class=\"form-control\">\n" +
            "                <option selected=\"selected\" value=\"d\">Day(s)</option>\n" +
            "                <option value=\"m\">Month(s)</option>\n" +
            "                <option value=\"y\">Year(s)</option>\n" +
            "            </select>\n" +
            "        </div>\n" +
            "    </div>");

        //Clear and update values of row
        $(newRow).attr("id", "editItemRow" + editCurrentRowNum);
        $(newRow).find("#editItemDeleteLabel1").attr("id", "editItemDeleteLabel" + editCurrentRowNum);
        $(newRow).find("#editItemDeleteDiv1").attr("id", "editItemDeleteDiv" + editCurrentRowNum);
        $(newRow).find('label.control-label').text("Item #" + editCurrentRowNum);
        $(newRow).find("input[id='edititems0.name']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".name")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].name");
        $(newRow).find("input[id='edititems0.quantity']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".quantity")
            .attr("name", "items[" + (editCurrentRowNum - 1)+ "].quantity");
        $(newRow).find("input[id='edititems0.unitPrice']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".unitPrice")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].unitPrice");
        $(newRow).find("input[id='edititems0.warrantyLength']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".warrantyLength")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].warrantyLength");
        $(newRow).find("select[id='edititems0.warrantyUnit']").attr("id", "edititems" + (editCurrentRowNum - 1) + ".warrantyUnit")
            .attr("name", "items[" + (editCurrentRowNum - 1) + "].warrantyUnit");

        //Enable multiselect
        $(newRow).find("select[id='edititems" + (editCurrentRowNum - 1) + ".warrantyUnit']").multiselect();

        //Insert row
        if (editCurrentRowNum == 1) {
            $(newRow).insertAfter("#editItemRowNames");
        } else {
            $(newRow).insertAfter("#editItemRow" + (editCurrentRowNum - 1));
        }

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

        //Only bind delete button hovers once
        //This works becuase it will never create handlers for a currentRowNum more than once.
        if (editCurrentRowNum > maxRowNum) {
            createItemDeleteButtonHandlers("body", "editItemDeleteLabel", "editItemDeleteDiv", editCurrentRowNum);
            maxRowNum = editCurrentRowNum;
        }

        editCurrentRowNum++;
    });

    /* Delete item functionality */

    //Delete button functionality
    $('.content-body').on("click", ".edit-item-delete-button", function(event) {
        var rowNum = Number($(this).parent().parent().attr('id').slice(-1));
        console.log("Deleting item row " + rowNum);

        //delete row
        $(this).parent().parent().remove();

        //Update rows after rowNum
        decrementItemRowAttributes(rowNum + 1);
        editCurrentRowNum--;
    });

    function decrementItemRowAttributes(rowNumStart) {
        var i = rowNumStart;

        //Start after deleted row
        for (i; i < editCurrentRowNum; i++) {
            var row = $("#editItemRow" + i);

            //Decrease the value of all attributes of the rows
            $(row).attr('id', "editItemRow" + (i - 1));
            $(row).find("label.control-label").text("Item #" + (i - 1));

            //reassign id
            $(row).find("#editItemDeleteLabel" + i).attr("id", "editItemDeleteLabel" + (i - 1));
            $(row).find("#editItemDeleteDiv" + i).attr("id", "editItemDeleteDiv" + (i - 1));
        }
    }

    //Create datepicker
    $('#editDate').datepicker();

    //Delete Modal
    $('#deleteReceipt').on('shown.bs.modal', function() {
        $("#cancelDeleteReceipt").focus();
    });

});