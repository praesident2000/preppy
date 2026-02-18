import { useState } from "react";
import { useFood } from "../../hooks/useFood";
import styles from "../Step2/Step2.module.scss";

type StepProps = {
   days: number
   setDays: React.Dispatch<React.SetStateAction<number>>
   people: number
   setPeople: React.Dispatch<React.SetStateAction<number>>
}

function Step2({days, setDays, people, setPeople}: StepProps) {
   const { food, loading, error } = useFood();
   const [showQuantity, setShowQuantity] = useState<boolean>(false);
   const [showList, setShowList] = useState<boolean>(false);

   const decrement = () => {
      if (people > 1) {
         setPeople((prev) => prev - 1);
      }
   };
   const increment = () => {
      if (people < 10) {
         setPeople((prev) => prev + 1);
      }
   };
   const handleType = () => {
      setShowQuantity(!showQuantity);
   };
   const handleDays = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDays(Number(e.target.value))
   }

   if (loading) return <div>...</div>;
   if (error) return <div>Error: {error.message}</div>;

   return (
      <div className={styles.step}>
         <div className={styles.stepMain}>
            <h2>Vorräte: Wie viele Tage möchtest du vorsorgen?</h2>
            <div>
               <p>Vorräte: {days} Tage</p>
               <input type="range" min={1} max={15} defaultValue={days} onChange={handleDays} />
            </div>
            <div>
               <p>Haushalt: Wie viele Personen?</p>
               <div className={styles.peopleInput}>
                  <button
                     onClick={decrement}
                     className={`${styles.button} ${people === 1 ? styles.inactive : ''}`}
                  >-</button>
                  <span>{people}</span>
                  <button
                     onClick={increment}
                     className={`${styles.button} ${people === 10 ? styles.inactive : ''}`}
                  >+</button>
               </div>
            </div>
            <div className={styles.foodContainer}>
               <div>
                  <div className={styles.foodHeader}>
                     <h2>Lebensmittelliste</h2>
                     <label className={styles.switcher}>
                        <span>Menge</span>
                        <input type="checkbox" onClick={handleType} />
                        <span>Packung</span>
                     </label>
                  </div>
                  <p>Für Ihren {people}-Personen-Haushalt, um {days} Tage zu überbrücken (Quelle: <a href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratskalkulator" target="_blank">BKK</a>)</p>
               </div>

               <div className={`${styles.foodList} ${showList ? styles.show : ''}`}>
                  {food && 
                     Object.entries(food).map(([key, category]) => {
                        const totalCategory = category.totPerPersonPerDay * people * days
                        return (
                           <ul key={key} className={styles.foodCategory}>
                              <h3>{totalCategory} {category.unit} {category.label}</h3>
                              {category.items.map(
                                 ({
                                    label,
                                    unit,
                                    perPersonPerDay,
                                    packSize,
                                    packLabelPlural,
                                    packLabelSingular,
                                 }) => {
                                    const total = perPersonPerDay * people * days
                                    const totalPacks = Math.ceil(total / Number(packSize))

                                    return (
                                       <li key={label}>
                                          <span>{label}{showQuantity && (<>&nbsp;<small>({packSize}{unit}/{packLabelSingular})</small></>)}</span>
                                          {showQuantity 
                                             ? <strong>{`${totalPacks} ${totalPacks > 1 ? packLabelPlural : packLabelSingular}`}</strong> 
                                             : <strong>{`${total} ${unit}`}</strong> 
                                          }
                                       </li>
                                    )
                                 },
                              )}
                           </ul>
                        )
                     }
                  )}
               </div>
               <button className={styles.more} onClick={() => setShowList(!showList)}>{showList ? "Weniger" : "Mehr"} anzeigen</button>
            </div>
         </div>
      </div>
   );
}

export default Step2;
