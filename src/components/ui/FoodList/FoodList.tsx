import { useState } from "react";
import { useFood } from "../../../hooks/useFood";
import Accordion from "../Accordion/Accordion";
import Switcher from "../Switcher/Switcher";
import styles from "../FoodList/FoodList.module.scss";
import type { FoodProps, ShoppingList } from "../../../types/types";

function foodList({ people, days, shoppingList, setShoppingList }: FoodProps) {
	const { food, loading, error } = useFood();
	const [showQuantity, setShowQuantity] = useState<boolean>(false);

	function handleChange(category: keyof ShoppingList, element: string) {
		setShoppingList((prev) => {
			const current = prev[category] ?? []
			const exists = current.includes(element)

			return {
				...prev,
				[category]: exists
				? current.filter((item: string) => item !== element)
				: [...current, element]
			}
		})
	}

	return (
		<div className={styles.foodList}>
			<div className={styles.foodHeader}>
				<h2>Benötigte Vorräte. Welche davon hast du bereits?</h2>
				<p>
					Für deinen {people.length}-Personen-Haushalt, um {days} Tage zu
					überbrücken (Quelle:{" "}
					<a
						href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratskalkulator"
						target="_blank"
					>
						<u>BKK</u>
					</a>
					)
				</p>
				<Switcher
					switcher={() => setShowQuantity(!showQuantity)}
					label1="Menge/Gewicht"
					label2="Packungseinheiten"
				/>
			</div>
			{!loading && !error && (
				<div className={styles.foodListWrapper}>
					{food.map(({ category, label, items, icon }) => (
						<div key={category} className={styles.foodSection}>
							<Accordion
								label={label}
								sublabel={`${shoppingList[category].length} von ${items.length} Artikeln gesammelt`}
								icon={icon}
								big={true}
							>
								<div className={styles.checkboxes}>
									{items.map(
										({
											label,
											unit,
											perPersonPerDay,
											packSize,
											packLabelPlural,
											packLabelSingular,
										}) => {
											const total =
												perPersonPerDay * people.length * days;
											const totalPacks = Math.ceil(
												total / Number(packSize),
											);

											return (
												<label
													className={styles.checkbox}
													key={label}
												>
													<input
														type="checkbox"
														name={`foodCategory-${category}`}
														value={label}
														checked={shoppingList[category].includes(
															label,
														)}
														onChange={() =>
															handleChange(category, label)
														}
													/>
													<span>
														<strong>{label}</strong>
														<small>
															{showQuantity
																? `(${packSize}${unit}/${packLabelSingular}) ${totalPacks} ${totalPacks > 1 ? packLabelPlural : packLabelSingular}`
																: `${total}${unit}`}
														</small>
													</span>
												</label>
											);
										},
									)}
								</div>
							</Accordion>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default foodList;
