<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<html>
<head>
<title>Receipt Organizer Tool</title>
<spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
<spring:url value="/resources/css/afx_styleguide.css" var="styleguide"/>
<spring:url value="http://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>
<spring:url value="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.13.1/jquery.validate.min.js" var="jqueryvalidate"/>
<spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
<spring:url value="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" var="fontawesomecss"/>
<spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
<link rel="stylesheet" type="text/css" href="${bootstrap}">
<link rel="stylesheet" type="text/css" href="${styleguide}">
<link rel="stylesheet" type="text/css" href="${googlefonts}">
<link rel="stylesheet" type="text/css" href="${fontawesomecss}"/>
<script src="${jquery}"></script>
<script src="${jqueryvalidate}"></script>
<script src="${bootstrapjs}"></script>
<meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1" />
</head>
<body>
	<div class="text-center" style="padding: 50px 0">
		<div class="logo">login</div>
		<!-- Main Form -->
		<div class="login-form-1">
			<form:form method="post" action="login.do" id="login-form"
				class="text-left">
				<div class="login-form-main-message"></div>
				<div class="main-login-form">
					<div class="login-group">
						<div class="form-group">
							<form:label path="username" for="lg_username" class="sr-only">Username</form:label>
							<form:input path="username" type="text" class="form-control"
								id="lg_username" name="lg_username" placeholder="username" />
						</div>
						<div class="form-group">
							<form:label path="password" for="lg_password" class="sr-only">Password</form:label>
							<form:input path="password" type="password" class="form-control"
								id="lg_password" name="lg_password" placeholder="password" />
						</div>
						<div class="form-group login-group-checkbox">
							<form:checkbox path="remember" id="lg_remember"
								name="lg_remember" />
							<form:label path="remember" for="lg_remember">remember</form:label>
						</div>
					</div>
					<button type="submit" class="login-button">
						<i class="fa fa-chevron-right"></i>
					</button>
				</div>
			</form:form>
		</div>
		<!-- end:Main Form -->
	</div>

</body>
</html>