import {
  Disclosure,
  DisclosureContent,
  useDisclosureStore,
} from "@ariakit/react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiLoaderLine,
  RiMoreLine,
} from "@remixicon/react";
import classNames from "classnames";
import { useState, useTransition } from "react";
import { Stack, type StackProps } from "../../abstract/stack";
import { verifyChildren } from "../../hooks/verifyChildrenTypes";
import type { Action } from "../../types";
import { Button } from "../button";
import { Styles } from "./styles";

export type SideBarItems = (SideBarElementProps | SideBarGroupProps)[];

interface SideBarElementProps {
  isActive?: boolean;
  children: React.ReactNode;
  actions?: Action[] | Action;
  href?: string;
}
interface SideBarGroupProps extends SideBarElementProps {
  name: React.ReactNode;
}

interface SideBarProps extends StackProps {
  children:
    | (
        | React.ReactElement<typeof SideBarElement>
        | React.ReactElement<typeof SideBarGroup>
      )[]
    | React.ReactElement<typeof SideBarElement>
    | React.ReactElement<typeof SideBarGroup>;
}

const SideBarElement = ({
  children,
  actions,
  href,
  isActive = false,
}: SideBarElementProps) => {
  const handleClick = (callback: () => void) => {
    if (callback) {
      callback();
    }
  };

  const hasActions = typeof actions === "object" && actions !== null;

  const ElementContent = (
    <Stack
      className={classNames("sidebar-element", Styles.Element, {
        [Styles.ActiveElement]: isActive,
      })}
      direction="row"
      alignItems="center"
    >
      <Stack className={Styles.ElementContent} direction="row" grow>
        {children}
      </Stack>
      {typeof actions === "object" && (
        <Stack direction="row">
          {Array.isArray(actions) ? (
            <Button.Menu
              placement="bottom-end"
              level="secondary"
              items={actions.map((action) => ({
                icon: action.icon,
                label: action.label,
                callback: action.callback,
              }))}
            >
              <RiMoreLine />
            </Button.Menu>
          ) : // <Stack direction="row" className={Styles.GroupAction}>
          //   {actions.map((action) => (
          //     <Button
          //       key={action.callback.toString()}
          //       onClick={() => handleClick(action.callback)}
          //       level={action.level || "secondary"}
          //     >
          //       {action.icon || action.label}
          //     </Button>
          //   ))}
          // </Stack>
          hasActions && actions.icon ? (
            <Button
              onClick={() => handleClick(actions.callback)}
              level={actions.level || "secondary"}
            >
              {actions.icon}
            </Button>
          ) : null}
        </Stack>
      )}
    </Stack>
  );

  const isExternal = href
    ? href.startsWith("http://") || href.startsWith("https://")
    : false;

  return (
    <Stack className={Styles.ElementContainer}>
      <a
        href={href || "#"}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {ElementContent}
      </a>
    </Stack>
  );
};

const SideBarGroup = ({ name, children }: SideBarGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const disclosure = useDisclosureStore({
    open: isOpen,
    setOpen: (open) => {
      startTransition(() => {
        setIsOpen(open);
      });
    },
  });

  return (
    <Stack className={classNames(Styles.Group)}>
      <Disclosure store={disclosure} className={classNames(Styles.ClickZone)}>
        <Stack grow className={Styles.ElementContent} direction="row">
          {name}
        </Stack>
        {isPending ? (
          <RiLoaderLine />
        ) : isOpen ? (
          <RiArrowUpSLine />
        ) : (
          <RiArrowDownSLine />
        )}
      </Disclosure>
      <DisclosureContent store={disclosure}>
        <Stack className={classNames(Styles.Group)}>
          <Stack grow className={Styles.GroupParent}>
            {children}
          </Stack>
        </Stack>
      </DisclosureContent>
    </Stack>
  );
};

export const SideBar = ({ children }: SideBarProps) => {
  verifyChildren(children, [SideBarElement, SideBarGroup]);
  return (
    <Stack className={classNames("sidebar", Styles.Main)} grow>
      {children}
    </Stack>
  );
};

SideBar.Group = SideBarGroup;
SideBar.Element = SideBarElement;
