import styles from "./Summary.module.scss";

type SummaryProps = {
   summaryRef: React.RefObject<HTMLDivElement>;
   house: string | null;
   days: number;
   // people: number;
   // equipment: string[];
};

function Summary({
   summaryRef,
   house,
   days,
   // people,
   // equipment,
}: SummaryProps) {
   return (
      <div className={styles.summary} ref={summaryRef}>
         <ul>
            <h2>Dein Preppy</h2>
            {house && <li>Wie viele Parteien leben in ihrem Haus?: <strong>{house}</strong></li>}
            {days > 0 && <li>Vorräte: Wie viele Tage möchtest du vorsorgen?: <strong>{days}</strong></li>}
            {/* {people > 0 && <li>Haushalt: Wie viele Personen?: <strong>{people}</strong></li>} */}
         </ul>
      </div>
   );
}

export default Summary;
