import { css } from "@styles";
import classNames from "classnames";
import type {
	ChangeEvent,
	FocusEvent,
	InputHTMLAttributes,
	ReactNode,
	Ref,
} from "react";

const fieldWrapper = css({
	height: "100%",
	display: "flex",
	alignItems: "center",
	gap: "c.searchInput.gap",
	// `background` (not backgroundColor): c.searchInput.bg is a color or a
	// gradient token depending on the project theme.
	background: "c.searchInput.bg",
	borderWidth: "1px",
	borderStyle: "solid",
	borderColor: "c.searchInput.border",
	"&:focus-within": {
		borderColor: "c.searchInput.borderFocus",
	},
	borderRadius: "c.searchInput.radius",
	padding: "c.searchInput.padding",
	minWidth: 0,
});

const glyph = css({
	display: "block",
	flexShrink: 0,
	color: "c.searchInput.fg",
	opacity: 0.6,
});

const input = css({
	flex: 1,
	minWidth: 0,
	border: "none",
	outline: "none",
	background: "transparent",
	font: "inherit",
	color: "c.searchInput.fg",
	_placeholder: {
		opacity: 0.55,
	},
});

interface ISearchInputProps {
	value: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	"aria-label": string;
	onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
	icon?: ReactNode;
	className?: string;
	inputProps?: InputHTMLAttributes<HTMLInputElement> & {
		ref?: Ref<HTMLInputElement>;
	};
}

export const SearchInput = ({
	value,
	onChange,
	placeholder,
	onFocus,
	icon,
	className,
	inputProps,
	...aria
}: ISearchInputProps) => {
	const {
		onChange: onInput,
		ref: inputRef,
		...domProps
	} = inputProps ?? { onChange: undefined, ref: undefined };

	return (
		<label className={classNames(fieldWrapper, className)}>
			{icon ? <span className={glyph}>{icon}</span> : null}
			<input
				type="search"
				{...domProps}
				value={value}
				placeholder={placeholder}
				onFocus={onFocus}
				onChange={(event: ChangeEvent<HTMLInputElement>) => {
					onInput?.(event);
					onChange?.(event.target.value);
				}}
				className={input}
				{...aria}
				ref={inputRef}
			/>
		</label>
	);
};
