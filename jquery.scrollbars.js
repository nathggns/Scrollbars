(function($) {
	var data = {};

	var methods = {
		init: function() {
			// Test if we need to use our plugin
			overflow = this.css('overflow');
			overflowY = this.css('overflow-y');
			if (overflow != 'auto' && overflowY != 'scroll' && overflowY != 'auto' && overflowY != 'scroll') return;

			// Make sure we don't have position static
			if (this.css('position') === 'static') this.css('position', 'relative');

			// Lock size
			this.css({
				height: this.height(),
				width: this.width()
			});

			// Apply overflow hidden (remove scrollbars)
			this.css({
				overflow: 'hidden'
			});

			// Generate a unique id for every element generated
			id = 'scroll-' + Math.floor(Math.random() * 10000);

			// Call generate function
			methods.generate.apply(this, Array(id));

			// Add our event listeners
			methods.addEvents.apply(this);
		},
		generate: function(id) {

			rightPadding = this.data('opts')['rightPadding'];

			this.addClass('scrollRoot').addClass(id);
			// Create a root wrap to make space for scrollbars
			rootWrap = $(document.createElement('div'));
			rootWrap
				.addClass(id)
				.addClass('scrollElement')
				.addClass('rootWrap')
				.html(this.html())
				.css({
					height: this.height(),
					width: this.width() - rightPadding
				});
			
			this.html('').append(rootWrap);

			// Create a content wrap for various calculations and manipulations
			contentWrap = $(document.createElement('div'));
			contentWrap
				.addClass(id)
				.addClass('scrollElement')
				.addClass('contentWrap')
				.html(rootWrap.html());
			
			rootWrap.html('').append(contentWrap);

			// Create a container for the dragger
			dragCon = $(document.createElement('div'));
			dragCon
				.addClass(id)
				.addClass('scrollElement')
				.addClass('dragCon');
			
			this.append(dragCon);

			// Work out a ratio
			ratio = dragCon.height() / contentWrap.height();
			dragHeight = +(rootWrap.height() * ratio);

			// Create our dragger
			drag = $(document.createElement('div'));
			drag
				.addClass(id)
				.addClass('scrollElement')
				.addClass('drag')
				.css({
					height: dragHeight
				})
				.data('id', id)
				.data('ratio', ratio);

			dragCon.append(drag);
		},
		addEvents: function() {
			mousewheel = this.data('opts')['mousewheel'];
			cursor = this.data('opts')['mousedragcursor'];

			drag = this.find('.drag');
			contentWrap = this.find('.contentWrap');

			drag.mousedown(function(event) {
				$(this).data('move', event.pageY);
				$('body').css({
					'cursor': 'default'
				});
				event.preventDefault();
			});

			if (this.data('opts')['mousedrag']) {
				this.mousedown(function(event) {
					drag = $(this).find('.drag');
					drag.data('move', event.pageY);
					drag.data('multiply', '-1');
					$('body').css({
						'cursor': cursor
					})
					event.preventDefault();
				}).hover(function() {
					$(this).css({
						'cursor': cursor
					})
				}, function() {
					$(this).css({
						'cursor': 'auto'
					});
				});
			}

			$('*').mouseup(function(event) {
				$('.scrollElement.drag').data('move', false);
				$('body').css({
					cursor: 'auto'
				});
			}).mousemove(function(event) {
				$('.scrollElement.drag').each(function() {
					if (!$(this).data('move')) return;
					offset = event.pageY - $(this).data('move');
					$(this).data('move', event.pageY);

					if ($(this).data('multiply')) {
						offset = offset * parseFloat($(this).data('multiply'));
					}

					methods.move.call($('.scrollRoot.' + $(this).data('id')), offset);
				});
			});
			if ($().mousewheel && mousewheel) {
				this.mousewheel(function(event, delta) {
					methods.move.call($(this), -(delta*1.5));
				});
			}
		},
		move: function(offset) {
			drag = this.find('.drag');
			contentWrap = this.find('.contentWrap');
			rootWrap = this.find('.rootWrap');

			current = drag.css('top');
			current = current == 'auto' ? 0 : parseFloat(current);

			distance = current + offset;

			min = 0;
			max = drag.parent().height() - drag.height();

			if (distance < min) distance = min;
			if (distance > max) distance = max;

			drag.css({
				'top': distance
			});

			trackDistance = drag.parent().height() - drag.height();
			notVisible = contentWrap.height() - rootWrap.height();
			distanceRatio = notVisible / trackDistance

			distance = (distance * distanceRatio) * -1;

			contentWrap.css({
				top: distance
			});
		}
	}
	$.fn.scrollbars = function(options) {
		var opts = $.fn.extend($.fn.scrollbars.defaults, options);
		return this.each(function() {
			$(this).data('opts', opts);
			methods.init.apply($(this), arguments);
		});
	}

	$.fn.scrollbars.defaults = {
		'rightPadding': 20,
		'mousewheel': true,
		'mousedrag': false,
		'mousedragcursor': 'move'
	}
})(jQuery);