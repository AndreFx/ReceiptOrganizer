<%--
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<spring:url var="searchUrl" value="/home/search"/>
<spring:url var="logoutUrl" value="/logout"/>
<spring:url var="settingsUrl" value="/users/settings"/>

<div class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <button id="sidebarCollapse" class="btn navbar-ctl"><i class="fa fa-bars hamburger-icon" aria-hidden="true"></i><span>Toggle Sidebar</span></button>
        </div>
        <div class="collapse navbar-collapse">
            <!-- TODO Fix this disappearing when the screensize is small -->
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <form action="${searchUrl}" autocomplete="off" method="get" class="pull-right position">
                        <div class="input-append">
                            <input name="searchString" id="sr-input" class="navbar-ctl" placeholder="Search Receipts">
                            <button id="sr-btn" class="btn navbar-ctl" data-toggle="tooltip" data-placement="bottom" title="Search"><i class="fa fa-search"></i></button>
                        </div>
                    </form>
                </li>
                <li>
                    <form class="pull-right position" action="${logoutUrl}" method="post" id="logout-form">
                        <input type="hidden"  name="${_csrf.parameterName}"   value="${_csrf.token}"/>
                        <button id="logout-btn" class="btn navbar-ctl" data-toggle="tooltip" data-placement="bottom" title="Logout"><i class="fa fa-sign-out"></i></button>
                    </form>
                </li>
                <li>
                    <form class="pull-right position" action="${settingsUrl}" id="settings-form">
                        <button id="settings-btn" class="btn navbar-ctl" data-toggle="tooltip" data-placement="bottom" title="Settings"><i class="fa fa-cog"></i></button>
                    </form>
                </li>
            </ul>
        </div>
    </div>
</div>