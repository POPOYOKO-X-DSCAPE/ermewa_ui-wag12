import React from "react";

export const verifyChildren = (
	children: React.ReactNode,
	allowedTypes: Array<React.ElementType>,
): void => {
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) {
			console.warn("Children must be valid React elements.");
		}

		const isAllowedType = allowedTypes.some((type) => {
			return (
				(React.isValidElement(child) && child.type === type) ||
				(typeof type === "function" &&
					React.isValidElement(child) &&
					child.type === type)
			);
		});

		if (!isAllowedType) {
			const allowedTypeNames = allowedTypes
				.map((type) =>
					typeof type === "function" ? type.name : "Unknown",
				)
				.join(", ");

			console.warn(`Children must be of type: ${allowedTypeNames}`);
		}
	});
};
