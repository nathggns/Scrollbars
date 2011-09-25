<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>jQuery.scrollbars.js</title>
	<style type="text/css">
	#div-1, #div-2 {
		width: 300px;
		height: 180px;
		overflow: scroll;
		float: left;
		margin-right: 30px;
	}
	</style>
	<link rel="stylesheet" href="jquery.scrollbars.css" type="text/css">
	<link rel="stylesheet" href="lion.theme.css" type="text/css">
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="jquery.mousewheel.js"></script>
	<script type="text/javascript" src="jquery.scrollbars.js"></script>
	<script type="text/javascript">							
	$(document).ready(function() {
		$('*').scrollbars();
	});
	</script>
</head>
<body>
	<div id="div-1">
		<img src="http://www.getthebigpicture.net/storage/jbaldwin/hawaii8.jpg?__SQUARESPACE_CACHEVERSION=1304222222297" />
	</div>
	<div id="div-2">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	</div>
	<div style="width:100%;height:1px;clear:both;">&nbsp;</div>
</body>
</html>