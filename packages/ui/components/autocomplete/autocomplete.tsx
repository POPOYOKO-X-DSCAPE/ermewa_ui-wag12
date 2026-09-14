import {
	ComboboxItem,
	ComboboxList,
	ComboboxPopover,
	ComboboxProvider,
	useComboboxStore,
	useStoreState,
} from "@ariakit/react";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
} from "react";
import { SearchInput } from "../form/search-input";
import { Styles } from "./styles";

export interface AutocompleteOption {
	value: string;
	label: string;
	meta?: string;
}

export interface AutocompleteProps {
	options: AutocompleteOption[];
	onSelect: (value: string) => void;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	minLength?: number;
	clearOnSelect?: boolean;
	empty?: string;
	renderOption?: (option: AutocompleteOption) => ReactNode;
	placeholder?: string;
	"aria-label": string;
	icon?: ReactNode;
	className?: string;
}

export const Autocomplete = ({
	options,
	onSelect,
	value,
	defaultValue = "",
	onValueChange,
	open,
	onOpenChange,
	minLength = 2,
	clearOnSelect = true,
	empty = "No matches",
	renderOption,
	placeholder,
	"aria-label": ariaLabel,
	icon,
	className,
}: AutocompleteProps) => {
	const isValueControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue);
	const currentValue = isValueControlled ? value : internalValue;
	const valueRef = useRef(defaultValue);
	valueRef.current = currentValue;
	const pendingPickRef = useRef<string | null>(null);
	const onOpenChangeRef = useRef(onOpenChange);
	useEffect(() => {
		onOpenChangeRef.current = onOpenChange;
	});
	const storeRef = useRef<ReturnType<typeof useComboboxStore> | null>(
		null,
	);

	const store = useComboboxStore({
		inputValue: currentValue,
		setInputValue: (next: string) => {
			if (next === pendingPickRef.current) return;
			if (next === valueRef.current) return;
			valueRef.current = next;
			if (!isValueControlled) setInternalValue(next);
			onValueChange?.(next);
		},
		setSelectedValue: (next: string) => {
			if (!next) return;
			pendingPickRef.current = next;
			const nextValue = clearOnSelect ? "" : next;
			if (nextValue !== valueRef.current) {
				valueRef.current = nextValue;
				if (!isValueControlled) setInternalValue(nextValue);
				onValueChange?.(nextValue);
			}
			storeRef.current?.hide();
			onSelect(next);
		},
	});
	storeRef.current = store;

	const storeOpen = useStoreState(store, (state) => state.open);
	const effectiveOpen = open ?? storeOpen;
	const activeId = useStoreState(store, (state) =>
		state.open && state.activeId ? state.activeId : undefined,
	);
	const listId = useStoreState(
		store,
		(state) => state.contentElement?.id ?? "",
	);
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const element = inputRef.current;
		if (element) {
			store.setInputElement(element);
			store.setCompositeElement(element);
		}
		return () => {
			store.setInputElement(null);
			store.setCompositeElement(null);
		};
	}, [store]);

	useEffect(() => {
		if (open !== undefined) store.setOpen(open);
	}, [store, open]);

	const reportedOpenRef = useRef(false);
	useEffect(() => {
		if (!reportedOpenRef.current) {
			reportedOpenRef.current = true;
			return;
		}
		onOpenChangeRef.current?.(storeOpen);
	}, [storeOpen]);

	const handleInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const next = event.target.value;
			if (next !== valueRef.current) {
				valueRef.current = next;
				if (!isValueControlled) setInternalValue(next);
				onValueChange?.(next);
			}
			store.setInputValue(next);
			store.setActiveId(null);
			if (next.length >= minLength) store.show();
		},
		[isValueControlled, minLength, onValueChange, store],
	);

	const handleInputMouseDown = useCallback(
		(event: MouseEvent<HTMLInputElement>) => {
			if (event.button !== 0 || event.ctrlKey) return;
			store.setActiveId(null);
			store.setInputValue(valueRef.current);
			if (valueRef.current.length >= minLength) store.show();
		},
		[minLength, store],
	);

	const handleInputKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			const state = store.getState();
			if (event.key === "Escape") {
				// prevent default before the browser's native search-input
				// clear (a trusted `input` event) wipes the typed query.
				event.preventDefault();
				if (state.open) {
					store.hide();
				} else if (valueRef.current) {
					// MDN combobox: Escape while closed clears the value.
					valueRef.current = "";
					if (!isValueControlled) setInternalValue("");
					onValueChange?.("");
					store.setInputValue("");
				}
				return;
			}
			if (event.key === "ArrowDown" && event.altKey) {
				// APG optional: Alt+ArrowDown opens the popup.
				if (!state.open && valueRef.current.length >= minLength) {
					event.preventDefault();
					store.show();
				}
				return;
			}
			if (event.key === "ArrowUp" && event.altKey) {
				// APG optional: Alt+ArrowUp closes the popup (keeps the
				// typed query, unlike a plain Escape).
				if (state.open) {
					event.preventDefault();
					store.hide();
				}
				return;
			}
			if (state.open && event.key === "Enter") {
				event.preventDefault();
				const id = state.activeId;
				if (!id) return;
				const item = state.items.find((entry) => entry.id === id);
				if (!item || item.disabled || item.value == null) return;
				store.setSelectedValue(item.value);
				store.setInputValue(item.value);
				store.hide();
				return;
			}
			if (
				event.ctrlKey ||
				event.altKey ||
				event.shiftKey ||
				event.metaKey
			)
				return;
			if (!state.open) {
				if (
					(event.key === "ArrowDown" || event.key === "ArrowUp") &&
					valueRef.current.length >= minLength
				) {
					event.preventDefault();
					store.show();
				}
				return;
			}
			let nextId: string | null | undefined;
			if (event.key === "ArrowDown") {
				nextId = store.down();
			} else if (event.key === "ArrowUp") {
				nextId = store.up();
			} else if (event.key === "Home" || event.key === "PageUp") {
				nextId = store.first();
			} else if (event.key === "End" || event.key === "PageDown") {
				nextId = store.last();
			}
			if (nextId !== undefined) {
				event.preventDefault();
				store.move(nextId);
			}
		},
		[minLength, isValueControlled, onValueChange, store],
	);

	// The Ariakit popover stays mounted in the DOM while the store is closed,
	// so the list is gated at the React level (open AND long-enough value).
	const listVisible = effectiveOpen && currentValue.length >= minLength;

	// Screen-reader announcement of the result count (role="status" is the
	// polite live region screen readers expect for search suggestions).
	const resultSummary = listVisible
		? options.length > 0
			? `${options.length} ${options.length === 1 ? "result" : "results"}`
			: empty
		: "";

	return (
		<div className={classNames(Styles.field, className)}>
			{/* biome-ignore lint/a11y/useSemanticElements: role="status" is the live region for the result count */}
			<span role="status" className={Styles.srOnly}>
				{resultSummary}
			</span>
			<SearchInput
				value={currentValue}
				placeholder={placeholder}
				aria-label={ariaLabel}
				icon={icon}
				inputProps={{
					// `text` (not `search`): the APG combobox pattern is a text
					// box; the native search-input Escape behavior (a trusted
					// clear) would fight the combobox keyboard model.
					type: "text",
					role: "combobox",
					"aria-autocomplete": "list",
					"aria-haspopup": "listbox",
					"aria-expanded": effectiveOpen,
					"aria-controls": listId || undefined,
					"aria-activedescendant": activeId,
					autoComplete: "off",
					ref: inputRef,
					onChange: handleInputChange,
					onMouseDown: handleInputMouseDown,
					onKeyDown: handleInputKeyDown,
				}}
			/>
			{listVisible ? (
				<ComboboxProvider store={store}>
					<ComboboxPopover
						aria-label={ariaLabel}
						className={Styles.panel}
					>
						<ComboboxList
							aria-label={ariaLabel}
							className={Styles.list}
						>
							{options.length > 0 ? (
								options.map((option) => (
									<ComboboxItem
										key={option.value}
										// Short accessible name: the APG
										// listbox pattern warns against long
										// option names, so the meta (snippet)
										// stays out of the name.
										aria-label={option.label}
										value={option.value}
										className={Styles.item}
									>
										{renderOption ? (
											renderOption(option)
										) : (
											<>
												{option.label}
												{option.meta ? (
													<span
														aria-hidden="true"
														className={Styles.itemMeta}
													>
														{option.meta}
													</span>
												) : null}
											</>
										)}
									</ComboboxItem>
								))
							) : (
								<ComboboxItem
									disabled
									className={classNames(Styles.item, Styles.itemEmpty)}
								>
									{empty}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxPopover>
				</ComboboxProvider>
			) : null}
		</div>
	);
};
