<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<spring:url var="baseHomeUrl" value="/home/"/>
<spring:url var="searchUrl" value="/home/search"/>
<spring:url var="logoutUrl" value="/logout"/>
<spring:url var="settingsUrl" value="/users/settings"/>

<div class="inbox-head">
    <h3><a href="${baseHomeUrl}" class="home-link">ReceiptOrganizer</a></h3>
    <form class="pull-right position" action="${settingsUrl}" id="settings-form">
        <button class="btn settings-button" data-toggle="tooltip" data-placement="bottom" title="Settings"><i class="fa fa-cog"></i></button>
    </form>
    <form class="pull-right position" action="${logoutUrl}" method="post" id="logout-form">
        <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
        <button class="btn logout-button" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></button>
    </form>
    <form action="${searchUrl}" autocomplete="off" method="get" class="pull-right position">
        <div class="input-append">
            <input name="searchString" class="sr-input" placeholder="Search Receipts">
            <button class="btn sr-btn" data-toggle="tooltip" data-placement="bottom" title="Search"><i class="fa fa-search"></i></button>
        </div>
    </form>
</div>