(function($) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty || window.hasOwnProperty;

	$.scrollbars = function() {
		return $('*').scrollbars();
	};

	$.fn.scrollbars = function(method) {

		var $body = $(document.body);

		var defaults = {
			xSpace: 'auto',
			ySpace: 'auto',
			forceScrollbars: false,
			keyboardControl: true,
			persistantSize: true,
			overlap: false,
			draggerSize: 'auto',
			device: {
				touch: false,
				blackberry: false,
				other: true
			},
			scrollbarAutohide: false,
			dragContent: false,
			mousewheelSupport: true,
			mouseWheelMultiplier: 1,
			xEnabled: true,
			yEnabled: true
		};

		var classes = {
			rootElement: 'scrollRoot',
			scrollElement: 'scrollElement',
			dragCon: 'dragCon',
			dragConX: 'dragConX',
			dragConY: 'dragConY',
			contentWrap: 'contentWrap',
			rootWrap: 'rootWrap',
			axisInUse: 'axisInUse',
			axisInUseX: 'axisInUseX',
			axisInUseY: 'axisInUseY',
			dragger: 'drag',
			draggerX: 'dragX',
			draggerY: 'dragY',
			contentDrag: 'contentDrag',
			unselectable: 'unselectable'
		};

		var methods = {
			init: function(options) {
				// Create a scopeless copy of this
				var obj = this;

				// Create a data object
				var data = {
					opts: $.extend(defaults, options),
					obj: obj,
					X: {},
					Y: {}
				};

				var ua = navigator.userAgent;

				if ('ontouchstart' in document.documentElement) {
					data.device = 'touch';
				} else if (ua.match(/blackberry/i)) {
					data.device = 'blackberry';
				} else {
					data.device = 'other';
				}

				if (!data.opts.device[data.device]) {
					return false;
				}

				// Does the element need scrollbars
				if (!data.opts.forceScrollbars) {
					var given = {
						overflow:  obj.css('overflow'),
						overflowX: obj.css('overflow-x'),
						overflowY: obj.css('overflow-y')
					};

					var needs = ['overflow', 'overflowX', 'overflowY'];
					var need = false;

					for (var i in needs) {
						if (hasOwn.call(needs, i)) {
							var key = needs[i];

							if (
								given[key] === 'auto' ||
								given[key] === 'scroll'
							) {
								need = true;
								break;
							}
						}
					}

					if (!need) {
						return false;
					}
				}

				// Count images objs
				var imgs = obj.find('img');
				var imgsLen = imgs.length;
				var imgsLoad = 0;

				data.imgs = {
					objs: imgs,
					len: imgsLen,
					load: imgsLoad
				};

				// Write data to our object
				methods.setData.call(obj, data);
				methods.prePrepare.call(obj);

				if (imgsLen === 0) {
					return methods.prepare.call(obj);
				} else {
					return $.each(imgs, function(i, img) {
						$(document.createElement('img'))
							.on('load error', function() {
								var data = methods.getData.call(obj);
								data.imgs.load = data.imgs.load + 1;
								methods.setData.call(obj, data);

								if (data.imgs.load === data.imgs.len) {
									return methods.prepare.call(obj);
								}
							})
							.attr('src', img.src);
					});
				}
			},
			prePrepare: function() {
				// Create a scopeless copy of this
				var obj = this;

				// Make sure we do not have position static
				if (obj.css('position') === 'static') {
					obj.css('position', 'relative');
				}

				// Add our id as a class, and the scrollRoot class
				obj
					.addClass(classes.scrollElement)
					.addClass(classes.rootElement);

			},
			prepare: function() {

				// Create a scopeless copy of this
				var obj = this;

				// Get a copy of data
				var data = methods.getData.call(obj);

				// Generate a unique identifier
				var id      =
					data.id = 'scroll-' + Math.floor (Math.random() * 100000);

				// Add our id as a class, and the scrollRoot class
				obj.addClass(id);

				var xSpace = data.opts.xSpace;
				var ySpace = data.opts.ySpace;

				var temp;

				if (xSpace === 'auto') {

					temp = $(document.createElement('div'))
						.addClass(classes.dragCon)
						.addClass(classes.scrollElement)
						.addClass(classes.dragConX)
						.appendTo('body');

					xSpace = data.opts.xSpace = parseFloat(temp.height());
					temp.remove();
				}

				if (ySpace === 'auto') {
					temp = $(document.createElement('div'))
						.addClass(classes.dragCon)
						.addClass(classes.scrollElement)
						.addClass(classes.dragConY)
						.appendTo('body');

					ySpace = data.opts.ySpace = parseFloat(temp.width());
					temp.remove();
				}

				// Wrap with our content wrap
				//

				var contentWrap = $(document.createElement('div'))
									.addClass(classes.contentWrap)
									.addClass(classes.scrollElement)
									.addClass(id);

				obj.wrapInner(contentWrap);

				contentWrap = data.contentWrap = obj.find('.' + [
					classes.contentWrap, id, classes.scrollElement
				].join('.'));

				// Wrap with our root wrap
				var rootWrap = $(document.createElement('div'))
									.addClass(classes.rootWrap)
									.addClass(classes.scrollElement)
									.addClass(id);

				obj.wrapInner(rootWrap);

				rootWrap = data.rootWrap = obj.find('.' + [
					classes.rootWrap, id, classes.scrollElement
				].join('.'));

				// Lock root wraps size
				rootWrap.css({
					width: obj.width(),
					height: obj.height()
				});

				// Make sure that rootWrap stays the same size as its parent
				if (data.opts.persistantSize) {
					$(window).resize(function() {
						methods.update.apply(obj);
					});
				}

				// Make sure we don't have tab index 0 (keyboard control)
				if (data.opts.keyboardControl) {
					var tabindex = data.tabindex = obj.attr('tabindex');
					if (typeof tabindex === 'undefined' || tabindex === 0) {
						obj.attr('tabindex', '-1');
					}
				}

				methods.setData.call(obj, data);
				var axisCount = 0;

				$.each({
					X: 'width',
					Y: 'height'
				}, function(axis, method) {
					if (rootWrap[method]() < contentWrap[method]()) {
						obj.addClass(classes['axisInUse' + axis]);
						axisCount = axisCount + 1;
					}
				});

				if (axisCount === 0) {
					methods.destroy.call(obj);
					return;
				}

				// Add our content drag class
				if (data.opts.dragContent) {
					obj.addClass(classes.dragContent);
				}

				// Generate our scrollbars
				if (data.opts.xEnabled) {
					methods.generate.call(obj, 'X');
				}

				if (data.opts.yEnabled) {
					methods.generate.call(obj, 'Y');
				}
			},
			generate: function(axis) {
				// Create scopeless copy of this
				var obj = this;

				// Get copy of data
				var data = methods.getData.call(obj);

				// Pull needed values from data
				var contentWrap = data.contentWrap;
				var rootWrap = data.rootWrap;
				var id = data.id;

				if (obj.find('.' + classes['dragCon' + axis]).length > 0) {
					return false;
				}

				if (data.X.dragCon && data.Y.dragCon) {
					if (axis === 'X') {
						data.Y.dragCon.css({
							top: -data.opts.xSpace
						});
					} else {
						data.X.dragCon.css({
							left: -data.opts.xSpace
						});
					}
				}

				// Add our drag container
				var dragCon = $(document.createElement('div'))
					.addClass(classes.scrollElement)
					.addClass(id)
					.addClass(classes.dragCon)
					.addClass(classes['dragCon' + axis])
					.appendTo(obj);

				data[axis].dragCon = dragCon;

				var destroy = false;

				if (axis === 'X') {
					// Check if this axis needs scrollbars
					destroy = (rootWrap.width() + data.opts.ySpace) >=
								contentWrap.width();
				} else {
					// Check if this axis needs scrollbars
					destroy = (rootWrap.height() + data.opts.xSpace) >=
								contentWrap.height();
				}

				if (destroy) {
					methods.destroy.call(obj, axis);
					return false;
				}

				obj.addClass(classes['axisInUse' + axis]);

				if (axis === 'X') {
					data.rootWrap.css({
						height: data.rootWrap.height() - data.opts.ySpace
					});
				} else {
					data.rootWrap.css({
						width: data.rootWrap.width() - data.opts.xSpace
					});
				}

				// Stop from overlapping
				var overlapping = !data.opts.overlap &&
									obj.hasClass(classes.axisInUseX) &&
									obj.hasClass(classes.axisInUseY);


				data.overlapping = overlapping;

				if (overlapping) {
					if (axis === 'X') {
						dragCon.css({
							left: data.opts.ySpace * -1
						});
					} else {
						dragCon.css({
							top: data.opts.xSpace * -1
						});
					}
				}

				var ratio;

				if (data.opts.draggerSize === 'auto') {
					if (axis === 'X') {
						ratio = dragCon.width() / contentWrap.width();
					} else {
						ratio = dragCon.height() / dragCon.height();
					}

					ratio = Math.round(ratio * 100);
				} else {
					ratio = parseFloat(data.opts.draggerSize);
				}

				data.opts.draggerSize = ratio;

				// Create the dragger
				var dragger = $(document.createElement('div'))
								.addClass(classes.scrollElement)
								.addClass(classes.dragger)
								.addClass(id)
								.addClass(classes['dragger' + axis])
								.attr('unselectable', 'on')
								.appendTo(dragCon);

				data[axis].dragger = dragger;

				if (axis === 'X') {
					dragger.css({
						left: data.opts.ySpace,
						width: ratio + '%'
					});
				} else {
					dragger.css({
						top: data.opts.xSpace,
						height: ratio + '%'
					});
				}

				// Initial hide of elements for autohide options
				if (data.opts.scrollbarAutohide) {
					dragger.parent().fadeTo(0, 0);
				}

				methods.setData.call(obj, data);

				return methods.addEvents.call(obj, axis);
			},
			addEvents: function(axis) {
				// Scopeless copy of this
				var obj = this;

				// Get data
				var data = methods.getData.call(obj);

				// Pull items from data
				var dragCon = data[axis].dragCon;
				var dragger = data[axis].dragger;

				if (typeof data.eventsAdded === 'undefined') {
					data.eventsAdded = {};
				}

				var events = {
					draggerMousedown: [
						dragger,
						'mousedown',
						function(e, obj, axis) {

							e.preventDefault();

							var data = methods.getData.call(obj);
							data.activeAxis = axis;
							data.activePosition = axis === 'X' ?
													e.pageX : e.pageY;

							methods.setData.call(obj, data);

							$body.addClass('normalScrollingActive');
							$body.addClass(classes.unselectable);

							e.preventDefault();
						}
					],
					draggerOnSelectStart: [
						dragger,
						'selectstart',
						function(e) {
							e.preventDefault();
						}
					],
					starMousemove: [
						$(document),
						'mousemove',
						function(e, obj) {

							var data = methods.getData.call(obj);
							var axis = data.activeAxis;
							var pos = data.activePosition;

							if (axis && pos) {
								var newPos = data.activePosition = (
									axis === 'X' ? e.pageX : e.pageY
								);

								var disPos = newPos - pos;

								methods.move.call(obj, disPos, axis);
								methods.setData.call(obj, data);
							}
						},
						'*'
					],
					starMouseup: [
						$(document),
						'mouseup',
						function(e, obj) {
							var data = $.extend({}, methods.getData.call(obj), {
								activeAxis: false,
								activePos: false
							});
							methods.setData.call(obj, data);

							$body.removeClass('normalScrollingActive');
							$body.removeClass(classes.unselectable);
						},
						'*'
					],
					dragConMousedown: [
						dragCon,
						'mousedown',
						function(e, obj, axis) {
							if (!$(e.target).hasClass(classes.dragger)) {
								var dragger = $(this).children().eq(0);

								var dPos;
								var mPos;
								var dragSize;
								var offset = dragger.offset();

								if (axis === 'X') {
									dPos = offset.left;
									mPos = e.pageX;
									dragSize = dragger.width();
								} else {
									dPos = offset.top;
									mPos = e.pageY;
									dragSize = dragger.height();
								}

								var distance = mPos > dPos ?
												dragSize : -dragSize;

								methods.move.call(obj, distance, axis);
							}
						}
					]
				};

				if (data.opts.keyboardControl) {
					events.objKeydown = [
						obj,
						'keydown',
						function(e, obj) {
							switch (e.which) {
								case 37:
									methods.moveContent.call(obj, -20, 'X');
								break;

								case 38:
									methods.moveContent.call(obj, -20, 'Y');
								break;

								case 39:
									methods.moveContent.call(obj, 20, 'X');
								break;

								case 40:
									methods.moveContent.call(obj, 20, 'Y');
								break;

								case 33:
									methods.moveContent.call(
										obj, -obj.height(), 'Y'
									);
								break;

								case 34:
									methods.moveContent.call(
										obj, obj.height(), 'Y'
									);
								break;
							}
						}
					];
				}

				if (data.opts.dragContent) {
					events.contentMousedown = [
						data.contentWrap,
						'mousedown',
						function(e, obj) {

							var data = {
								contentActiveX: e.pageX,
								contentActiveY: e.pageY
							};

							$body.addClass('contentDragActive');

							methods.setData.call(obj, data);

							obj.focus();
							e.preventDefault();
						}
					];

					events.contentMousemove = [
						$('*'),
						'mousemove',
						function(e, obj) {
							var data = methods.getData.call(obj);

							if (data.contentActiveX && data.contentActiveY) {
								var posX = data.contentActiveX,
									posY = data.contentActiveY,
									newX = data.contentActiveX = e.pageX,
									newY = data.contentActiveY = e.pageY,
									disX = newX - posX,
									disY = newY - posY;

								methods.moveContent.call(obj, -disX, 'X');
								methods.moveContent.call(obj, -disY, 'Y');
								methods.setData.call(obj, data);
							}
						}
					];

					events.contentMouseup = [
						$('*'),
						'mouseup',
						function(e, obj) {
							var data = {
								contentActiveX: false,
								contentActiveY: false
							};

							methods.setData.call(obj, data);

							$body.removeClass('contentDragActive');
						}
					];
				}

				if (data.opts.scrollbarAutohide) {
					data = methods.getData.call(obj);
					events.objMouseEnter = [
						$('.scrollElement.' + data.id),
						'mouseenter',
						function(e, obj) {
							var data = methods.getData.call(obj);
							data.X.dragCon.stop().fadeTo(500, 1);
							data.Y.dragCon.stop().fadeTo(500, 1);
						}
					];

					events.objMouseOut = [
						obj,
						'mouseout',
						function(e, obj) {
							var data = methods.getData.call(obj);
							data.X.dragCon.stop().fadeTo(500, 0);
							data.Y.dragCon.stop().fadeTo(500, 0);
						}
					];
				}

				if ($.fn.mousewheel && data.opts.mousewheelSupport) {
					events.objMousewheel = [
						obj,
						'mousewheel',
						function(e, obj, args) {
							var data = methods.getData.call(obj);
							var delta = -args[1];
							var axis = args[2] !== 0 ? 'X' : 'Y';
							var distance = delta < 0 ? -3 : delta > 0 ? 3 : 0;

							distance *= data.opts.mouseWheelMultiplier;

							methods.move.call(obj, distance, axis);

							e.preventDefault();
						}
					];
				}

				$.each(events, function(i, e) {
					var ele = e[0],
						eventName = e[1],
						cb = e[2],
						selector = e[3];

					var args = [eventName];

					if (selector) {
						args.push(selector);
					}

					args.push(function(e) {
						var classList = e.target.className.split(' '), axis;
						var args = arguments;

						$.each(classList, function(k, v) {
							var isX = v.match(/.*?X/);
							var isY = v.match(/.*?Y/);

							if (isX && isY) {
								return false;
							}

							if (isX) {
								axis = 'X';
							} else if (isY) {
								axis = 'Y';
							}
						});

						if (!axis) {
							return cb.call($(this), e, obj, args);
						}

						return cb.call($(this), e, obj, axis, args);
					});

					ele.on.apply(ele, args);
				});
			},
			moveContent: function(distance, axis) {
				var obj = this,
					data = methods.getData.call(this),
					dragCon = data[axis].dragCon,
					dragger = data[axis].dragger,
					rootWrap = data.rootWrap,
					contentWrap = data.contentWrap;


				if (!dragger) {
					return false;
				}


				var draggerSize = axis === 'X' ?
								dragger.width() : dragger.height();

				var padding = axis === 'X' ?
								dragCon.css('left') : dragCon.css('top');

				padding = padding === 'auto' ? 0 : -parseFloat(padding);

				var size = axis === 'X' ?
							dragCon.width() - padding :
							dragCon.height() - padding;

				var contentWrapSize = axis === 'X' ?
								contentWrap.width() :
								contentWrap.height();

				var rootWrapSize = axis === 'X' ?
									rootWrap.width() :
									rootWrap.height();

				var trackDistance = size - draggerSize,
					outOfRange = contentWrapSize - rootWrapSize;

				var dRatio = outOfRange / trackDistance;

				methods.move.call(obj, distance / dRatio, axis);
			},
			move: function(distance, axis, options) {
				var obj = this;
				var moveDefaults = {
					moveMethod: 'distance',
					moveType: 'pixels'
				};

				var moveOptions = $.extend(moveDefaults, options);

				var data = methods.getData.call(obj);

				var dragCon = data[axis].dragCon,
					dragger = data[axis].dragger,
					rootWrap = data.rootWrap,
					contentWrap = data.contentWrap;

				if (!dragCon || !dragger) {
					return false;
				}

				var position,
					current,
					percent,
					padding = axis === 'X' ?
								dragCon.css('left') :
								dragCon.css('top');

				padding = padding === 'auto' ? 0 : -parseFloat(padding);

				var size = axis === 'X' ?
							dragCon.width() - padding :
							dragCon.height() - padding;

				var draggerSize = axis === 'X' ?
									dragger.width() :
									dragger.height();

				var rootWrapSize = axis === 'X' ?
									rootWrap.width() :
									rootWrap.height();

				var contentWrapSize = axis === 'X' ?
										contentWrap.width() :
										contentWrap.height();


				var min = padding;
				var max = (size + padding) - draggerSize;

				if (moveOptions.moveMethod === 'position') {
					if (moveOptions.moveType === 'percent') {
						position = (distance / size) * 100;
					} else {
						position = distance;
					}
				} else {
					current = axis === 'X' ?
								dragger.css('left') :
								dragger.css('top');

					current = current === 'auto' ? min : parseFloat(current);

					if (moveOptions.moveType === 'percent') {
						percent = (distance / size) * 100;
						position = current + percent;
					} else {
						position = current + distance;
					}
				}

				position = Math.max(min, Math.min(max, position));

				if (axis === 'X') {
					dragger.css('left', position);
				} else {
					dragger.css('top', position);
				}

				var trackDistance = size - draggerSize,
					outOfRange = contentWrapSize - rootWrapSize;

				var dRatio = outOfRange / trackDistance;

				if (position === max) {
					position = position - 1;
				}

				var scrollDistance = (position - padding) * dRatio;

				if (axis === 'X') {
					contentWrap.css({left: -scrollDistance});
				} else {
					contentWrap.css({top: -scrollDistance});
				}
			},
			getScrollPos: function(axis, add) {
				var obj = this;

				var data = methods.getData.call(obj);

				var dragger = data[axis].dragger;
				var dragCon = data[axis].dragCon;

				var scrollPos = axis === 'X' ?
									dragger.css('left') : dragger.css('top');

				scrollPos = scrollPos === 'auto' ? 0 : parseFloat(scrollPos);

				var dragConSize = axis === 'X' ?
									dragCon.width() : dragCon.height();
				var dragSize = axis === 'X' ?
									dragger.width() : dragger.height();

				if (add) {
					scrollPos = scrollPos + dragSize;
				}

				var percentage = (scrollPos/dragConSize) * 100;

				return percentage;
			},
			destroy: function(axis, deleteAll) {

				if (typeof deleteAll === 'undefined') {
					deleteAll = true;
				}

				var obj = this;
				var data = methods.getData.call(obj);

				if (!data) {
					return false;
				}

				if (axis) {
					obj
						.removeClass(classes['axisInUse' + axis])
						.find('.' + classes['dragCon' + axis])
						.filter('.' + data.id)
						.remove();

					if (axis === 'X') {
						data.rootWrap.css({
							height: '100%'
						});

						if (data.Y.dragCon) {
							data.Y.dragCon.css({
								top: 0
							});
						}
					} else {
						data.rootWrap.css({
							width: '100%'
						});

						if (data.X.dragCon) {
							data.X.dragCon.css({
								left: 0
							});
						}
					}
				}

				if (deleteAll && (!axis || (
					!obj.hasClass(classes.axisInUseX) &&
					!obj.hasClass(classes.axisInUseY)
				))) {
					obj.html(data.contentWrap.html());

					for (var index in classes) {
						if (hasOwn.call(classes, index)) {
							obj.removeClass(classes[index]);
						}
					}

					if (data.tabindex) {
						obj.attr('tabindex', data.tabindex);
					} else {
						obj.removeAttr('tabindex');
					}

					obj.removeClass(data.id);
					methods.removeData.call(this);
				}
			},
			setData: function(data) {
				return this.data('jQSData', data);
			},
			getData: function() {
				return this.data('jQSData');
			},
			removeData: function() {
				return this.removeData('jQSData');
			},
			update: function() {
				var obj = this;
				var data = methods.getData.call(obj);

				data.rootWrap.css({
					width: obj.width() - data.opts.ySpace,
					height: obj.height() - data.opts.xSpace
				});

				$.each({
					X: 'width',
					Y: 'height'
				}, function(axis, method) {

					if (
						data.rootWrap[method]() <
						data.contentWrap[method]()
					) {
						methods.generate.call(obj, axis);
					} else {
						methods.destroy.call(obj, axis, false);
					}

					try {
						methods.move.call(
							obj,
							methods.getScrollPos.call(obj, axis),
							axis
						);
					} catch (e) {}

				});
			}
		};

		var args = $.makeArray(arguments);
		if (methods[method]) {
			var returns = [];
			var jQReturn = this.each(function() {
				var returnValue = methods[method].apply($(this), args.slice(1));
				if (!!returnValue) {
					returns.push(returnValue);
				}
			});

			if (returns.length < 1) {
				return jQReturn;
			} else if (returns.length > 1) {
				return returns;
			} else {
				return returns[0];
			}
		} else if (typeof(method) === 'object' || !method) {
			return this.each(function() {
				methods.init.apply($(this), args);
			});
		} else {
			$.error('No such method ' + method + ' on jQuery.scrollbars');
		}
	};
})(jQuery);