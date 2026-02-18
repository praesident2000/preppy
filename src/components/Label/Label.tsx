import styles from "../../components/Label/Label.module.scss";

function Label({ currentStep }: { currentStep: number }) {
   return (
      <div className={styles.stepsLabel}>
         <span>Step: {currentStep}/4</span>
      </div>
   );
}

export default Label;
