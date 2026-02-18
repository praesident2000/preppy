import styles from "./Navigation.module.scss";

type NavigationProps = {
   currentStep: number;
   onPrev: () => void;
   onNext: () => void;
   setUrl: () => void;
   summaryRef: React.RefObject<HTMLElement>;
};

function Navigation({
   currentStep,
   onPrev,
   onNext,
   setUrl,
   summaryRef,
}: NavigationProps) {
   const handleUrl = () => {
      setUrl();
   };

   const printSummary = () => {
      const element = summaryRef.current;
      if (!element) return

  const printWindow = window.open("", "_blank", "width=900,height=700")
  if (!printWindow) return

  // Collect styles from current document
  const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map(node => node.outerHTML)
    .join("")

  printWindow.document.write(`
    <html>
      <head>
        <title>Preppy Summary</title>
        ${styles}
        <style>
          @page { margin: 15mm; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
   };

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
            onClick={printSummary}
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
