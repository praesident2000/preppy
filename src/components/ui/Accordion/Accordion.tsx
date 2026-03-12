import { useState } from "react";
import styles from "./Accordion.module.scss";

type AccordionProps = {
	label: string;
	sublabel?: string;
	children: React.ReactNode;
	big?: boolean;
	icon?: string;
};

function Accordion({
	label,
	sublabel,
	children,
	big,
	icon,
}: AccordionProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={styles.accordion}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`${styles.accordionButton} ${isOpen ? styles.open : ""} ${big ? styles.big : ""}`}
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
							<small>{sublabel}</small>
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
