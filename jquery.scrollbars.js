(function($) {
	$.fn.scrollbars = function() {
		return this.each(function() {
			// Create pointer to original this
			base = $(this);

			// Check to make sure we actually need to use scrollbars

			overflow = base.css('overflow');
			overflowX = base.css('overflow-x');
			overflowY = base.css('overflow-y');

			if (overflow != 'scroll' && overflowX != 'scroll' && overflowY != 'scroll')
			{
				return;
			}

			// Make sure the position isn't static

			position = base.css('position');

			if (position == 'static')
			{
				base.css('position', 'relative');
			}

			base.css('overflow', 'hidden');

			// Wait until we have fully loaded all our items before continuing

			children = base.find('*').length;
			loaded = 0;

			base.find('*').load(function() {
				loaded = loaded + 1;
			});

			while (true)
			{
				if (loaded == children)
				{
					break;
				}
			}

			// Create a unique id to use as a pointer to this exact scroll set

			uniqid = 'scroll-' + Math.floor(Math.random() * 1000000).toString();

			// Wrap the whole thing in a div to find out its "natuaral" height

			wrap = document.createElement('div');
			wrap.className = 'scrollWrap ' + uniqid;
			wrap.innerHTML = base.html();
			base.html(wrap);
		});
	}
})(jQuery);