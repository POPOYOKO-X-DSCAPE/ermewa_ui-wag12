import { css } from "@styles";
import classNames from "classnames";
import type { PositionCombo } from "../../abstract";
import { Stack } from "../../abstract/stack";

interface ISnackbarProps {
  children: React.ReactNode;
  isVsible: boolean;
  positionCombo?: PositionCombo;
}

export const SnackBar = ({
  children,
  isVsible,
  positionCombo,
}: ISnackbarProps) => {
  const panda = css({
    padding: "c.snackbar.padding",
    margin: "c.snackbar.margin",
    backgroundColor: "c.snackbar.bg",
    color: "c.snackbar.fg",
    width: "min-content",
    borderColor: "c.snackbar.fg",
    border: "1px solid",
    right: 0,
    display: isVsible ? "inherit" : "none",
    rounded: "c.snackbar.radius",
  });

  return (
    <Stack
      className={classNames(panda)}
      position={{
        type: "relativeToApp",
        position: positionCombo || ["bottom", "right"],
      }}
    >
      {children}
    </Stack>
  );
};
