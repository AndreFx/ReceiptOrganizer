<%--
  Created by IntelliJ IDEA.
  User: Andrew
  Date: 9/4/2017
  Time: 11:17 PM
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<html>
<head>
    <spring:url var="baseHomeUrl" value="/home/"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>

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

    <title>ReceiptOrganizer Error</title>
</head>
<body>
    <div class="mail-box">
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
                <h1 class="text-center">D'Oh!</h1>
                <p class="text-center">${errorMessage}</p>

                <!--
                Exception:  ${exception.message}
                <c:forEach items="${exception.stackTrace}" var="ste">
                    ${ste}
                </c:forEach>
                -->

            </div>
        </aside>
    </div>
</body>
</html>
