import { Navigation } from "swiper/modules";
import { useThemes } from "../../../hooks/useThemes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./Step01.module.scss";
import { useEffect } from "react";

type StepProps = {
	currentStep: number;
	theme: string;
	setTheme: React.Dispatch<React.SetStateAction<string>>;
};

function Step01({ currentStep, theme, setTheme }: StepProps) {
	const { themes, loading, error } = useThemes();

	useEffect(() => {
		const currentUrl = new URL(window.location.href);
		const themeParam = currentUrl.searchParams.get("thema");
		if (!themeParam && !loading && !error) {
			setTheme(themes[0].label);
		}
	}, [loading]);

	if (loading) return <div>...</div>;
	if (error) return <div>Error: {error.message}</div>;

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
