<%--
  User: Andrew
  Date: 9/1/2017
  Time: 8:10 PM
--%>
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib uri = "http://www.springframework.org/tags/form" prefix = "form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!doctype html>
<html lang="en">
<head>
    <!-- SITE URLS -->
    <spring:url var="receiptIndexUrl" value="/receipts/"/>
    <c:choose>
        <c:when test='${!searchString.equals("")}'>
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
    <spring:url value="https://fonts.googleapis.com/css?family=Varela+Round" var="googlefonts"/>

    <!-- STYLESHEETS -->
    <spring:url value="/resources/css/styleguide.css" var="styleguide"/>
    <spring:url value="/resources/css/bootstrap.min.css" var="bootstrap"/>
    <spring:url value="/resources/css/bootstrap-multiselect.css" var="multiselectcss"/>
    <spring:url value="/resources/css/fontawesome-all.css" var="fontawesomecss"/>
    <spring:url value="/resources/css/jquery-ui.css" var="uicss"/>
    <spring:url value="/resources/css/jquery.mCustomScrollbar.min.css" var="sidebarScrollCss"/>

    <!-- JAVASCRIPT -->
    <spring:url value="/resources/js/bootstrap.min.js" var="bootstrapjs"/>
    <spring:url value="/resources/js/jquery-3.2.1.min.js" var="jquery"/>
    <spring:url value="/resources/js/bootstrap-multiselect.js" var="multiselectjs"/>
    <spring:url value="/resources/js/jquery.validate.min.js" var="validate"/>
    <spring:url value="/resources/js/additional-methods.min.js" var="addvalidate"/>
    <spring:url value="/resources/js/jquery-ui.min.js" var="ui"/>
    <spring:url value="/resources/js/jquery.mCustomScrollbar.min.js" var="sidebarScroll"/>
    <spring:url value="/resources/js/common.js" var="receiptCommon"/>
    <spring:url value="/resources/js/home.js" var="receiptHome"/>
    <spring:url value="/resources/js/sidebar.js" var="sidebar"/>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>

    <link rel="stylesheet" href="${fontawesomecss}"/>
    <link rel="stylesheet" type="text/css" href="${googlefonts}">
    <link rel="stylesheet" href="${bootstrap}"/>
    <link rel="stylesheet" href="${multiselectcss}"/>
    <link rel="stylesheet" href="${uicss}"/>
    <link rel="stylesheet" href="${sidebarScrollCss}"/>
    <link rel="stylesheet" href="${styleguide}">

    <script src="${jquery}"></script>
    <script defer src="${bootstrapjs}"></script>
    <script defer src="${multiselectjs}"></script>
    <script defer src="${validate}"></script>
    <script defer src="${addvalidate}"></script>
    <script defer src="${ui}"></script>
    <script defer src="${sidebarScroll}"></script>
    <script defer src="${receiptCommon}"></script>
    <script defer src="${receiptHome}"></script>
    <script defer src="${sidebar}"></script>
    <script defer>
        $(function() {
            $(function () {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                $(document).ajaxSend(function(e, xhr, options) {
                    xhr.setRequestHeader(header, token);
                });
            });
        });
    </script>

    <title>ReceiptOrganizer</title>
</head>
<body>
    <div class="wrapper">
        <jsp:include page="/WEB-INF/jsp/sidebar.jsp"/>
        <div id="content">
            <jsp:include page="navbar.jsp"/>
            <div class="content-body">
                <div class="page-option">
                    <div class="btn-group-container">
                        <c:choose>
                            <c:when test="${activeLabels.size() != 0}">
                                <h4 class="vertical-align-text">
                                <c:forEach items="${activeLabels}" var="label" varStatus="i">
                                    [${label}]
                                </c:forEach>
                                </h4>
                            </c:when>
                            <c:when test='${!searchString.equals("")}'>
                                <h4 class="vertical-align-text">Search for: "${searchString}"</h4>
                            </c:when>
                            <c:otherwise>
                                <h4 class="vertical-align-text">All Receipts</h4>
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
                            <ul class="pagination ">
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
                                                <c:when test='${!searchString.equals("")}'>
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
                            <c:forEach items="${receipts}" var="receipt" varStatus="i">
                                <spring:url value="/receipts/${receipt.receiptId}" var="receiptViewUrl"/>
                                <spring:url value="/receipts/${receipt.receiptId}/image?thumbnail=true" var="receiptViewImageUrl"/>
                                <tr class="clickable-row" data-href="<c:out value="${receiptViewUrl}"/>">
                                    <td class="vertical-align-text"><img class="receipt-thumbnail modal-image" alt="${receipt.title}" src='<c:out value="${receiptViewImageUrl}"/>'></td>
                                    <td class="vertical-align-text">
                                        <table class="table receipt-info-table">
                                            <tr>
                                                <th class="receipt-table-primary">${receipt.title}</th>
                                                <th class="receipt-table-secondary">${receipt.date}</th>
                                                <fmt:formatNumber value='${receipt.total}' type="number" minFractionDigits="2" maxFractionDigits="2" var="formattedReceiptAmount"/>
                                                <th class="receipt-table-secondary">${formattedReceiptAmount}</th>
                                            </tr>
                                            <tr>
                                                <td class="receipt-table-primary">First Item</td>
                                                <td class="receipt-table-secondary">Quantity</td>
                                                <td class="receipt-table-secondary">Unit Price</td>
                                            </tr>
                                            <c:choose>
                                                <c:when test="${receipt.items.size() != 0}">
                                                    <c:forEach items="${receipt.items}" var="item" varStatus="j">
                                                        <c:if test="${j.index < numThumbnailItems}">
                                                            <tr>
                                                                <td class="receipt-table-primary">${item.name}</td>
                                                                <td class="receipt-table-secondary">${item.quantity}</td>
                                                                <fmt:formatNumber value='${item.unitPrice}' type="number" minFractionDigits="2" maxFractionDigits="2" var="formattedUnitPrice"/>
                                                                <td class="receipt-table-secondary">${formattedUnitPrice}</td>
                                                            </tr>
                                                        </c:if>
                                                    </c:forEach>
                                                </c:when>
                                                <c:otherwise>
                                                    <tr>
                                                        <td colspan="3" class="receipt-table-empty">No Items!</td>
                                                    </tr>
                                                </c:otherwise>
                                            </c:choose>

                                        </table>
                                    </td>
                                </tr>
                            </c:forEach>
                        </table>
                    </c:when>
                    <c:otherwise>
                        <p class="text-center">No receipts!</p>
                    </c:otherwise>
                </c:choose>
            </div>
            <jsp:include page="/WEB-INF/jsp/footer.jsp"/>
        </div>
    </div>
    <div class="snackbar">
        <span id="snackbarText"></span>
    </div>
    <div id="overlay"></div>
    <jsp:include page="/WEB-INF/jsp/image-modal.jsp"/>
    <jsp:include page="/WEB-INF/jsp/loader.jsp"/>
</body>
</html>