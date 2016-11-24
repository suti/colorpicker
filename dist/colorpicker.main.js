'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _converts;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import {defaults} from './colorpicker.wheel.js';
// import {screen} from './colorpicker.screen.js';

/* Converts: HSL, RGB, HEX */
var converts = (_converts = {
	hsb2rgb: function hsb2rgb(hsb) {
		var rgb = {};
		var h = Math.round(hsb.h);
		var s = Math.round(hsb.s * 255 / 100);
		var v = Math.round(hsb.b * 255 / 100);
		if (s === 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255 - s) * v / 255;
			var t3 = (t1 - t2) * (h % 60) / 60;
			if (h === 360) h = 0;
			if (h < 60) {
				rgb.r = t1;rgb.b = t2;rgb.g = t2 + t3;
			} else if (h < 120) {
				rgb.g = t1;rgb.b = t2;rgb.r = t1 - t3;
			} else if (h < 180) {
				rgb.g = t1;rgb.r = t2;rgb.b = t2 + t3;
			} else if (h < 240) {
				rgb.b = t1;rgb.r = t2;rgb.g = t1 - t3;
			} else if (h < 300) {
				rgb.b = t1;rgb.g = t2;rgb.r = t2 + t3;
			} else if (h < 360) {
				rgb.r = t1;rgb.g = t2;rgb.b = t1 - t3;
			} else {
				rgb.r = 0;rgb.g = 0;rgb.b = 0;
			}
		}
		return {
			r: Math.round(rgb.r),
			g: Math.round(rgb.g),
			b: Math.round(rgb.b)
		};
	},
	rgbString2hex: function rgbString2hex(rgb) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return rgb && rgb.length === 4 ? '#' + ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
	},
	hsb2hex: function hsb2hex(rgb) {
		var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
		$.each(hex, function (nr, val) {
			if (val.length === 1) hex[nr] = '0' + val;
		});
		return '#' + hex.join('');
	}
}, _defineProperty(_converts, 'hsb2hex', function hsb2hex(hsb) {
	return rgb2hex(hsb2rgb(hsb));
}), _defineProperty(_converts, 'hex2hsb', function hex2hsb(hex) {
	var hsb = rgb2hsb(hex2rgb(hex));
	if (hsb.s === 0) hsb.h = 360;
	return hsb;
}), _defineProperty(_converts, 'rgb2hsb', function rgb2hsb(rgb) {
	var hsb = { h: 0, s: 0, b: 0 };
	var min = Math.min(rgb.r, rgb.g, rgb.b);
	var max = Math.max(rgb.r, rgb.g, rgb.b);
	var delta = max - min;
	hsb.b = max;
	hsb.s = max !== 0 ? 255 * delta / max : 0;
	if (hsb.s !== 0) {
		if (rgb.r === max) {
			hsb.h = (rgb.g - rgb.b) / delta;
		} else if (rgb.g === max) {
			hsb.h = 2 + (rgb.b - rgb.r) / delta;
		} else {
			hsb.h = 4 + (rgb.r - rgb.g) / delta;
		}
	} else {
		hsb.h = -1;
	}
	hsb.h *= 60;
	if (hsb.h < 0) {
		hsb.h += 360;
	}
	hsb.s *= 100 / 255;
	hsb.b *= 100 / 255;
	return hsb;
}), _defineProperty(_converts, 'hex2rgb', function hex2rgb(hex) {
	hex = parseInt(hex.indexOf('#') > -1 ? hex.substring(1) : hex, 16);
	return {
		/* jshint ignore:start */
		r: hex >> 16,
		g: (hex & 0x00FF00) >> 8,
		b: hex & 0x0000FF
		/* jshint ignore:end */
	};
}), _converts);

/* Selector */

var Selector = function () {
	function Selector() {
		_classCallCheck(this, Selector);
	}

	_createClass(Selector, [{
		key: 'qs',
		value: function qs(selector) {
			return document.querySelector(selector);
		}
	}, {
		key: 'qsAll',
		value: function qsAll(selector) {
			return document.querySelectorAll(selector);
		}
	}]);

	return Selector;
}();

var Main = function () {
	function Main() {
		_classCallCheck(this, Main);

		this.event_handler();
	}

	/* Event handler */


	_createClass(Main, [{
		key: 'event_handler',
		value: function event_handler() {
			var box = new Box(),
			    s = new Selector();

			var event_bind = function event_bind(target, type, handler) {
				target.addEventListener(type, handler);
			};

			var movebar = s.qs('#js-movebar'),
			    panel = s.qs('#js-panel');

			//Start moving 
			event_bind(movebar, 'mousedown', function (event) {
				event.preventDefault();
				this.dataset.on = 'on';
				box.move(this, event);
			});

			//Moving
			event_bind(movebar, 'mousemove', function (event) {
				if (this.dataset.on == 'on') {
					box.move(this, event);
				}
			});

			//Stop moving
			event_bind(movebar, 'mouseup', function () {
				this.dataset.on = 'off';
			});

			//Moveout
			event_bind(movebar, 'mouseout', function () {
				this.dataset.on = 'off';
			});

			//Panel click to move 
			event_bind(panel, 'click', function (event) {
				box.move(this, event);
			});
		}
	}]);

	return Main;
}();

var Box = function () {
	function Box() {
		_classCallCheck(this, Box);
	}

	_createClass(Box, [{
		key: 'fade',

		/* Trigger to fadeIn and fadeOut */
		value: function fade(target) {
			target.toggleClassList('fadeIn fadeOut');
		}

		/* Simple animate */

	}, {
		key: 'animate',
		value: function animate(o, para, cb) {
			var _para$top = para.top,
			    top = _para$top === undefined ? '0' : _para$top,
			    _para$left = para.left,
			    left = _para$left === undefined ? '0' : _para$left,
			    _para$bottom = para.bottom,
			    bottom = _para$bottom === undefined ? '0' : _para$bottom,
			    _para$right = para.right,
			    right = _para$right === undefined ? '0' : _para$right;


			o.style.top = top;
			o.style.left = left;
			o.style.bottom = bottom;
			o.style.right = right;

			if (!cb) {
				return;
			}
			cb();
		}

		/* Appear */

	}, {
		key: 'appear',
		value: function appear(trigger) {
			var templete = '\n\t\t\t<div class="colorpicker">\n\t\t\t    <div class="colorpicker-panel">\n\t\t\t        <div class="colorpicker-panel-mask"></div>\n\t\t\t        <div class="colorpicker-panel-movebar" id="js-movebar"></div>\n\t\t\t    </div>\n\t\t\t    <div class="colorpicker-toolbar">\n\t\t\t        <div class="colorpicker-toolbar-tool">\n\t\t\t            <div class="colorpicker-screen"></div>\n\t\t\t            <div class="colorpicker-watch"></div>\n\t\t\t            <div class="colorpicker-control">\n\t\t\t                <div class="colorpicker-control-solid">\n\t\t\t                  <input type="range" name="" value="10" min="1" max="10">\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-control-opacity">\n\t\t\t                  <input type="range" name="" value="10" min="1" max="10" step="1">\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t        </div>\n\t\t\t        <div class="colorpicker-toolbar-input">\n\t\t\t            <div class="colorpicker-toolbar-input-hex">\n\t\t\t                <input type="text">\n\t\t\t                <div class="colorpicker-toolbar-input-text">HEX</div>\n\t\t\t            </div>\n\t\t\t            <div class="colorpicker-toolbar-input-rgba">\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">R</div>\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">G</div>\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">B</div>\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">A</div>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t            <div class="colorpicker-toolbar-input-hsla">\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">H</div>\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">S</div>\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">L</div>\n\t\t\t                </div>\n\t\t\t                <div class="colorpicker-toolbar-input-wrap">\n\t\t\t                    <input type="text">\n\t\t\t                    <div class="colorpicker-toolbar-input-text">A</div>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t            <div class="flip"></div>\n\t\t\t        </div>\n\t\t\t    </div>\n\t\t\t</div>\n\t\t';
		}

		/* The movebar and control move */

	}, {
		key: 'move',
		value: function move(target, event) {
			var s = new Selector();

			var movebar = s.qs('#js-movebar'),
			    panel = s.qs('#js-panel');

			var offsetX = panel.offsetLeft,
			    offsetY = panel.offsetTop,
			    offsetWidth = target.offsetWidth,
			    offsetHeight = target.offsetHeight,
			    x = Math.round(event.pageX - offsetX - offsetWidth / 2),
			    y = Math.round(event.pageY - offsetY - offsetHeight / 2);

			// if (target === panel) {
			// 	x = Math.round(event.pageX - offsetX),
			// 	y = Math.round(event.pageY - offsetY);
			// }

			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x > panel.clientWidth - offsetWidth) x = panel.clientWidth - offsetWidth;
			if (y > panel.clientHeight - offsetHeight) y = panel.clientHeight - offsetHeight;

			if (target === movebar) {
				this.animate(target, {
					top: y + 'px',
					left: x + 'px'
				});
			} else if (target === panel) {
				x = Math.round(event.pageX - offsetX), y = Math.round(event.pageY - offsetY);

				this.animate(movebar, {
					top: y + 'px',
					left: x + 'px'
				});
			} else {
				this.animate(target, {
					left: x + 'px'
				});
			}
		}
	}]);

	return Box;
}();

new Main();