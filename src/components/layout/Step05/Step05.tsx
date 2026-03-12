import styles from "./Step05.module.scss";
import { useGears } from "../../../hooks/useGear";
import { useOptions } from "../../../hooks/useOptions";
import { useFood } from "../../../hooks/useFood";
import Accordion from "../../ui/Accordion/Accordion";
import Label from "../../ui/Label/Label";
import type { Step05Props } from "../../../types/types";
import {
	HelpIcon,
	FoodIcon,
	GearsIcon,
	GuideIcon,
	ContactIcon,
	ErrorIcon,
} from "../../ui/Icon/Icon";


function Step05({ currentStep, house, equipment, shoppingList }: Step05Props) {
	const { options, loading, error } = useOptions();

	const { food } = useFood();
	const totFood = food.reduce((sum, { items }) => sum + items.length, 0)
	const totList = Object.values(shoppingList).reduce((sum, arr) => sum + arr.length, 0)
	const percentFood = Math.floor((totList / totFood) * 100);
	const missingFoodNumber = totFood - totList;

	const missingFoodList = food.flatMap(({ category, items }) => 
		items.filter((item) => !shoppingList[category]?.includes(item.label))
	)

	const { gears } = useGears();
	const percentGears = Math.floor((equipment.length / gears.length) * 100);
	const missingGears = gears.filter(({ label }) => !equipment.includes(label));


	
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
						</div>
						{ !house.subcategory && (
							<div className={`${styles.missing} ${styles.alt}`}>
								<ErrorIcon />
								<span>Wohnsituation noch nicht angegeben - bitte Schritt 2 ausfüllen.</span>
							</div>
						)}
						<ul className={styles.list}>
							{!loading &&
								!error &&
								options
									.filter(
										({ category }) => category === house.category,
									)
									.flatMap(({ subcategories }) =>
										subcategories
											.filter(({ label }) =>
												house.subcategory?.includes(label),
											)
											.flatMap(({ results }) => results),
									)
									.map((result, index) => (
										<li key={index} className={styles.listItem}>
											{result}
										</li>
								))}
						</ul>
					</div>










					<div className={styles.section}>
						<div className={styles.sectionMain}>
							<Label value={percentFood} />
							<FoodIcon />
							<h2>Vorräte</h2>
							<span>
								<strong>{`${percentFood}%`} </strong>
								<small>Vollständig</small>
							</span>
							<div className={styles.percent}>
								<span
									className={`${styles.percentInner} ${styles.blue}`}
									style={{ width: `${percentFood}%` }}
								></span>
							</div>
							{ missingFoodNumber > 0 && (
								<div className={styles.missing}>
									<ErrorIcon />
									<span>{missingFoodNumber} Artikel { missingFoodNumber === 1 ? 'fehlen' : 'fehlt'}</span>
								</div>
							)}
						</div>
						<div className={styles.sectionBottom}>
							<Accordion label="Einkaufsliste">
								<div>
									{missingFoodList.length > 0 && (
										<ul className={styles.list}>
											{missingFoodList.map(({ label }) => {
												return (
													<li key={label} className={styles.listItem}>
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
							<Label value={percentGears} />
							<GearsIcon />
							<h2>Ausrüstung</h2>
							<span>
								<strong>{`${percentGears}%`} </strong>
								<small>Vollständig</small>
							</span>
							<div className={styles.percent}>
								<span
									className={`${styles.percentInner} ${styles.orange}`}
									style={{ width: `${percentGears}%` }}
								></span>
							</div>
						</div>
						{missingGears.length > 0 && (
							<div className={styles.sectionBottom}>
								<Accordion label="Was mir noch fehlt">
									<div>
										<ul className={styles.list}>
											{missingGears.map(({ label, icon }) => {
												return (
													<li
														key={label}
														className={styles.listItem}
													>
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
									</div>
								</Accordion>
							</div>
						)}
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
