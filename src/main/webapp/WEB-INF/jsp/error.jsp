<%--
  User: Andrew
  Date: 9/4/2017
  Time: 11:17 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<html>
<head>
    <!-- SITE URLS -->
    <spring:url var="baseHomeUrl" value="/home/"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>
    <spring:url value="/resources/images/systemError.jpg" var="errorImage"/>

    <!-- FONTS -->
    <spring:url value="https://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>

    <!-- STYLESHEETS -->
    <spring:url value="/resources/css/afx-home-styleguide.css" var="styleguide"/>
    <spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
    <spring:url value="/resources/css/bootstrap-multiselect.css" var="multiselectcss"/>
    <spring:url value="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" var="fontawesomecss"/>
    <spring:url value="/resources/css/jquery-ui.css" var="uicss"/>
    <spring:url value="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css" var="sidebarScrollCss"/>

    <!-- JAVASCRIPT -->
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
    <spring:url value="/resources/js/bootstrap-multiselect.js" var="multiselectjs"/>
    <spring:url value="/resources/js/jquery.validate.min.js" var="validate"/>
    <spring:url value="/resources/js/jquery-ui.min.js" var="ui"/>
    <spring:url value="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.concat.min.js" var="sidebarScroll"/>
    <spring:url value="/resources/js/sidebar.js" var="sidebar"/>
    <spring:url value="/resources/js/common.js" var="receiptCommon"/>

    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" href="${bootstrap}"/>
    <link rel="stylesheet" href="${sidebarScrollCss}"/>
    <link rel="stylesheet" href="${multiselectcss}"/>
    <link rel="stylesheet" href="${uicss}"/>
    <link rel="stylesheet" href="${styleguide}">

    <script src="${jquery}"></script>
    <script src="${bootstrapjs}"></script>
    <script src="${multiselectjs}"></script>
    <script src="${sidebarScroll}"></script>
    <script src="${validate}"></script>
    <script src="${ui}"></script>
    <script src="${receiptCommon}"></script>
    <script src="${sidebar}"></script>
    <script>
        $(document).ready(function() {
            $(function () {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                $(document).ajaxSend(function(e, xhr, options) {
                    xhr.setRequestHeader(header, token);
                });
            });
        });
    </script>
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>

    <title>ReceiptOrganizer Error</title>
</head>
<body>
    <div class="wrapper">
        <jsp:include page="/WEB-INF/jsp/sidebar.jsp">
            <jsp:param name="baseHomeUrl" value="${baseHomeUrl}"/>
        </jsp:include>
        <div id="content">
            <jsp:include page="navbar.jsp"/>
            <div class="content-body">
                <img class="error-image" src="${errorImage}" alt="System Error">
                <p class="text-center">${errorMessage}</p>

                <!--
                Exception:  ${exception.message}
                <c:forEach items="${exception.stackTrace}" var="ste">
                    ${ste}
                </c:forEach>
                -->

            </div>
        </div>
    </div>
    <jsp:include page="/WEB-INF/jsp/image-modal.jsp"/>
</body>
</html>
