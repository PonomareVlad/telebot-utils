/**
 * Modifier for commands parsing
 * @param data
 * @returns {*}
 */
export const parseCommands = data => {
    if (data?.message?.text?.startsWith("/")) {
        const [name, ...words] = data.message.text.split(" ");
        Object.assign(data.message, {
            command: name.replace("/", ""), text: words.join(" "), isCommand: true
        });
    }
    return data;
}

export function keyboardGrid(buttons = [], columns = 1) {
    return buttons.reduce((rows, button) => {
        const lastRow = rows.at(-1);
        if (lastRow.length < columns) lastRow.push(button);
        else rows.push([button]);
        return rows;
    }, [[]]);
}

export const getSetName = (name = "", username = "") => `${name.replaceAll(" ", "_")}_by_${username}`;

export const NewMethodsMixin = superClass => class extends superClass {

    async get(field) {
        const data = this.data ??= await this.getMe();
        return field ? data[field] : data;
    }

    async uploadStickerFile(data = {user_id: 0}) {
        const {
            file,
            buffer,
            user_id,
            filename = "sticker.tgs",
            sticker_format = "animated",
        } = data || {};
        const value = buffer || file;
        const form = {
            user_id,
            sticker_format,
            sticker: {
                value,
                options: {
                    filename
                }
            },
        };
        const {result} = await this.request("/uploadStickerFile", null, form);
        return result;
    }

    async addStickerToSet(data = {user_id: 0, name: "", sticker: {sticker: "", emoji_list: ["🖼️"]}}) {
        const {
            name,
            title,
            user_id,
            sticker = {},
            username = this.username ??= await this.get("username"),
        } = data || {};
        const form = {
            user_id,
            sticker: JSON.stringify(sticker),
            name: getSetName(name || title, username),
        };
        const {result} = await this.request("/addStickerToSet", form);
        return result;
    }

    async setStickerPositionInSet(data = {sticker: "", position: 0}) {
        const {
            sticker,
            position,
        } = data || {};
        const form = {
            sticker,
            position,
        };
        const {result} = await this.request("/setStickerPositionInSet", form);
        return result;
    }

    async deleteStickerFromSet(data = {sticker: ""}) {
        const {sticker} = data || {};
        const form = {sticker};
        const {result} = await this.request("/deleteStickerFromSet", form);
        return result;
    }

    async createNewStickerSet(data = {user_id: 0, title: "", stickers: [{sticker: "", emoji_list: ["🖼️"]}]}) {
        const {
            name,
            title,
            user_id,
            stickers = [],
            needs_repainting = false,
            sticker_format = "animated",
            sticker_type = "custom_emoji",
            username = this.username ??= await this.get("username"),
        } = data || {};
        const form = {
            title,
            user_id,
            sticker_type,
            sticker_format,
            needs_repainting,
            stickers: JSON.stringify(stickers),
            name: getSetName(name || title, username),
        };
        const {result} = await this.request("/createNewStickerSet", form);
        return result;
    }

    async getStickerSet(data = {title: ""}) {
        const {
            name,
            title,
            username = this.username ??= await this.get("username"),
        } = data || {};
        const form = {
            name: getSetName(name || title, username),
        };
        const {result} = await this.request("/getStickerSet", form);
        return result;
    }

    async deleteStickerSet(data = {title: ""}) {
        const {
            name,
            title,
            username = this.username ??= await this.get("username"),
        } = data || {};
        const form = {
            name: getSetName(name || title, username),
        };
        const {result} = await this.request("/deleteStickerSet", form);
        return result;
    }

    async getCustomEmojiStickers(data = {custom_emoji_ids: [""]}) {
        const {custom_emoji_ids = []} = data || {};
        const form = {custom_emoji_ids: JSON.stringify(custom_emoji_ids)};
        const {result} = await this.request("/getCustomEmojiStickers", form);
        return result;
    }

    async setMyCommands(data = {}) {
        const toCommand = ([command, description]) => ({command, description});
        const commands = JSON.stringify(Object.entries(data).map(toCommand));
        return this.request('/setMyCommands', {commands});
    }

}
