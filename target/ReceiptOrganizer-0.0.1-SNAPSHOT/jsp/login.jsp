<?xml version="1.0" encoding="ISO-8859-1" ?>
<jsp:root xmlns:jsp="http://java.sun.com/JSP/Page" version="2.0">
	<jsp:directive.page contentType="text/html; charset=ISO-8859-1"
		pageEncoding="ISO-8859-1" session="false" />
	<jsp:output doctype-root-element="html"
		doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
		omit-xml-declaration="true" />
	<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>AFX ReceiptOrganizer</title>
</head>
<body>
	<div class="container">
		<h2>Employees</h2>
		<!--Search Form -->
		<form action="/employee" method="get" id="seachEmployeeForm"
			role="form">
			<input type="hidden" id="searchAction" name="searchAction"
				value="searchByName" />
			<div class="form-group col-xs-5">
				<input type="text" name="employeeName" id="employeeName"
					class="form-control" required="true"
					placeholder="Type the Name or Last Name of the employee" />
			</div>
			<button type="submit" class="btn btn-info">
				<span class="glyphicon glyphicon-search"></span> Search
			</button>
			<br></br> <br></br>
		</form>
	</div>

</body>
	</html>
</jsp:root>