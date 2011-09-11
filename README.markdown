# Scrollbars

Scrollbars is an easy to use, jQuery plugin which enables you to create themeable scrollbars.

# Usage

First you have to include the base css files

	<link href="jquery.scrollbars.css" rel="stylesheet" type="text/css" />

Then add in jQuery

	<script type="text/javascript" src="jquery.js"></script>

Then add in Scrollbars

	<script type="text/javascript" src="jquery.scrollbars.js"></script>

Then initialize

	<script type="text/javascript">
    $(document).ready(function() {
    	$('*').scrollbars();
    })
	</script>


# Useful information

## Is it safe to use Scrollbars on the * selector?

Yes, Scrollbars detects if it is needed