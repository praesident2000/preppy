import styles from "./Step02.module.scss";
import { useOptions } from "../../../hooks/useOptions";
import type { Step02Props } from "../../../types/types"


function Step02({ currentStep, house, setHouse }: Step02Props) {
	const { options, loading, error } = useOptions();

	const handleMainInput = (category: string) => {
		setHouse((prev) => ({
			...prev,
			category,
			subcategory: undefined,
		}));
	};

	const handleSubInput = (label: string) => {
		setHouse((prev) => ({
			...prev,
			subcategory: prev.subcategory?.includes(label)
				? prev.subcategory.filter((item) => item !== label)
				: [...(prev.subcategory ?? []), label],
		}));
	};

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Wie ist deine Wohnsituation?</h2>
				<span>Schritt {currentStep}/5</span>
			</div>
			{!loading && !error && (
				<div className="stepMain">
					<div className={styles.radios}>
						{options.map(({ category, icon, subcategories }) => {
							const isActive = house.category === category;

							return (
								<label
									className={`${styles.radiosItem} ${isActive ? styles.active : ""}`}
									key={category}
								>
									<input
										className={styles.radioMain}
										type="radio"
										name="housingCategory"
										value={category}
										checked={house.category === category}
										onChange={() => handleMainInput(category)}
									/>
									<div className={styles.radioButton}>
										<span
											dangerouslySetInnerHTML={{
												__html: icon,
											}}
										></span>
										<span>{category}</span>
									</div>

									{isActive && subcategories?.length > 0 && (
										<div
											className={styles.radioSub}
											role="group"
											aria-label={`${category} details`}
										>
											{subcategories.map(({ label }) => (
												<label
													className={styles.radioSubItem}
													key={label}
												>
													<input
														type="checkbox"
														name={`housingSubcategory-${category}`}
														value={label}
														checked={house.subcategory?.includes(
															label,
														)}
														onChange={() => handleSubInput(label)}
													/>
													<span>{label}</span>
												</label>
											))}
										</div>
									)}
								</label>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

export default Step02;
