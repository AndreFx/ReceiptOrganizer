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
<!doctype html>
<html lang="en">
<head>
    <!-- SITE URLS -->
    <spring:url var="receiptIndexUrl" value="/receipts/"/>
    <spring:url var="searchUrl" value="/receipts/"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>
    <spring:url var="settingsUpdateUrl" value="/users/settings/update"/>
    <spring:url value="/users/getUserPhoto?thumbnail=false" var="userPhotoView"/>

    <!-- FONTS -->
    <spring:url value="https://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>
    <spring:url value="/resources/images/receipt.png" var="favicon"/>

    <!-- STYLESHEETS -->
    <spring:url value="/resources/css/base.css" var="styleguide"/>
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
    <spring:url value="/resources/js/settings.js" var="userSettings"/>
    <spring:url value="/resources/js/sidebar.js" var="sidebar"/>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>

    <link rel="icon" type="image/png" href="${favicon}">
    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" href="${bootstrap}"/>
    <link rel="stylesheet" href="${multiselectcss}"/>
    <link rel="stylesheet" href="${uicss}"/>
    <link rel="stylesheet" href="${sidebarScrollCss}"/>
    <link rel="stylesheet" href="${styleguide}">

    <script src="${jquery}"></script>
    <script defer src="${bootstrapjs}"></script>
    <script defer src="${multiselectjs}"></script>
    <script defer src="${validate}"></script>
    <script defer src="${addvalidate}"></script>
    <script defer src="${ui}"></script>
    <script defer src="${receiptCommon}"></script>
    <script defer src="${sidebarScroll}"></script>
    <script defer src="${sidebar}"></script>
    <script defer src="${userSettings}"></script>
    <script defer>
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

    <title>User Settings</title>
</head>
<body>
    <div class="wrapper">
        <jsp:include page="/WEB-INF/jsp/sidebar.jsp"/>
        <div id="content">
            <jsp:include page="navbar.jsp"/>
            <div class="content-body">
                <img class="receipt-edit-image modal-image" alt="${sessionScope.user.username} Image" src='<c:out value="${userPhotoView}"/>'>
                <form:form autocomplete="off" modelAttribute="user" method="post" action="${settingsUpdateUrl}?${_csrf.parameterName}=${_csrf.token}" class="form-horizontal" enctype="multipart/form-data">
                    <div class="form-group alert alert-danger center-full-width error-container" id="userSettingsErrorContainer">
                        <div class="col-lg-10" id="userSettingsErrors">
                            <form:errors path="fName"/>
                            <form:errors path="lName"/>
                            <form:errors path="paginationSize"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="fName" class="col-lg-2 control-label">First Name</form:label>
                        <div class="col-lg-10">
                            <form:input path="fName" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="lName" class="col-lg-2 control-label">Last Name</form:label>
                        <div class="col-lg-10">
                            <form:input path="lName" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <form:label path="paginationSize" class="col-lg-2 control-label">Page Size (5 - 25)</form:label>
                        <div class="col-lg-10">
                            <form:input path="paginationSize" type="text" placeholder="" value="" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-offset-2 col-lg-10">
                            <div class="receipt-edit-buttons">
                                <div class="btn-group-container">
                                    <div class="receipt-submit-container">
                                        <div class="file-input-container">
                                            <span class="btn green fileinput-button">
                                                <i class="fa fa-plus fa fa-white"></i>
                                                <span>Change your photo</span>
                                                <form:input class="multipart-input" path="image" id="editMultipartFile" type="file" accept="image/*"/>
                                            </span>
                                            <form:label path="image">No file chosen</form:label>
                                        </div>
                                        <div>
                                            <form:button id="userSettingsSubmit" class="btn btn-send form-save">Save Changes</form:button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form:form>
            </div>
            <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
        </div>
    </div>
</body>
</html>

