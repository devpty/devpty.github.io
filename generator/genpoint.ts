// points are random on a circle but scaled between 0.5 - 0.9
export function GenPoints(n: number) {
	n++;
	const pos = [];
	for (let i = 0; i < n; i++) {
		const angle = (i * Math.PI * 2) / n;
		pos.push([Math.sin(angle), -Math.cos(angle)]);
	}
	function map(value: number, iMin: number, iMax: number, oMin: number, oMax: number) {
		return oMin + (value - iMin) * (oMax - oMin) / (iMax - iMin);
	}
	const xMin = pos.map(i => i[0]).reduce((a, b) => a < b ? a : b);
	const xMax = pos.map(i => i[0]).reduce((a, b) => a > b ? a : b);
	const yMin = pos.map(i => i[1]).reduce((a, b) => a < b ? a : b);
	const yMax = pos.map(i => i[1]).reduce((a, b) => a > b ? a : b);
	const scale = xMax - xMin > yMax - yMin ? [xMin, xMax] : [yMin, yMax];
	const posNorm = pos.map(i => [map(i[0], scale[0], scale[1], -1, 1), map(i[1], scale[0], scale[1], -1, 1)]);

	// const posNorm = pos.map(i => [map(i[0], xMin, xMax, -1, 1), map(i[1], yMin, yMax, -1, 1)]);

	// const xShift = (xMin + xMax) / -2;
	// const yShift = (yMin + yMax) / -2;
	// const posNorm = pos.map(i => [i[0] + xShift, i[1] + yShift]);
	const out: string[] = [];
	for (let i = 0; i < posNorm.length; i++) {
		const [rx, ry] = posNorm[i];
		const x = rx.toFixed(5), y = ry.toFixed(5);
		out.push(`--x:${x[0] === `-` ? x : `+${x}`};--y:${y[0] === `-` ? y : `+${y}`}`);
	}
	return out;
}
if (import.meta.main) {
	console.log(GenPoints(parseInt(Deno.args[0] ?? "1")));
}
