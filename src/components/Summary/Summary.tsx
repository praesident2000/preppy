import styles from "./Summary.module.scss";

type SummaryProps = {
   summaryRef: React.RefObject<HTMLDivElement>;
   step1Value: string | null;
   days: number;
   people: number;
   step3Value: string[];
   medications: string | null;
};

function Summary({
   summaryRef,
   step1Value,
   days,
   people,
   step3Value,
   medications,
}: SummaryProps) {
   return (
      <div className={styles.summary} ref={summaryRef}>
         <ul>
            <h2>Dein Preppy</h2>
            {step1Value && <li>Wie viele Parteien leben in ihrem Haus?: <strong>{step1Value}</strong></li>}
            {days > 0 && <li>Vorräte: Wie viele Tage möchtest du vorsorgen?: <strong>{days}</strong></li>}
            {people > 0 && <li>Haushalt: Wie viele Personen?: <strong>{people}</strong></li>}
            {step3Value.length > 0 && <li>Welche Ausrüstung hast du bereits?: <strong>{step3Value.join(", ")}</strong></li>}
            {medications && <li>Medikamente: <strong>{medications}</strong></li>}
         </ul>
      </div>
   );
}

export default Summary;
