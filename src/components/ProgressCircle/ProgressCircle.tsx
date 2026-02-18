import styles from "./ProgressCircle.module.scss";

type TypeProgress = {
   progress: number;
};

function ProgressCircle({ progress }: TypeProgress) {
   return (
      <div className={styles.progressCircle} style={{background: `conic-gradient(#fff ${progress}%, rgba(255, 255, 255, 0.05) 0)`}}>
         <div className={styles.progressInner}>{progress}%</div>
      </div>
   );
}

export default ProgressCircle;
