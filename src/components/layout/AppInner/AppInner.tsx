import { useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useUrlParams } from "../../../hooks/useUrlParams";
import Step01 from "../Step01/Step01";
import Step02 from "../Step02/Step02";
import Step03 from "../Step03/Step03";
import Step04 from "../Step04/Step04";
import Step05 from "../Step05/Step05";
import Navigation from "../Navigation/Navigation";
import Summary from "../Summary/Summary";
import styles from "./AppInner.module.scss";

function AppInner() {
	const { state, dispatch } = useAppContext();

	const summaryRef = useRef<HTMLDivElement>(null!);
	const appRef = useRef<HTMLDivElement>(null!);

	useUrlParams(dispatch);

	return (
		<div ref={appRef} className={styles.app}>
			<div className={styles.wrapper}>
				{state.step === 1 && <Step01 />}
				{state.step === 2 && <Step02 />}
				{state.step === 3 && <Step03 />}
				{state.step === 4 && <Step04 />}
				{state.step === 5 && <Step05 />}
				<Navigation summaryRef={summaryRef} appRef={appRef} />
				<Summary summaryRef={summaryRef} />
			</div>
		</div>
	);
}

export default AppInner;
