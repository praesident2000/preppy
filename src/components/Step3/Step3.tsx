import styles from "./Step3.module.scss";
import { useGears } from "../../hooks/useGear";

type StepProps = {
   step3Value: string[]
   setStep3Value: React.Dispatch<React.SetStateAction<string[]>>
   extra: boolean
   setExtra: React.Dispatch<React.SetStateAction<boolean>>
   medications: string | null
   setMedications: React.Dispatch<React.SetStateAction<string | null>>
}

function Step3({step3Value, setStep3Value, extra, setExtra, medications, setMedications}: StepProps) {
   const { gears, loading, error } = useGears();

   const handleChange = (id: string) => {
      setStep3Value((prev) => {
         if (!prev.includes(id)) {
            return [...prev, id];
         } else {
            return prev.filter((p) => p !== id);
         }
      });
   };

   const handleExtra = () => {
      setExtra(!extra)
   }
   const handleMedication = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMedications(e.target.value)
   }

   if (loading) return <div>...</div>;
   if (error) return <div>Error: {error.message}</div>;
   
   return (
      <div className={styles.step}>
         <div className={styles.stepMain}>
            <h2>
               Beim Szenario Hochwasser solltest du folgende Ausrüstung bereit
               halten.
            </h2>
            <p>Welche davon hast du bereits?</p>
            <div className={styles.options}>
               {gears.map(({ id, label }) => (
                  <label key={id}>
                     <input
                        type="checkbox"
                        name="gear"
                        value={id}
                        checked={step3Value.includes(id)}
                        onChange={() => handleChange(id)}
                     />
                     <span>{label}</span>
                  </label>
               ))}
            </div>
            <div className={styles.extra}>
               <label className={styles.switcher}>
                  <input
                     type="checkbox"
                     name="gear"
                     checked={extra}
                     onChange={handleExtra}
                  />
                  <span>Medikamente</span>
               </label>
               {extra && (
                  <input 
                     className={styles.medicationInput}
                     type="text"
                     value={medications || ""}
                     onChange={handleMedication}
                     placeholder="Welche Medikamente brauchst du?"
                  />
               )}
            </div>
         </div>
      </div>
   );
}

export default Step3;
