<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
    <spring:url value="/resources/css/afx_home_styleguide.css" var="styleguide"/>
    <spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
    <spring:url value="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" var="fontawesomecss"/>
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
    <link rel="stylesheet" href="${styleguide}">
    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" href="${bootstrap}">

    <script src="${jquery}"></script>
    <script src="${bootstrapjs}"></script>
    <title>Receipts</title>
</head>
<body>
<div class="container">
    <div class="mail-box">
        <aside class="sm-side">
            <div class="user-head">
                <a class="inbox-avatar">
                    <img  width="64" height="60" src="http://bootsnipp.com/img/avatars/ebeb306fd7ec11ab68cbcaa34282158bd80361a7.jpg">
                    <form:form method="post" action="../logout.do">
                        <button class="btn btn-compose">
                            Logout
                        </button>
                    </form:form>
                </a>
                <div class="user-name">
                    <h5><a href="#">${username}</a></h5>
                    <!-- TODO Implement -->
                    <span><a href="#">${userEmail}@gmail.com</a></span>
                </div>
            </div>
            <div class="inbox-body">
                <a href="#myModal" data-toggle="modal"  title="Add Receipt"    class="btn btn-compose">
                    Add Receipt
                </a>
                <!-- Modal -->
                <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="myModal" class="modal fade" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                                <h4 class="modal-title">Add Receipt</h4>
                            </div>
                            <div class="modal-body">
                                <form role="form" class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Title</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="receiptTitle" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Store</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="store" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Labels</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="labels" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Date</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="inputDate" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Description</label>
                                        <div class="col-lg-10">
                                            <textarea rows="10" cols="30" class="form-control" id="" name=""></textarea>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <form method="post" action="uploadreceipt.do" enctype="multipart/form-data">
                                            <div class="col-lg-offset-2 col-lg-10">
                                                      <span class="btn green fileinput-button">
                                                        <i class="fa fa-plus fa fa-white"></i>
                                                        <span>Receipt</span>
                                                        <input type="file" name="files[]">
                                                      </span>
                                                <button class="btn btn-send" type="submit">Create</button>
                                            </div>
                                        </form>
                                    </div>
                                </form>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            </div>
            <ul class="inbox-nav inbox-divider">
                <li> <h4>Labels</h4> </li>
                <c:forEach items="${homeModel.labels}" var="label" varStatus="i">
                    <li> <a href="#"> <i class=" fa fa-sign-blank text-info"></i> ${label.labelText}
                    <span class="label label-info pull-right">${label.numberOfReceipts}</span> </a></li>
                </c:forEach>
            </li>
            </ul>

            <div class="inbox-body text-center">
                <div class="btn-group">
                    <a class="btn mini btn-info" href="javascript:;">
                        <i class="fa fa-cog"></i>
                    </a>
                </div>
            </div>

        </aside>
        <aside class="lg-side">
            <div class="inbox-head">
                <h3>Receipts</h3>
                <form action="#" class="pull-right position">
                    <div class="input-append">
                        <input type="text" class="sr-input" placeholder="Search Receipts">
                        <button class="btn sr-btn" type="button"><i class="fa fa-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="inbox-body">
                <div class="mail-option">

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

                    <ul class="unstyled inbox-pagination">
                        <!-- TODO Make this number real -->
                        <li><span>1-50 of ${homeModel.receipts.size()}</span></li>
                        <li>
                            <a class="np-btn" href="#"><i class="fa fa-angle-left  pagination-left"></i></a>
                        </li>
                        <li>
                            <a class="np-btn" href="#"><i class="fa fa-angle-right pagination-right"></i></a>
                        </li>
                    </ul>
                </div>
                <table class="table table-inbox table-hover">
                    <tbody>
                    <c:forEach items="${homeModel.receipts}" var="receipt" varStatus="i">
                        <td class="inbox-small-cells">
                            <input type="checkbox" class="mail-checkbox">
                        </td>
                        <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
                        <td class="view-message  dont-show">${receipt.title}</td>
                        <td class="view-message ">${receipt.store}</td>
                        <td class="view-message  inbox-small-cells"><i class="fa fa-paperclip"></i></td>
                        <td class="view-message  text-right">${receipt.date}</td>
                    </c:forEach>
                    </tbody>
                </table>
            </div>
        </aside>
    </div>
</div>
</body>
</html>