# Scrollbars

Scrollbars is an easy to use, jQuery plugin which enables you to create themeable scrollbars.

# Important Links

[FAQs](https://github.com/nathggns/Scrollbars/wiki/FAQs)

[Theme Writing Guide](https://github.com/nathggns/Scrollbars/wiki/Theme-Writing-Guide)

[Options](https://github.com/nathggns/Scrollbars/wiki/Options)

[Important Information](https://github.com/nathggns/Scrollbars/wiki/Important-Information)

[Demo](http://nathggns.github.com/Scrollbars)

# Usage

**Notice:** ALWAYS put the css before the javascript!!!!

First you have to include the base css files

	<link href="jquery.scrollbars.css" rel="stylesheet" type="text/css" />

Include a theme if you would like. You can also write your own

  <link href="lion.theme.min.css" rel="stylesheet" type="text/css" />

Then add in [jQuery](http://jquery.com)

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>

Include [jQuery Mousewheel](http://plugins.jquery.com/project/mousewheel) if you want mousewheel support

	<script type="text/javascript" src="http://brandonaaron.net/javascripts/plugins/mousewheel.js"></script>

Then add in Scrollbars

	<script type="text/javascript" src="jquery.scrollbars.min.js"></script>

Then initialize

	<script type="text/javascript">
    $(document).ready(function() {
    	$('*').scrollbars();
    })
	</script>