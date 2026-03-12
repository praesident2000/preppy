import fetchThemes, { type TypeThemes } from '../api/fetchThemes';
import { useFetch } from './useFetch';

export function useThemes() {
  return useFetch<TypeThemes[]>(fetchThemes, []);
}
