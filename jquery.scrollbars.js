(function($) {
	$.fn.scrollbars = function() {
		$(this).each(function() {
			$.fn.scrollbars.run.call(this);
		});
	}
	$.fn.scrollbars.moveYBar = function(id, distance)
	{
		(function() {
			if (distance < 0)
			{
				distance = 0;
			}

			if (distance > ($(this).data('viewHeight') - $(this).height()))
			{
				distance = $(this).data('viewHeight') - $(this).height();
			}
			$(this).css({
				top: distance
			});

			wrap = $('.' + id + '.scrollWrap');

			percent = $(this).data('YPercent');
			height = $(this).height();

			wrap.css({
				bottom: distance * ($(this).data('viewHeight') / (wrap.height() / 2 ))
			});
		}).call($('.' + id + '.scrollYBar').get());
	}
	$.fn.scrollbars.run = function() {
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

		base.css('overflow', 'visible');

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

		uniqid = 'scroll-' + 
		        Math.floor(Math.random() * 1000000).toString();

		// Wrap the whole thing in a div to contain it in a overflow: hidden

		wrapHide = document.createElement('div');
		wrapHide.className = 'scrollWrapHide ' + uniqid;

		$(wrapHide).css({
			height: base.height(),
			width: base.width(),
			overflow: 'hidden'
		});

		// Create a wrap to find out our "natural" content height

		wrap = document.createElement('div');
		wrap.className = 'scrollWrap ' + uniqid;

		wrap.innerHTML = base.html();

		wrapHide.appendChild(wrap);

		wrap = $(wrap);
		wrapHide = $(wrapHide);

		base.html(wrapHide.get());

		// Get Dimensions

		viewWidth = base.width();
		viewHeight = base.height();

		contentWidth = wrap.width();
		contentHeight = wrap.height();

		// Do we need a vetical scrollbar?

		if (contentHeight > viewHeight)
		{
			// Get Percentages for scroll speed and scrollbar height
			YPercent = (viewHeight / contentHeight) * 100;
			YBarHeight = ((viewHeight / 100) * (YPercent));

			YBarWrap = document.createElement('div');
			YBarWrap.className = 'scrollYWrap ' + uniqid;

			YBarHeight - $(YBarWrap).height();

			YBar = document.createElement('div');
			YBar.className = 'scrollYBar scrollBar ' + uniqid;

			$(YBarWrap).css({
				height: viewHeight
			});

			$(YBarWrap).append(YBar);

			$(wrapHide).append(YBarWrap);

			$(YBar)
			.data('uniqid', uniqid)
			.data('YPercent', YPercent)
			.data('viewHeight', viewHeight)
			.css({
				height: YBarHeight
			}).mousedown(function(event) {
				$(this).data('move', true).data('mouseY', event.pageY);
				event.preventDefault();
			});
			$('body').mouseup(function(event) {
				$('.scrollBar').each(function() {
					$(this).data('move', 'false');
				});
			})
			$('body').mousemove(function(event) {
				$('.scrollYBar').each(function() {
					if ($(this).data('move') == true)
					{
						distance = event.pageY - $(this).data('mouseY');
						$(this).data('mouseY', event.pageY);

						current = $(this).css('top');

						current = (current == 'auto') ? 0 : parseFloat(current);

						if (distance < 0) {
							distance = -distance;
							change = current - distance;
						} else {
							change = current + distance;
						}

						$.fn.scrollbars.moveYBar($(this).data('uniqid'), change);
					}
				});
			});
		}
	}
})(jQuery);