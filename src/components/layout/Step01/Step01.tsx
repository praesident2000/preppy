import { useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useThemes } from "../../../hooks/useThemes";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Step01.module.scss";


function Step01() {
	const { state, dispatch } = useAppContext();
	const { data: themes, loading, error } = useThemes();

	useEffect(() => {
		const currentUrl = new URL(window.location.href);
		const themeParam = currentUrl.searchParams.get("thema");
		if (!themeParam && !loading && !error) {
			dispatch({ type: "set_theme", payload: themes[0].label });
		}
	}, [loading]);

	const themeIndex = themes.findIndex(({ label }) => label === state.theme);

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Worauf möchtest du vorbereitet sein?</h2>
				<span>Schritt {state.step}/5</span>
			</div>
			{!loading && !error && (
				<Swiper
					className={styles.slider}
					modules={[Navigation]}
					initialSlide={themeIndex}
					loop
					spaceBetween={50}
					slidesPerView={1}
					navigation
					onRealIndexChange={(swiper) =>
						dispatch({
							type: "set_theme",
							payload: themes[swiper.realIndex].label,
						})
					}
				>
					{themes.map(({ label, title, subtitle, icon }) => {
						return (
							<SwiperSlide key={label} className={styles.slide}>
								<div className={styles.slideWrapper}>
									<strong>{title.toUpperCase()}</strong>
									<span
										dangerouslySetInnerHTML={{ __html: icon }}
									></span>
									<span>{subtitle}</span>
								</div>
							</SwiperSlide>
						);
					})}
				</Swiper>
			)}
		</div>
	);
}

export default Step01;
