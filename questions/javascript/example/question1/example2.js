/**
 * Определяет инициированная ли переменная.
 * @param nameVar {string}
 * @returns {boolean}
 */
function defined(nameVar) {
    return typeof window[nameVar] !== "undefined";
}

if (defined("a")) {
    console.log("Переменная определена");
} else {
    console.log("Переменная не определена");
}