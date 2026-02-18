import styles from "./Step4.module.scss";
import { useGears } from "../../hooks/useGear";
import ProgressCircle from '../../components/ProgressCircle/ProgressCircle'

type StepProps = {
   step3Value: string[]
};

function Step4({ step3Value }: StepProps) {
   const { gears } = useGears();
   const percent = Math.floor((step3Value.length / gears.length) * 100)
   const missing = gears.filter(({id}) => !step3Value.includes(id))
   console.log('missing', missing)

   return (
      <div className={styles.step}>
         <div className={styles.stepColumns}>
            <div>
               <div className={styles.title}>
                  <h2>Ausrüstungscore</h2>
                  <small>Du hast <strong>{step3Value.length}</strong> von {gears.length} Punkten.</small>
               </div>
               <ProgressCircle progress={percent}/>
            </div>
            <div>
               {missing.length > 0 
                  ? (
                     <ul className={styles.missingItems}>
                        <h3>Dir fehlen noch:</h3>
                        {missing.map(({id, label}) => {
                           return <li key={id}>{label}</li>
                        })}
                     </ul>
                  ) : (
                     <h3>Du hast alles vorbereitet!</h3>
                  )}
            </div>
         </div>
      </div>
   );
}

export default Step4;
