import { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useSetUrl } from "../../../hooks/useSetUrl";
import { usePdfData } from "../../../hooks/usePdfData";
import { generatePrepPDF } from "../../../utils/generatePDF";
import {
	ArrowForwardIcon,
	ArrowBackIcon,
	RestartIcon,
	DownloadIcon,
	PdfIcon,
	CopyIcon,
	CalendarIcon2,
	ShareIcon,
} from "../../ui/Icon/Icon";
import styles from "./Navigation.module.scss";

function Navigation({
	appRef,
}: {
	appRef: React.RefObject<HTMLDivElement>;
}) {
	const { state, dispatch } = useAppContext();
	const { getPdfData } = usePdfData();

	const scrollToApp = () => {
		window.scrollTo({
			top: appRef.current?.offsetTop ? appRef.current?.offsetTop - 150 : 0,
			behavior: "instant",
		});
	};

	const { setUrl } = useSetUrl(state);
	const [popupOpen, setPopupOpen] = useState(false);
	const [generatedUrl, setGeneratedUrl] = useState("");

	const handleOpenPopup = async () => {
		const url = await setUrl();
		setGeneratedUrl(url);
		setPopupOpen(true);
	};

	const handleCopyUrl = async () => {
		try {
			await navigator.clipboard.writeText(generatedUrl);
			setPopupOpen(false);
		} catch {
			// fallback for browsers without clipboard API
		}
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({ url: generatedUrl });
			} catch {
				// user cancelled or share not supported
			}
		}
	};

	return (
		<div className={styles.nav}>
			{state.step === 5 && (
				<>
					<div className={styles.navPdf}>
						<div className={styles.navPdfInner}>
							<PdfIcon />
							<p>
								<strong>Dein persönlicher Ratgeber</strong>
								<span>
									Lade dir deine individuelle Check- und
									Einkaufslistesowie Notfallpläne als PDF herunter.
								</span>
							</p>
						</div>
						<button
							className={`${styles.navButtonBig}`}
							onClick={() => generatePrepPDF(getPdfData())}
						>
							<span>Pdf herunterladen</span>
							<DownloadIcon />
						</button>
					</div>
					<div className={styles.navTop}>
						<button
							className={styles.navTopButton}
							title="Link speichern"
							onClick={handleOpenPopup}
						>
							<CopyIcon />
							<span>
								<strong>Link Speichern oder Teilen</strong>
								<small>Jederzeit zurückkehren und Plan anpassen.</small>
							</span>
						</button>
						<button
							className={styles.navTopButton}
							title="Link speichern"
						>
							<CalendarIcon2 />
							<span>
								<strong>Erinnere mich im Oktober 2026</strong>
								<small>Vorräte und Batterien regelmäßig prüfen.</small>
							</span>
						</button>
					</div>
				</>
			)}

			<div
				className={[
					styles.navBottom,
					state.step === 1 ? styles.centered : "",
				]
					.join(" ")
					.trim()}
			>
				{state.step !== 1 && (
					<button
						className={styles.navButton}
						title="Zurück"
						onClick={() => {
							dispatch({ type: "step_decrement" });
							requestAnimationFrame(scrollToApp);
						}}
					>
						<ArrowBackIcon />
					</button>
				)}
				{state.step !== 5 && (
					<button
						className={[
							styles.navButtonAlt,
							state.themes.length === 0 && state.step === 1
								? styles.disabled
								: "",
						]
							.join(" ")
							.trim()}
						onClick={() => {
							dispatch({ type: "step_increment" });
							requestAnimationFrame(scrollToApp);
						}}
					>
						<span>{state.step === 4 ? "zur Auswertung" : "weiter"}</span>
						<ArrowForwardIcon />
					</button>
				)}
				{state.step !== 1 && state.step !== 5 && (
					<button
						className={styles.navButton}
						title="Link speichern"
						onClick={handleOpenPopup}
					>
						<CopyIcon />
					</button>
				)}
				{state.step === 5 && (
					<button
						className={styles.navButton}
						title="Neustart: alle Inhalte werden zurück gesetzt."
						onClick={() => {
							dispatch({ type: "step_restart" });
							requestAnimationFrame(scrollToApp);
						}}
					>
						<RestartIcon />
					</button>
				)}
			</div>

			<div
				className={`${styles.popup} ${popupOpen ? styles.active : ""}`}
				onClick={() => setPopupOpen(false)}
			>
				<div
					className={styles.popupInner}
					onClick={(e) => e.stopPropagation()}
				>
					<textarea
						className={styles.popupText}
						readOnly
						value={generatedUrl}
					/>
					<div className={styles.popupBottom}>
						<button className={styles.navButtonAlt} onClick={handleCopyUrl}>
							<CopyIcon />
							<span>Link Kopieren</span>
						</button>
						<button className={styles.navButtonAlt} onClick={handleShare}>
							<ShareIcon />
							<span>Link teilen</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navigation;
