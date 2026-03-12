import fetchGears, { type TypeGear } from "../api/fetchGears";
import { useFetch } from "./useFetch";

export function useGears() {
	return useFetch<TypeGear[]>(fetchGears, []);
}
