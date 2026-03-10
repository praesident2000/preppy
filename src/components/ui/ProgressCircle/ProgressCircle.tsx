import styles from "./ProgressCircle.module.scss";

type ProgressProps = {
   progress: number;
};

function ProgressCircle({ progress }: ProgressProps) {
   return (
      <div className={styles.progressCircle} style={{background: `conic-gradient(#000 ${progress}%, rgba(0, 0, 0, 0.05) 0)`}}>
         <div className={styles.progressInner}>{progress}%</div>
      </div>
   );
}

export default ProgressCircle;
