import type { TypeFood } from "./fetchFood";
import type { TypeThemes } from "./fetchThemes";
import type { TypeOption } from "./fetchOptions";
import type { TypeGear } from "./fetchGears";

type Config = {
	themes: TypeThemes[];
	options: TypeOption[];
	food: TypeFood[];
	gears: TypeGear[];
};

let cache: Promise<Config> | null = null;
let CONFIG_URL: string = "/config.json";
// let CONFIG_URL: string = "https://www.diakonie-katastrophenhilfe.de/fileadmin/Mediapool/testdateien/preppy-test/config.json";

export default function fetchConfig(): Promise<Config> {
	if (!cache) {
		cache = fetch(CONFIG_URL).then((res) => {
			if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
			return res.json();
		});
	}
	return cache;
}
