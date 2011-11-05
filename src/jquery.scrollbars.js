/*! jQuery Scrollbars | License: https://github.com/nathggns/Scrollbars/blob/master/LICENSE */
(function($) {
	$.scrollbars = function(method) {
		$('*').scrollbars(method);
	};
	$.fn.scrollbars = function(method) {
		var data = {};
		var defaults = {
			'ypadding': 'auto',
			'xpadding': 'auto',
			'mousewheel': true,
			'mousedrag': false,
			'mousedragcursor': 'move',
			'clicktoscroll': true,
			'draggerheight': 'auto',
			'draggerwidth': 'auto',
			'autohide': false,
			'touch': true,
			'blackberry': true,
			'force': false,
			'keyboard': true,
			'keyboardDistance': 10,
			'persistant': true,
			'preciseclicktoscroll': true
		};

		var seperators = {
			"classList-tagName": "++__++",
			"pId-key": "__++__"
		}
		
		var methods = {
			init: function(options) {
				var opts = $.extend(defaults, options);
				data[this] = {
					opts: opts,
					ele: this
				};

				var noSessionStorage = false;

				try {
					noSessionStorage = !sessionStorage;
				} catch (e) {
					noSessionStorage = true;
				}

				if (noSessionStorage) data[this].opts.persistant = false;

				// Create a reference to this
				var ele = this;

				// Do we /need/ our plugin?
				var overflow = this.css('overflow'),
					overflowX = this.css('overflow-x'),
					overflowY = this.css('overflow-y'),
					need = overflow == 'auto' || overflow == 'scroll';
				
				need = need || overflowX == 'auto' || overflowX == 'scroll';
				need = need || overflowY == 'auto' || overflowY == 'scroll';

				if (!need && !opts.force) { return false; }

				// Wait until all images have loaded.
				var imgs = this.find('img'),
					imgsLen = imgs.length,
					imgsLoad = 0;
				
				if (imgsLen === 0) {
					methods.prepare.call(this);
				} else {
					var id = 'imagewait-' + Math.floor(Math.random() * 10000);
					data[id] = {
						imgs: imgs,
						len: imgsLen,
						load: imgsLoad
					};
					$.each(imgs, function(i, img) {
						var image = new Image;
						$(image).bind('load error', function(event) {
							data[id].load++;
							if (event.type == 'error') { return false; }

							if (data[id].load == data[id].len) {
								methods.prepare.call(ele);
							}
							return true;
						});

						image.src = img.src;
					});
				}
				return true;
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
				var xPadding = data[this].opts.xpadding,
					yPadding = data[this].opts.ypadding;
				
				if (xPadding == 'auto') {
					temp = $(document.createElement('div'));
					temp.addClass('dragConX');
					$('body').append(temp);

					xPadding = data[this].opts.xpadding = parseFloat(temp.height());
					temp.remove();
				}

				if (yPadding == 'auto') {
					temp = $(document.createElement('div'));
					temp.addClass('dragConY');
					$('body').append(temp);

					yPadding = data[this].opts.ypadding = parseFloat(temp.width());

					temp.remove();
				}
									
				// Wrap with contentWrap
				var contentWrap = $(document.createElement('div'));
				contentWrap.addClass(id).addClass('contentWrap');
				this.wrapInner(contentWrap);
				contentWrap = this.find('.contentWrap');
				data[this].contentWrap = contentWrap;

				// Wrap with rootWrap
				var rootWrap = $(document.createElement('div'));
				rootWrap.addClass(id).addClass('rootWrap');
				this.wrapInner(rootWrap);
				rootWrap = this.find('.rootWrap');
				data[this].rootWrap = rootWrap;

				// Lock our rootWraps size
				rootWrap.css({
					width: this.width() - yPadding,
					height: this.height() - xPadding
				});

				// Give our element tab index for keyboard support
				if (data[this].opts.keyboard && !this.attr('tabindex')) {
					this.attr('tabindex', '-1');
				}

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

				if (this.find('.dragX').length > 0) {
					this.addClass('dragXUsed');
				}

				if (this.find('.dragY').length > 0) {
					this.addClass('dragYUsed');
				}
			},
			getId: function(ele) {
				var ele = ele ? ele : this;
				var pId;

				if (!pId && (pId = ele.attr('id'))) pId = "id-" + pId;
				if (!pId && (pId = ele.attr('name'))) pId = "name-" + ele.get(0).tagName + "-" + pId; 
				if (!pId) {
					pId = "hybrid-";

					var className = $.trim(ele.get(0).className.replace(id,"").replace(/scroll\-[0-9]+/, "").replace("scrollRoot", "").replace("dragXUsed", "").replace("dragYUsed", ""));
					pId = pId + className + seperators['classList-tagName'] + ele.get(0).tagName.toLowerCase();
				}

				return pId
			},
			getElementFromId: function(id) {
				var id = id ? id : this;

				var parts = id.split("-");

				switch (parts[0]) {
					case 'id':
						return $("#" + parts.slice(1).join('-'));
					case 'name':
						return $(parts[1] + "[name=" + parts.slice(2).join('-') + "]");
					case 'hybrid':
						var sParts = parts.slice(1).join('-').split(seperators['classList-tagName']);
						var classList = sParts[0];
						var tagName = sParts[1];

						var className = "." + classList.split(" ").join(".");

						return $(tagName + className);
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
				};

				var ratio, dragSize;

				if (axis == 'X') {

					// Double check that we need scrollbars on this axis
					var xPadding = data[this].opts.xpadding;
					if ((rootWrap.width() + xPadding) >= contentWrap.width()) {
						rootWrap.css({
							height: rootWrap.height() + xPadding
						});
						dragCon.remove();
						return false;
					}

					// Calculate dragSize
					ratio = dragCon.width() / contentWrap.width();
					dragSize = data[this].opts.draggerwidth;
					dragSize = dragSize == 'auto' ? +(dragCon.width() * ratio) : dragSize;
					dragSize = dragSize < 10 ? 10 : dragSize;
					dragSize = dragSize > (dragCon.width() - 10) ? dragCon.width() - 10 : dragSize;
				} else {

					// Double check that we need scrollbars on this axis
					var yPadding = data[this].opts.ypadding;
					if ((rootWrap.height() + yPadding) > contentWrap.height()) {
						rootWrap.css({
							width: rootWrap.width() + yPadding
						});
						dragCon.remove();
						return false;
					}

					// Calculate dragSize
					ratio = dragCon.height() / contentWrap.height();
					dragSize = data[this].opts.draggerheight;
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

				var distance = parseFloat(methods.getIdData.call(this, axis + "-distance"));
				if (distance) {
					methods.move.call(this, distance, axis);
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

				var eventMethods = {
					dragMouseDown: function(event) {
						if (axis == 'X') {
							$(this).data('move', event.pageX);
						} else {
							$(this).data('move', event.pageY);
						}
						$(this).addClass('active');
						$('body').addClass('scrollingActive');
						event.preventDefault();
						return false;
					},
					scrollStarMouseMove: function(event) {
						$('.scrollRoot').each(function() {
							var drag = $(this).find('.drag' + axis);
							if (drag.data('move')) {
								var distance;
								if (axis == 'X') {
									distance = event.pageX - drag.data('move');
									methods.move.call($(this), distance, axis);
									drag.data('move', event.pageX);
								} else {
									distance = event.pageY - drag.data('move');
									methods.move.call($(this), distance, axis);
									drag.data('move', event.pageY);
								}
							}
						});
					},
					scrollStarMouseUp: function(event) {
						$('.dragX, .dragY').data('move', false);
					},
					mousewheel: function(event, delta, deltaX, deltaY) {
						if (axis == 'X') {
							methods.move.call($(this), deltaX*10, axis);
						} else {
							methods.move.call($(this), -deltaY*10, axis);
						}
						return false;
					},
					clickScrollUp: function(event) {
						var dragCon = $('.dragCon' + axis + '.' + id);
						if ($(event.srcElement).hasClass('drag')) {
							return false;
						}
						if (!dragCon.data('mousedown')) {
							return false;
						}
						dragCon.data('mousedown', false);
						var drag = $(this).find('.drag');
						var current;

						if (axis == 'X') {
							current = event.pageX;
							current = current - drag.offset().left;
							current = current - (drag.width() / 2);
							methods.move.call($('.scrollRoot.' + id), current, axis);
						} else {
							current = event.pageY;
							current = current - drag.offset().top;
							current = current - (drag.height() / 2);
							methods.move.call($('.scrollRoot.' + id), current, axis);
						}
						event.preventDefault();
						return false;
					},
					clickScrollDown: function(event) {
						if ($(event.srcElement).hasClass('drag')) {
							return false;
						}
						if (!$(this).data('stayOff')) {
							$(this).data('mousedown', true);
						} else {
							$(this).data('mousedown', false);
						}
						event.preventDefault();
						return false;
					},
					hideEnter: function(event) {
						$(this).find('.drag').fadeTo(400, 1);
					},
					hideOut: function(event) {
						var drag = $(this).find('.drag');
						if (!drag.data('move')) {
							drag.fadeTo(400, 0);
						}
					},
					mouseDragDown: function(event) {
						$('html, body').css({cursor: data[$(this)].opts.mousedragcursor});
						$(this).data('move', [event.pageX, event.pageY]);
						event.preventDefault();
						return false;
					},
					mouseDragStarMove: function(event) {
						$('.scrollRoot').each(function() {
							if ($(this).data('move')) {
								x = $(this).data('move')[0];
								y = $(this).data('move')[1];

								dX = event.pageX - x;
								dY = event.pageY - y;

								methods.moveContent.call($(this), -dX, 'X');
								methods.moveContent.call($(this), -dY, 'Y');

								$(this).data('move', [event.pageX, event.pageY]);	
							}
						});
					},
					mouseDragStarUp: function(event) {
						$('html, body').css({cursor: 'auto'});
						$('.scrollRoot').each(function() {
							$(this).data('move', false);
						});
					},
					onTouchStart: function(event) {
						ele = $('.scrollRoot.' + id);
						if (event.targetTouches.length == 1) {
							ele.data('start', [event.targetTouches[0].pageX, event.targetTouches[0].pageY]);
						} else {
							ele.data('start', false);
						}
					},
					onTouchEnd: function(event) {
						ele = $('.scrollRoot.' + id);
						if (event.targetTouches.length == 1) {
							ele.data('start', [event.targetTouches[0].pageX, event.targetTouches[0].pageY]);
						} else {
							ele.data('start', false);
						}
					},
					onTouchMove:  function(event, op) {
						ele = $('.scrollRoot.' + id);
						if (ele.data('start')) {
							startX = ele.data('start')[0];
							startY = ele.data('start')[1];
							newX = event.targetTouches[0].pageX;
							newY = event.targetTouches[0].pageY;

							difX = newX - startX;
							difY = newY - startY;

							ele.data('start', [newX, newY]);

							if (op) {
								X = methods.moveContent.call($('.scrollRoot.' + id), difX, 'X');
								Y = methods.moveContent.call($('.scrollRoot.' + id), difY, 'Y');
							} else {
								X = methods.moveContent.call($('.scrollRoot.' + id), -difX, 'X');
								Y = methods.moveContent.call($('.scrollRoot.' + id), -difY, 'Y');
							}

							if (!X && !Y) {
								event.preventDefault();
							}
						}
					},
					bbMouseDown: function(event) {
						if ($(this).data('move')) {
							$(this).data('move', false);
						} else {
							if (axis == 'X') {
								$(this).data('move', event.pageX);
							} else {
								$(this).data('move', event.pageY);
							}
						}
					},
					ignore: function() {
						// Ignore
					}
				};

				// Blackberry support
				if (data[this].opts.blackberry && navigator.userAgent.toLowerCase().search('blackberry') != -1) {
					eventMethods['scrollStarMouseUp'] = eventMethods['ignore'];
					eventMethods['dragMouseDown'] = eventMethods['bbMouseDown'];
				}

				// Keyboard support
				if (data[this].opts.keyboard) {
					var KD = data[this].opts.keyboardDistance;
					this.keydown(function(event) {
						var used;
						if (axis == 'X') {
							switch (event.which) {
								case 37:
									methods.move.call($(this), -KD, 'X');
									used = true;
									break;
								case 39:
									methods.move.call($(this), KD, 'X');
									used = true;
									break;
							}
						} else {
							switch (event.which) {
								case 38:
									methods.move.call($(this), -KD, 'Y');
									used = true;
									break;
								case 40:
									methods.move.call($(this), KD, 'Y');
									used = true;
									break;
								case 33:
									methods.moveContent.call($(this), -$(this).height(), 'Y');
									used = true;
									break;
								case 34:
									methods.moveContent.call($(this), $(this).height(), 'Y');
									used = true;
									break;
							}
						}

						if (used) {
							event.preventDefault();
						}
					});
				}

				// Touch support
				var uAgent = navigator.userAgent.toLowerCase(),
					isTouch = uAgent.search('iphone') > -1 || uAgent.search('ipod') > -1 || uAgent.search('ipad') > -1 || uAgent.search('android') > -1;
				if (data[this].opts.touch && isTouch) {
					var pure = this.find('.contentWrap').get(0);
					var pdrag = drag.get(0);
					pure.ontouchstart = eventMethods['onTouchStart'];
					pure.ontouchend = eventMethods['onTouchEnd'];
					pure.ontouchmove = eventMethods['onTouchMove'];

					pdrag.ontouchstart = function(event) {
						pure.ontouchstart(event, true);
					};
					pdrag.ontouchend = function(event) {
						pure.ontouchend(event, true);
					};
					pdrag.ontouchmove = function(event) {
						pure.ontouchmove(event, true);
					};
				}

				drag.mousedown(eventMethods['dragMouseDown']);

				$('*').mousemove(eventMethods['scrollStarMouseMove']).mouseup(eventMethods['scrollStarMouseUp']);

				// Mousewheel support
				if ($().mousewheel && data[this].opts.mousewheel) {
					this.mousewheel(eventMethods['mousewheel']);
				}

				// clicktoscroll support
				if (data[this].opts.clicktoscroll) {
					dragCon.mouseup(eventMethods['clickScrollUp']).mousedown(eventMethods['clickScrollDown']);
					
					drag.get(0).ontouchend = function(event) {
						dragCon.data('stayOff', true);
						dragCon.data('mousedown', false);
					};
				}

				// Autohide
				if (data[this].opts.autohide) {
					this.hover(eventMethods['hideEnter'], eventMethods['hideOut']);
				}

				// mousedrag
				if (data[this].opts.mousedrag) {
					this.mousedown(eventMethods['mouseDragDown']);

					$('*').mousemove(eventMethods['mouseDragStarMove']).mouseup(eventMethods['mouseDragStarUp']);

					this.css({cursor:data[this].opts.mousedragcursor});
				}
			},
			move: function(offset, axis) {
				var drag = this.find('.drag' + axis);
				var dragCon = this.find('.dragCon' + axis);
				var contentWrap = this.find('.contentWrap');
				var rootWrap = this.find('.rootWrap');
				var returnV = false;
				var current;

				if (axis == 'X') {
					current = drag.css('left');
				} else {
					current = drag.css('top');
				}

				current = (current == 'auto') ? 0 : parseFloat(current);
				var distance = current + offset;

				var min = 0;
				var max, trackDistance, distanceRatio, notVisible;

				if (axis == 'X') {
					max = dragCon.width() - drag.width();

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

					methods.setIdData.call(this, axis + "-distance", distance);

					trackDistance = dragCon.width() - drag.width();
					notVisible = contentWrap.width() - rootWrap.width();
					distanceRatio = notVisible / trackDistance;
					distance = (distance * distanceRatio) * -1;

					contentWrap.css({ left: distance });

				} else {
					max = dragCon.height() - drag.height();

					if (distance < min) { distance = min; }
					if (distance > max) { distance = max; }

					drag.css({
						top: distance
					});

					methods.setIdData.call(this, axis + "-distance", distance);

					trackDistance = dragCon.height() - drag.height();
					notVisible = contentWrap.height() - rootWrap.height();
					distanceRatio = notVisible / trackDistance;
					distance = (distance * distanceRatio) * -1;
					
					contentWrap.css({ top: distance });
				}

				return returnV;
			},
			moveContent: function(offset, axis) {
				var drag = this.find('.drag' + axis);
				var dragCon = this.find('.dragCon' + axis);
				var contentWrap = this.find('.contentWrap');
				var rootWrap = this.find('.rootWrap');
				var returnV = false;
				var current = 0;
				var trackDistance = 0;
				var outOfRange = 0;
				var ratio = 0;

				if (axis === 'X') {
					current = contentWrap.css('left');
				} else {
					current = contentWrap.css('top');
				}

				current = current === 'auto' ? 0 : -parseFloat(current);

				var distance = current + offset;
				var min = 0;
				var max = 0;

				if (axis === 'X') {
					min = 0;
					max = contentWrap.width() - rootWrap.width();

					distance = distance < min ? min : distance;
					distance = distance > max ? max : distance;
					distance = -distance;

					contentWrap.css({
						left: distance
					});

					trackDistance = dragCon.width() - drag.width();
					outOfRange = contentWrap.width() - rootWrap.width();
					ratio = trackDistance / outOfRange;

					current = drag.css('left');

					current = current === 'auto' ? 0 : parseFloat(current);

					distance = current + (ratio * offset);

					min = 0;
					max = trackDistance;

					distance = distance < min ? min : distance;
					distance = distance > max ? max : distance;

					drag.css({
						left: distance
					});

					methods.setIdData.call(this, axis + "-distance", distance);

				} else {
					min = 0;
					max = contentWrap.height() - rootWrap.height();

					distance = distance < min ? min : distance;
					distance = distance > max ? max : distance;
					distance = -distance;

					contentWrap.css({
						top: distance
					});

					trackDistance = dragCon.height() - drag.height();
					outOfRange = contentWrap.height() - rootWrap.height();
					ratio = trackDistance / outOfRange;

					current = drag.css('top');

					current = current === 'auto' ? 0 : parseFloat(current);

					distance = current + (ratio * offset);

					min = 0;
					max = trackDistance;

					distance = distance < min ? min : distance;
					distance = distance > max ? max : distance;

					drag.css({
						top: distance
					});

					methods.setIdData.call(this, axis + "-distance", distance);
				}

				return returnV;
			},
			destroy: function() {
				this.html(this.find('.contentWrap').html());
				this.removeClass('scrollRoot').removeClass('dragXUsed').removeClass('dragYUsed');
			},
			setIdData: function(key, data) {
				sessionStorage[methods.getId.call(this) + seperators["pId-key"] + key] = data;
			},
			getIdData: function(key) {
				var id = methods.getId.call(this);
				var ele = methods.getElementFromId(id);
				if (ele.length > 1) return false;
				return sessionStorage[id + seperators["pId-key"] + key];
			}
		};
		var arg = arguments;
		if (methods[method]) {
			return this.each(function() {
				methods[method].apply($(this), $.makeArray(arg).slice(1));
			});
		} else if (typeof method === 'object' || !method) {
			return this.each(function() {
				methods['init'].apply($(this), arg);
			});
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.scrollbars');
		}
		return true;
	}
})(jQuery);
