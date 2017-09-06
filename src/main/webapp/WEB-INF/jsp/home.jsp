<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
    <spring:url var="baseHomeUrl" value="/home/"/>
    <spring:url var="searchUrl" value="/home/search"/>
    <spring:url var="logoutUrl" value="/logout"/>
    <spring:url var="settingsUrl" value="/users/settings"/>
    <spring:url value="/users/getUserPhoto" var="userPhotoView"/>
    <c:choose>
        <c:when test="${searchString != null}">
            <spring:url value="./search" var="prev">
                <spring:param name="page" value="${currentPage-1}"/>
                <spring:param name="searchString" value="${searchString}"/>
            </spring:url>
        </c:when>
        <c:otherwise>
            <spring:url value="." var="prev">
                <spring:param name="page" value="${currentPage-1}"/>
            </spring:url>
        </c:otherwise>
    </c:choose>
    <c:choose>
        <c:when test="${searchString != null}">
            <spring:url value="./search" var="next">
                <spring:param name="page" value="${currentPage + 1}"/>
                <spring:param name="searchString" value="${searchString}"/>
            </spring:url>
        </c:when>
        <c:otherwise>
            <spring:url value="." var="next">
                <spring:param name="page" value="${currentPage + 1}"/>
            </spring:url>
        </c:otherwise>
    </c:choose>

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
    <spring:url value="/resources/js/receiptOrganizerCommon.js" var="receiptCommon"/>
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
    <script src="${receiptCommon}"></script>
    <script src="${receiptHome}"></script>
    <script>
        $(document).ready(function() {
            <c:forEach items="${labels}" var="label" varStatus="i">
            $('#editLabelForm${label.name.replaceAll("\\s+","").replaceAll("\\W+", "")}').validate({
                rules: {
                    oldLabelName: "required",
                    newLabelName: {
                        required: true,
                        notAllSpace: true,
                        uniqueLabel: true
                    }
                },

                messages: {
                    oldLabelName: "Don't mess around in the dev console",
                    newLabelName: {
                        required: "Cannot enter empty label for ${label.name}",
                        notAllSpace: "Cannot enter empty label for ${label.name}",
                        uniqueLabel: "Label name must be unique for ${label.name}"
                    }
                },

                onkeyup: false,

                onfocusout: false,

                errorContainer: "#labelEditErrorContainer",

                errorLabelContainer: "#labelEditErrorContainer ul",

                wrapper: "li",

                submitHandler: function (form) {
                    $('#labelEditErrorContainer').hide();
                    form.submit();
                }
            });
            </c:forEach>
        });
    </script>
    <title>Receipts</title>
</head>
<body>
    <div class="mail-box">
        <jsp:include page="/WEB-INF/jsp/userLabelsAside.jsp">
            <jsp:param name="userPhotoView" value="${userPhotoView}"/>
            <jsp:param name="baseHomeUrl" value="${baseHomeUrl}"/>
        </jsp:include>
        <aside class="lg-side">
            <div class="inbox-head">
                <h3><a href="${baseHomeUrl}" class="home-link">ReceiptOrganizer</a></h3>
                <form class="pull-right position" action="${settingsUrl}" id="settings-form">
                    <button class="btn settings-button"><i class="fa fa-cog"></i></button>
                </form>
                <form class="pull-right position" action="${logoutUrl}" method="post" id="logout-form">
                    <button class="btn logout-button"><i class="fa fa-sign-out"></i></button>
                </form>
                <form action="${searchUrl}" method="get" class="pull-right position">
                    <div class="input-append">
                        <input name="searchString" class="sr-input" placeholder="Search Receipts">
                        <button class="btn sr-btn"><i class="fa fa-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="inbox-body">
                <div class="mail-option">
                    <div class="btn-group-container">

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
                                <c:choose>
                                    <c:when test="${currentPage > 1}">
                                        <li class="page-item"><a href="<c:out value="${prev}" />" class="page-link">Previous</a></li>
                                    </c:when>
                                    <c:otherwise>
                                        <li class="page-item disabled"><a tabindex="-1" href="javascript:void(0);" class="page-link">Previous</a></li>
                                    </c:otherwise>
                                </c:choose>

                                <!-- Numbered buttons -->
                                <c:forEach begin="1" end="${numPages}" step="1" varStatus="i">
                                    <c:choose>
                                        <c:when test="${currentPage == i.index}">
                                            <li class="page-item active"><a href='javascript:void(0);' class="page-link bottom-stack-order">${i.index}</a></li>
                                        </c:when>
                                        <c:otherwise>
                                            <c:choose>
                                                <c:when test="${searchString != null}">
                                                    <spring:url value="./search" var="url">
                                                        <spring:param name="page" value="${i.index}"/>
                                                        <spring:param name="searchString" value="${searchString}"/>
                                                    </spring:url>
                                                </c:when>
                                                <c:otherwise>
                                                    <spring:url value="." var="url">
                                                        <spring:param name="page" value="${i.index}"/>
                                                    </spring:url>
                                                </c:otherwise>
                                            </c:choose>
                                            <li class="page-item"><a href='<c:out value="${url}" />' class="page-link">${i.index}</a></li>
                                        </c:otherwise>
                                    </c:choose>
                                </c:forEach>

                                <!-- Next button -->
                                <c:choose>
                                    <c:when test="${currentPage + 1 <= numPages}">
                                        <li class="page-item"><a href='<c:out value="${next}" />' class="page-link">Next</a></li>
                                    </c:when>
                                    <c:otherwise>
                                        <li class="page-item disabled"><a tabindex="-1" href='javascript:void(0);' class="page-link">Next</a></li>
                                    </c:otherwise>
                                </c:choose>
                            </ul>
                        </nav>
                    </div>
                </div>
                <table class="table table-inbox table-hover">
                    <tbody>
                    <c:forEach items="${receipts}" var="receipt" varStatus="i">
                        <spring:url value="/receipts/${receipt.receiptId}" var="receiptViewUrl"/>
                        <spring:url value="/receipts/${receipt.receiptId}/image" var="receiptViewImageUrl"/>
                        <tr class="clickable-row" data-href="<c:out value="${receiptViewUrl}"/>">
                            <td class="view-message vertical-align-text"><img class="receipt-thumbnail modal-image" alt="${receipt.title}" src='<c:out value="${receiptViewImageUrl}"/>'></td>
                            <td class="view-message dont-show vertical-align-text">${receipt.title}</td>
                            <td class="view-message vertical-align-text">${receipt.description}</td>
                            <td class="view-message vertical-align-text">$${receipt.receiptAmount}</td>
                            <td class="view-message vertical-align-text text-right">${receipt.date}</td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
                <!-- Modal Image -->
                <div id="imageModal" class="image-modal">

                    <!-- The Close Button -->
                    <span class="image-modal-close">&times;</span>

                    <!-- Modal Content (The Image) -->
                    <img class="image-modal-content" id="modalImage">

                    <!-- Modal Caption (Image Text) -->
                    <div class="image-modal-caption" id="modalCaption"></div>
                </div>
            </div>
        </aside>
    </div>
    <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
</body>
</html>