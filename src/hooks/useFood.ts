import fetchFood, { type TypeFood } from "../api/fetchFood";
import { useFetch } from "./useFetch";

export function useFood() {
	return useFetch<TypeFood[]>(fetchFood, []);
}
