<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
    <spring:url var="baseHomeUrl" value="/home/"/>
    <c:choose>
        <c:when test="${searchString != null}">
            <spring:url value="./search" var="prev">
                <spring:param name="page" value="${currentPage-1}"/>
                <spring:param name="searchString" value="${searchString}"/>
            </spring:url>
            <spring:url value="./search" var="next">
                <spring:param name="page" value="${currentPage + 1}"/>
                <spring:param name="searchString" value="${searchString}"/>
            </spring:url>
        </c:when>
        <c:otherwise>
            <spring:url value="." var="prev">
                <spring:param name="page" value="${currentPage-1}"/>
            </spring:url>
            <spring:url value="." var="next">
                <spring:param name="page" value="${currentPage + 1}"/>
            </spring:url>
        </c:otherwise>
    </c:choose>

    <spring:url value="/resources/css/afx-home-styleguide.css" var="styleguide"/>
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
    <spring:url value="/resources/js/receiptOrganizerSidebar.js" var="sidebar"/>
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
    <script src="${sidebar}"></script>
    <script>
        $(document).ready(function() {
            $(function () {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                $(document).ajaxSend(function(e, xhr, options) {
                    xhr.setRequestHeader(header, token);
                });
            });
        });
    </script>
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <title>ReceiptOrganizer</title>
</head>
<body>
    <div class="mail-box">
        <jsp:include page="/WEB-INF/jsp/userLabelsAside.jsp">
            <jsp:param name="baseHomeUrl" value="${baseHomeUrl}"/>
        </jsp:include>
        <aside class="lg-side">
            <jsp:include page="rightNavbar.jsp"/>
            <div class="inbox-body">
                <div class="mail-option">
                    <div class="btn-group-container">
                        <c:choose>
                            <c:when test="${currentLabel != null}">
                                <span class="vertical-align-text">${currentLabel}</span>
                            </c:when>
                            <c:when test="${searchString != null}">
                                <span class="vertical-align-text">Search for: "${searchString}"</span>
                            </c:when>
                            <c:otherwise>
                                <span class="vertical-align-text">All Receipts</span>
                            </c:otherwise>
                        </c:choose>
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
                <c:choose>
                    <c:when test="${receipts != null}">
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
                    </c:when>
                    <c:otherwise>
                        <p class="text-center"> No receipts!</p>
                    </c:otherwise>
                </c:choose>
            </div>
        </aside>
        <div class="snackbar"></div>
        <jsp:include page="/WEB-INF/jsp/imageModal.jsp"/>
    </div>
    <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
</body>
</html>