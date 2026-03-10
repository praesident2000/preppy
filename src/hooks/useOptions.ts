import { useEffect, useState } from "react";
import fetchOptions, { type TypeStep } from '../api/fetchOptions'


export function useOptions() {
   const [options, setOptions] = useState<TypeStep[]>([])
   const [error, setError] = useState<Error | null>(null)
   const [loading, setLoading] = useState<boolean>(true)
   
   useEffect(() => {
      const load = async () => {
         try {
            const data = await fetchOptions()
            setOptions(data)
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

   return {options, loading, error}
}