<%--
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<html>
<head>
    <!-- SITE URLS -->
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

    <!-- FONTS -->
    <spring:url value="http://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>

    <!-- STYLESHEETS -->
    <spring:url value="/resources/css/afx-home-styleguide.css" var="styleguide"/>
    <spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
    <spring:url value="/resources/css/bootstrap-multiselect.css" var="multiselectcss"/>
    <spring:url value="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" var="fontawesomecss"/>
    <spring:url value="/resources/css/jquery-ui.css" var="uicss"/>
    <spring:url value="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css" var="sidebarScrollCss"/>

    <!-- JAVASCRIPT -->
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
    <spring:url value="/resources/js/bootstrap-multiselect.js" var="multiselectjs"/>
    <spring:url value="/resources/js/jquery.validate.min.js" var="validate"/>
    <spring:url value="/resources/js/additional-methods.min.js" var="addvalidate"/>
    <spring:url value="/resources/js/jquery-ui.min.js" var="ui"/>
    <spring:url value="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.concat.min.js" var="sidebarScroll"/>
    <spring:url value="/resources/js/common.js" var="receiptCommon"/>
    <spring:url value="/resources/js/home.js" var="receiptHome"/>
    <spring:url value="/resources/js/sidebar.js" var="sidebar"/>
    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" href="${bootstrap}"/>
    <link rel="stylesheet" href="${multiselectcss}"/>
    <link rel="stylesheet" href="${uicss}"/>
    <link rel="stylesheet" href="${sidebarScrollCss}"/>
    <link rel="stylesheet" href="${styleguide}">

    <script src="${jquery}"></script>
    <script src="${bootstrapjs}"></script>
    <script src="${multiselectjs}"></script>
    <script src="${validate}"></script>
    <script src="${addvalidate}"></script>
    <script src="${ui}"></script>
    <script src="${sidebarScroll}"></script>
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
    <div class="wrapper">
        <jsp:include page="/WEB-INF/jsp/sidebar.jsp">
            <jsp:param name="baseHomeUrl" value="${baseHomeUrl}"/>
        </jsp:include>
        <div id="content">
            <jsp:include page="navbar.jsp"/>
            <div class="content-body">
                <div class="page-option">
                    <div class="btn-group-container">
                        <c:choose>
                            <c:when test="${activeLabels.size() != 0}">
                                <span class="vertical-align-text">
                                <c:forEach items="${activeLabels}" var="label" varStatus="i">
                                    [${label}]
                                </c:forEach>
                                </span>
                            </c:when>
                            <c:when test='${searchString != ""}'>
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
                    <c:when test="${receipts.size() != 0}">
                        <table class="table table-receipts table-hover">
                            <tbody>
                            <c:forEach items="${receipts}" var="receipt" varStatus="i">
                                <spring:url value="/receipts/${receipt.receiptId}" var="receiptViewUrl"/>
                                <spring:url value="/receipts/${receipt.receiptId}/image?thumbnail=true" var="receiptViewImageUrl"/>
                                <tr class="clickable-row" data-href="<c:out value="${receiptViewUrl}"/>">
                                    <td class="vertical-align-text"><img class="receipt-thumbnail modal-image" alt="${receipt.title}" src='<c:out value="${receiptViewImageUrl}"/>'></td>
                                    <td class="vertical-align-text">${receipt.title}</td>
                                    <td class="vertical-align-text">${receipt.description}</td>
                                    <td class="vertical-align-text">${receipt.receiptAmountCurrency}</td>
                                    <td class="vertical-align-text text-right">${receipt.date}</td>
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
            <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
        </div>
    </div>
    <div class="snackbar">
        <span id="snackbarText"></span>
    </div>
    <jsp:include page="/WEB-INF/jsp/image-modal.jsp"/>
</body>
</html>