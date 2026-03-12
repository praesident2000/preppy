import { useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { CalendarIcon } from "../../ui/Icon/Icon";
import styles from "./Range.module.scss";

function Range() {
	const { state, dispatch } = useAppContext();
	const defaultValue = state.days;
	const min = 3;
	const max = 14;

	const inputRef = useRef<HTMLInputElement>(null);

	const updateFill = (val: number) => {
		const pct = ((val - min) / (max - min)) * 100;
		if (inputRef.current) {
			inputRef.current.style.setProperty("--fill", `${pct}%`);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number(e.target.value);
		dispatch({ type: "set_days", payload: val });
		updateFill(val);
	};

	const initialPct = ((defaultValue - min) / (max - min)) * 100;

	return (
		<div className={styles.range}>
			<div className={styles.rangeLabel}>
				<div>
					<CalendarIcon />
					<span>Vorratsziel</span>
				</div>
				<strong>{state.days} Tage</strong>
			</div>
			<div className={styles.rangeWrapper}>
				<input
					ref={inputRef}
					type="range"
					className={styles.rangeInput}
					min={min}
					max={max}
					value={state.days}
					onChange={handleChange}
					style={{ "--fill": `${initialPct}%` } as React.CSSProperties}
				/>
				<div>
					<span>3 Tage</span>
					<strong>10 Tage (Empfholen)</strong>
					<span>14 Tage</span>
				</div>
			</div>
		</div>
	);
}

export default Range;
