interface File {
	type: string
	title: string
}

const registry: Record<string, File> = {};

export function RegisterFile(name: string, contents: File) {
	registry[name] = contents;
}

export function GetFile<T = File>(name: string): T | null {
	return registry[name] as unknown as T ?? null;
}
