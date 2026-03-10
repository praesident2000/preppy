import styles from "./Step05.module.scss";
import { useGears } from "../../../hooks/useGear";
import { useOptions } from "../../../hooks/useOptions";
import Accordion from "../../ui/Accordion/Accordion";
import type { House } from "../../../types/types";
import {
	HelpIcon,
	FoodIcon,
	GearsIcon,
	GuideIcon,
	ContactIcon,
} from "../../ui/Icon/Icon";

type StepProps = {
	currentStep: number;
	house: House;
	equipment: string[];
};

function Step05({ currentStep, house, equipment }: StepProps) {
	const { options, loading, error } = useOptions();
	const { gears } = useGears();
	const percent = Math.floor((equipment.length / gears.length) * 100);
	const missing = gears.filter(({ label }) => !equipment.includes(label));

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Übersicht und Auswertung</h2>
				<span>Schritt {currentStep}/5</span>
			</div>

			<div className="stepMain">
				<div className={styles.sections}>
					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<HelpIcon />
							<h2>Tipps für deine Wohnsituation</h2>
							<ul className={styles.list}>
								{!loading && !error && (
									options
									.filter(({ category }) => category === house.category)
									.flatMap(({ subcategories }) => subcategories
										.filter(({ label }) => house.subcategory?.includes(label))
										.flatMap(({ results }) => results),
									)
									.map((result, index) => (
										<li key={index} className={styles.listItem}>{result}</li>
									))
								)}
							</ul>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<FoodIcon />
							<h2>Vorräte</h2>
							<span>
								<strong>{`${percent}%`} </strong>
								<small>Vollständig</small>
							</span>
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Einkaufsliste">
								<div>
									{missing.length > 0 && (
										<ul className={styles.list}>
											{missing.map(({ label, icon }) => {
												return (
													<li key={label} className={styles.listItem}>
														<span
															dangerouslySetInnerHTML={{
																__html: icon,
															}}
														></span>
														<span>{label}</span>
													</li>
												);
											})}
										</ul>
									)}
								</div>
							</Accordion>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<GearsIcon />
							<h2>Ausrüstung</h2>
							<span>
								<strong>{`${percent}%`} </strong>
								<small>Vollständig</small>
							</span>
							<div className={styles.percent}>
								<span
									className={`${styles.percentInner} ${styles.orange}`}
									style={{ width: `${percent}%` }}
								></span>
							</div>
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Was mir noch fehlt">
								<div>
									{missing.length > 0 && (
										<ul className={styles.list}>
											{missing.map(({ label, icon }) => {
												return (
													<li key={label} className={styles.listItem}>
														<span
															dangerouslySetInnerHTML={{
																__html: icon,
															}}
														></span>
														<span>{label}</span>
													</li>
												);
											})}
										</ul>
									)}
								</div>
							</Accordion>
						</div>
					</div>
				</div>

				<div className={styles.links}>
					<a href="" target="_blank" className={styles.linksItem}>
						<GuideIcon />
						<span>Stromausfall-Guide</span>
					</a>
					<a href="" target="_blank" className={styles.linksItem}>
						<ContactIcon />
						<span>Stromausfall-Guide</span>
					</a>
				</div>
			</div>
		</div>
	);
}

export default Step05;
