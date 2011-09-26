# Scrollbars

Scrollbars is an easy to use, jQuery plugin which enables you to create themeable scrollbars.

# Demo

Check out the [github page](http://nathggns.github.com/Scrollbars) for demos and more!

# Usage

**Notice:** ALWAYS put the css before the javascript!!!!

First you have to include the base css files

	<link href="jquery.scrollbars.css" rel="stylesheet" type="text/css" />

Include a theme if you would like. You can also write your own

  <link href="lion.theme.min.css" rel="stylesheet" type="text/css" />

Then add in jQuery

	<script type="text/javascript" src="jquery.js"></script>

Include jQuery Mousewheel if you want mousewheel support

	<script type="text/javascript" src="jquery.mousewheel.js"></script>

Then add in Scrollbars

	<script type="text/javascript" src="jquery.scrollbars.min.js"></script>

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

**Does touch support work on all platforms?**

No, touch support is limited to iOS at the current moment.

**What options do we have?**

If you pass an array to the plugin, we can change certain things, such as:

 - **xPadding**:
  - Default: auto
  - Use: Changes the amount of space reserved for the scrollbars. Make it **0** if you want to make the scrollbars overlay the content.
 - **yPadding**:
  - Default: auto
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
 - **clicktoscroll**:
  - Default: true
  - Use: Allow clicking the dragger container to scroll.
 - **draggerheight**:
  - Default: auto
  - Use: Height of the dragger.
  - Min: 10
 - **autohide**:
  - Default: false
  - Use: Enable/Disable autohiding of the dragger
 - **naturalscrolling**:
  - Default: false
  - Use: Mimic OS X Lion natural scrolling
 - **touch**
  - Default: true
  - Use: Enable/Disable touch support

# Examples.

```javascript
// Default scrollbars
$('*').scrollbars();

// Overlay scrollbars
$('*').scrollbars({
	xPadding:0,
  yPadding:0
});

// Disable mousewheel support
$('*').scrollbars({
	mousewheel: false
})

// Enable mousedrag support
$('*').scrollbars({
	mousedrag: true
});

// Enable mousedrag support and change cursor to pointer
$('*').scrollbars({
	mousedrag: true,
	mousedragcursor: 'pointer'
});

// Disable clicktoscroll
$('*').scrollbars({
	clicktoscroll: false
});

// Make dragger 50px tall
$('*').scrollbars({
	draggerheight: 50
});

// Enable autohiding of the dragger
$('*').scrollbars({
  autohide: true
});

// Disable touch
$('*').scrollbars({
  touch: false
});
```

# Screenshots.

**Lion Theme**

[![lion them](http://s.nath.is/24_09_11_18_47_39.png)](http://s.nath.is/24_09_11_18_47_39.png)

**Lion Theme (overlay)**

[![lion theme (overlay)](http://s.nath.is/24_09_11_18_48_47.png)](http://s.nath.is/24_09_11_18_48_47.png)

# How to write a theme.

It's easy to write a theme for this thing, you just need to write a CSS file, and override a couple of classes. Here is a list of what classes are what

 - .dragConY - The Y axis drag container
 - .dragConX - The X axis drag container
 - .dragY    - The Y axis dragger
 - .dragX    - The X axis dragger

If you need anymore help, just look at the lion theme.