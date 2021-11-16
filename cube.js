var cc = document.createElement("div");
cc.id = "cc";
document.body.appendChild(cc);
var cube = document.createElement("div");
cube.id = "cube";
cc.appendChild(cube);
for (let i = 0; i < 6; i++) {
	var c = document.createElement("div");
	c.className = "cube";
	cube.appendChild(c);
}
var targetX = 0;
var targetY = 0;
var currentX = 0;
var currentY = 0;
var cssX = 0;
var cssY = 0;
var lt = 0;
window.addEventListener("mousemove", function cubeUpdate(ev) {
	var posX = ev.clientX / window.innerWidth;
	var posY = ev.clientY / window.innerHeight;
	targetX = (posX - 0.5) * 25;
	targetY = (posY - 0.5) * 25;
});
window.addEventListener("mouseout", function cubeExit() {
	targetX = 0;
	targetY = 0;
});
function lerp(a, b, t) {
	return a * (1 - t) + b * t;
}
function lc(a, b, t) {
	return lerp(a, b, Math.min(Math.max(t, 0), 1));
}
function frame(time) {
	const dt = (time - lt) / 100;
	lt = time;
	currentX = lc(currentX, targetX, dt);
	currentY = lc(currentY, targetY, dt);
	if (cssX !== currentX)
		cube.style.setProperty("--x", (cssX = currentX) + "deg");
	if (cssY !== currentY)
		cube.style.setProperty("--y", -(cssY = currentY) + "deg");
	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
