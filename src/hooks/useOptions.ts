import fetchOptions, { type TypeOption } from "../api/fetchOptions";
import { useFetch } from "./useFetch";

export function useOptions() {
   return useFetch<TypeOption[]>(fetchOptions, []);
}
