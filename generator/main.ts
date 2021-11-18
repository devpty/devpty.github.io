import { GenRing, RingConf } from "./genring.ts";
import {GetFile, RegisterFile} from "./register.ts";
if (!import.meta.main)
	throw new Error(`main.ts must be main!`);

async function RecurseDir(name: string): Promise<string[]> {
	const out: string[] = [];
	for await (const file of Deno.readDir(name)) {
		const fn = `${name}/${file.name}`;
		if (file.isDirectory)
			out.push(...await RecurseDir(fn));
		else if (file.isFile)
			out.push(fn);
	}
	return out;
}

const files = await RecurseDir("src");
const prefixes: string[] = [];
for (let i = 0; i < files.length; i++) {
	const file = files[i];
	if (!file.endsWith(`.json`))
		continue;
	const prefix = file.slice(4, -5);
	prefixes.push(prefix);
	const data = JSON.parse(await Deno.readTextFile(file));
	RegisterFile(prefix, data);
}
for (let i = 0; i < prefixes.length; i++) {
	const prefix = prefixes[i];
	console.log(`src/${prefix}.json -> ${prefix}.html`);
	const data = GetFile(prefix)!;
	if (data.type === `ring`)
		await Deno.writeTextFile(`${prefix}.html`, GenRing(data as RingConf, prefix.split(`/`).length - 1));
}
