import styles from "./Step04.module.scss";
import { useGears } from "../../../hooks/useGear";

type StepProps = {
	currentStep: number;
	equipment: string[];
	setEquipment: React.Dispatch<React.SetStateAction<string[]>>;
};

function Step04({ currentStep, equipment, setEquipment }: StepProps) {
	const { gears, loading, error } = useGears();

	const handleChange = (id: string) => {
		setEquipment((prev) => {
			if (!prev.includes(id)) {
				return [...prev, id];
			} else {
				return prev.filter((p) => p !== id);
			}
		});
	};

	if (loading) return <div>...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>
					Beim Szenario Stromausfall solltest du folgende Ausrüstung bereit
					halten.
				</h2>
				<span>Schritt {currentStep}/5</span>
			</div>
			<div className="stepMain">
				<div className={styles.options}>
					<span className={styles.optionsText}>
						Welche Ausrüstung hast du bereits?
					</span>
					<div className={styles.optionsWrapper}>
						{gears.map(({ label, subtitle, icon }) => (
							<label key={label} className={styles.optionsItem}>
								<input
									type="checkbox"
									name="gear"
									value={label}
									checked={equipment.includes(label)}
									onChange={() => handleChange(label)}
								/>
								<div className={styles.optionsItemLabel}>
									<div>
										<strong>{label}</strong>
										<span>{subtitle}</span>
									</div>
									<span
										dangerouslySetInnerHTML={{ __html: icon }}
									></span>
								</div>
							</label>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Step04;
