// ParallaxAble.js
/**
 * @author 		Nicolas Udy	| http://udy.io
 * @version 	2.0.1			 	| https://github.com/udyux/parallaxable-js
 * @license 	MIT License | https://tldrlegal.com/license/mit-license
 * @copyright UdyUX 2016
 *//**
 * @summary 	ParallaxAble - Acheive 60fps x-browser parallax effect -
 *						Apply class `.parallax` to elements with `data-ratio=""`.
 *						Ratio is a floating point number starting with a decimal.
 *						The higher the ratio, the closer it is to position:fixed.
 *						Apply class `.parallax-parent` to identify offset-parent.
 *						This places elements below the fold on page load so they
 * 						appear correctly in the viewport.
 *			NOTE: Avoid ratios above `.5` due to performance issues.
 *
 * @see 			https://github.com/udyux/parallaxable-js/README
 * @example 	<section class="parallax-parent">
 * 							<img src="bg.jpg" class="parallax" data-ratio=".4"/>
 */

(function() {
	var nodes = document.querySelectorAll('.parallax');
	var buffer = false;
	var positions = [];
	var ratios = [];
	var scroll = 0;

	var P = {
		// update scroll position and request a new frame
		updateScroll: function() {
			scroll = window.scrollY;
			P.requestBuffer();
		},
		// debounce new frame requests, fires when browser is ready
		requestBuffer: function() {
			if (!buffer) requestAnimationFrame(P.updateFrame);
			buffer = true;
		},
		// reset buffer and render all nodes
		updateFrame: function() {
			buffer = false;
			var lastscroll = scroll;
			for (i=0; i < nodes.length; i++) {
				// using translate3d to force hardware acceleration
				var render = 'translate3d(0,' + (lastscroll*ratios[i]+positions[i]) + 'px,0)';
				nodes[i].style.transform = render;
			}
		},
		// climb the DOM tree and return the `.parallax-parent`
		getParent: function(node) {
			while (!node.offsetParent.classList.contains('parallax-parent')) {
				node = node.offsetParent;
			}
			return node.offsetParent;
		},
		// return offsetTop of `.parallax-parent` relative to document
		getOffset: function(node) {
			var parentNode = P.getParent(node);
			var parentTop = 0;
			while (parentNode) {
				parentTop += parentNode.offsetTop;
				parentNode = parentNode.offsetParent;
			}
			return parentTop;
		},
		// store ratios, offsets and prepare nodes
		init: function() {
			for (i=0; i < nodes.length; i++) {
				var ratio = nodes[i].dataset.ratio;
				var position = P.getOffset(nodes[i])*-ratio;
				var place = 'translate3d(0,' + (window.scrollY*ratio+position) + 'px,0)';
				nodes[i].style.transform = place;
				ratios.push(ratio);
				positions.push(position);
			}
		}
	};

	window.addEventListener('scroll', P.updateScroll, true);
	setTimeout(P.init(),50);

})();
