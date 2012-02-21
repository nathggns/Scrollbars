/*! jQuery Scrollbars | License: https://github.com/nathggns/Scrollbars/blob/master/LICENSE */
(function($) {
	$.scrollbars = function() {
		return $("*").scrollbars();	
	};

	$.fn.scrollbars = function(method) {
		var defaults = {
			"xSpace": "auto",
			"ySpace": "auto",
			"forceScrollbars": false,
			"keyboardControl": true,
			"persistantSize": true,
			"overlap": false,
			"draggerSize": "auto",
			"device-touch": false,
			"device-blackberry": false,
			"device-other": true,
			"scrollbarAutohide": false,
			"dragContent": false,
			"mousewheelSupport": true,
			"xEnabled": true,
			"yEnabled": true
		};

		var classes = {
			"rootElement": "scrollRoot",
			"scrollElement": "scrollElement",
			"dragCon": "dragCon",
			"contentWrap": "contentWrap",
			"rootWrap": "rootWrap",
			"axisInUse": "axisInUse",
			"axisInUseX": "axisInUseX",
			"axisInUseY": "axisInUseY",
			"dragger": "drag",
			"contentDrag": "contentDrag"
		}

		var methods = {
			"init": function(options) {
				// Create a scopeless copy of this
				var obj = this;

				// Create a data object
				var data = {
					opts: $.extend(defaults, options),
					obj: obj,
					X: {},
					Y: {}
				}

				var ua = navigator.userAgent;

				if (ua.match(/android/i) || ua.match(/iphone/i) || ua.match(/ipad/i) || ua.match(/ipod/i)) {
					data['device'] = "touch";
				} else if (ua.match(/blackberry/i)) {
					data['device'] = "blackberry";
				} else {
					data['device'] = "other";
				}

				if (!data.opts["device-" + data['device']]) return false;
 
				// Does the element need scrollbars
				if (!data.opts.forceScrollbars) {
					var overflow  = this.css('overflow'),
						overflowX = this.css('overflow-x'),
						overflowY = this.css('overflow-y');
					
					var need = overflow == 'auto' || overflow == 'scroll';
						need = need || overflowX == 'auto' || overflowX == 'scroll';
						need = need || overflowY == 'auto' || overflowY == 'scroll';

					if (!need) return false;
				}

				// Count images objs
				var imgs = this.find('img'),
					imgsLen = imgs.length,
					imgsLoad = 0;
				
				data['imgs'] = {
					"objs": imgs,
					"len": imgsLen,
					"load": imgsLoad
				}

				// Write data to our object
				methods.setData.call(this, data);

				if (imgsLen === 0) {
					return methods.prepare.call(this);
				} else {
					return $.each(imgs, function(i, img) {
						var image = new Image();
						$(image).bind("load error", function(event) {
							var data = methods.getData.call(obj, "imgs");
							data["load"]++;
							methods.setData.call(obj, "imgs", data);

							if (data.load == data.len) {
								return methods.prepare.call(obj);
							}
						});

						image.src = img.src;
					});
				}
			},
			"prepare": function() {
				// Create a scopeless copy of this
				var obj = this;

				// Make sure we do not have position static
				if (obj.css('position') === 'static') {
					obj.css('position', 'relative');
				}

				// Get a copy of data
				var data = methods.getData.call(obj);

				// Generate a unique identifier
				var id = data['id'] = "scroll-" + Math.floor (Math.random() * 100000);

				// Add our id as a class, and the scrollRoot class
				obj.addClass(id).addClass(classes['scrollElement']).addClass(classes['rootElement']);

				var xSpace = data.opts.xSpace,
					ySpace = data.opts.ySpace;
				
				if (xSpace === 'auto') {
					temp = $("<div/>", {"class": classes['dragCon'] + " scrollElement " + classes['dragCon'] + "X"}).appendTo("body");

					xSpace = data.opts.xSpace = parseFloat(temp.height());
					temp.remove();
				}

				if (ySpace === 'auto') {
					temp = $("<div/>", {"class": classes['dragCon'] + " scrollElement " + classes['dragCon'] + "Y"}).appendTo("body");

					ySpace = data.opts.ySpace = parseFloat(temp.width());
					temp.remove();
				}

				// Wrap with our content wrap
				obj.wrapInner($("<div/>", {"class":[classes["contentWrap"], "scrollElement", id].join(" ")}));
				var contentWrap = data.contentWrap = obj.find("." + classes["contentWrap"] + "." + id);

				// Wrap with our root wrap
				obj.wrapInner($("<div/>", {"class": [classes["rootWrap"], "scrollElement", id].join(" ")}));
				var rootWrap = data.rootWrap = obj.find("." + classes["rootWrap"] + "." + id);

				// Lock root wraps size
				rootWrap.css({
					width: obj.width(),
					height: obj.height()
				});

				// Make sure that rootWrap stays the same size as its parent
				if (data.opts.persistantSize && $.fn._bind) {
					obj.resize(function() {
						var data = methods.getData.call($(this));
						data.rootWrap.css({
							width: obj.width() - data.opts.ySpace,
							height: obj.height() - data.opts.xSpace
						});

						if (data.rootWrap.height() >= data.contentWrap.height()) {
							methods.destroy.call(obj, "Y");
						} else {
							methods.generate.call(obj, "Y");
						}

						if (data.rootWrap.width() >= data.contentWrap.width()) {
							methods.destroy.call(obj, "X");
						} else {
							methods.generate.call(obj, "X");
						}

						try {
							var posX = methods.getScrollPos.call(obj, 'X');
							methods.move.call(obj, posX, 'X');
							var posY = methods.getScrollPos.call(obj, 'Y');
							methods.move.call(obj, posY, 'Y');
						} catch(e) { };
					});
				}

				// Make sure we don't have tab index 0 (keyboard control)
				if (data.opts.keyboardControl) {
					var tabindex = data.tabindex = obj.attr('tabindex');
					if (typeof tabindex === 'undefined' || tabindex === 0) {
						obj.attr('tabindex', '-1');
					}
				}

				methods.setData.call(this, data);

				// Check if we actually need these scrollbars
				if (rootWrap.width() >= contentWrap.width()) {
					methods.destroy.call(this, 'X');
				} else {
					obj.addClass(classes["axisInUse"] + "X");
				}
				if (rootWrap.height() >= contentWrap.height()) {
					methods.destroy.call(this, 'Y');
				} else {
					obj.addClass(classes["axisInUse"] + "Y");
				}

				// Add our content drag class
				if (data.opts.dragContent) {
					obj.addClass(classes["dragContent"]);
				}
				
				// Generate our scrollbars
				if (data.opts.xEnabled) methods.generate.call(obj, 'X');
				if (data.opts.yEnabled) methods.generate.call(obj, 'Y')
			},
			"generate": function(axis) {
				// Create scopeless copy of this
				var obj = this;

				// Get copy of data
				var data = methods.getData.call(obj);

				// Pull needed values from data
				var contentWrap = data.contentWrap,
					rootWrap = data.rootWrap,
					id = data.id;
				
				if (obj.find('.' + classes['dragCon'] + axis).length > 0) {
					if (obj.find('.' + classes['dragCon'] + axis).length > 0) {
						return false;
					}
				}
								
				if (data.X.dragCon && data.Y.dragCon) {
					if (axis == 'X') {
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
				var dragCon = data[axis].dragCon = $("<div/>", {"class": [classes["scrollElement"], id, classes["dragCon"], classes["dragCon"]+axis].join(" ")}).appendTo(obj);

				if (axis == 'X') {
					// Check if this axis needs scrollbars
					if ((rootWrap.width() + data.opts.ySpace) >= contentWrap.width()) {
						methods.destroy.call(obj, axis);
						return false;
					}
				} else {
					// Check if this axis needs scrollbars
					if ((rootWrap.height() + data.opts.xSpace) >= contentWrap.height()) {
						methods.destroy.call(obj, axis);
						return false;
					}
				}

				obj.addClass(classes["axisInUse" + axis]);

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
				var overlapping = data.overlapping = !data.opts.overlap && obj.hasClass(classes["axisInUseX"]) && obj.hasClass(classes["axisInUseY"]);
				if (overlapping) {
					if (axis == 'X') {
						dragCon.css({
							left: data.opts.ySpace * -1
						});
					} else {
						dragCon.css({
							top: data.opts.xSpace * -1
						});
					}
				}

				var ratio, dragSize;

				if (axis == 'X') {
					// Calculate the dragSize
					if (data.opts.draggerSize === 'auto') {
						ratio = dragCon.width() / contentWrap.width();
						ratio = data.opts.draggerSize = Math.round(ratio * 100);
					} else {
						ratio = data.opts.draggerSize = parseFloat(data.opts.draggerSize);
					}
				} else {
					// Calculate the dragSize
					if (data.opts.draggerSize === 'auto') {
						ratio = dragCon.height() / contentWrap.height();
						ratio = data.opts.draggerSize = Math.round(ratio * 100);
					} else {
						ratio = data.opts.draggerSize = parseFloat(data.opts.draggerSize);
					}
				}

				// Create the dragger
				var dragger = data[axis].dragger = $("<div/>", {"class": [classes["scrollElement"], classes["dragger"], id, classes["dragger"] + axis].join(" ")}).appendTo(dragCon);

				if (axis == 'X') {
					dragger.css({
						left: data.ySpace,
						width: ratio + "%"
					});
				} else {
					dragger.css({
						top: data.xSpace,
						height: ratio + "%"
					});
				}

				// Initial hide of elements for autohide options
				if (data.opts.scrollbarAutohide) {
					dragger.parent().fadeTo(0, 0);
				}

				methods.setData.call(obj, this);

				return methods.addEvents.call(obj, axis);
			},
			"addEvents": function(axis) {
				// Scopeless copy of this
				var obj = this;

				// Get data
				var data = methods.getData.call(obj);

				// Pull items from data
				var dragCon = data[axis].dragCon,
					dragger = data[axis].dragger,
					rootWrap = data.rootWrap,
					contentWrap = data.contentWrap;
				
				if (typeof data.eventsAdded == 'undefined') {
					data.eventsAdded = {};
				}

				events = {
					"draggerMousedown": [
						dragger,
						"mousedown",
						function(e, obj, axis) {
							var data = methods.getData.call(obj);
							data['activeAxis'] = axis;
							data['activePosition'] = axis == 'X' ? e.pageX : e.pageY;
							methods.setData.call(obj, data);

							$("body").addClass('normalScrollingActive');

							e.preventDefault();
						}
					],
					"starMousemove": [
						$("*"),
						"mousemove",
						function(e, obj) {
							var data = methods.getData.call(obj),
								axis = data['activeAxis'],
								pos = data['activePosition'];
							
							if (axis && pos) {
								var newPos = data['activePosition']  = axis === 'X' ? e.pageX : e.pageY;
								var disPos = newPos - pos;

								methods.move.call(obj, disPos, axis);
								methods.setData.call(obj, data);
							}
						}
					],
					"starMouseup": [
						$("*"),
						"mouseup",
						function(e, obj) {
							var data = { activeAxis: false, activePos: false };
							methods.setData.call(obj, data);

							$("body").removeClass("normalScrollingActive");
						}
					],
					"dragConMousedown": [
						dragCon,
						"mousedown",
						function(e, obj, axis) {
							if (!$(e.target).hasClass(classes['dragger'])) {
								var dragger = $(this).children().eq(0),
									dPos = axis == 'X' ? dragger.offset().left : dragger.offset().top,
									mPos = axis == 'X' ? e.pageX : e.pageY,
									dragSize = axis == 'X' ? dragger.width() : dragger.height(),
									distance = mPos > dPos ? dragSize : -dragSize;
								
								methods.move.call(obj, distance, axis);
							}
						}
					]
				}

				if (data.opts.keyboardControl) {
					events["objKeydown"] = [
						obj,
						"keydown",
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
									methods.moveContent.call(obj, -obj.height(), 'Y');
									break;
								case 34:
									methods.moveContent.call(obj, obj.height(), 'Y');
									break;
							}				
						}
					];
				}

				if (data.opts.dragContent) {
					events["contentMousedown"] = [
						data.contentWrap,
						"mousedown",
						function(e, obj) {

							var data = {
								"contentActiveX": e.pageX,
								"contentActiveY": e.pageY
							};

							$("body").addClass("contentDragActive");

							methods.setData.call(obj, data);

							obj.focus();
							e.preventDefault();
						}
					];

					events['contentMousemove'] = [
						$("*"),
						"mousemove",
						function(e, obj) {
							var data = methods.getData.call(obj);

							if (data.contentActiveX && data.contentActiveY) {
								var posX = data.contentActiveX,
									posY = data.contentActiveY,
									newX = data['contentActiveX'] = e.pageX,
									newY = data['contentActiveY'] = e.pageY,
									disX = newX - posX,
									disY = newY - posY;
								
								methods.moveContent.call(obj, -disX, 'X');
								methods.moveContent.call(obj, -disY, 'Y');
								methods.setData.call(obj, data);
							}
						}
					];

					events['contentMouseup'] = [
						$("*"),
						"mouseup",
						function(e, obj) {
							var data = { contentActiveX: false, contentActiveY: false };
							methods.setData.call(obj, data);

							$("body").removeClass("contentDragActive");
						}
					];
				}

				if (data.opts.scrollbarAutohide) {
					var data = methods.getData.call(obj);
					events['objMouseEnter'] = [
						$(".scrollElement." + data['id']),
						"mouseenter",
						function(e, obj, args) {
							var data = methods.getData.call(obj);
							data.X.dragCon.stop().fadeTo(500, 1);
							data.Y.dragCon.stop().fadeTo(500, 1);
						}
					];

					events['objMouseOut'] = [
						obj,
						"mouseout",
						function(e, obj, args) {
							var data = methods.getData.call(obj);
							//if ($(e.currentTarget).hasClass(data['id'])) return false;
							data.X.dragCon.stop().fadeTo(500, 0);
							data.Y.dragCon.stop().fadeTo(500, 0);
						}
					];
				}

				if ($.fn.mousewheel && data.opts.mousewheelSupport) {
					events['objMousewheel'] = [
						obj,
						"mousewheel",
						function(e, obj, args) {
							var delta = -args[1];
							var axis = args[2] != 0 ? 'X' : 'Y';
							var distance = delta < 0 ? -3 : delta > 0 ? 3 : 0;
							methods.move.call(obj, distance, axis);

							e.preventDefault();
						}
					];
				}

				$.each(events, function(i, e) {
					var ele = e[0],
						eventName = e[1],
						cb = e[2];
					
					ele.bind(eventName, function(e) {
						var classList = e.target.className.split(" "), axis;
						var args = arguments;

						$.each(classList, function(k, v) {
							var isX = v.match(/.*?X/), isY = v.match(/.*?Y/);
							if (isX && isY) return false;
							if (isX) axis = 'X';
							else if (isY) axis = 'Y';
						});

						if (!axis) return cb.call($(this), e, obj, args);
						return cb.call($(this), e, obj, axis, args);
					});
				});
			},
			"moveContent": function(distance, axis) {
				var obj = this,
					data = methods.getData.call(this),
					dragCon = data[axis].dragCon,
					dragger = data[axis].dragger,
					rootWrap = data.rootWrap,
					contentWrap = data.contentWrap;
				
				
				if (!dragger) return false;
								
				var draggerSize = axis == 'X' ? dragger.width() : dragger.height(),
					padding = axis == 'X' ?
								dragCon.css('left') :
								dragCon.css('top');
				
				padding = padding == "auto" ? 0 : -parseFloat(padding);

				var size = axis == 'X' ?
							dragCon.width() - padding :
							dragCon.height() - padding;
				
				var contentWrapSize = axis == 'X' ? contentWrap.width() : contentWrap.height(),
					rootWrapSize = axis == 'X' ? rootWrap.width() : rootWrap.height();
				
				var trackDistance = size - draggerSize,
					outOfRange = contentWrapSize - rootWrapSize;
				
				var dRatio = outOfRange / trackDistance;

				methods.move.call(obj, distance / dRatio, axis);
			},
			"move": function(distance, axis, options) {
				var obj = this;
				var moveDefaults = {
					"moveMethod": "distance",
					"moveType": "pixels"
				}

				var moveOptions = $.extend(moveDefaults, options);

				var data = methods.getData.call(obj);

				var dragCon = data[axis].dragCon,
					dragger = data[axis].dragger,
					rootWrap = data.rootWrap,
					contentWrap = data.contentWrap;
				
				if (!dragCon || !dragger) return false;
				
				var position,
					current,
					percent,
					padding = axis == 'X' ?
								dragCon.css('left') :
								dragCon.css('top');
				
				padding = padding == "auto" ? 0 : -parseFloat(padding);

				var size = axis == 'X' ?
							dragCon.width() - padding :
							dragCon.height() - padding;
				
				var draggerSize = axis == 'X' ?
									dragger.width() :
									dragger.height();
				
				var rootWrapSize = axis == 'X' ? rootWrap.width() : rootWrap.height();
				var contentWrapSize = axis == 'X' ? contentWrap.width() : contentWrap.height();
				
				var min = padding;
				var max = (size + padding) - draggerSize;

				if (moveOptions.moveMethod == "position") {
					if (moveOptions.moveType == "percent") {
						position = (distance / size) * 100;
					} else {
						position = distance;
					}
				} else {
					current = axis == 'X' ?
								dragger.css('left') :
								dragger.css('top');
					
					current = current == 'auto' ? min : parseFloat(current);

					if (moveOptions.moveType == "percent") {
						percent = (distance / size) * 100;
						position = current + percent;
					} else {
						position = current + distance;
					}
				}

				if (position < min) position = min;
				if (position > max) position = max;

				if (axis == 'X') {
					dragger.css('left', position);
				} else {
					dragger.css('top', position);
				}

				var trackDistance = size - draggerSize,
					outOfRange = contentWrapSize - rootWrapSize;
				
				var dRatio = outOfRange / trackDistance;

				if (position == max) position = position-1;

				var scrollDistance = (position - padding) * dRatio;

				if (axis == 'X') {
					contentWrap.css({left: -scrollDistance});
				} else {
					contentWrap.css({top: -scrollDistance});
				}
			},
			"getScrollPos": function(axis, add) {
				var obj = this;

				var data = methods.getData.call(obj);

				var dragger = data[axis].dragger;
				var dragCon = data[axis].dragCon;

				var scrollPos = axis == 'X' ? dragger.css('left') : dragger.css('top');

				scrollPos = scrollPos == "auto" ? 0 : parseFloat(scrollPos);

				var dragConSize = axis == 'X' ? dragCon.width() : dragCon.height();
				var dragSize = axis == 'X' ? dragger.width() : dragger.height();

				if (add) scrollPos = scrollPos + dragSize;

				var percentage = (scrollPos/dragConSize) * 100;

				return percentage;
			},
			"destroy": function(axis) {
				var obj = this;
				var data = methods.getData.call(this);
				if (!data) return false;
				if (axis) {
					obj.removeClass(classes["axisInUse"] + axis);
					obj.find("." + classes["dragCon"] + axis + "." + data.id).remove();
					if (axis == 'X') {
						data.rootWrap.css({height: "100%"});
						if (data.Y.dragCon) {
							data.Y.dragCon.css({
								top: 0
							});
						}
					} else {
						data.rootWrap.css({width: "100%"});
						if (data.X.dragCon) {
							data.X.dragCon.css({
								left: 0
							});
						}
					}
				} else {
					obj.html(data.contentWrap.html());
					for (index in classes) {
						obj.removeClass(classes[index]);
						obj.removeClass(classes[index] + "X");
						obj.removeClass(classes[index] + "Y");
					}

					if (data.tabindex) {
						obj.attr("tabindex", data.tabindex);
					} else {
						obj.removeAttr("tabindex");
					}

					obj.removeClass(data.id);
					methods.removeData.call(this);
				}
			},
			"setData": function(index, value, overwrite) {
				var obj = this;
				if (typeof(index) === 'object') {
					if (value === null && overwrite === true) {
						return this.data('jQSData', index);
					}
					return $.each(index, function(index, value) {
						return methods.setData.call(obj, index, value);
					});
				}

				var data = this.data('jQSData');
				if (!data) {
					data = {};
					this.data('jQSData', data);
				}

				data[index] = value;
				if (value === null && overwrite === true) {
					data = value;
				}
				return this.data('jQSData', data);
			},
			"getData": function(index) {
				var data = this.data('jQSData');
				return index ? data[index] : data;
			},
			"removeData": function() {
				return this.removeData('jQSData');
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

			return returns.length < 1 ? jQReturn : returns.length > 1 ? returns : returns[0];
		} else if (typeof(method) === 'object' || !method) {
			var opts = $.extend(defaults, args[0]);
			return this.each(function() {
				methods["init"].apply($(this), args);
			});
		} else {
			$.error("No such method " + method + " on jQuery.scrollbars");
		}
	}
})(jQuery);