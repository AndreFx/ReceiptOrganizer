<%--
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!doctype html>
<html lang="en">
<head>
	<!-- SITE URLS -->
    <spring:url var="loginUrl" value="/login"/>

	<!-- FONTS -->
	<spring:url value="https://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>
	<spring:url value="/resources/images/receipt.png" var="favicon"/>

	<!-- STYLESHEETS -->
    <spring:url value="/resources/css/bootstrap.css" var="bootstrap"/>
    <spring:url value="/resources/css/base.css" var="styleguide"/>
	<spring:url value="/resources/css/fontawesome-all.css" var="fontawesomecss"/>

	<!-- JAVASCRIPT -->
    <spring:url value="/resources/js/jquery.validate.min.js" var="jqueryvalidate"/>
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
	<spring:url value="/resources/js/built/login-bundle.js" var="loginApp"/>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<link rel="icon" type="image/png" href="${favicon}">
    <link rel="stylesheet" type="text/css" href="${bootstrap}">
    <link rel="stylesheet" type="text/css" href="${styleguide}">
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" type="text/css" href="${fontawesomecss}">
	
	<title>Receipt Organizer Tool</title>
</head>
<body>
	<div id="react" data-loginurl="${loginUrl}" data-error="${param.error}" data-logout="${param.logout}" data-csrftoken="${_csrf.token}" data-csrfparametername="${_csrf.parameterName}"></div>
	
	<script src="${loginApp}"></script>
</body>
</html>