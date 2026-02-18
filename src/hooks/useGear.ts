import { useEffect, useState } from "react";
import fetchGears, { type TypeGear } from '../api/fetchGears'


export function useGears() {
   const [gears, setGears] = useState<TypeGear[]>([])
   const [error, setError] = useState<Error | null>(null)
   const [loading, setLoading] = useState<boolean>(true)
   
   useEffect(() => {
      const load = async () => {
         try {
            const data = await fetchGears()
            setGears(data)
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

   return {gears, loading, error}
}