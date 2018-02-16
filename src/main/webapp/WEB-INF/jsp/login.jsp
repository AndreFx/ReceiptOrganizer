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

	<!-- STYLESHEETS -->
    <spring:url value="/resources/css/bootstrap.css" var="bootstrap"/>
    <spring:url value="/resources/css/styleguide.css" var="styleguide"/>
	<spring:url value="/resources/css/fontawesome-all.css" var="fontawesomecss"/>

	<!-- JAVASCRIPT -->
    <spring:url value="/resources/js/jquery.validate.min.js" var="jqueryvalidate"/>
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
	<spring:url value="/resources/js/login.js" var="afxLogin"/>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" type="text/css" href="${bootstrap}">
    <link rel="stylesheet" type="text/css" href="${styleguide}">
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" type="text/css" href="${fontawesomecss}"/>

    <script defer src="${jquery}"></script>
    <script defer src="${jqueryvalidate}"></script>
    <script defer src="${bootstrapjs}"></script>
	<script defer src="${afxLogin}"></script>

	<title>Receipt Organizer Tool</title>
</head>
<body>
	<div class="text-center login" style="padding: 50px 0">
		<div class="logo">login</div>
		<!-- Main Form -->
		<div class="login-form">
			<form method="post" action="${loginUrl}" id="loginForm" class="text-left" autocomplete="off">
				<c:choose>
					<c:when test="${param.error != null}">
						<div class="login-form-main-message show invalid" id="form-errors-container">
                            <p class="submission-status">Invalid username and/or password.</p>
						</div>
					</c:when>
                    <c:when test="${param.logout != null}">
                        <div class="login-form-main-message show success" id="form-errors-container">
                            <p class="submission-status">You have been logged out successfully.</p>
                        </div>
                    </c:when>
					<c:otherwise>
                        <div class="login-form-main-message invalid" id="form-errors-container"></div>
					</c:otherwise>
				</c:choose>
				<div class="main-login-form">
					<div class="login-group">
						<div class="form-group">
							<label for="lg_username" class="sr-only">Username</label>
							<input name="username" type="text" class="form-control"
								id="lg_username" placeholder="username" />
						</div>
						<div class="form-group">
							<label for="lg_password" class="sr-only">Password</label>
							<input name="password" type="password" class="form-control"
								id="lg_password" placeholder="password" />
							<input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
						</div>
					</div>
					<button type="submit" class="login-button">
						<i class="fa fa-chevron-right"></i>
					</button>
				</div>
			</form>
		</div>
		<!-- end:Main Form -->
	</div>

</body>
</html>