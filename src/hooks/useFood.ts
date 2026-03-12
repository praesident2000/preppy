import { useEffect, useState } from "react";
import fetchFood, { type TypeFood } from '../api/fetchFood'


export function useFood() {
   const [food, setFood] = useState<TypeFood[]>([])
   const [error, setError] = useState<Error | null>(null)
   const [loading, setLoading] = useState<boolean>(true)
   
   useEffect(() => {
      const load = async () => {
         try {
            const data = await fetchFood()
            setFood(data)
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

   return {food, loading, error}
}