import { Button } from "@packages/ui";
import classNames from "classnames";
import { useMemo, useRef, useState } from "react";

import type {
	WagonSelectionInterface,
	WagonSelectionItemInterface,
} from "../../../domain/types/wagon-selection";
import { Form } from "../form";

import "./index.scss";

const BASENAME = import.meta.env.PROD ? "/app/WAG12" : "";

/**
 * Props : prend la sélection complète des wagons.
 */
type WagonSelectProps = {
	wagons?: WagonSelectionInterface["selection"];
};

/**
 * Normalisation texte pour comparaison insensible à la casse / espaces.
 */
const normalizeText = (text: string): string =>
	text
		.normalize("NFKD")
		.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-")
		.replace(/\s+/g, "")
		.toLowerCase();

/**
 * Met en surbrillance la recherche utilisateur dans le texte.
 */
const highlightMatch = (text: string, query: string) => {
	if (!query) return <span className="value">{text}</span>;

	const rawText = text.toString();
	const normalizedQuery = normalizeText(query);
	if (!normalizedQuery) return <span className="value">{rawText}</span>;

	const escapeRegExp = (str: string) =>
		str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	const regexQuery = normalizedQuery
		.split("")
		.map((char) => escapeRegExp(char))
		.join("[\\s\\-–—]*");

	const regex = new RegExp(regexQuery, "gi");

	let lastIndex = 0;
	const matches = [...rawText.matchAll(regex)];
	if (matches.length === 0)
		return <span className="value">{rawText}</span>;

	const result: React.ReactNode[] = [];

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const start = match.index ?? 0;
		const end = start + match[0].length;

		result.push(rawText.slice(lastIndex, start));
		result.push(
			<span key={String(i)} className="highlight">
				{rawText.slice(start, end)}
			</span>,
		);
		lastIndex = end;
	}

	result.push(rawText.slice(lastIndex));
	return <span className="value">{result}</span>;
};

/**
 * 🧩 Composant principal : sélection de wagon (simplifié : filtre/affiche MACNUM)
 */
const WagonSelect: React.FC<WagonSelectProps> = ({ wagons }) => {
	const location = window.location;
	const navigate = (
		newPath: string,
		options?: { replace?: boolean },
	) => {
		if (options?.replace) {
			window.history.replaceState({}, "", newPath);
		} else {
			window.history.pushState({}, "", newPath);
		}
	};

	const [filters, setFilters] = useState<Record<string, string>>({});
	const [showAllList, setShowAllList] = useState(false);

	const folderRef = useRef<string | null>(null);
	const macnumRef = useRef<string | null>(null);
	const [error, setError] = useState("");

	const urlParts = location.pathname.split("/").filter(Boolean);
	const basePathIndex = import.meta.env.DEV ? 0 : 1;

	const hasAppSegment = !!urlParts[basePathIndex];
	const isEmpty = !wagons || wagons.length === 0;

	// Seule colonne filtrable : MACNUM
	const columns = ["MACNUM"] as const;

	const filteredWagons = useMemo(() => {
		return wagons?.filter((wagon) =>
			(
				Object.entries(filters) as [
					keyof WagonSelectionItemInterface,
					string,
				][]
			).every(([key, value]) => {
				const normalizedFilter = normalizeText(value);
				const wagonValue = normalizeText(wagon[key]?.toString() ?? "");
				return wagonValue.includes(normalizedFilter);
			}),
		);
	}, [wagons, filters]);

	const handleFilterChange = (alias: string, value?: string) => {
		setFilters((prev) => {
			const newFilters = { ...prev };
			if (value) newFilters[alias] = value;
			else delete newFilters[alias];
			return newFilters;
		});
	};

	const handleManualSubmit = () => {
		setError("");

		const folder = folderRef.current?.trim();
		const macNum = macnumRef.current?.trim();
		const finalFolder = folder || urlParts[basePathIndex];

		if (!finalFolder) {
			setError("Le champ 'App Segment' est requis.");
			return;
		}

		if (!macNum) {
			setError("Le champ 'Wagon Number' est requis.");
			return;
		}

		const safeFolder = encodeURIComponent(finalFolder);
		const safeMac = encodeURIComponent(macNum);
		const newPath = `${BASENAME}/${safeFolder}/${safeMac}${location.search}`;

		navigate(newPath, { replace: true });
		window.location.href = newPath;
	};

	/**
	 * Rendu d’un wagon sous forme de carte cliquable (affiche uniquement MACNUM)
	 */
	const renderWagon = (wagon: WagonSelectionItemInterface) => {
		const link = `${window.location.pathname.replace(/\/$/, "")}/${wagon.MACNUM}`;
		const macnum = wagon.MACNUM ?? "—";

		return (
			<li key={wagon.uuid} className={classNames("item", "card")}>
				<a href={link}>
					<div className="wagon">
						{highlightMatch(String(macnum), filters.MACNUM || "")}
					</div>
				</a>
			</li>
		);
	};

	if (isEmpty) {
		return (
			<div className="manual-input">
				<form
					onSubmit={(e) => e.preventDefault()}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleManualSubmit();
					}}
				>
					<h1>Manual Wagon Selection</h1>
					{!hasAppSegment && (
						<Form.Input
							label="App Segment"
							placeholder="Ex: wag12"
							type="text"
							onChange={(e) => {
								const value = (e.target as HTMLInputElement).value;
								folderRef.current = value;
							}}
						/>
					)}
					<Form.Input
						label="Wagon Number"
						placeholder="Ex: 33001"
						type="text"
						onChange={(e) => {
							const value = (e.target as HTMLInputElement).value;
							macnumRef.current = value;
						}}
					/>
					{error && <p style={{ color: "red" }}>{error}</p>}
					<Button onClick={handleManualSubmit}>Load</Button>
				</form>
			</div>
		);
	}

	return (
		<div className="list-container">
			<div className={classNames("layout", { scroller: showAllList })}>
				<div className={classNames("filters")}>
					<h1>Find a Wagon</h1>
					<Form>
						{columns.map((col) => (
							<Form.Input
								key={col}
								label={`By ${col}`}
								placeholder={`Filter by ${col}`}
								type="text"
								onChange={(e) =>
									handleFilterChange(
										col,
										(e.target as HTMLInputElement).value,
									)
								}
							/>
						))}
					</Form>
				</div>

				<ul
					className={classNames("list", { open: showAllList })}
					onWheel={() => setShowAllList(true)}
				>
					{filteredWagons?.map(renderWagon)}
					{!showAllList && (
						<Button onClick={() => setShowAllList(true)}>
							Show all
						</Button>
					)}
				</ul>
			</div>
		</div>
	);
};

export default WagonSelect;
