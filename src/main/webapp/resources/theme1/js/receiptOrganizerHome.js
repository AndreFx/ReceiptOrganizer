$(document).ready(function() {

    //Custom validators

    jQuery.validator.addMethod("notAllSpace", function(value, element) {
        return value.trim().length != 0;
    }, "Empty input not allowed");

    //TODO Find a better way to do this. Shouldnt make synchronous Ajax call
    jQuery.validator.addMethod("uniqueLabel", function(value, element) {
        var success = false;

        var fd = new FormData();
        fd.append("labelName", value);

        $.ajax({
                       url : '/ReceiptOrganizer/labels/validate',
                       type: "POST",
                       data : fd,
                       processData: false,
                       contentType: false,
                       async: false,
                       success : function(res) {

                           if(res.validated){
                               //Submit to real service
                               //$('#receiptCreateSubmit').submit();
                               console.log("Valid label submission attempt.");
                               success = true;
                           } else {
                               //Set error messages
                               console.log("Invalid label submission attempt.");
                               success = false;
                           }
                       }
       });
       return success;
    }, "Label must be unique");

    //Modals and validation

    $('#addReceipt').on('hidden.bs.modal', function() {
        console.log('Receipt modal closed.');

        //Hide error messages
        $('div#receiptErrors').empty();
        $('#receiptErrorContainer').hide();

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

    $('#newLabel').validate({
        rules: {
            name: {
                required: true,
                uniqueLabel: true
            }
        },

        messages: {
            name: {
                required: "Label name is required",
                uniqueLabel: "Label name must be unique"
            }
        },

        onkeyup: false,

        onfocusout: false,

        errorElement: 'div',

        errorPlacement: function(error, element) {
            console.log("Placing newLabel form errors.");
            error.appendTo('div#labelErrors');
            $('#labelErrorContainer').show();
        },

        submitHandler: function(form) {
            $('#labelErrorContainer').hide();
            form.submit();
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

    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });

    //Show image modal
    $(".modal-image").click(function(event) {
        event.stopPropagation();
        $("body").addClass("image-modal-open");
        $("#imageModal").css("display", "block");

        $("#modalImage").attr("src", $(this).attr("src"));
        $("#modalCaption").text($(this).attr("alt"));
    });

    // When the user clicks on <span> (x), close the modal
    $(".image-modal-close").click(function() {
        $("body").removeClass("image-modal-open")
        $("#imageModal").css("display", "none");
    });


    $('#editLabel').on('hidden.bs.modal', function() {
        console.log('Edit Label modal closed.');

        //Hide error messages
        $('#labelEditErrorContainer ul').empty();
        $('#labelEditErrorContainer').hide();

        //Clear any user input
        var i;
        for (i = 0; i < $(this).find('form').length; i++) {
            console.log('Iteration #: ' + i);
            $(this).find('form')[i].reset();
        }
    });

//TODO AJAX Example
//            $(function() {
//                //  Submit form using Ajax
//                $('#newReceipt').submit(function(e) {
//                    e.preventDefault();
//
//                    //Remove all errors
//                    $('input').next().remove();
//
//                    //Setup form data
//                    var fd = new FormData();
//
//                    fd.append( "title", $('input[name=title]').val());
//                    fd.append( "date", $('input[name=date]').val());
//                    fd.append( "numItems", $('input[name=numItems]').val());
//                    fd.append( "receiptAmount", $('input[name=receiptAmount]').val());
//                    fd.append( "labels", $('select[name=labels]').val());
//                    fd.append( "description", $('textarea[name=description]').val());
//                    var temp = $('input[name=multipartFile]').get(0).files[0];
//                    //Don't pass undefined string if there is no file.
//                    if (typeof temp  != 'undefined') {
//                        fd.append( "multipartFile", temp);
//                    }
//
//                    $.ajax({
//                        url : 'validatereceipt.do',
//                        type: "POST",
//                        data : fd,
//                        enctype: 'multipart/form-data',
//                        processData: false,
//                        contentType: false,
//                        success : function(res) {
//
//                            if(res.validated){
//                                //Submit to real service
//                                //$('#receiptCreateSubmit').submit();
//                                console.log("Valid submission attempt.");
//                                return true;
//                            } else {
//                                //Set error messages
//                                console.log("Invalid submission attempt.");
//                                $.each(res.errorMessages, function(key,value){
//                                    $('input[name='+key+']').after('<div class="alert alert-danger">'+value+'</div>');
//                                });
//                                return false;
//                            }
//                        }
//                    })
//                });
//            });
});