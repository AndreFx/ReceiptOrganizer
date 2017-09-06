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
    <spring:url var="deleteReceiptUrl" value="/receipts/${receiptId}/delete"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>
    <spring:url value="/users/getUserPhoto" var="userPhotoView"/>

    <spring:url value="/receipts/${receipt.receiptId}/image" var="receiptViewImageUrl"/>

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
    <spring:url value="/resources/js/receiptOrganizerCommon.js" var="receiptCommon"/>
    <spring:url value="/resources/js/receiptOrganizerHome.js" var="receiptHome"/>
    <spring:url value="/resources/js/receiptEdit.js" var="receiptEdit"/>
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
    <script src="${receiptCommon}"></script>
    <script src="${receiptHome}"></script>
    <script src="${receiptEdit}"></script>
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
    <title>${receipt.title}</title>
</head>
<body>
    <div class="mail-box">
        <jsp:include page="/WEB-INF/jsp/userLabelsAside.jsp">
            <jsp:param name="userPhotoView" value="${userPhotoView}"/>
            <jsp:param name="baseHomeUrl" value="${baseHomeUrl}"/>
        </jsp:include>
        <aside class="lg-side">
            <div class="inbox-head">
                <h3><a href="${baseHomeUrl}" class="home-link">ReceiptOrganizer</a></h3>
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
                <img class="receipt-edit-image modal-image" alt="${receipt.title} Image" src='<c:out value="${receiptViewImageUrl}"/>'>
                <form:form autocomplete="false" modelAttribute="receipt" method="post" action="${editReceiptUrl}" class="form-horizontal" enctype="multipart/form-data">
                    <div class="form-group alert alert-danger center-full-width error-container" id="editReceiptErrorContainer">
                        <div class="col-lg-10" id="editReceiptErrors"></div>
                    </div>
                    <div class="form-group">
                        <form:label path="title" class="col-lg-2 control-name">Title</form:label>
                        <div class="col-lg-10">
                            <form:input path="title" id="editTitle" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="date" class="col-lg-2 control-name">Date</form:label>
                        <div class="col-lg-10">
                            <form:input path="date" id="editDate" type="text" placeholder="MM/dd/yyyy" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="numItems" class="col-lg-2 control-name"># of Items</form:label>
                        <div class="col-lg-10">
                            <form:input path="numItems" id="editNumItems" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="receiptAmount" class="col-lg-2 control-name">Receipt Amount</form:label>
                        <div class="col-lg-10">
                            <form:input path="receiptAmount" id="editReceiptAmount" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="labels" class="col-lg-2 control-name">Labels</form:label>
                        <div class="col-lg-10">
                            <form:select multiple="true" path="labels" id="editLabels" placeholder="" value="" class="form-control">
                                <form:options items="${labels}" itemLabel="name" itemValue="name"/>
                            </form:select>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="description" class="col-lg-2 control-name">Description</form:label>
                        <div class="col-lg-10">
                            <form:textarea path="description" id="editDescription" rows="10" cols="30" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-2 col-lg-10">
                            <div class="receiptEditButtons">
                                <div class="btn-group-container">
                                    <span class="btn green fileinput-button">
                                                <i class="fa fa-plus fa fa-white"></i>
                                                <span>Change Receipt Image</span>
                                                <form:input path="multipartFile" id="editMultipartFile" type="file" accept=".png,.jpg"/>
                                            </span>
                                    <form:button id="receiptEditSubmit" class="btn btn-send">Save Changes</form:button>
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
                                <form:form autocomplete="false" action="${deleteReceiptUrl}" method="post" class="form-horizontal">
                                    <button class="btn btn-secondary">Yes</button>
                                    <button aria-hidden="true" data-dismiss="modal" class="btn btn-send" type="button">No</button>
                                </form:form>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            </div>
        </aside>
        <jsp:include page="/WEB-INF/jsp/imageModal.jsp"/>
    </div>
    <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
</body>
</html>
