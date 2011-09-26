/*! jQuery Scrollbars | License: https://github.com/nathggns/Scrollbars/blob/master/LICENSE */
(function($) {
	function Scroller() {
		var data = {}
		var defaults =  {
			'yPadding': 'auto',
			'xPadding': 'auto',
			'mousewheel': true,
			'mousedrag': false,
			'mousedragcursor': 'move',
			'clicktoscroll': true,
			'draggerheight': 'auto',
			'draggerwidth': 'auto',
			'autohide': false,
			'naturalscrolling': false,
			'touch': true
		}

		this.init = function(options) {
			var methods = {
				init: function(options) {
					var opts = $.extend(defaults, options);
					data[this] = {
						opts: opts,
						ele: this
					}

					// Create a reference to this
					var ele = this;

					// Do we /need/ our plugin?
					var overflow = this.css('overflow'),
						overflowX = this.css('overflow-x'),
						overflowY = this.css('overflow-y'),
						need = overflow == 'auto' || overflow == 'scroll';
					
					need = need || overflowX == 'auto' || overflowX == 'scroll';
					need = need || overflowY == 'auto' || overflowY == 'scroll';

					if (!need) return;

					// Wait until all images have loaded.
					var imgs = this.find('img'),
						imgsLen = imgs.length,
						imgsLoad = 0;
					
					if (imgsLen == 0) {
						methods.prepare.call(this);
					} else {
						data[this]['imgs'] = {
							eles: imgs,
							length: imgsLen,
							load: imgsLoad
						}
						$.each(imgs, function(i, img) {
							image = new Image;
							data[image] = ele;

							$(image).bind('load error', function() {
								data[data[this]].imgs.load++;

								if (data[data[this]].imgs.load == data[data[this]].imgs.length) {
									methods.prepare.call(data[data[this]].ele);
								}
							});

							image.src = img.src;
						});
					}
				},
				prepare: function() {
					// Create a reference to this
					var ele = this;

					// Make sure we do not have position static
					if (this.css('position') == 'static') {
						this.css('position', 'relative');
					}

					// Create an id for all our elements
					id = 'scroll-' + Math.floor(Math.random() * 100000);
					
					// Add our id and scrollRoot class
					this.addClass(id).addClass('scrollRoot');

					// Add our id to global data
					data[this].id = id;

					// Retrieve xPadding and yPadding from options
					var xPadding = data[this].opts.xPadding,
						yPadding = data[this].opts.yPadding;
					
					if (xPadding == 'auto') {
						temp = $(document.createElement('div'));
						temp.addClass('dragConX');
						$('body').append(temp);

						xPadding = data[this].opts.xPadding = parseFloat(temp.outerHeight());
						temp.remove();
					}

					if (yPadding == 'auto') {
						temp = $(document.createElement('div'));
						temp.addClass('dragConY');
						$('body').append(temp);

						yPadding = data[this].opts.yPadding = parseFloat(temp.outerWidth());

						temp.remove();
					}
										
					// Wrap with contentWrap
					var contentWrap = $(document.createElement('div'));
					contentWrap.addClass(id).addClass('contentWrap');
					this.wrapInner(contentWrap);
					var contentWrap = this.find('.contentWrap');
					data[this].contentWrap = contentWrap;

					// Wrap with rootWrap
					var rootWrap = $(document.createElement('div'));
					rootWrap.addClass(id).addClass('rootWrap');
					this.wrapInner(rootWrap);
					var rootWrap = this.find('.rootWrap');
					data[this].rootWrap = rootWrap;

					// Lock our rootWraps size
					rootWrap.css({
						width: this.width() - yPadding,
						height: this.height() - xPadding
					});

					// Check if we actually need these scrollbars
					if (rootWrap.height() > contentWrap.height() && rootWrap.width() > contentWrap.width()) {
						this.html(contentWrap.html());
						this.removeClass(id).removeClass('scrollRoot');
					}

					// Generate X and Y scrollbars
					if (methods.generate.call(this, 'X')) {
						methods.addEvents.call(this, 'X', data[this].id);
					}

					if (methods.generate.call(this, 'Y')) {
						methods.addEvents.call(this, 'Y', data[this].id);
					}
				},
				generate: function(axis) {
					// Retrieve needed values
					var contentWrap = data[this].contentWrap,
						rootWrap = data[this].rootWrap,
						id = data[this].id;

					// Add our drag container
					var dragCon = $(document.createElement('div'));
					dragCon.addClass(id).addClass('dragCon' + axis);
					this.append(dragCon);
					data[this][axis] = {
						dragCon: dragCon
					}

					if (axis == 'X') {

						// Double check that we need scrollbars on this axis
						var xPadding = data[this].opts.xPadding;
						if ((rootWrap.width() + xPadding) >= contentWrap.width()) {
							rootWrap.css({
								height: rootWrap.height() + xPadding
							});
							return false;
						}

						// Calculate dragSize
						var ratio = dragCon.width() / contentWrap.width();
						var dragSize = data[this].opts.draggerwidth;
						dragSize = dragSize == 'auto' ? +(dragCon.width() * ratio) : dragSize;
						dragSize = dragSize < 10 ? 10 : dragSize;
						dragSize = dragSize > (dragCon.width() - 10) ? dragCon.width() - 10 : dragSize;
					} else {

						// Double check that we need scrollbars on this axis
						var yPadding = data[this].opts.yPadding;
						if ((rootWrap.height() + yPadding) > contentWrap.height()) {
							rootWrap.css({
								width: rootWrap.width() + yPadding
							});
							return false;
						}

						// Calculate dragSize
						var ratio = dragCon.height() / contentWrap.height();
						var dragSize = data[this].opts.draggerheight;
						dragSize = dragSize == 'auto' ? +(dragCon.height() * ratio) : dragSize;
						dragSize = dragSize < 10 ? 10 : dragSize;
						dragSize = dragSize > (dragCon.height() - 10) ? dragCon.height() - 10 : dragSize;
					}

					// Create the dragger
					var drag = $(document.createElement('div'));
					drag.addClass(id).addClass('drag' + axis).addClass('drag');
					data[this][axis].drag = drag;

					// Set the dragger size
					if (axis == 'X') {
						drag.css({
							width: dragSize
						});
					} else {
						drag.css({
							height: dragSize
						});
					}

					// Append to dragCon
					dragCon.append(drag);

					// Autohide
					if (data[this].opts.autohide) {
						drag.fadeTo(0, 0);
					}

					return true;
				},
				addEvents: function(axis, id) {
					// Create reference to this
					ele = this;

					// Create reference to drag
					drag = data[this][axis].drag;

					// Create reference to dragCon
					dragCon = data[this][axis].dragCon;

					drag.mousedown(function(event) {
						if (axis == 'X') {
							$(this).data('move', event.pageX);
						} else {
							$(this).data('move', event.pageY);
						}
						$(this).addClass('active');
						$('body').addClass('scrollingActive');
						event.preventDefault();
						return false;
					});

					$('*').mousemove(function(event) {
						$('.scrollRoot').each(function() {
							var drag = $(this).find('.drag' + axis);
							if (drag.data('move')) {
								if (axis == 'X') {
									var distance = event.pageX - drag.data('move');
									methods.move.call($(this), distance, axis)
									drag.data('move', event.pageX);
								} else {
									var distance = event.pageY - drag.data('move');
									methods.move.call($(this), distance, axis)
									drag.data('move', event.pageY);
								}
							}
						});
					}).mouseup(function(event) {
						$('.dragX, .dragY').data('move', false);
					})

					// Mousewheel support
					if ($().mousewheel && data[this].opts.mousewheel) {
						this.mousewheel(function(event, delta, deltaX, deltaY) {
							if (deltaY == 0) {
								if (data[$(this)].opts.naturalscrolling) {
									methods.move.call($(this), deltaX*-3, 'X');
								} else {
									methods.move.call($(this), deltaX*3, 'X');
								}
							} else {
								if (data[$(this)].opts.naturalscrolling) {
									methods.move.call($(this), deltaY, 'Y');
								} else {
									methods.move.call($(this), -deltaY, 'Y');
								}
							}
							return false;
						});
					}

					// clicktoscroll support
					if (data[this].opts.clicktoscroll) {
						dragCon.mouseup(function(event) {
							if ($(event.srcElement).hasClass('drag')) return;
							if (!$(this).data('mousedown')) return;
							$(this).data('mousedown', false);
							var drag = $(this).find('.drag');

							if (axis == 'X') {
								var current = event.pageX;
								current = current - drag.offset().left;
								current = current - (drag.width() / 2);
								methods.move.call($('.scrollRoot.' + id), current, axis);
							} else {
								var current = event.pageY;
								current = current - drag.offset().top;
								current = current - (drag.height() / 2);
								console.log(current);
								methods.move.call($('.scrollRoot.' + id), current, axis);
							}
							event.preventDefault();
							return false;
						}).mousedown(function(event) {
							if ($(event.srcElement).hasClass('drag')) return;
							$(this).data('mousedown', true);
							event.preventDefault();
							return false;
						});
					}

					// Autohide
					if (data[this].opts.autohide) {
						this.hover(function(event) {
							$(this).find('.drag').fadeTo(400, 1);
						}, function(event) {
							$(this).find('.drag').fadeTo(400, 0);
						})
					}

					// mousedrag
					if (data[this].opts.mousedrag) {
						this.mousedown(function(event) {
							$('html, body').css({cursor: data[$(this)].opts.mousedragcursor});
							$(this).data('move', [event.pageX, event.pageY]);
							event.preventDefault();
							return false;
						});

						$('*').mousemove(function(event) {
							$('.scrollRoot').each(function() {
								if ($(this).data('move')) {
									x = $(this).data('move')[0];
									y = $(this).data('move')[1];

									dX = event.pageX - x;
									dY = event.pageY - y;

									methods.move.call($(this), -dX, 'X');
									methods.move.call($(this), -dY, 'Y');

									$(this).data('move', [event.pageX, event.pageY]);	
								}
							});
						}).mouseup(function(event) {
							$('html, body').css({cursor: 'auto'});
							$('.scrollRoot').each(function() {
								$(this).data('move', false);
							});
						});

						this.css({cursor:data[this].opts.mousedragcursor});
					}

					// Touch support
					if (data[this].opts.touch) {
						var pure = this.get(0);
						pure.ontouchstart = function(event) {
							if (event.targetTouches.length == 1) {
								$(this).data('start', [event.targetTouches[0].pageX, event.targetTouches[0].pageY]);
							} else {
								$(this).data('start', false);
							}
						}
						pure.ontouchend = function(event) {
							this.ontouchstart(event);
						}
						pure.ontouchmove = function(event) {
							if ($(this).data('start')) {
								startX = $(this).data('start')[0];
								startY = $(this).data('start')[1];
								newX = event.targetTouches[0].pageX;
								newY = event.targetTouches[0].pageY;

								difX = newX - startX;
								difY = newY - startY;

								$(this).data('start', [newX, newY]);

								X = methods.move.call($('.scrollRoot.' + id), -difX, 'X');
								Y = methods.move.call($('.scrollRoot.' + id), -difY, 'Y');

								if (!X && !Y) {
									event.preventDefault();
								}
							}
						}
					}
				},
				move: function(offset, axis) {
					var drag = this.find('.drag' + axis);
					var dragCon = this.find('.dragCon' + axis);
					var contentWrap = this.find('.contentWrap');
					var rootWrap = this.find('.rootWrap');
					var returnV = false;

					if (axis == 'X') {
						var current = drag.css('left');
					} else {
						var current = drag.css('top')
					}

					current = (current == 'auto') ? 0 : parseFloat(current);
					var distance = current + offset;

					var min = 0;

					if (axis == 'X') {
						var max = dragCon.width() - drag.width();

						if (distance < min) {
							distance = min;
							returnV = true;
						}
						if (distance > max) {
							distance = max;
							returnV = true;
						}

						drag.css({
							left: distance
						});

						var trackDistance = dragCon.width() - drag.width(),
							notVisible = contentWrap.width() - rootWrap.width(),
							distanceRatio = notVisible / trackDistance,
							distance = (distance * distanceRatio) * -1;

						contentWrap.css({ left: distance });

					} else {
						var max = dragCon.height() - drag.height();

						if (distance < min) distance = min;
						if (distance > max) distance = max;

						drag.css({
							top: distance
						});

						if (distance == max) {
							distance = distance - 1;
						}

						var	trackDistance = dragCon.height() - drag.height(),
							notVisible = contentWrap.height() - rootWrap.height(),
							distanceRatio = notVisible / trackDistance,
							distance = (distance * distanceRatio) * -1;
						
						contentWrap.css({ top: distance });
					}

					return returnV;
				}
			}

			methods.init.call($(this), options);
		}
	}

	$.fn.scrollbars = function(options) {
		return this.each(function() {
			scroller = new Scroller();
			scroller.init.call(this, options)

		});
	}
})(jQuery);;