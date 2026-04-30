import { useThemes } from "../../../hooks/useThemes";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Step01.module.scss";
import StepHeader from "../../ui/StepHeader/StepHeader";
import Tile from "../../ui/Tile/Tile";

function Step01() {
	const { data: themes, loading, error } = useThemes();

	return (
		<div className="step">
			<StepHeader
				title="Worauf möchtest du vorbereitet sein?"
			/>
			{!loading && !error && (
				<div className={styles.themes}>
					{themes.map(({ label, title, subtitle, icon }) => {
						return (
							<Tile
								key={label}
								label={label}
								title={title}
								subtitle={subtitle}
								icon={icon}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default Step01;
