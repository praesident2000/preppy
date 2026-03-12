import { useAppContext } from "../../../context/AppContext";
import Toggle from "../Toggle/Toggle";
import { PersonIcon, PersonPlusIcon, TrashIcon } from "../../ui/Icon/Icon";
import styles from "./People.module.scss";

function People() {
	const { state, dispatch } = useAppContext();

	const addPerson = () => {
		dispatch({ type: "set_people", payload: [...state.people, "omnivore"] });
	};

	const removePerson = (index: number) => {
		dispatch({
			type: "set_people",
			payload: state.people.filter((_: string, i: number) => index !== i),
		});
	};

	return (
		<div className={styles.people}>
			<ul className={styles.peopleList}>
				{state.people.map((person: string, index: number) => {
					return (
						<li key={index} className={styles.peopleItem}>
							<div className={styles.peopleItemHeader}>
								<div>
									<PersonIcon />
									<strong>{`Person ${index + 1}`}</strong>
								</div>
								{index > 0 && (
									<button
										className={styles.peopleRemove}
										onClick={() => removePerson(index)}
									>
										<TrashIcon />
									</button>
								)}
							</div>
							<div className={styles.peopleItemOptions}>
								<Toggle
									person={person}
									people={state.people}
									index={index}
									dispatch={dispatch}
								/>
							</div>
						</li>
					);
				})}
			</ul>
			<button className={styles.peopleMore} onClick={addPerson}>
				<PersonPlusIcon />
				<span>Person hinzufügen</span>
			</button>
		</div>
	);
}

export default People;
