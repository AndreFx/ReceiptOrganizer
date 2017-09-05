$(document).ready(function() {
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
});