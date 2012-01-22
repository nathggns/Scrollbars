h1(#title). Scrollbars V2

*Scrollbars V2* has been completely refactored, from head to toe to give you the _amazing_ and the _fluid_ experience you expect from natural scrollbars with the _customizability_ of CSS.

h1(#table_of_contents). Table of contents

* "Description":#desc
* "Features":#features
* "Usage":#usage
* "Options":#options
* "Classes":#classes

h1(#desc). Description

*Scrollbars V2* is a jQuery plugin that allows you to theme any elements with the simple CSS you already know. It feature filled yet lightweight, the perfect combination to add that little spark to your special creation. 

h1(#features). Features

* *Fluid Width Element Support*
* *Keyboard Control Support*
* *Mousewheel Support*
* *Persistant Scroll Level (After Refresh)*
* *Turns off on mobile phones (Can be forced to stay on)*

h1(#usage). Usage

First, you need to include the <code>jquery.scrollbars.css</code> file in your webpage. You *must* include this before you include the script. Next, you need to include "jQuery":http://c.nath.is/DVmD in your webpage. Including the "jQuery Resize":http://c.nath.is/DWoe and the "jQuery Mousewheel":http://c.nath.is/DXCF plugins is optional, but some of the features will not be available without them.
the next file you need to include is the <code>jquery.scrollbars.js</code> file.

To activate the script, just run the scrollbars method on your jQuery object. *Scrollbars V2* detects when it's needed so, though not recommened or ideal, it's possible to run it on the *** selector.

<code>$("*").scrollbars();</code>

h1(#options). Options

The scrollbars method accepts an asociative array that can and will modify the way *Scrollbars V2* behaves.

h2(#options-contents). Options table of contents

* "xSpace and ySpace":#options-xspace
* "forceScrollbars":#options-force
* "keyboardControl":#options-keyboard
* "persistantSize":#options-persistantsize
* "overlap":#options-overlap
* "draggerSize":#options-draggersize
* "device-touch, device-blackberry and device-other":#options-device
* "scrollbarAutohide":#options-hide
* "mousewheelSupport":#options-mousewheel

h3(#options-xspace). xSpace and ySpace

<blockquote>
xSpace and ySpace control the space allocated to the scrollbar container, for the x and y axis accordingly.

h4. Value

Defaults to *"auto"*.

Accepts *"auto"*, or any integer. *"auto"* has the same effect as setting it to the size of the scrollbar.
</blockquote>

h3(#options-force). forceScrollbars

<blockquote>
Controls the checking the need for scrollbars.

h4. Value

Defaults to *false*.

Accepts any boolean.

h4. Warning

*DO NOT* set this true when using it on the *** selector, it will quite possibly crash your browser on a large webpage.

</blockquote>

h3(#options-keyboard). keyboardControl

<blockquote>
Toggles support for scrolling using the arrow keys and PageUp/PageDown keys.

h4. Value

Defaults to *true*

Accepts any boolean.

</blockquote>

h3(#options-persistantsize). persistantSize

<blockquote>
Toggles support for fluid width elements.

h4. Requires

This option/feature requires the "jQuery Resize":http://c.nath.is/DWoe plugin.

h4. Value

Defaults to *true*

Accepts any boolean.

</blockquote>

h3(#options-overlap). overlap

<blockquote>
Toggles the allowance of scrollbars overlapping each other.

h4. Value

Defaults to *false*

Accepts any boolean.

</blockquote>

h3(#options-draggersize). draggerSize

<blockquote>
Controls the height/width of the scrollbar.

h4. Value

Defaults to *"auto"*

Accepts *"auto"* or any interger. When *"auto"* a complex algorithm will be used to define the scrollbars height.

</blockquote>

h3(#options-device). device-touch, device-blackberry and device-other

<blockquote>
Defines what devices scrollbars is to be used one.

*device-touch* controls activation on touch handhelds (android and iOS).

*device-blackberry* controls activation on blackberry devices.

*device-other* controls activation on every other device.

h4. Value

*device-touch* and *device-blackberry* default to *false*
*device-other* default to *true*

Accepts any boolean

h4. Warning

No support for touch and blackbery devices has yet been coded into *Scrollbars V2*. Activate on these devices at your own risk.

</blockquote>

h3(#options-hide). scrollbarAutohide

<blockquote>
Toggles the autohiding of scrollbars.

h4. Value

Defaults to *true*

Accepts any boolean.
</blockquote>

h3(#options-mousewheel). mousewheelSupport

Toggles support for mousewheel.

h4. Requires

This option/feature requires the "jQuery Mousewheel":http://c.nath.is/DXCF plugin.

h4. Value

Defaults to *true*

Accepts any boolean.
</blockquote>

h1(#classes). Classes

You theme your scrollbars by applying css styles to certain elements.

h2(#classes-contents). Classes Table Of Contents

* "scrollElement":#classes-scrollelement
* "axisInUseX and axisInUseY":#classes-axisinuse
* "rootWrap":#classes-rootwrap
* "dragCon, dragConX and dragConY":#classes-dragcon
* "drag, dragX, dragY":#classes-drag
* "dragConInner":#classes-dragconinner
* "contentWrap":#classes-contentwrap

h3(#classes-scrollelement). scrollElement

<blockquote>
Just an internal class added to all elements *Scrollbars V2* touches.
</blockquote>

h3(#classes-axisinsse). axisInUseX and axisInUseY

<blockquote>
A class added to your element when said axis in use.
</blockquote>

h3(#classes-rootwrap). rootWrap

<blockquote>
A wrapper added to your content that gives space for your scrollbars.
</blockquote>

h3(#classes-dragcon). dragCon, dragConX and dragConY

<blockquote>
A class added to the container for your scrollbar.
</blockquote>

h3(#classes-drag). drag, dragX, dragY

<blockquote>
A class added to the actual scrollbar.
</blockquote>

h3(#classes-dragconinner). dragConInner

<blockquote>
An inerwrap inside the dragCon
</blockquote>

h3(#classes-contentwrap). contentWrap

<blockquote>
A wrapper added to your content to determine the size of it.
</blockquote>