export class ForbiddenLandsActor extends Actor {
	createEmbeddedEntity(embeddedName, data, options) {
		// Replace randomized attributes like "[[d6]] days" with a roll
		let newData = duplicate(data);
		const inlineRoll = /\[\[(\/[a-zA-Z]+\s)?([^\]]+)\]\]/gi;
		if (newData.data) {
			for (let key of Object.keys(newData.data)) {
				if (typeof newData.data[key] === "string") {
					newData.data[key] = newData.data[key].replace(
						inlineRoll,
						(_match, _contents, formula) => new Roll(formula).roll().total,
					);
				}
			}
		}
		return super.createEmbeddedEntity(embeddedName, newData, options);
	}
}

export class ForbiddenLandsItem extends Item {
	async sendToChat() {
		const itemData = duplicate(this.data);
		if (itemData.img.includes("/mystery-man")) {
			itemData.img = null;
		}
		if (game.fbl.config.itemTypes.includes(itemData.type)) itemData[`is${itemData.type.capitalize()}`] = true;
		itemData.hasRollModifiers =
			itemData.data.rollModifiers && Object.values(itemData.data.rollModifiers).length > 0;
		const html = await renderTemplate("systems/forbidden-lands/templates/chat/item.hbs", itemData);
		const chatData = {
			user: game.user._id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
			["flags.forbidden-lands.itemData"]: this.data, // Adds posted item data to chat message flags for item drag/drop
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		} else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		ChatMessage.create(chatData);
	}
}
