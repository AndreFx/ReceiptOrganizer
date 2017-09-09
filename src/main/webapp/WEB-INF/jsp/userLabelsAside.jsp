<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<spring:url var="createReceiptUrl" value="/receipts/create"/>
<spring:url var="deleteLabelUrl" value="/labels/delete"/>
<spring:url var="createLabelUrl" value="/labels/create"/>
<spring:url var="updateLabelUrl" value="/labels/update"/>
<spring:url value="/users/getUserPhoto" var="userPhotoView"/>

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
        <!-- Modal -->
        <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="addReceipt" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                        <h4 class="modal-title">Add Receipt</h4>
                    </div>
                    <div class="modal-body">
                        <form:form autocomplete="false" modelAttribute="newReceipt" method="post" action="${createReceiptUrl}?${_csrf.parameterName}=${_csrf.token}" class="form-horizontal" enctype="multipart/form-data">
                            <div class="form-group alert alert-danger center-full-width error-container" id="receiptErrorContainer">
                                <div class="col-lg-10" id="receiptErrors"></div>
                            </div>
                            <div class="form-group">
                                <form:label path="title" class="col-lg-2 control-name">Title</form:label>
                                <div class="col-lg-10">
                                    <form:input path="title" type="text" placeholder="" value="" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <form:label path="date" class="col-lg-2 control-name">Date</form:label>
                                <div class="col-lg-10">
                                    <form:input path="date" type="text" placeholder="MM/dd/yyyy" value="" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <form:label path="numItems" class="col-lg-2 control-name"># of Items</form:label>
                                <div class="col-lg-10">
                                    <form:input path="numItems" type="text" placeholder="" value="" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <form:label path="receiptAmount" class="col-lg-2 control-name">Receipt Amount</form:label>
                                <div class="col-lg-10">
                                    <form:input path="receiptAmount" type="text" placeholder="" value="" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <form:label path="labels" class="col-lg-2 control-name">Labels</form:label>
                                <div class="col-lg-10">
                                    <form:select multiple="true" path="labels" placeholder="" value="" class="form-control">
                                        <form:options items="${labels}" itemLabel="name" itemValue="name"/>
                                    </form:select>
                                </div>
                            </div>
                            <div class="form-group">
                                <form:label path="description" class="col-lg-2 control-name">Description</form:label>
                                <div class="col-lg-10">
                                    <form:textarea path="description" rows="10" cols="30" value="" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-lg-offset-2 col-lg-10">
                                            <span class="btn green fileinput-button">
                                                <i class="fa fa-plus fa fa-white"></i>
                                                <span>Receipt</span>
                                                <form:input path="multipartFile" type="file" accept=".png,.jpg"/>
                                            </span>
                                    <form:button id="receiptCreateSubmit" class="btn btn-send">Create</form:button>
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
    </div>
    <ul class="nav-stacked labels-info nav nav-pills inbox-divider">
        <li><div class="labels-title-container"><h4 class="labels-title">Labels</h4><a href="#editLabel" data-toggle="modal"  title="Edit Labels" class="labels-edit"><i class="fa fa-pencil-square-o"></i></a></div></li>
        <div aria-hidden="true" aria-labelledby="editLabelModel" role="dialog" tabindex="-1" id="editLabel" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                        <h4 class="modal-title">Edit Labels</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group alert alert-danger row center-full-width" id="labelEditErrorContainer" style="display: none">
                            <ul></ul>
                        </div>
                        <c:forEach items="${labels}" var="label" varStatus="i">
                            <div class="form-group row">
                                <form id="editLabelForm${label.name.replaceAll("\\s+","")}" action="${updateLabelUrl}" method="post" class="col-lg-10 form-horizontal">
                                    <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
                                    <label class="col-lg-4 control-name">${label.name}</label>
                                    <div class="col-lg-5">
                                        <input name="oldLabelName" value="${label.name}" type="hidden">
                                        <input name="newLabelName" placeholder="" value="${label.name}" class="form-control"/>
                                    </div>
                                    <div class="col-lg-3">
                                        <button type="submit" value="Submit" class="btn btn-send">Save Edit</button>
                                    </div>
                                </form>
                                <div class="col-lg-2">
                                    <form action="${deleteLabelUrl}" method="post" class="form-horizontal">
                                        <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
                                        <input type="hidden" name="labelName" value="${label.name}">
                                        <button class="btn btn-send">Delete</button>
                                    </form>
                                </div>
                            </div>
                        </c:forEach>
                    </div>
                    <div class="modal-footer">
                        <h4 class="footer-text">Edit or delete your configured labels</h4>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <li class="nav-item"><a class="nav-link" href="${param.baseHomeUrl}"><i class="fa fa-sign-blank text-info"></i>All Receipts</a></li>
        <c:forEach items="${labels}" var="label" varStatus="i">
            <li class="nav-item"><a class="nav-link" href="${param.baseHomeUrl}?label=${label.name}"><i class="fa fa-sign-blank text-info"></i>${label.name}</a></li>
        </c:forEach>
        <li><a href="#addLabel" data-toggle="modal"  title="Add Label"><i class="fa fa-plus"></i><i class="fa fa-sign-blank text-info"></i> Create New Label</a></li>
        <div aria-hidden="true" aria-labelledby="addLabelModal" role="dialog" tabindex="-1" id="addLabel" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                        <h4 class="modal-title">Add Label</h4>
                    </div>
                    <div class="modal-body">
                        <form:form autocomplete="false" action="${createLabelUrl}" modelAttribute="newLabel" method="post" class="form-horizontal">
                            <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
                            <div class="form-group alert alert-danger center-full-width" hidden="true" id="labelErrorContainer">
                                <div class="col-lg-10" id="labelErrors"></div>
                            </div>
                            <div class="form-group">
                                <form:label path="name" class="col-lg-2 control-name">Label</form:label>
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
    </ul>
</aside>
