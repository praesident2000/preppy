import { useEffect, useState } from "react";

export function useFetch<T>(fetcher: () => Promise<T>, initial: T) {
	const [data, setData] = useState<T>(initial);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				setData(await fetcher());
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Unknown error"));
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	return { data, loading, error };
}
