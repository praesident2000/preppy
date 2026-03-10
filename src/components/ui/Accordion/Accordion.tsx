import { useState } from "react";
import styles from "./Accordion.module.scss";

type AccordionProps = {
	label: string;
	children: React.ReactNode;
};

function Accordion({ label, children }: AccordionProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={styles.accordion}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`${styles.accordionButton} ${isOpen ? styles.open : ""}`}
			>
				<span>{label}</span>
				<svg
					width="12"
					height="7"
					viewBox="0 0 12 7"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9.46875 0.28125L5.57812 4.17188L1.6875 0.28125C1.3125 -0.09375 0.65625 -0.09375 0.28125 0.28125C-0.09375 0.703125 -0.09375 1.3125 0.28125 1.6875L4.875 6.28125C5.25 6.70312 5.90625 6.70312 6.28125 6.28125L10.875 1.6875C11.25 1.3125 11.25 0.703125 10.875 0.28125C10.5 -0.09375 9.84375 -0.09375 9.46875 0.28125Z"
						fill="#94A3B8"
					/>
				</svg>
			</button>
			<div
				className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
			>
				{children}
			</div>
		</div>
	);
}

export default Accordion;
