<%--
  Created by IntelliJ IDEA.
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
    <spring:url var="baseHomeUrl" value="/home/"/>
    <spring:url var="editReceiptUrl" value="/receipts/${receiptId}/update"/>
    <spring:url var="deleteLabelUrl" value="/labels/delete"/>
    <spring:url var="createLabelUrl" value="/labels/create"/>
    <spring:url var="updateLabelUrl" value="/labels/update"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/settings"/>

    <spring:url value="/resources/css/afx_home_styleguide.css" var="styleguide"/>
    <spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
    <spring:url value="/resources/css/bootstrap-multiselect.css" var="multiselectcss"/>
    <spring:url value="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" var="fontawesomecss"/>
    <spring:url value="/resources/css/jquery-ui.css" var="uicss"/>

    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
    <spring:url value="/resources/js/bootstrap-multiselect.js" var="multiselectjs"/>
    <spring:url value="/resources/js/jquery.validate.min.js" var="validate"/>
    <spring:url value="/resources/js/jquery-ui.min.js" var="ui"/>
    <spring:url value="/resources/js/receiptOrganizerHome.js" var="receiptHome"/>
    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" href="${bootstrap}"/>
    <link rel="stylesheet" href="${multiselectcss}"/>
    <link rel="stylesheet" href="${uicss}"/>

    <!-- My stylesheet last -->
    <link rel="stylesheet" href="${styleguide}">

    <script src="${jquery}"></script>
    <script src="${bootstrapjs}"></script>
    <script src="${multiselectjs}"></script>
    <script src="${validate}"></script>
    <script src="${ui}"></script>
    <script src="${receiptHome}"></script>
    <script>
        $(document).ready(function() {
            <c:forEach items="${labels}" var="label" varStatus="i">
            $('#editLabelForm${label.name.replaceAll("\\s+","").replaceAll("\\W+", "")}').validate({
                rules: {
                    oldLabelName: "required",
                    newLabelName: {
                        required: true,
                        notAllSpace: true,
                        uniqueLabel: true
                    }
                },

                messages: {
                    oldLabelName: "Don't mess around in the dev console",
                    newLabelName: {
                        required: "Cannot enter empty label for ${label.name}",
                        notAllSpace: "Cannot enter empty label for ${label.name}",
                        uniqueLabel: "Label name must be unique for ${label.name}"
                    }
                },

                onkeyup: false,

                onfocusout: false,

                errorContainer: "#labelEditErrorContainer",

                errorLabelContainer: "#labelEditErrorContainer ul",

                wrapper: "li",

                submitHandler: function (form) {
                    $('#labelEditErrorContainer').hide();
                    form.submit();
                }
            });
            </c:forEach>

            $('#editLabel').on('hidden.bs.modal', function() {
                console.log('Edit Label modal closed.');

                //Hide error messages
                <c:forEach items="${labels}" var="label" varStatus="i">
                $('#labelEditErrorContainer ul').empty();
                $('#labelEditErrorContainer').hide();
                </c:forEach>

                //Clear any user input
                var i;
                for (i = 0; i < $(this).find('form').length; i++) {
                    console.log('Iteration #: ' + i);
                    $(this).find('form')[i].reset();
                }
            });
        });
    </script>
    <title>Receipts</title>
</head>
<body>
<div class="container">
    <div class="mail-box">
        <aside class="sm-side">
            <div class="user-head">
                <a class="inbox-avatar">
                    <img  width="64" height="60" src="http://bootsnipp.com/img/avatars/ebeb306fd7ec11ab68cbcaa34282158bd80361a7.jpg">
                </a>
                <div class="user-name">
                    <h5>${sessionScope.user.username}</h5>
                </div>
            </div>
            <div class="inbox-body">
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
                <li class="nav-item"><a class="nav-link" href="."><i class="fa fa-sign-blank text-info"></i>Show All Receipts</a></li>
                <c:forEach items="${labels}" var="label" varStatus="i">
                    <li class="nav-item"><a class="nav-link" href="${baseHomeUrl}?label=${label.name}"><i class="fa fa-sign-blank text-info"></i>${label.name}</a></li>
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
        <aside class="lg-side">
            <div class="inbox-head">
                <h3>Receipts</h3>
                <form class="pull-right position" action="${settingsUrl}" id="settings-form">
                    <button class="btn settings-button"><i class="fa fa-cog"></i></button>
                </form>
                <form class="pull-right position" action="${logoutUrl}" method="post" id="logout-form">
                    <button class="btn logout-button"><i class="fa fa-sign-out"></i></button>
                </form>
                <form action="#" class="pull-right position">
                    <div class="input-append">
                        <input class="sr-input" placeholder="Search Receipts">
                        <button class="btn sr-btn"><i class="fa fa-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="inbox-body">
                <img class="receiptEditImage" alt="${receipt.title} Image" src="data:image/jpeg;charset=utf-8;base64,${receipt.viewableImage}">
                <form:form autocomplete="false" modelAttribute="receipt" method="post" action="${editReceiptUrl}" class="form-horizontal" enctype="multipart/form-data">
                    <div class="form-group alert alert-danger center-full-width" hidden="true" id="receiptErrorContainer">
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
                                                <span>Change Receipt Image</span>
                                                <form:input path="multipartFile" type="file" accept=".png,.jpg"/>
                                            </span>
                            <form:button id="receiptCreateSubmit" class="btn btn-send">Save Changes</form:button>
                        </div>
                    </div>
                </form:form>
            </div>
        </aside>
    </div>
</div>
</body>
</html>
