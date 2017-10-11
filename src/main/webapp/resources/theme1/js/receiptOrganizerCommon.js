$(document).ready(function() {

    /* Custom validators */

    jQuery.validator.addMethod("notAllSpace", function(value, element) {
        return value.trim().length != 0;
    }, "Empty input not allowed");

    jQuery.validator.addMethod("validUSDate", function(value, element) {
        var pattern = /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/;
        var match = value.match(pattern);
        if (!match) {
            return false;
        }

        var d = new Date(value);

        if (d.getMonth()+1 == parseInt(match[1], 10) && d.getDate() == parseInt(match[2], 10)) {
            return true;
        }
        return false;
    }, "Invalid date input");

    /* File upload label functionality */

    $('.multipart-input').change(function() {
        console.log("User selected file");
        var filename = $(this).val().split('\\').pop();
        if (filename) {
            $(this).parent().next().html(filename);
        } else {
            $(this).parent().next().html("No file chosen");
        }
    });

    /* Image Modal functionality */

    //Show image modal
    //TODO Fix for user photo
    $(".modal-image").click(function(event) {
        console.log("Image Modal toggled.");
        event.stopPropagation();
        $("body").addClass("image-modal-open");
        $("#imageModal").css("display", "block");

        var src = $(this).attr("src");
        var noQryStr = src.substring(0, src.indexOf('?'));
        var crtString = noQryStr + "?thumbnail=false";

        $("#modalImage").attr("src", crtString);
        $("#modalCaption").text($(this).attr("alt"));
    });

    // When the user clicks on <span> (x), close the modal
    $(".image-modal-close").click(function() {
        $("body").removeClass("image-modal-open");
        $("#imageModal").css("display", "none");
    });

    /* Clickable row handler */


    $(".clickable-row").click(function(event) {
        console.log("Row clicked.");

        if (!$(event.target).hasClass('menu-icon') && !$(event.target).hasClass('dropdown-toggle')) {
            console.log("Menu wasn't the target");
            event.stopPropagation();
            var attr = $(this).attr("data-toggle");

            if (typeof attr !== typeof undefined && attr !== false) {
                $('#addLabel').modal('show');
            } else {
                window.location = $(this).data("href");
            }
        }
    });
});