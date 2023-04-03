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
