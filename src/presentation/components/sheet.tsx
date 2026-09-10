import {
	Disclosure,
	DisclosureContent,
	DisclosureProvider,
} from "@ariakit/react";
import { Stack } from "@packages/ui";
import { RiArrowDownSLine as RiArrowSLine } from "@remixicon/react";
import { css } from "@styles";
import type { ReactElement } from "react";

import type {
	WagonDataGroup,
	WagonDataInterface,
	WagonZone,
} from "../../domain/types/wagon-data";
import type { LayoutItem } from "../../interface-adapters/external-types/app-profile";

interface SheetProps {
	items: LayoutItem[];
	bindings: WagonDataInterface["data"] | null;
}

const styles = {
	sheetCards: css({ padding: "s.padding.m", gap: "s.padding.m" }),
	sheetCard: css({
		padding: "s.padding.m",
		backgroundColor: "s.bg.elevated.initial",
		gap: "s.padding.m",
	}),
	cardHeader: css({
		fontSize: "s.h2",
	}),
	cardSubSectionHeader: css({
		fontSize: "s.h3",
		cursor: "pointer",
		padding: "s.padding.s",
		_hover: {
			backgroundColor: "s.bg.elevated.hover",
		},
	}),
	cardContent: css({
		gap: "s.padding.s",
	}),
	subgroup: css({
		marginLeft: "s.padding.m",
		borderLeft: "1px solid s.border.default",
		paddingLeft: "s.padding.m",
	}),
	subgroupTitle: css({
		marginTop: "s.padding.s",
		marginBottom: "s.padding.xs",
		fontWeight: "s.fontWeight.semibold",
	}),
};

const renderGroup = (
	group: WagonDataGroup,
	i: number,
): ReactElement => {
	return (
		<Stack direction="column" key={`group-${String(i)}`}>
			<DisclosureProvider>
				<Disclosure>
					<Stack
						direction="row"
						alignItems="center"
						grow
						className={styles.cardSubSectionHeader}
					>
						<RiArrowSLine />
						{group.type}
					</Stack>
				</Disclosure>
				<DisclosureContent>
					{/* --- Zones --- */}
					<Stack className={styles.cardContent}>
						{Object.values(group.zones).length > 0 ? (
							Object.values(group.zones).map((zone, zoneIndex) => (
								<Stack key={`zone-${String(i)}-${String(zoneIndex)}`}>
									<div className="tag">{zone.code}</div> {zone.label} :{" "}
									{zone.value !== null && zone.value !== undefined
										? String(zone.value)
										: "—"}
								</Stack>
							))
						) : (
							<Stack>no zone data.</Stack>
						)}
					</Stack>

					{/* --- Sous-groupes récursifs --- */}
					{Object.keys(group.subGroups).length > 0 && (
						<Stack className={styles.cardContent}>
							{Object.entries(group.subGroups).map(
								([key, subGroups], subIndex) => (
									<Stack
										key={`subgroup-${String(i)}-${String(subIndex)}`}
										direction="column"
									>
										<Stack className={styles.subgroupTitle}>
											{key}
										</Stack>
										{subGroups.map((sg, sgIndex) => (
											<Stack
												key={`subgroup-${String(i)}-${String(subIndex)}-${String(
													sgIndex,
												)}`}
												className={styles.subgroup}
											>
												{renderGroup(sg, sgIndex)}
											</Stack>
										))}
									</Stack>
								),
							)}
						</Stack>
					)}
				</DisclosureContent>
			</DisclosureProvider>
		</Stack>
	);
};

export const Sheet = ({
	items,
	bindings,
}: SheetProps): ReactElement => {
	if (!bindings) {
		return (
			<Stack grow alignItems="center" justifyContent="center">
				Loading...
			</Stack>
		);
	}

	const groups = Object.values(bindings);

	return (
		<Stack scrollable grow>
			<Stack className={styles.sheetCards} justifyContent="stretch">
				{items.map((chapter, i) => (
					<Stack
						key={`chapter-${String(i)}`}
						alignItems="start"
						className={styles.sheetCard}
						grow
					>
						<Stack
							className={styles.cardHeader}
							id={chapter.title?.alias}
						>
							{chapter.title?.defaultTxt}
						</Stack>

						<Stack className={styles.cardContent} grow>
							{groups.map((group, groupIndex) => (
								<Stack
									key={`group-${String(groupIndex)}`}
									direction="column"
									id={group.type}
								>
									{renderGroup(group, groupIndex)}
								</Stack>
							))}
						</Stack>
					</Stack>
				))}
			</Stack>
		</Stack>
	);
};
