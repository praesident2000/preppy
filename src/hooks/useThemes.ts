import { useEffect, useState } from "react";
import fetchThemes, { type TypeThemes } from '../api/fetchThemes'


export function useThemes() {
   const [themes, setThemes] = useState<TypeThemes[]>([])
   const [error, setError] = useState<Error | null>(null)
   const [loading, setLoading] = useState<boolean>(true)
   
   useEffect(() => {
      const load = async () => {
         try {
            const data = await fetchThemes()
            setThemes(data)
         } catch (err) {
            if (err instanceof Error) {
               setError(err)
            } else {
               setError(new Error('unknow error'))
            }
         } finally {
            setLoading(false)
         }
      }

      load()
   }, [])

   return {themes, loading, error}
}