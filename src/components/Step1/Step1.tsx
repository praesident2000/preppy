import styles from "./Step1.module.scss";

type StepProps = {
   step1Value: string | null
   setStep1Value: React.Dispatch<React.SetStateAction<string | null>>;
}

function Step1({ step1Value, setStep1Value }: StepProps) {
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStep1Value(e.target.value);
   };

   return (
      <div className={styles.step}>
         <div className={styles.stepMain}>
            <h2 className={styles.title}>Wie viele Parteien leben in ihrem Haus?</h2>
            <div className={styles.radios}>
               <label>
                  <input
                     type="radio"
                     name="type"
                     value="single"
                     checked={step1Value === 'single'}
                     onChange={handleChange}
                  />
                  <span>Einfamilienhaus</span>
               </label>
               <label>
                  <input
                     type="radio"
                     name="type"
                     value="2-10"
                     checked={step1Value === '2-10'}
                     onChange={handleChange}
                  />
                  <span>Zwei bis zehn Wohnunge</span>
               </label>
               <label>
                  <input
                     type="radio"
                     name="type"
                     value=">10"
                     checked={step1Value === '>10'}
                     onChange={handleChange}
                  />
                  <span>Mehr als zehn Wohnungen</span>
               </label>
            </div>
         </div>
      </div>
   );
}

export default Step1;
