(function($) {
	$.fn.scrollbars = function() {
		this.each(function() {
			$this = $(this);

			overflow = $this.css('overflow');
			overflowX = $this.css('overflowX');
			overflowY = $this.css('overflowY');


			if (overflow != 'scroll' && overflowX != 'scroll' && overflowY != 'scroll')
			{
				return;
			}

			position = $this.css('position');

			if (position == 'static')
			{
				$this.css('position', 'relative');
			}

			$this.css('overflow', 'hidden');

			uniqid = 'scroll-' + Math.floor(Math.random() * 10000);

			$this.html("<div class='" + uniqid + " scrollWrapHide'>" + $this.html() + "</div>");

			$wrapHide = $(".scrollWrapHide." + uniqid);

			$wrapHide.html("<div class='" + uniqid + " scrollWrap'>" + $wrapHide.html() + "</div>");
			
			$wrap = $('.scrollWrap.' + uniqid);

			contentWidth = $wrap.width();
			contentHeight = $wrap.height();
			viewWidth = $this.width();
			viewHeight = $this.height();

			if (contentWidth > viewWidth)
			{
				/* Not adding horizontal support yet */
			}

			if (contentHeight > viewHeight)
			{
				YWrap = document.createElement('div');
				YWrap.className = uniqid + " scrollYWrap";
				$YWrap = $(YWrap);

				$YWrap.css({
					height: viewHeight
				});

				YBar = document.createElement('div');
				YBar.className = uniqid + " scrollYBar";
				$YBar = $(YBar);

				$YBar.data('uniqid', uniqid);
				$YBar.data('viewHeight', viewHeight);
				$YBar.data('contentHeight', contentHeight);

				// A math calculation will replace this.
				YBarHeight = 100;

				$YBar.css({
					height: YBarHeight
				}).mousedown(function(event) {
					$(this).data('move', true).data('mouseY', event.clientY);
					event.preventDefault();
				});

				$('*').mousemove(function(event) {
					$('.scrollYBar').each(function() {
						if ($(this).data('move') == true)
						{
							distance =  event.clientY - $(this).data('mouseY');
							$(this).data('mouseY', event.clientY);

							$.fn.scrollbars.moveY($(this), distance);
							event.preventDefault();
							return false;
						}
					});
				}).mouseup(function() {
					$('.scrollYBar').each(function(event) {
						$(this).data('move', false);
					});
				});

				if ($.mousewheel)
				{
					
					$this.mousewheel(function(event, delta) {
						delta = -delta;

						$.fn.scrollbars.moveY($(event.currentTarget).find('.scrollYBar'), delta);
					});
				}

				$YWrap.append(YBar);
				$wrapHide.append(YWrap);
			}
		});
	}
	$.fn.scrollbars.moveY = function(base, distance) {
		current = base.position().top;
		current = current == 'auto' ? 0 : parseFloat(current);

		t = current + distance;
		max = base.data('viewHeight') - base.height();
		min = 0;

		if (t < min) t = min;
		if (t > max) t = max;

		base.css({
			top: t
		});

		/* This is where I need the speed to be calculated */
	}

})(jQuery);