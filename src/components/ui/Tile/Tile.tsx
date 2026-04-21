import { useAppContext } from "../../../context/AppContext";
import styles from "./Tile.module.scss";

interface TileProps {
	label: string;
	title: string;
	subtitle: string;
	icon: string;
}

const Tile = ({ label, title, subtitle, icon }: TileProps) => {
	const { state, dispatch } = useAppContext();

	const handleChange = (id: string) => {
		dispatch({ type: "toggle_themes", payload: id });
	};

	return (
		<label className={styles.tile}>
			<input
				type="checkbox"
				name="baby"
				checked={state.themes.includes(label)}
				onChange={() => handleChange(label)}
			/>
			<div className={styles.tileInner}>
				<span dangerouslySetInnerHTML={{ __html: icon }}></span>
				<strong>{title.toUpperCase()}</strong>
				<span>{subtitle}</span>
			</div>
		</label>
	);
};

export default Tile;
