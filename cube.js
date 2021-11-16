(function() {
	var mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	var animate = !mediaQuery.matches;
	mediaQuery.onchange = function() {
		animate = !mediaQuery.matches;
	}
	var cube = document.getElementById("cube");
	var targetX = 0;
	var targetY = 0;
	var currentX = 0;
	var currentY = 0;
	var cssX = 1;
	var cssY = 1;
	var lt = 0;
	var winW = 0;
	var winH = 0;
	var winS = 0;
	var first = true;
	var go = null;
	var running = 0;
	function start() {
		if (!running) {
			running = 3;
			frame();
		}
	}
	function windowUpdate() {
		winW = window.innerWidth;
		winH = window.innerHeight;
		winS = winW + winH;
	}
	window.addEventListener("resize", windowUpdate);
	windowUpdate();
	window.addEventListener("mousemove", function (ev) {
		if (!go)
			targetX = (2 * ev.clientX - winW) / winS,
			targetY = (2 * ev.clientY - winH) / winS;
		start();
	});
	window.addEventListener("mouseout", function () {
		targetX = targetY = 0;
		start();
	});
	function lerp(a, b, t) {
		return a * (1 - t) + b * t;
	}
	function lc(a, b, t) {
		return lerp(a, b, Math.min(Math.max(t, 0), 1));
	}
	function frame(time) {
		var dt = (time - lt) / 100;
		lt = time;
		if (running > 1) {
			running--;
			requestAnimationFrame(frame);
			return;
		}
		if (first) {
			first = false;
			cube.style.transform = "rotateY(calc(6 * var(--x))) rotateX(calc(-6 * var(--y))) rotateX(-35.264389682754deg) rotateY(45deg)";
		}
		if (animate)
			currentX = lc(currentX, targetX, dt),
			currentY = lc(currentY, targetY, dt);
		else
			currentX = currentY = 0;
		var change = false;
		if (Math.abs(cssX - currentX) > 1e-5) {
			change = true;
			cube.style.setProperty("--x", (cssX = currentX) + "deg");
		}
		if (Math.abs(cssY - currentY) > 1e-5) {
			change = true;
			cube.style.setProperty("--y", (cssY = currentY) + "deg");
		}
		if (change)
			requestAnimationFrame(frame);
		else
			running = 0;
	}
	var links = document.body.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		link.addEventListener("click", function(ev) {
			ev.preventDefault();
			targetX = targetY = 0;
			start();
			go = this.href;
			if (animate) {
				for (var j = 0; j < links.length; j++) {
					var link = links[j];
					link.style.animationName = "stop";
					link.style.animationTimingFunction = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
				}
			}
			var elem = document.createElement("link");
			elem.rel = "prefetch";
			elem.href = this.href;
			document.head.appendChild(elem);
			setTimeout(function() {
				location = go;
			}, 500);
			return false;
		});
	}
	if (animate) {
		for (var i = 0; i < links.length; i++)
			links[i].style.opacity = "0";
		// browser jank
		setTimeout(function() {
			for (var i = 0; i < links.length; i++)
				links[i].style.animationName = "start";
		}, 50);
	}
})();
