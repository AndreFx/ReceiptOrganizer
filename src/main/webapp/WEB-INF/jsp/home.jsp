<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
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
    <spring:url value="/resources/js/receiptOrganizerHome.js" var="receiptHome"/>
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
    <script src="${receiptHome}"></script>
    <title>Receipts</title>
</head>
<body>
<div class="container">
    <div class="mail-box">
        <aside class="sm-side">
            <div class="user-head">
                <a class="inbox-avatar">
                    <img  width="64" height="60" src="http://bootsnipp.com/img/avatars/ebeb306fd7ec11ab68cbcaa34282158bd80361a7.jpg">
                </a>
                <div class="user-name">
                    <h5>${sessionScope.user.username}</h5>
                </div>
            </div>
            <div class="inbox-body">
                <a href="#addReceipt" data-toggle="modal"  title="Add Receipt" class="btn btn-compose">
                    Add Receipt
                </a>
                <!-- Modal -->
                <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="addReceipt" class="modal fade" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                                <h4 class="modal-title">Add Receipt</h4>
                            </div>
                            <div class="modal-body">
                                <form:form autocomplete="false" modelAttribute="newReceipt" method="post" action="uploadreceipt.do" class="form-horizontal" enctype="multipart/form-data">
                                    <div class="form-group alert alert-danger" hidden="true" id="receiptErrorContainer">
                                        <div class="col-lg-10" id="receiptErrors">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="title" class="col-lg-2 control-name">Title</form:label>
                                        <div class="col-lg-10">
                                            <form:input path="title" type="text" placeholder="" value="" class="form-control"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="date" class="col-lg-2 control-name">Date</form:label>
                                        <div class="col-lg-10">
                                            <form:input path="date" type="text" placeholder="MM/dd/yyyy" value="" class="form-control"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="numItems" class="col-lg-2 control-name"># of Items</form:label>
                                        <div class="col-lg-10">
                                            <form:input path="numItems" type="text" placeholder="" value="" class="form-control"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="receiptAmount" class="col-lg-2 control-name">Receipt Amount</form:label>
                                        <div class="col-lg-10">
                                            <form:input path="receiptAmount" type="text" placeholder="" value="" class="form-control"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="labels" class="col-lg-2 control-name">Labels</form:label>
                                        <div class="col-lg-10">
                                            <form:select multiple="true" path="labels" placeholder="" value="" class="form-control">
                                                <form:options items="${labels}" itemLabel="name" itemValue="name"/>
                                            </form:select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="description" class="col-lg-2 control-name">Description</form:label>
                                        <div class="col-lg-10">
                                            <form:textarea path="description" rows="10" cols="30" value="" class="form-control"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-lg-offset-2 col-lg-10">
                                            <span class="btn green fileinput-button">
                                                <i class="fa fa-plus fa fa-white"></i>
                                                <span>Receipt</span>
                                                <form:input path="multipartFile" type="file" accept=".png,.jpg"/>
                                            </span>
                                            <form:button id="receiptCreateSubmit" class="btn btn-send">Create</form:button>
                                        </div>
                                    </div>
                                </form:form>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            </div>
            <ul class="nav-stacked labels-info nav nav-pills inbox-divider">
                <li><h4>Labels</h4></li>
                <!-- TODO Set one of these as active -->
                <li class="nav-item"><a class="nav-link active" href="."><i class="fa fa-sign-blank text-info"></i> Show All Receipts </a></li>
                <c:forEach items="${labels}" var="label" varStatus="i">
                    <li class="nav-item"><a class="nav-link" href="?label=${label.name}"><i class="fa fa-sign-blank text-info"></i> ${label.name}
                        <!-- TODO FIX
                    <span class="name name-info pull-right">Number of receipts</span>
                    -->
                    </a></li>
                </c:forEach>
                <li><a href="#addLabel" data-toggle="modal"  title="Add Label"><i class="fa fa-plus"></i><i class="fa fa-sign-blank text-info"></i> Create New Label</a></li>
                <div aria-hidden="true" aria-labelledby="addLabelModal" role="dialog" tabindex="-1" id="addLabel" class="modal fade" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                                <h4 class="modal-title">Add Label</h4>
                            </div>
                            <div class="modal-body">
                                <form:form autocomplete="false" action="createlabel.do" modelAttribute="newLabel" method="post" class="form-horizontal">
                                    <div class="form-group alert alert-danger" hidden="true" id="labelErrorContainer">
                                        <div class="col-lg-10" id="labelErrors">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form:label path="name" class="col-lg-2 control-name">Label</form:label>
                                        <div class="col-lg-10">
                                            <form:input path="name" placeholder="" value="" class="form-control"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-lg-offset-2 col-lg-10">
                                            <form:button class="btn btn-send">Create</form:button>
                                        </div>
                                    </div>
                                </form:form>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            </ul>
        </aside>
        <aside class="lg-side">
            <div class="inbox-head">
                <h3>Receipts</h3>
                <form class="pull-right position" action="../settings" method="get" id="settings-form">
                    <button class="btn settings-button"><i class="fa fa-cog"></i></button>
                </form>
                <form class="pull-right position" action="../logout.do" method="post" id="logout-form">
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
                <div class="mail-option">
                    <div class="btn-group-container">
                        <div class="btn-group">
                            <a data-original-title="Refresh" data-placement="top" data-toggle="dropdown" href="#" class="btn mini tooltips">
                                <i class=" fa fa-refresh"></i>
                            </a>
                        </div>
                        <div class="btn-group hidden-phone">
                            <a data-toggle="dropdown" href="#" class="btn mini blue" aria-expanded="false">
                                More
                                <i class="fa fa-angle-down "></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="#"><i class="fa fa-trash-o"></i> Delete</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="btn-group-container">
                        <c:choose>
                            <c:when test="${numReceipts == 0}">
                                <span class="pagination-number">0 - 0 of 0</span>
                            </c:when>
                            <c:otherwise>
                                <c:choose>
                                    <c:when test="${currentPage * pageSize > numReceipts}">
                                        <span class="pagination-number">${(currentPage - 1) * pageSize + 1} - ${numReceipts} of ${numReceipts}</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="pagination-number">${(currentPage - 1) * pageSize + 1} - ${currentPage * pageSize} of ${numReceipts}</span>
                                    </c:otherwise>
                                </c:choose>
                            </c:otherwise>
                        </c:choose>

                        <nav class="pagination-nav" aria-label="page navigation">
                            <ul class="pagination">
                                <!-- Previous button -->
                                <c:url value="." var="prev">
                                    <c:param name="page" value="${currentPage-1}"/>
                                </c:url>
                                <c:choose>
                                    <c:when test="${currentPage > 1}">
                                        <li class="page-item"><a href="<c:out value="${prev}" />" class="page-link">Previous</a></li>
                                    </c:when>
                                    <c:otherwise>
                                        <li class="page-item disabled"><a tabindex="-1" href="<c:out value="${prev}" />" class="page-link">Previous</a></li>
                                    </c:otherwise>
                                </c:choose>

                                <!-- Numbered buttons -->
                                <c:forEach begin="1" end="${numPages}" step="1" varStatus="i">
                                    <c:choose>
                                        <c:when test="${currentPage == i.index}">
                                            <li class="page-item active"><a class="page-link">${i.index}</a></li>
                                        </c:when>
                                        <c:otherwise>
                                            <c:url value="." var="url">
                                                <c:param name="page" value="${i.index}"/>
                                            </c:url>
                                            <li class="page-item"><a href='<c:out value="${url}" />' class="page-link">${i.index}</a></li>
                                        </c:otherwise>
                                    </c:choose>
                                </c:forEach>

                                <!-- Next button -->
                                <c:url value="." var="next">
                                    <c:param name="page" value="${currentPage + 1}"/>
                                </c:url>
                                <c:choose>
                                    <c:when test="${currentPage + 1 <= numPages}">
                                        <li class="page-item"><a href='<c:out value="${next}" />' class="page-link">Next</a></li>
                                    </c:when>
                                    <c:otherwise>
                                        <li class="page-item disabled"><a tabindex="-1" href='<c:out value="${next}" />' class="page-link">Next</a></li>
                                    </c:otherwise>
                                </c:choose>

                            </ul>
                        </nav>
                    </div>
                </div>
                <table class="table table-inbox table-hover">
                    <tbody>
                    <c:forEach items="${receipts}" var="receipt" varStatus="i">
                        <tr>
                            <td class="inbox-small-cells">
                                <input type="checkbox" class="mail-checkbox">
                            </td>
                            <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
                            <td class="view-message  dont-show">${receipt.title}</td>
                            <td class="view-message ">${receipt.description}</td>
                            <td class="view-message  inbox-small-cells"><i class="fa fa-paperclip"></i></td>
                            <td class="view-message  text-right">${receipt.date}</td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
            </div>
        </aside>
    </div>
</div>
</body>
</html>