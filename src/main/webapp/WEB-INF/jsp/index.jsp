<%--
  User: Andrew
  Date: 10/28/2018
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
    <!-- FONTS -->
    <spring:url value="https://fonts.googleapis.com/css?family=Roboto:300,400,500" var="font"/>
    <spring:url value="https://fonts.googleapis.com/icon?family=Material+Icons" var="materialIcons"/>
    <spring:url value="/resources/images/receipt.png" var="favicon"/>

    <!-- JAVASCRIPT -->
    <spring:url value="/resources/js/built/app-bundle.js" var="organizerApp"/>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="icon" type="image/png" href="${favicon}">
    <link rel="stylesheet" href="${materialIcons}">

    <title>ReceiptOrganizer</title>
</head>
<body style="margin: 0;">
    <div id="react" data-csrfToken="${_csrf.token}" data-csrfHeaderName="${_csrf.headerName}" data-csrfParameterName="${_csrf.parameterName}"></div>

    <script src="${organizerApp}"></script>
</body>
</html>