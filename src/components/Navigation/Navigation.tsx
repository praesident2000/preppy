import styles from "./Navigation.module.scss";

type NavigationProps = {
   currentStep: number;
   onPrev: () => void;
   onNext: () => void;
   setUrl: () => void;
};

function Navigation({ currentStep, onPrev, onNext, setUrl }: NavigationProps) {
   const handleUrl = () => {
      setUrl()
   }

   return (
      <div className={styles.nav}>
         <button
            className={`${styles.navButton} ${currentStep === 1 && styles.inactive}`}
            onClick={onPrev}
         >
            Zurück
         </button>
         <button
            className={`${styles.navButton} ${currentStep !== 4 && styles.inactive}`}
            onClick={handleUrl}
         >
            Link erstellen
         </button>
         <button
            className={`${styles.navButton} ${currentStep !== 4 && styles.inactive}`}
         >
            Als PDF Speichern
         </button>
         <button
            className={`${styles.navButton} ${currentStep === 4 && styles.inactive}`}
            onClick={onNext}
         >
            Weiter
         </button>
      </div>
   );
}

export default Navigation;
