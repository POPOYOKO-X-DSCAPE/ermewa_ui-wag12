import { css } from "@styles";

const Main = css({
	bg: "c.sidebar.bg.initial",
	color: "c.sidebar.fg.initial",
	boxSizing: "border-box",
	"& button": {
		textAlign: "left",
	},
});

const GroupAction = css({
	gap: "c.sidebar.element.gap",
});

const Group = css({
	bg: "c.sidebar.element.bg.initial",
	color: "sidebar.element.fg.initial",
	padding: "c.sidebar.element.padding",
	gap: "c.sidebar.element.gap",
	boxSizing: "border-box",
	paddingRight: "0",
	_hover: {
		bg: "c.sidebar.element.bg.hover",
	},
	"& .sidebar-element": {
		paddingLeft: "sidebar.groupChildren.paddingLeft",
	},
	"& button": {
		padding: "sidebar.element.padding",
		paddingX: "sidebar.element.paddingX",
		cursor: "pointer",
	},
});

const GroupParent = css({
	borderLeftColor: "c.sidebar.fg.initial",
	borderLeftWidth: "1",
	borderStyle: "solid",
	boxSizing: "border-box",
});

const ElementContainer = css({
	bg: "c.sidebar.element.bg.initial",
	color: "c.sidebar.element.fg.initial",
	padding: "c.sidebar.element.padding",

	boxSizing: "border-box",
	_hover: {
		bg: "c.sidebar.element.bg.hover",
	},
	cursor: "pointer",
});

const Element = css({
	gap: "c.sidebar.element.padding",
	borderRadius: "c.sidebar.element.radius",
	minHeight: "48px",
	boxSizing: "border-box",
	cursor: "pointer",
	"& button": {
		padding: "sidebar.element.padding",
		paddingX: "sidebar.element.paddingX",
		cursor: "pointer",
	},
});

const ActiveElement = css({
	bg: "c.sidebar.element.bg.active",
	paddingLeft: "c.sidebar.element.padding",
});

const ElementContent = css({
	gap: "c.sidebar.element.padding",
	boxSizing: "border-box",
});

const ClickZone = css({
	boxSizing: "border-box",
	padding: "c.sidebar.element.padding",
	flexGrow: 1,
	marginRight: "c.sidebar.element.padding",
});

export const Styles = {
	Main,
	GroupAction,
	Group,
	GroupParent,
	ElementContainer,
	Element,
	ActiveElement,
	ElementContent,
	ClickZone,
};
