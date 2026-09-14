import { css } from "@styles";

const field = css({
	position: "relative",
	width: "100%",
});

const panel = css({
	background: "c.autocomplete.panelBg",
	boxShadow: "c.autocomplete.panelShadow",
	borderWidth: "1px",
	borderStyle: "solid",
	borderColor: "c.autocomplete.panelBorder",
	borderRadius: "c.autocomplete.radius",
	overflow: "hidden",
});

const list = css({
	maxHeight: "c.autocomplete.listMaxHeight",
	overflowY: "auto",
	margin: 0,
	padding: 0,
});

const item = css({
	display: "block",
	width: "100%",
	paddingBlock: "c.autocomplete.itemPaddingBlock",
	paddingInline: "c.autocomplete.itemPaddingInline",
	font: "inherit",
	color: "c.autocomplete.itemFg",
	cursor: "pointer",
	textAlign: "start",
	_hover: {
		backgroundColor: "c.autocomplete.itemBgHover",
	},
	"&[data-active-item]": {
		backgroundColor: "c.autocomplete.itemBgActive",
	},
});

const itemEmpty = css({
	cursor: "default",
	pointerEvents: "none",
	color: "c.autocomplete.itemFgMuted",
});

const itemMeta = css({
	display: "block",
	color: "c.autocomplete.itemFgMuted",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
});

const srOnly = css({
	position: "absolute",
	clip: "rect(0 0 0 0)",
	width: "1px",
	height: "1px",
	overflow: "hidden",
	whiteSpace: "nowrap",
});

export const Styles = {
	field,
	panel,
	list,
	item,
	itemEmpty,
	itemMeta,
	srOnly,
};
