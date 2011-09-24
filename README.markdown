# Scrollbars

Scrollbars is an easy to use, jQuery plugin which enables you to create themeable scrollbars.

# Usage

**Notice:** ALWAYS put the css before the javascript!!!!

First you have to include the base css files

	<link href="jquery.scrollbars.css" rel="stylesheet" type="text/css" />

Then add in jQuery

	<script type="text/javascript" src="jquery.js"></script>

Include jQuery Mousewheel if you want mousewheel support

	<script type="text/javascript" src="jquery.mousewheel.js"></script>

Then add in Scrollbars

	<script type="text/javascript" src="jquery.scrollbars.js"></script>

Then initialize

	<script type="text/javascript">
    $(document).ready(function() {
    	$('*').scrollbars();
    })
	</script>


# Useful information.

**Is it safe to use Scrollbars on the * selector?**

Yes, Scrollbars detects if it is needed. The speed difference is unnoticable. Of course, this isn't ideal if your running this on lots of elements, or on a production server.

**Is it safe to not include the mousewheel plugin?**

Yes, Scrollbars will just turn off mousewheel support if it is absent.

**What options do we have?**

If you pass an array to the plugin, we can change certain things, such as:

 - **rightPadding**:
  - Default: 20
  - Use: Changes the amount of space reserved for the scrollbars. Make it **0** if you want to make the scrollbars overlay the content.
 - **mousewheel**:
  - Default: true
  - Use: Enable/Disable mousewheel support.
 - **mousedrag**:
  - Default: false
  - Use: Enabled/Disable mouse drag support
 - **mousedragcursor**:
  - Default: move
  - Use: Choose cursor that is used for mouse drag

**Will you ever get horizontal support?**

Yes, first we are trying to master vertical support before we do anything with horizontal.

**Will you give us a minified version?**

Yes, when we come out of beta.

# Examples.

```javascript
// Default scrollbars
$('*').scrollbars();

// Overlay scrollbars
$('*').scrollbars({
	rightPadding: 0
});

// Disable mousewheel support
$('*').scrollbars({
	mousewheel: false
})
```

# Screenshots.

**Lion Theme**

[![lion them](http://s.nath.is/24_09_11_18_47_39.png)](http://s.nath.is/24_09_11_18_47_39.png)

**Lion Theme (overlay)**

[![lion theme (overlay)](http://s.nath.is/24_09_11_18_48_47.png)](http://s.nath.is/24_09_11_18_48_47.png)