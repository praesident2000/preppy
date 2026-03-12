import { useEffect } from "react";
import { Navigation } from "swiper/modules";
import { useThemes } from "../../../hooks/useThemes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Step01.module.scss";
import type { Step01Props } from "../../../types/types"


function Step01({ currentStep, theme, setTheme }: Step01Props) {
	const { themes, loading, error } = useThemes();

	useEffect(() => {
		const currentUrl = new URL(window.location.href);
		const themeParam = currentUrl.searchParams.get("thema");
		if (!themeParam && !loading && !error) {
			setTheme(themes[0].label);
		}
	}, [loading]);

	const themeIndex = themes.findIndex(({ label }) => label === theme);

	return (
		<div className="step">
			<div className="stepHeader">
				<h2>Worauf möchtest du vorbereitet sein?</h2>
				<span>Schritt {currentStep}/5</span>
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
						setTheme(themes[swiper.realIndex].label)
					}
				>
					{themes.map(({ label, title, subtitle, icon }) => {
						return (
							<SwiperSlide key={label} className={styles.slide}>
								<div className={styles.slideWrapper}>
									<strong>{title.toUpperCase()}</strong>
									<span dangerouslySetInnerHTML={{ __html: icon }}></span>
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
