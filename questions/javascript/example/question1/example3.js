/**
 * Определяет инициированная ли переменная.
 * @param nameVar {string}
 * @returns {boolean}
 */
function defined(nameVar) {
    return (nameVar in window) && window[nameVar]!=null;
}

if (defined("a")) {
    console.log("Переменная определена");
} else {
    console.log("Переменная не определена");
}