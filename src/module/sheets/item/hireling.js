import { ForbiddenLandsItemSheet } from "./item.js";
export class ForbiddenLandsHirelingSheet extends ForbiddenLandsItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			...super.defaultOptions,
			template: "systems/forbidden-lands/templates/hireling.hbs",
		});
	}
}
