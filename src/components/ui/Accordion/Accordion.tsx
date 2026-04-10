import { useState } from "react";
import styles from "./Accordion.module.scss";

type AccordionProps = {
	label: string;
	sublabel1?: string;
	sublabel2?: string;
	children: React.ReactNode;
	big?: boolean;
	icon?: string;
	startOpen?: boolean;
};

function Accordion({
	label,
	sublabel1,
	sublabel2,
	children,
	big,
	icon,
	startOpen,
}: AccordionProps) {
	const [isOpen, setIsOpen] = useState(startOpen);

	return (
		<div className={`${styles.accordion} ${isOpen ? styles.open : ""} ${big ? styles.big : ""}`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={styles.accordionButton}
			>
				{big ? (
					<div className={styles.accordionButtonLabel}>
						<span
							dangerouslySetInnerHTML={{
								__html: icon ?? "",
							}}
						></span>
						<span>
							<strong>{label}</strong>
							<small>{sublabel1}</small>
							<small>{sublabel2}</small>
						</span>
					</div>
				) : (
					<span className={styles.accordionButtonLabel}>{label}</span>
				)}
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
