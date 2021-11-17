import { GenPoints } from "./genpoint.ts";
import { GetFile } from "./register.ts";

export interface RingConf {
	type: "ring";
	title: string;
	pages: string[];
}

const templates = {
	start: (d: string) => `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="description" content="The DEVPTY website">
		<meta name="author" content="/DEV/PTY">
		<meta name="generator" content="DEVPTY website generator">
		<!-- <meta name="keywords" content=""> -->
		<meta name="theme-color" content="#000000">
		<meta name="color-scheme" content="normal">
		<meta name="robots" content="all">
		<meta name="referrer" content="no-referrer">
		<meta name="viewport" scale=1.0">
		<title>/DEV/PTY</title>
		<link rel="stylesheet" href="${d}style.css">
		<link rel="stylesheet" href="${d}cube.css">
	</head>
	<body>
		<div id="cc"><div id="cube"><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div></div></div>
		<div class="links">\n`,
	title: (a: string) => `\t\t<a style="--x:0;--y:-1";>${a}</a>\n`,
	link: (a: string, b: string, c: string) => `\t\t<a style="${a}"; href="${c}">${b}</a>\n`,
	end: (d: string) => `
		</div>
		<script src="${d}cube.js"></script>
	</body>
</html>`
};

export function GenRing(conf: RingConf, depth: number) {
	// todo: do the to
	const d = `../`.repeat(depth);
	let out = templates.start(d) + templates.title(conf.title.toUpperCase());
	const pos = GenPoints(conf.pages.length);
	for (let i = 0; i < conf.pages.length; i++) {
		const page = conf.pages[i];
		const split = page.split(`:`);
		let title = `page`;
		let path = `out/${page}.html`;
		if (split.length === 2) {
			title = split[0];
			path = `out/${split[1]}.html`;
		} else {
			const data = GetFile<RingConf>(page);
			if (data)
				title = data.title;
			else
				path = `static/404.html`;
		}
		out += templates.link(pos[i], title.toUpperCase(), `${d}${path}`);
	}
	return out + templates.end(d);
}
