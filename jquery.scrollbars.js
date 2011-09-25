/*! jQuery Scrollbars | License: https://github.com/nathggns/Scrollbars/blob/master/LICENSE */
(function($) {
	var methods = {
		init: function() {
			// Create reference to this
			ele = this;

			// Test if we need our plugin or not
			overflow = this.css('overflow');
			overflowX = this.css('overflow-x');
			overflowY = this.css('overflow-y');

			need = overflow == 'auto' || overflow == 'scroll';
			need = need || overflowX == 'auto' || overflowX == 'scroll';
			need = need || overflowY == 'auto' || overflowY == 'scroll';

			if (!need) {
				return;
			}

			// Wait until all child images have loaded
			allImgs = this.find('img');
			allImgsLength = allImgs.length;
			allImgsLoaded = 0;

			if (allImgsLength == 0) {
				methods.prepare.call(ele);
			} else {
				allImgs.each(function() {
					image = new Image;

					$(image)
						.data('ele', ele)
						.data('imgs', [allImgsLength, allImgsLoaded])
						.bind('load', function() {
							imgs = $(this).data('imgs');

							imgs[1]++;

							if (imgs[1] == imgs[0]) {
								methods.prepare.call($(this).data('ele'));
							}

							$(this).data('imgs', imgs);
						});
					
					image.src = this.src;
				});
			}
		},
		prepare: function() {
			// Create a reference to this
			ele = this;

			// Make sure we don't have position static
			if (this.css('position') == 'static') {
				this.css('position', 'relative');
			}

			// Remove OS scrollbars
			this.css('overflow', 'hidden');

			// Generate a uniq id tag for every element we use
			id = 'scroll-' + Math.floor(Math.random() * 100000);

			// Retrieve option values for space to reserve for scrollbars
			yPadding = this.data('opts')['yPadding'];
			xPadding = this.data('opts')['xPadding'];

			// Give the class scrollRoot to our root element
			this.addClass('scrollRoot').addClass(id);

			// Create the wrap that gives space to our scrollbars
			rootWrap = $(document.createElement('div'));
			rootWrap
				.addClass(id)
				.addClass('rootWrap')
				.html(this.html())
				.css({
					height: this.height() - xPadding,
					width: this.width() - yPadding
				});
			
			// Create a content wrap for various manipulations and calculations
			contentWrap = $(document.createElement('div'));
			contentWrap
				.addClass(id)
				.addClass('contentWrap')
				.html(rootWrap.html())
				.css({
					'float': 'left',
					padding: 0
				});
	

			// Add our wraps to the DOM
			rootWrap.html('').append(contentWrap);
			this.html('').append(rootWrap);

			// Check if we actually need these scrollbars
			if (rootWrap.height() > contentWrap.height() && rootWrap.width() > contentWrap.width()) {
				this.html(contentWrap.html());
			}

			this.find('img').each(function() {
				console.log($(this).width());
			})

			// Generate Y scrollbar
			methods.generate.call(this, id, 'Y');

			// Generate X scrollbars
			methods.generate.call(this, id, 'X');

			// Add events for Y scrollbars
			methods.addEvents.call(this, id, 'Y');

			// Add events for X scrollbars
			methods.addEvents.call(this, id, 'X');
		},
		generate: function(id, axis) {
			contentWrap = this.find('.contentWrap');
			rootWrap = this.find('.rootWrap');


			dragCon = $(document.createElement('div'));
			dragCon
				.addClass(id)
				.addClass('dragCon' + axis);
			
			this.append(dragCon);

			if (axis == 'Y') {
				// Double check if we need scrollbars on this axis
				yPadding = this.data('opts')['yPadding'];
				if ((rootWrap.height() + yPadding) > contentWrap.height()) {
					rootWrap.css({
						height: rootWrap.height() + yPadding
					});
					return false;
				}

				// Calculate dragSize
				ratio = dragCon.height() / contentWrap.height();
				dragSize = this.data('opts')['draggerheight'];
				dragSize = dragSize == 'auto' ? +(rootWrap.height() * ratio) : dragSize;
				dragSize = dragSize < 10 ? 10 : dragSize;
				dragSize = dragSize > dragCon.height() ? dragCon.height() - 10 : dragSize;
			} else {
				// Double check if we need scrollbars on this axis
				xPadding = this.data('opts')['xPadding'];
				if ((rootWrap.width() + xPadding) > contentWrap.width()) {
					rootWrap.css({
						height: rootWrap.width() + xPadding
					});
					return false;
				} else {
					contentWrap.height(contentWrap.height() - 5);
				}

				// Calculate dragSize
				ratio = dragCon.width() / contentWrap.width();
				dragSize = this.data('opts')['draggerwidth'];
				dragSize = dragSize == 'auto' ? +(rootWrap.width() * ratio) : dragSize;
				dragSize = dragSize < 10 ? 10 : dragSize;
				dragSize = dragSize > dragCon.width() ? dragCon.width() - 10 : dragSize;
			}

			// Create the dragger
			drag = $(document.createElement('div'));
			drag
				.addClass(id)
				.addClass('drag' + axis)
				.addClass('drag');
			
			// Set our dragger size
			if (axis == 'Y') {
				drag.css({
					height: dragSize
				});
			} else {
				drag.css({
					width: dragSize
				});
			}

			// Give id to drag
			drag.data('id', id);

			// Append to dragCon
			dragCon.append(drag);

			// Auto hide option - Hide initially
			if (this.data('opts')['autohide']) {
				drag.fadeTo(0, 0);
			}
			return true;
		},
		addEvents: function(id, axis) {
			ele = this;
			drag = this.find('.drag' + axis);

			dragCon = drag.parent();

			rootWrap = this.find('.rootWrap');
			contentWrap = this.find('.contentWrap');

			drag.mousedown(function(event) {
				if (axis == 'Y') {
					$(this).data('move', event.pageY);
				} else {
					$(this).data('move', event.pageX);
				}
				$('body').addClass('scrollingActive');
				event.preventDefault();
				return false;
			});

			$('*').mouseup(function(event) {
				$('.drag' + axis).data('move', false);
				$('body').removeClass('scrollingActive');
			}).mousemove(function(event) {
				$('.drag' + axis).each(function() {
					if ($(this).data('move')) {
						ele = $('.scrollRoot.' + $(this).data('id'));
						if (axis == 'Y') {
							methods.move.call(ele, event.pageY - $(this).data('move'), axis);
							$(this).data('move', event.pageY);
						} else {
							methods.move.call(ele, event.pageX - $(this).data('move'), axis);
							$(this).data('move', event.pageX);
						}
						event.preventDefault();
					}
				});
			});

			// Mousewheel support
			if ($().mousewheel) {
				this.mousewheel(function(event, delta, deltaX, deltaY) {
					if (deltaX == 0) {
						methods.move.call($(this), -deltaY * 1.5, 'Y');
					} else {
						methods.move.call($(this), deltaX * 2, 'X');
					}
					event.preventDefault();
				});
			}

			// Mousedrag support
			if (this.data('opts')['mousedrag']) {
				this.find('.rootWrap').css({
					cursor: this.data('opts')['mousedragcursor']
				}).mousedown(function(event) {
					$(this).data('move', [event.pageX, event.pageY]);
					return false;
				});

				$('*').mousemove(function(event) {
					$('.rootWrap').each(function() {
						if ($(this).data('move')) {
							x = $(this).data('move')[0];
							y = $(this).data('move')[1];

							dX = event.pageX - x;
							dY = event.pageY - y;

							$(this).data('move', [event.pageX, event.pageY]);

							methods.move.call($(this).parent(), -dX, 'X');
							methods.move.call($(this).parent(), -dY, 'Y');
							event.preventDefault();
						}
					}).mouseup(function(event) {
						$('.rootWrap').each(function() {
							$(this).data('move', false);
						});
					});
				});

				$(window).mouseout(function(event) {
					$('.rootWrap').each(function() {
						$(this).data('move', false);
					});
				});
			}

			// clicktoscroll support

			if (this.data('opts')['clicktoscroll']) {
				dragCon.data('axis', axis).click(function(event) {
					axis = $(this).data('axis');

					srcElement = $(event.srcElement);
					drag = $(this).children().eq(0);
					ele = $('.scrollRoot.' + drag.data('id'));

					if (srcElement.hasClass('drag' + axis)) {
						return;
					}

					if (axis == 'Y') {
						offset = event.pageY;
						offset = offset - (drag.height() / 2);
						offset = offset - drag.offset().top;
					} else {
						offset = event.pageX;
						offset = offset - (drag.width() / 2);
						offset = offset - drag.offset().left;
					}

					methods.move.call(ele, offset, axis);
					event.preventDefault();

				});
			}

			// autohide support
			if (this.data('opts')['autohide']) {
				this.hover(function() {
					$(this).find('.drag').fadeTo(400, 1);
					
				}, function() {
					$(this).find('.drag').fadeTo(400, 0);
				});
			}
		},
		move: function(offset, axis) {
			drag = this.find('.drag' + axis);
			dragCon = drag.parent();

			rootWrap = this.find('.rootWrap');
			contentWrap = this.find('.contentWrap');

			if (axis == 'Y') {
				current = drag.css('top');
				current = current == 'auto' ? 0 : parseFloat(current);

				distance = current + offset;

				min = 0;

				max = dragCon.height() - drag.height();
				if (distance < min) distance = min;
				if (distance > max) distance = max;

				drag.css({
					top: distance
				});

				trackDistance = dragCon.height() - drag.height();
				notVisible = (contentWrap.height() - rootWrap.parent().height());
				distanceRatio = notVisible / trackDistance;

				distance = (distance * distanceRatio) * -1;

				contentWrap.css({
					top: distance
				});

			} else {
				current = drag.css('left');

				current = current == 'auto' ? 0 : parseFloat(current);

				distance = current + offset;

				min = 0;
				max = dragCon.width() - drag.width();

				if (distance < min) distance = min;
				if (distance > max) distance = max;

				drag.css({
					left: distance
				});

				trackDistance = dragCon.width() - drag.width();
				notVisible = (contentWrap.width() - rootWrap.parent().width());
				distanceRatio = notVisible / trackDistance;

				distance = (distance * distanceRatio) * -1;

				contentWrap.css({
					left: distance
				});

			}

		}
	};

	$.fn.scrollbars = function(opts) {
		var options = $.fn.extend($.fn.scrollbars.defaults, opts);
		return this.each(function() {
			$(this).data('opts', options);
			methods.init.call($(this));
		});
	};

	$.fn.scrollbars.defaults = {
		'yPadding': 20,
		'xPadding': 20,
		'mousewheel': true,
		'mousedrag': false,
		'mousedragcursor': 'move',
		'clicktoscroll': true,
		'draggerheight': 'auto',
		'draggerwidth': 'auto',
		'autohide': false
	};

	$.fn.scrollbars.methods = methods;
})(jQuery);