<%@page contentType="text/html;charset=UTF-8" language="java"%>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<spring:url var="createReceiptUrl" value="/receipts/create"/>
<spring:url var="deleteLabelUrl" value="/labels/delete"/>
<spring:url var="createLabelUrl" value="/labels/create"/>
<spring:url var="updateLabelUrl" value="/labels/update"/>
<spring:url value="/users/getUserPhoto?thumbnail=true" var="userPhotoView"/>

<aside class="sm-side">
    <div class="user-head">
        <a class="inbox-avatar">
            <img class="modal-image" width="64" height="60" src="${userPhotoView}" alt="${sessionScope.user.username}'s Account Photo">
        </a>
        <div class="user-name">
            <h5>Welcome ${sessionScope.user.username}!</h5>
            <span>${sessionScope.user.fName} ${sessionScope.user.lName}</span>
        </div>
    </div>
    <div class="inbox-body">
        <a href="#addReceipt" data-toggle="modal"  title="Add Receipt" class="btn btn-compose">
            Add Receipt
        </a>
    </div>
    <ul class="nav-stacked labels-info nav nav-pills inbox-divider" id="labelList">
        <li><div class="labels-title-container"><h4 class="labels-title">Labels</h4></div></li>
        <li class="nav-item">
            <table class="table table-label table-hover">
                <tbody>
                    <tr class="clickable-row" data-href="${param.baseHomeUrl}">
                        <td class="vertical-align-text label-name"><i class="fa fa-sign-blank text-info"></i><span>All Receipts</span></td>
                    </tr>
                </tbody>
            </table>
        </li>
        <c:forEach items="${labels}" var="label" varStatus="i">
            <li class="nav-item">
                <table class="table table-label table-hover">
                    <tbody>
                        <tr class="clickable-row" data-href="${param.baseHomeUrl}?label=${label.name}">
                            <td class="vertical-align-text label-name"><i class="fa fa-sign-blank text-info"></i><span>${label.name}</span></td>
                            <td class="vertical-align-text menu">
                                <div class="dropdown">
                                    <a class="dropdown-toggle full-width" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                                <input name="newLabelName" class="form-control"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table table-label">
                    <tbody>
                        <tr>
                            <td class="text-nowrap">
                                <button type="submit" value="Submit" class="btn btn-send">Save Edit</button>
                                <button type="button" class="btn btn-secondary">Cancel</button>
                            </td>
                            <td class="full-width">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form:form>
        </li>
    </ul>
    <div class="inbox-body">
        <a href="#addLabel" data-toggle="modal"  title="Add Label" class="btn btn-compose">
            Add Label
        </a>
    </div>
    <!-- Modals -->
    <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="addReceipt" class="modal fade" style="display: none;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                    <h4 class="modal-title">Add Receipt</h4>
                </div>
                <div class="modal-body">
                    <form:form autocomplete="off" modelAttribute="newReceipt" method="post" action="${createReceiptUrl}?${_csrf.parameterName}=${_csrf.token}" class="form-horizontal" enctype="multipart/form-data">
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
                            <form:label path="receiptAmount" class="col-lg-2 control-label">Receipt Amount</form:label>
                            <div class="col-lg-9">
                                <form:input path="receiptAmount" type="text" placeholder="" value="" class="form-control"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <form:label path="labels" class="col-lg-2 control-label">Labels</form:label>
                            <div class="col-lg-9">
                                <form:select multiple="true" path="labels" placeholder="" value="" class="form-control">
                                    <form:options items="${labels}" itemLabel="name" itemValue="name"/>
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
                                        <span class="btn green fileinput-button">
                                            <i class="fa fa-plus fa fa-white"></i>
                                            <span>Receipt</span>
                                            <form:input class="multipart-input" path="multipartFile" type="file" accept="image/*,application/pdf"/>
                                        </span>
                                        <form:label path="multipartFile">No file chosen</form:label>
                                    </div>
                                    <div>
                                        <form:button id="receiptCreateSubmit" class="btn btn-send">Create</form:button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form:form>
                </div>
                <div class="modal-footer">
                    <h4 class="footer-text">Create a new receipt</h4>
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
</aside>
