import { css } from "@styles";
import classNames from "classnames";
import type { ReactNode } from "react";

interface IHeaderProps {
	children: ReactNode;
	className?: string;
}

const panda = css({
	bg: "c.header.bg",
	color: "c.header.fg",
	position: "sticky",
	top: "0",
	zIndex: "10",
	paddingBlock: "c.header.paddingBlock",
	paddingInline: "c.header.paddingInline",
});

export const Header = ({ children, className }: IHeaderProps) => (
	<header className={classNames(panda, className)}>{children}</header>
);
