import { useState, useEffect } from "react";
import { useFood } from "../../../hooks/useFood";
import styles from "../FoodList/FoodList.module.scss";

type FoodProps = {
	people: string[];
	days: number;
};

function foodList({ people, days }: FoodProps) {
	const { food, loading, error } = useFood();
	const [showQuantity, setShowQuantity] = useState<boolean>(false);
	const [showList, setShowList] = useState<boolean>(false);

	if (loading) return <div>...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className={styles.foodList}>
			<div className={styles.foodHeader}>
				<h2>Einkaufsliste</h2>
				<label className={styles.switcher}>
					<span>Menge</span>
					<input
						type="checkbox"
						onClick={() => setShowQuantity(!showQuantity)}
					/>
					<span>Packung</span>
				</label>
				<p>
					Für deinen {people.length}-Personen-Haushalt, um {days} Tage zu
					überbrücken (Quelle:{" "}
					<a
						href="https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratskalkulator"
						target="_blank"
					>
						BKK
					</a>
					)
				</p>
			</div>

			<div
				className={`${styles.foodListWrapper} ${showList ? styles.show : ""}`}
			>
				{food &&
					Object.entries(food).map(([key, category]) => {
						const totalCategory =
							category.totPerPersonPerDay * people.length * days;
						return (
							<ul key={key} className={styles.foodCategory}>
								<h3>
									{totalCategory} {category.unit} {category.label}
								</h3>
								{category.items.map(
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
											<li key={label}>
												<span>
													{label}
													{showQuantity && (
														<>
															&nbsp;
															<small>
																({packSize}
																{unit}/{packLabelSingular})
															</small>
														</>
													)}
												</span>
												{showQuantity ? (
													<strong>{`${totalPacks} ${totalPacks > 1 ? packLabelPlural : packLabelSingular}`}</strong>
												) : (
													<strong>{`${total} ${unit}`}</strong>
												)}
											</li>
										);
									},
								)}
							</ul>
						);
					})}
			</div>
			<button className={styles.more} onClick={() => setShowList(!showList)}>
				{showList ? "Weniger" : "Mehr"} anzeigen
			</button>
		</div>
	);
}

export default foodList;
