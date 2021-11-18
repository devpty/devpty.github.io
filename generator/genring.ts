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
		<link rel="stylesheet" href="${d}static/style.css">
		<link rel="stylesheet" href="${d}static/cube.css">
		<link rel="stylesheet" href="${d}static/cube/spin.css">
	</head>
	<body>
		<div id="cc"><div id="cube"><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div><div class="cube"></div></div></div>
		<div id="links">\n`,
	link: (a: string, b: string, c: string, d: string) => `\t\t\t<${d} style="${a}"${c}>${b}</${d}>\n`,
	end: (d: string) => `
		</div>
		<script src="${d}static/cube.js"></script>
	</body>
</html>`.slice(1)
};

export function GenRing(conf: RingConf, depth: number) {
	// todo: do the to
	const d = `../`.repeat(depth);
	const pos = GenPoints(conf.pages.length);
	let out = templates.start(d) + templates.link(pos[0], conf.title.toUpperCase(), ``, `span`);
	for (let i = 0; i < conf.pages.length; i++) {
		const page = conf.pages[i];
		const split = page.split(`:`);
		let title = page.replaceAll(`_`, ` `);
		let path = `${page}.html`;
		let ring = ``;
		if (split.length === 2) {
			title = split[0];
			path = `${split[1]}.html`;
		} else {
			const data = GetFile(page);
			if (data) {
				title = data.title;
				if (data.type !== `ring`)
					ring = ` data-ring="1"`;
			} else {
				path = `static/404.html`;
			}
		}
		out += templates.link(pos[i + 1], title.toUpperCase(), ` href="${d}${path}"${ring}`, `a`);
	}
	return out + templates.end(d);
}
