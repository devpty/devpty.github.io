// deno-lint-ignore-file
/// <reference lib="dom" />
(function() {
	window.CUBE ??= {};
	window.CUBE.ret ??= false;
	var mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	var animate = !mediaQuery.matches;
	mediaQuery.onchange = function() {
		animate = !mediaQuery.matches;
	}
	var cube = document.getElementById("cube");
	var targetX = 0;
	var targetY = 0;
	var targetT = 0;
	var mouseX = 0;
	var mouseY = 0;
	var currentX = 0;
	var currentY = 0;
	var currentT = 0;
	var cssX = 1;
	var cssY = 1;
	var cssT = 0;
	var lt = 0;
	var winW = 0;
	var winH = 0;
	var winS = 0;
	var winM = 0;
	var first = true;
	var go = null;
	var running = 0;
	var hovering = [];
	var hoverType = [];
	if (!animate || window.CUBE.ret)
		cube.style.animationName = `none`;
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
		winM = Math.min(winW, winH) / winS;
	}
	window.addEventListener("resize", windowUpdate);
	windowUpdate();
	window.addEventListener("mousemove", function (ev) {
		mouseX = (2 * ev.clientX - winW) / winS,
		mouseY = (2 * ev.clientY - winH) / winS;
		if (!go && (hovering.length === 0 || hoverType.map(i => i === `key`).reduce((a, b) => a && b, true)))
			targetX = mouseX, targetY = mouseY;
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
		if (animate)
			currentX = lc(currentX, targetX, dt),
			currentY = lc(currentY, targetY, dt),
			currentT = lc(currentT, targetT, dt * 2);
		else
			currentX = currentY = 0;
		if (first) {
			first = false;
			cube.style.transform = "rotateX(calc(-35 * var(--y) - 35.264389682754deg * (1 - var(--tilt)))) rotateY(calc(35 * var(--x))) rotateX(calc(-35.264389682754deg * var(--tilt))) rotateY(45deg)";
			// cube.style.transform = "rotateX(calc(-35 * var(--y) - 35.264389682754deg)) rotateY(calc(35 * var(--x))) rotateY(45deg)";
			const anim = cube.getAnimations();
			if (anim.length > 0) {
				const time = anim[0].currentTime % 2000;
				cube.style.animationName = "none";
				const t = time > 1000 ? (time - 2000) : time;
				currentX = t * -7 / 6000;
			}
			targetT = 1;
		}
		var change = false;
		if (Math.abs(cssX - currentX) > 1e-5) {
			change = true;
			cube.style.setProperty("--x", (cssX = currentX) + "deg");
		}
		if (Math.abs(cssY - currentY) > 1e-5) {
			change = true;
			cube.style.setProperty("--y", (cssY = currentY) + "deg");
		}
		if (Math.abs(cssT - currentT) > 1e-5) {
			change = true;
			cube.style.setProperty("--tilt", (cssT = currentT));
		}
		if (change) {
			requestAnimationFrame(frame);
		} else {
			if (CUBE.ret && targetX !== 0 && targetY !== 0) {
				targetX = targetY = 0;
				requestAnimationFrame(frame);
			} else {
				running = 0;
			}
		}
	}
	var links = document.getElementById("links").children;
	for (var i = 0; i < links.length; i++) {
		let link = links[i];
		function focus(type) {
			return function() {
				if (!hovering.includes(link)) {
					hovering.push(link);
					hoverType.push(type);
				}
				targetX = link.style.getPropertyValue("--x") * winM;
				targetY = link.style.getPropertyValue("--y") * winM;
				start();
			}
		}
		function blur(ev) {
			return function() {
				var idx = hovering.indexOf(link);
				if (idx >= 0) {
					hovering.splice(idx, 1);
					hoverType.splice(idx, 1);
				}
			}
		}
		if (link.tagName !== `A`)
			continue;
		link.addEventListener("mouseover", focus("mouse"));
		link.addEventListener("mouseout", blur("mouse"));
		link.addEventListener("focus", focus("key"));
		link.addEventListener("blur", blur("key"));
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
				if (this.getAttribute("data-ring"))
					cube.style.animationName = "exit";
			}
			var elem = document.createElement("link");
			elem.rel = "prefetch";
			elem.href = this.href;
			document.head.appendChild(elem);
			localStorage.setItem("last-page", location.toString());
			setTimeout(function() {
				location = go;
			}, 500);
			return false;
		});
	}
	if (animate && localStorage.getItem("last-page")) {
		for (var i = 0; i < links.length; i++)
			links[i].style.opacity = "0";
		// browser jank
		setTimeout(function() {
			localStorage.removeItem("last-page");
			for (var i = 0; i < links.length; i++)
				links[i].style.animationName = "start";
		}, 50);
	}
})();
