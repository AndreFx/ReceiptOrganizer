<%--
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!doctype html>
<html lang="en">
<head>
    <!-- SITE URLS -->
    <spring:url var="receiptIndexUrl" value="/receipts/"/>
    <spring:url var="searchUrl" value="/receipts/"/>
    <spring:url var="updateReceiptUrl" value="/receipts/${receiptId}"/>
    <spring:url var="deleteReceiptUrl" value="/receipts/${receiptId}/delete"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>
    <spring:url value="/users/getUserPhoto" var="userPhotoView"/>
    <spring:url value="/receipts/${receipt.receiptId}/image?thumbnail=false" var="receiptViewImageUrl"/>

    <!-- FONTS -->
    <spring:url value="https://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>

    <!-- STYLESHEETS -->
    <spring:url value="/resources/css/styleguide.css" var="styleguide"/>
    <spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
    <spring:url value="/resources/css/bootstrap-multiselect.css" var="multiselectcss"/>
    <spring:url value="/resources/css/fontawesome-all.css" var="fontawesomecss"/>
    <spring:url value="/resources/css/jquery-ui.css" var="uicss"/>
    <spring:url value="/resources/css/jquery.mCustomScrollbar.min.css" var="sidebarScrollCss"/>

    <!-- JAVASCRIPT -->
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
    <spring:url value="/resources/js/bootstrap-multiselect.js" var="multiselectjs"/>
    <spring:url value="/resources/js/jquery.validate.min.js" var="validate"/>
    <spring:url value="/resources/js/additional-methods.min.js" var="addvalidate"/>
    <spring:url value="/resources/js/jquery-ui.min.js" var="ui"/>
    <spring:url value="/resources/js/jquery.mCustomScrollbar.min.js" var="sidebarScroll"/>
    <spring:url value="/resources/js/common.js" var="receiptCommon"/>
    <spring:url value="/resources/js/receipt-edit.js" var="receiptEdit"/>
    <spring:url value="/resources/js/sidebar.js" var="sidebar"/>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>

    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" href="${bootstrap}"/>
    <link rel="stylesheet" href="${multiselectcss}"/>
    <link rel="stylesheet" href="${uicss}"/>
    <link rel="stylesheet" href="${sidebarScrollCss}"/>
    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" href="${styleguide}">

    <script src="${jquery}"></script>
    <script defer src="${bootstrapjs}"></script>
    <script defer src="${multiselectjs}"></script>
    <script defer src="${validate}"></script>
    <script defer src="${addvalidate}"></script>
    <script defer src="${ui}"></script>
    <script defer src="${sidebarScroll}"></script>
    <script defer src="${receiptCommon}"></script>
    <script defer>
        //Allow receipt-edit.js to get current number of receipts
        var editCurrentRowNum = ${receipt.items.size()} + 1;

        $(function() {
            $(function () {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                $(document).ajaxSend(function(e, xhr, options) {
                    xhr.setRequestHeader(header, token);
                });
            });
        });
    </script>
    <script defer src="${sidebar}"></script>
    <script defer src="${receiptEdit}"></script>

    <title>${receipt.title}</title>
</head>
<body>
    <div class="wrapper">
        <jsp:include page="/WEB-INF/jsp/sidebar.jsp"/>
        <div id="content">
            <jsp:include page="navbar.jsp"/>
            <div class="content-body">
                <img class="receipt-edit-image modal-image" alt="${receipt.title} Image" src='<c:out value="${receiptViewImageUrl}"/>'>
                <form:form autocomplete="off" modelAttribute="receipt" method="post" action="${updateReceiptUrl}" class="form-horizontal">
                    <div class="form-group alert alert-danger center-full-width error-container" id="editReceiptErrorContainer">
                        <div class="col-lg-10" id="editReceiptErrors"></div>
                    </div>
                    <div class="form-group">
                        <form:label path="title" class="col-lg-2 control-label">Title</form:label>
                        <div class="col-lg-10">
                            <form:input path="title" id="editTitle" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="date" class="col-lg-2 control-label">Date</form:label>
                        <div class="col-lg-10">
                            <form:input path="date" id="editDate" type="text" placeholder="MM/dd/yyyy" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group" id="editItemRowNames">
                        <label class="col-lg-2 control-label">Receipt Items</label>
                        <label class="col-lg-2 control-table-label">Name</label>
                        <label class="col-lg-2 control-table-label">Quantity</label>
                        <label class="col-lg-2 control-table-label">Unit Price</label>
                        <label class="col-lg-4 control-table-label">Warranty Length</label>
                    </div>
                    <c:forEach items="${receipt.items}" var="receiptItem" varStatus="i">
                        <div class="form-group" id="editItemRow${i.index + 1}">
                            <label id="editItemDeleteLabel${i.index + 1}" class="col-lg-2 control-label item-label">Item #${i.index + 1}</label>
                            <div id="editItemDeleteDiv${i.index + 1}" class="col-lg-2" style="display: none;">
                                <button type="button" class="btn btn-send edit-item-delete-button"><span id="close" class="delete-icon">&times;</span> Delete</button>
                            </div>
                            <div class="col-lg-2">
                                <form:input id="edititems${i.index}.name" path="items[${i.index}].name" type="text" placeholder="" value="${receiptItem.name}" maxlength="50" class="form-control"/>
                            </div>
                            <div class="col-lg-2">
                                <form:input id="edititems${i.index}.quantity" path="items[${i.index}].quantity" type="text" placeholder="" value="${receiptItem.quantity}" class="form-control"/>
                            </div>
                            <div class="col-lg-2">
                                <fmt:formatNumber value='${receiptItem.unitPrice}' type="currency" currencySymbol="" var="formattedUnitPrice"/>
                                <form:input id="edititems${i.index}.unitPrice" path="items[${i.index}].unitPrice" type="text" placeholder="" value="${formattedUnitPrice}" class="form-control"/>
                            </div>
                            <div class="col-lg-2">
                                <form:input id="edititems${i.index}.warrantyLength" path="items[${i.index}].warrantyLength" type="text" placeholder="" value="${receiptItem.warrantyLength}" class="form-control"/>
                            </div>
                            <div class="col-lg-2">
                                <form:select id="edititems${i.index}.warrantyUnit" path="items[${i.index}].warrantyUnit" placeholder="" value="" class="form-control">
                                    <c:choose>
                                        <c:when test='${receiptItem.warrantyUnit.equals("d")}'>
                                            <option selected="selected" value="d">Day(s)</option>
                                            <option value="m">Month(s)</option>
                                            <option value="y">Year(s)</option>
                                        </c:when>
                                        <c:when test='${receiptItem.warrantyUnit.equals("m")}'>
                                            <option value="d">Day(s)</option>
                                            <option selected="selected" value="m">Month(s)</option>
                                            <option value="y">Year(s)</option>
                                        </c:when>
                                        <c:otherwise>
                                            <option selected="selected" value="d">Day(s)</option>
                                            <option value="m">Month(s)</option>
                                            <option selected="selected" value="y">Year(s)</option>
                                        </c:otherwise>
                                    </c:choose>
                                </form:select>
                            </div>
                        </div>
                    </c:forEach>
                    <div class="form-group" id="receiptAddItem">
                        <div class="col-lg-offset-2 col-lg-10">
                            <button id="editReceiptAddItemBtn" class="btn" type="button">
                                <i class="fa fa-plus fa-white"></i>
                                <span> Item</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="total" class="col-lg-2 control-label">Tax</form:label>
                        <div class="col-lg-10">
                            <fmt:formatNumber value='${receipt.tax}' type="currency" currencySymbol="" var="formattedEditTax"/>
                            <form:input path="tax" id="editTax" type="text" value="${formattedEditTax}" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="total" class="col-lg-2 control-label">Total</form:label>
                        <div class="col-lg-10">
                            <fmt:formatNumber value='${receipt.total}' type="currency" currencySymbol="" var="formattedEditTotal"/>
                            <form:input path="total" id="editTotal" type="text" value="${formattedEditTotal}" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="labels" class="col-lg-2 control-label">Labels</form:label>
                        <div class="col-lg-10">
                            <form:select multiple="true" path="labels" id="editLabels" placeholder="" value="" class="form-control">
                                <form:options items="${userLabels}" itemLabel="name" itemValue="name"/>
                            </form:select>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="description" class="col-lg-2 control-label">Description</form:label>
                        <div class="col-lg-10">
                            <form:textarea path="description" id="editDescription" rows="10" cols="30" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-2 col-lg-10">
                            <div class="receipt-edit-buttons">
                                <div class="btn-group-container">
                                    <div class="receipt-submit-container">
                                        <div class="file-input-container">
                                            <span class="receipt-image-file-name">${receipt.originalFileName}</span>
                                        </div>
                                        <div>
                                            <form:button id="receiptEditSubmit" class="btn btn-send form-save">Save Changes</form:button>
                                        </div>
                                    </div>
                                </div>
                                <div class="btn-group-container">
                                    <a href="#deleteReceipt" data-toggle="modal"  title="Delete Receipt" class="btn btn-send">
                                        Delete Receipt
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form:form>
                <!-- Modal -->
                <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="deleteReceipt" class="modal fade" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                                <h4 class="modal-title">Delete Receipt</h4>
                            </div>
                            <div class="modal-body">
                                <p class="text-center">Are you sure you want to delete the receipt: ${receipt.title}?</p>
                            </div>
                            <div class="modal-footer">
                                <form:form id="deleteReceiptForm" autocomplete="off" action="${deleteReceiptUrl}" method="post" class="form-horizontal">
                                    <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
                                    <button class="btn btn-secondary">Yes</button>
                                    <button id="cancelDeleteReceipt" aria-hidden="true" data-dismiss="modal" class="btn btn-send" type="button">No</button>
                                </form:form>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            </div>
            <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
        </div>
    </div>
    <div class="snackbar">
        <span id="snackbarText"></span>
    </div>
    <jsp:include page="/WEB-INF/jsp/image-modal.jsp"/>
    <jsp:include page="/WEB-INF/jsp/loader.jsp"/>
</body>
</html>
