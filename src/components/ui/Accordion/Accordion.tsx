import { useState, useRef, useEffect } from "react";
import styles from "./Accordion.module.scss";
import { InfoIcon } from "../Icon/Icon";

type AccordionProps = {
	label: string;
	sublabel1?: string;
	sublabel2?: string;
	children: React.ReactNode;
	big?: boolean;
	icon?: string;
	startOpen?: boolean;
	colorOpen?: boolean;
	percent?: number;
};

function Accordion({
	label,
	sublabel1,
	sublabel2,
	children,
	big,
	icon,
	startOpen,
	colorOpen,
	percent,
}: AccordionProps) {
	const [isOpen, setIsOpen] = useState(startOpen);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState<number | undefined>(
		startOpen ? undefined : 0,
	);

	useEffect(() => {
		if (!contentRef.current) return;
		if (isOpen) {
			setContentHeight(contentRef.current.scrollHeight);
		} else {
			setContentHeight(0);
		}
	}, [isOpen]);

	return (
		<div
			className={`${styles.accordion} ${isOpen ? styles.open : ""} ${big ? styles.big : ""} ${colorOpen ? styles.color : ""}`}
		>
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
						<div className={styles.accordionButtonLabelInner}>
							<strong>{label}</strong>
							<small>{sublabel1}</small>
							<small>{sublabel2}</small>
							{!!percent && percent > 0 && (
								<div className={styles.percent}>
									<span
										className={`${styles.percentInner} ${styles.blue}`}
										style={{ width: `${percent}%` }}
									></span>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className={styles.accordionButtonLabel}>
						<InfoIcon />
						<span>{label}</span>
					</div>
				)}
			</button>
			<div
				ref={contentRef}
				className={styles.accordionContent}
				style={{ maxHeight: contentHeight }}
			>
				{children}
			</div>
		</div>
	);
}

export default Accordion;
