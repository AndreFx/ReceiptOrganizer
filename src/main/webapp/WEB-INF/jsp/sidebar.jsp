<%--
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java"%>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<c:set var="receiptsUrl" value="/receipts/"/>
<spring:url value="${receiptsUrl}" var="allReceiptsUrl"/>
<spring:url var="createReceiptUrl" value="/receipts/"/>
<spring:url var="deleteLabelUrl" value="/labels/delete"/>
<spring:url var="createLabelUrl" value="/labels/create"/>
<spring:url var="updateLabelUrl" value="/labels/update"/>
<spring:url value="/users/getUserPhoto?thumbnail=true" var="userPhotoView"/>
<nav id="sidebar">
    <div class="sidebarHeader">
        <a href="${allReceiptsUrl}" class="home-link"><h3>AFX Receipt Organizer</h3></a>
        <div class="user-head">
            <a class="avatar">
                <img class="modal-image" width="64" height="60" src="${userPhotoView}" alt="${sessionScope.user.username}'s Account Photo">
            </a>
            <div class="username">
                <h5>Welcome ${sessionScope.user.username}!</h5>
                <span>${sessionScope.user.fName} ${sessionScope.user.lName}</span>
            </div>
        </div>
    </div>
    <div class="content-body">
        <a href="#addReceiptOcr" data-toggle="modal"  title="Add Receipt" class="btn btn-new-receipt">
            Add Receipt
        </a>
    </div>
    <ul class="labels-info nav label-divider" id="labelList">
        <li class="active labelMenu">
            <a href="#labelSubmenu" data-toggle="collapse" aria-expanded="true">Labels</a>
            <ul class="list-unstyled collapse in" id="labelSubmenu">
                <c:choose>
                <c:when test="${activeLabels.size() == 0}">
                <li class="nav-item active">
                    </c:when>
                    <c:otherwise>
                <li class="nav-item">
                    </c:otherwise>
                    </c:choose>
                    <table class="table table-label table-hover">
                        <tbody>
                        <tr class="clickable-row" data-href="${allReceiptsUrl}">
                            <td class="vertical-align-text label-name"><i class="fa fa-sign-blank text-info"></i><span>All Receipts</span></td>
                        </tr>
                        </tbody>
                    </table>
                </li>
                <c:forEach items="${userLabels}" var="label" varStatus="i">
                    <c:choose>
                        <c:when test="${label == null}">
                            <li class="nav-item">
                        </c:when>
                        <c:when test="${activeLabels.contains(label.name)}">
                            <li class="nav-item active">
                        </c:when>
                        <c:otherwise>
                            <li class="nav-item">
                        </c:otherwise>
                    </c:choose>
                    <table class="table table-label table-hover">
                        <tbody>
                        <c:choose>
                            <c:when test="${activeLabels.contains(label.name)}">
                                <!-- Allow users to deselect a single active label -->
                                <spring:url value="${receiptsUrl}" var="url">
                                    <c:forEach items="${activeLabels}" var="activeLabel" varStatus="i">
                                        <c:if test="${!activeLabel.equals(label.name)}">
                                            <spring:param name="requestLabels" value="${activeLabel}"/>
                                        </c:if>
                                    </c:forEach>
                                </spring:url>
                            </c:when>
                            <c:when test="${activeLabels.size() == 0}">
                                <spring:url value="${receiptsUrl}" var="url">
                                    <spring:param name="requestLabels" value="${label.name}"/>
                                </spring:url>
                            </c:when>
                            <c:otherwise>
                                <spring:url value="${receiptsUrl}" var="url">
                                    <c:forEach items="${activeLabels}" var="activeLabel" varStatus="i">
                                        <spring:param name="requestLabels" value="${activeLabel}"/>
                                    </c:forEach>
                                    <spring:param name="requestLabels" value="${label.name}"/>
                                </spring:url>
                            </c:otherwise>
                        </c:choose>
                        <tr class="clickable-row" data-href="${url}">
                            <td class="vertical-align-text label-name"><i class="fa fa-sign-blank text-info"></i><span>${label.name}</span></td>
                            <td class="vertical-align-text menu">
                                <div class="dropdown">
                                    <a class="dropdown-toggle label-dropdown-toggle full-width" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v menu-icon" aria-hidden="true"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-right">
                                        <li class="dropdown-item-edit"><a href="#">Edit Label</a></li>
                                        <li class="dropdown-item-delete"><!-- TODO Remove anchors --><a href="#deleteLabelModal" data-toggle="modal"  title="Delete Label">Delete Label</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </li>
                </c:forEach>
                <li id="editManager" class="nav-item" style="display: none">
                    <form:form autocomplete="off" action="${updateLabelUrl}" method="post">
                        <table class="table table-label">
                            <tbody>
                            <tr>
                                <td>
                                    <div class="alert alert-danger row center-full-width" id="labelEditErrorContainer" style="display: none">
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="table table-label">
                            <tbody>
                            <tr>
                                <td>
                                    <input name="oldLabelName" type="hidden">
                                    <input name="newLabelName" title="Label Name" class="form-control"/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="table table-label">
                            <tbody>
                            <tr>
                                <td class="text-nowrap">
                                    <button type="submit" value="Submit" class="btn btn-save-label-edit">Save Edit</button>
                                    <button type="button" class="btn btn-cancel-label-edit">Cancel</button>
                                </td>
                                <td class="full-width">
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form:form>
                </li>
            </ul>
        </li>
    </ul>
    <div class="content-body">
        <a href="#addLabel" data-toggle="modal"  title="Add Label" class="btn btn-new-receipt">
            Add Label
        </a>
    </div>
</nav>
<!-- Modals -->
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="addReceiptOcr" class="modal fade" style="display: none;">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                <h4 class="modal-title">Add Receipt</h4>
            </div>
            <div class="modal-body" id="receiptOCRBody">
                <form class="receipt-ocr-form" id="newReceiptOcrForm" method="post" action="${createReceiptUrl}?${_csrf.parameterName}=${_csrf.token}" enctype="multipart/form-data">
                    <div id="receiptOcrFormUpload">
                        <input type="file" name="receiptImage" id="receiptImage" accept="image/*,application/pdf">
                        <label for="receiptImage"><strong>Choose a file</strong><span class="ocr-drag-and-drop"> or drag it here</span>.</label>
                        <button id="receiptOcrFormBtn" class="btn btn-send hidden" type="submit" value="Submit">Upload</button>
                    </div>
                    <div id="receiptOcrFormError">
                        Error!
                        <span></span>
                        <a href="#" class="receipt-ocr-form-restart" role="button">Try again!</a>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <h4 class="footer-text">Create a new receipt</h4>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="addReceipt" class="modal fade" style="display: none;">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                <h4 class="modal-title">Update Receipt</h4>
            </div>
            <div class="modal-body" id="newReceiptBody">
                <form:form id="finishReceiptForm" autocomplete="off" modelAttribute="newReceipt" method="post" class="form-horizontal">
                    <div class="form-group alert alert-danger center-full-width error-container" id="receiptErrorContainer">
                        <div class="col-lg-10" id="receiptErrors"></div>
                    </div>
                    <div class="form-group">
                        <form:label path="title" class="col-lg-2 control-label">Title</form:label>
                        <div class="col-lg-9">
                            <form:input path="title" type="text" placeholder="" value="" maxlength="50" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="date" class="col-lg-2 control-label">Date</form:label>
                        <div class="col-lg-9">
                            <form:input path="date" type="text" placeholder="MM/dd/yyyy" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group" id="itemRowNames">
                        <label class="col-lg-2 control-label">Receipt Items</label>
                        <label class="col-lg-2 control-table-label">Name</label>
                        <label class="col-lg-2 control-table-label">Quantity</label>
                        <label class="col-lg-2 control-table-label">Unit Price</label>
                        <label class="col-lg-4 control-table-label">Warranty Length</label>
                    </div>
                    <div class="form-group" id="receiptAddItem">
                        <div class="col-lg-offset-2 col-lg-10">
                            <button id="receiptAddItemBtn" class="btn" type="button">
                                <i class="fa fa-plus fa-white"></i>
                                <span> Item</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="total" class="col-lg-2 control-label">Tax</form:label>
                        <div class="col-lg-9">
                            <fmt:formatNumber value='${newReceipt.tax}' type="currency" currencySymbol="" var="formattedTax"/>
                            <form:input path="tax" type="text" value="${formattedTax}" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="total" class="col-lg-2 control-label">Total</form:label>
                        <div class="col-lg-9">
                            <fmt:formatNumber value='${newReceipt.total}' type="currency" currencySymbol="" var="formattedTotal"/>
                            <form:input path="total" type="text" value="${formattedTotal}" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="labels" class="col-lg-2 control-label">Labels</form:label>
                        <div class="col-lg-9">
                            <form:select multiple="true" path="labels" placeholder="" value="" class="form-control">
                                <form:options items="${userLabels}" itemLabel="name" itemValue="name"/>
                            </form:select>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="description" class="col-lg-2 control-label">Description</form:label>
                        <div class="col-lg-9">
                            <form:textarea path="description" rows="10" cols="30" maxlength="500" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-2 col-lg-9">
                            <div class="receipt-submit-container">
                                <div class="file-input-container">
                                    <span class="receipt-image-file-name"></span>
                                </div>
                                <div>
                                    <form:button id="receiptCreateSubmit" class="btn btn-send">Finish</form:button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form:form>
            </div>
            <div class="modal-footer">
                <h4 class="footer-text">Update an existing receipt</h4>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- Modal -->
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="deleteLabelModal" class="modal fade" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                <h4 class="modal-title">Delete Label</h4>
            </div>
            <div class="modal-body">
                <p class="text-center" id="deleteLabelNameText"></p>
            </div>
            <div class="modal-footer">
                <form:form id="deleteLabel" autocomplete="off" action="${deleteLabelUrl}" method="post" class="form-horizontal">
                    <input type="hidden" name="labelName" id="deleteLabelNameValue">
                    <button class="btn btn-secondary">Yes</button>
                    <button id="deleteCancelButton" aria-hidden="true" data-dismiss="modal" class="btn btn-send" type="button">No</button>
                </form:form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<div aria-hidden="true" aria-labelledby="addLabelModal" role="dialog" tabindex="-1" id="addLabel" class="modal fade" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                <h4 class="modal-title">Add Label</h4>
            </div>
            <div class="modal-body">
                <form:form id="createLabel" autocomplete="off" action="${createLabelUrl}" modelAttribute="newLabel" method="post" class="form-horizontal">
                    <div class="form-group alert alert-danger center-full-width" hidden="true" id="labelErrorContainer">
                        <div class="col-lg-10" id="labelErrors"></div>
                    </div>
                    <div class="form-group">
                        <form:label path="name" class="col-lg-2 control-label">Label</form:label>
                        <div class="col-lg-10">
                            <form:input path="name" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-2 col-lg-10">
                            <form:button class="btn btn-send">Create</form:button>
                        </div>
                    </div>
                </form:form>
            </div>
            <div class="modal-footer">
                <h4 class="footer-text">Create a new label to categorize your receipts</h4>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
