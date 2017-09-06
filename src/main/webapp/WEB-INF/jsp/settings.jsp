<%--
  Created by IntelliJ IDEA.
  User: Andrew
  Date: 9/3/2017
  Time: 12:28 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
    <spring:url var="baseHomeUrl" value="/home/"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>
    <spring:url var="settingsUpdateUrl" value="/users/settings/update"/>
    <spring:url value="/users/getUserPhoto" var="userPhotoView"/>

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
    <spring:url value="/resources/js/userSettings.js" var="userSettings"/>
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
    <script src="${userSettings}"></script>
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
    <title>User Settings</title>
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
                <img class="receipt-edit-image modal-image" alt="${sessionScope.user.username} Image" src='<c:out value="${userPhotoView}"/>'>
                <form:form autocomplete="false" modelAttribute="user" method="post" action="${settingsUpdateUrl}" class="form-horizontal" enctype="multipart/form-data">
                    <div class="form-group alert alert-danger center-full-width error-container" id="userSettingsErrorContainer">
                        <div class="col-lg-10" id="userSettingsErrors"></div>
                    </div>
                    <div class="form-group">
                        <form:label path="fName" class="col-lg-2 control-name">First Name</form:label>
                        <div class="col-lg-10">
                            <form:input path="fName" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="lName" class="col-lg-2 control-name">Last Name</form:label>
                        <div class="col-lg-10">
                            <form:input path="lName" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="paginationSize" class="col-lg-2 control-name">Page Size (5 - 25)</form:label>
                        <div class="col-lg-10">
                            <form:input path="paginationSize" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-2 col-lg-10">
                            <div class="receiptEditButtons">
                                <div class="btn-group-container">
                                        <span class="btn green fileinput-button">
                                                    <i class="fa fa-plus fa fa-white"></i>
                                                    <span>Change your photo</span>
                                                    <form:input path="image" id="editMultipartFile" type="file" accept=".png,.jpg"/>
                                                </span>
                                    <form:button id="userSettingsSubmit" class="btn btn-send">Save Changes</form:button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form:form>
            </div>
        </aside>
        <jsp:include page="/WEB-INF/jsp/imageModal.jsp"/>
    </div>
    <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
</body>
</html>

