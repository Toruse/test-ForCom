## Второй вопрос

_Вопрос:_

Есть страница, на которой имеется текстовое поле __Search__ с __id=”page_seach”__ и произвольный контент, обрамленный 
враппером __id=”page_content”__. Напишите __JS + jQuery__ код, который при вводе текста в поле __Search__ будет 
подсвечивать все найденные внутри враппера экземпляры введенного текста, обрамляя их 
__\<span class=”alert-info”\>[текст]\</span\>__

_Ответ:_

Вариант 1.

Сформируем разметку для поиска:

```html
    <form role="search">
        <input id="page_seach" class="form-control" type="search" placeholder="Search" aria-label="Search">
    </form>
    <div id="page_content">
        Text
    </div>
```

Рассмотрим ситуацию простого поиска. Используя метод replace() экранируем спецсимволы в строке поиска, и 
используя тот же метод, делаем замену искомой строки на строку заключённую в тег span.

```JavaScript
    // Инициализируем метод для поиска.
    if (!String.prototype.searchReplace) {
        /**
         * Метод замены подстроки в строке.
         * @param search string - строка для поиска
         * @param replacement string - строка, в которой нужно выполнить замену
         * @returns string
         */
        String.prototype.searchReplace = function (search, replacement) {
            return this.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), 'gi'), replacement);
        };
    }
    
    $(function() {
        // Запоминаем строку для восстановления
        var pageContent = $("#page_content").html();

        // Назначаем слушатель при отпускании кнопки в поле поиска
        $("#page_seach").on("keyup", function () {
            // Получаем строку для поиска
            var seach = $(this).val();
            // Восстанавливаем исходное содержание слоя page_content
            $("#page_content").html(pageContent);

            // Выполняем поиск если слово для поиска содержит больше трёх символов
            if (seach.length >= 3) {
                // Получаем содержание слоя, выполняем поиск и подсветку найденного
                $("#page_content").html($("#page_content").html().searchReplace(seach, function (match) {
                    return '<span class="alert-info">' + match + '</span>';
                }));
            }
        });
    })
```

Чтобы начать новый поиск нужно удалить результаты предыдущего поиска, для этого используется переменная _pageContent_, 
в которой храниться исходный текст слоя _page_content_. Это упрощает код, но по желанию можно выполнить удаление и 
средствами _jQuery_.

Вариант 2.

Сформируем разметку для поиска. Она отличается от первого варианта наличием дополнительно слоя _page_content_clone_, 
который используется для сохранения исходно содержания слоя _page_content_.

```html
    <form role="search">
        <input id="page_seach" class="form-control" type="search" placeholder="Search" aria-label="Search">
    </form>
    <div id="page_content">
        Text
    </div>
    <div id="page_content_clone" style="display: none;"></div>
```

В данном варианте поиск выполняется через перебор элементов DOM-дерева. То есть, когда найдено текстовую ноду, 
выполняется поиск по её содержанию. Благодаря виртуализации поискового текста, когда мы имеем общий текст элемента, в 
котором выполняется поиск, и ссылки каждого символа из этого текста на элемент DOM-дерева, мы можем выполнять поиск с 
учётом форматирования абзаца. Например, когда поисковая фраза имеет в абзаце разный курсив написания.

```JavaScript
    /**
     * Класс для поиска по тексту, основанный на переборе DOM-дерева 
     * @param el - элемент с текстом
     * @param seach - поисковая фраза
     * @constructor
     */
    function TextSearch(el, seach) {
        // Хранит ссылку на элемент с текстом
        this.element = el;
        // Хранит поисковую фразу в нижнем регистре
        this.seach = seach.toLowerCase();
        // Хранить исходный текст без дочерних элементов
        this.text = '';
        // Хранить информацию о символах из text (позицию, символ, ссылку на элемент)
        this.listRef = [];
    
        /**
         * Перебирает DOM-дерево, находим текстовые элементы, сохраняем содержание в одну строку для поиска и ссылки 
         * в каком элементе находится данный символ.
         * @param el - элемент с текстом
         */
        this.eachTree = function (el) {
            // Если есть дочерние элементы продолжаем перебор дерева
            if (el.hasChildNodes()) {
                var children = el.childNodes;
                for (var i = 0; i < children.length; ++i) {
                    this.eachTree(children[i]);
                }
            } else {
                // Если найденный элемент текстовый, то сохраняем информацию о нём
                if (el.nodeName === '#text') {
                    // Перебираем посимвольно содержание
                    for (var i = 0; i < el.textContent.length; ++i) {
                        // Сохраняем позицию символа в строке, сам символ, и ссылку на элемент в DOM
                        this.listRef.push({
                            position: i,
                            char: el.textContent[i],
                            node: el
                        });
                    }
                    // Добавляем строку в общий текст для поиска
                    this.text += el.textContent;
                }
            }
        }

        /**
         * Проверяет имеет ли элемент связь с DOM-деревом.
         * @param node
         * @returns {boolean|boolean}
         */
        this.isInPage = function isInPage(node) {
            return node === document.body ? false : document.body.contains(node);
        }

        /**
         * Добавляет текстовый элемент перед текущем элементом. Источник содержания выступает текущий элемент
         * @param node - элемент
         * @param start - с какого символа выбрать данные для вставки
         * @param end - по какой символ выбрать данные для вставки
         */
        this.addTextNodeBefore = function (node, start, end) {
            var text = node.textContent.slice(start, end);
            if (text) {
                var nodeText = document.createTextNode(text);
                node.before(nodeText);
            }
        }
    
        /**
         * Добавляет span элемент перед текущем элементом. Источник содержания выступает текущий элемент
         * @param node - элемент
         * @param start - с какого символа выбрать данные для вставки
         * @param end - по какой символ выбрать данные для вставки
         */
        this.addSelectSpanNodeBefore = function (node, start, end) {
            var text = node.textContent.slice(start, end);
            if (text) {
                var nodeSpan = document.createElement('span')
                nodeSpan.textContent = text;
                nodeSpan.className = 'alert-info text-info';
                node.before(nodeSpan);
            }
        }

        /**
         * Находит искомую фразу в тексте.
         * @returns {*[]} - массив найденных символов с информации о них в DOM-дереве
         */
        this.findPositionsSearchCharWord = function () {
            var pos = -1;
            var result = [];
            while ((pos = this.text.indexOf(this.seach, pos + 1)) != -1) {
                result.push(this.listRef.slice(pos, pos + this.seach.length));
            }
            return result;
        }

        /**
         * Находит начальный и конечный символ поисковой фразы.
         * @returns {*[]} - массив найденных крайних символов с информации о них в DOM-дереве
         */
        this.findPositionsPartsChar = function () {
            // Находим символы искомых фраз
            var select = this.findPositionsSearchCharWord();
            var result = [];
            // Перебираем символы и выбрасываем промежуточные
            for (var i = 0; i < select.length; i++) {
                // Получаем первый символ
                var tmp = select[i][0];
                // Перебираем все символы поисковой фразы
                for (var n = 1; n < select[i].length; n++) {
                    // Если нашли смену элемента, то добавляем разрыв крайних символов
                    if (tmp.node.parentNode !== select[i][n].node.parentNode) {
                        result.push({
                            node: tmp.node,
                            start: tmp.position,
                            end: select[i][n-1].position
                        });
                        tmp = select[i][n];
                    }
                }
                // Сохраняем информацию о элементе в котором нашли поисковую фразу и позицию первого символа и 
                // последнего
                result.push({
                    node: tmp.node,
                    start: tmp.position,
                    end: select[i][select[i].length-1].position
                });
            }
            return result;
        }
        
        /**
         * Группирует найденные поисковые фразы, на основе одинаковых элементов 
         * @returns {*[]} - массив сгруппированных крайних символов поисковой фразы с информации о них в DOM-дереве
         */
        this.groupingNodes = function () {
            // Получаем из текста начальные и конечные символы поисковой фразы
            var select = this.findPositionsPartsChar()
            var result = [];
            // Буфер, который хранит позиции начальные и конечные символы поисковой фразы для одного элемента
            var tmp = [];
            
            // Перебираем результаты поиска
            for (var i = 0; i < select.length; i++) {
                // Записываем позицию поисковой фразы в элементе
                tmp.push({
                    start: select[i].start,
                    end: select[i].end
                });
                // Если меняется элемент или последний шаг цикла, то сохраняем новую группу
                if ((i === select.length-1) || (select[i].node !== select[i+1].node)) {
                    result.push({
                        node: select[i].node,
                        listSeach: tmp
                    });
                    tmp = [];
                }
            }
    
            return result;
        }
    
        /**
         * Выполняет пометку найденной фразы в тексте элемента.
         */
        this.findAndReplace = function () {
            // Перебираем дерево, для получения текста и ссылки на элементы
            this.eachTree(this.element);
            // Приводим полученный текст в нижний регистр
            this.text = this.text.toLowerCase();
    
            // Получаем список, где нам нужно пометить найденный текст
            var select = this.groupingNodes()
    
            var stringPath = '';
            // Перебираем группы
            for (var i = 0; i < select.length; i++) {
                // Перебираем найденные отрезки текста в группе
                for (var j = 0; j < select[i].listSeach.length; j++) {
                    // Вставляем текст, который находиться в начале текущего элемента
                    if (j === 0) {
                        this.addTextNodeBefore(select[i].node, 0, select[i].listSeach[j].start)
                    }
                    // Помечаем найденный текст, поместив его в тег span
                    this.addSelectSpanNodeBefore(select[i].node, select[i].listSeach[j].start, select[i].listSeach[j].end + 1);
                    if (j === select[i].listSeach.length - 1) {
                        // Вставляем текст, который находиться в конце текущего элемента
                        this.addTextNodeBefore(select[i].node, select[i].listSeach[j].end + 1, select[i].node.textContent.length)
                    } else {
                        // Вставляем текст, который находиться между найденными поисковыми фразами 
                        this.addTextNodeBefore(select[i].node, select[i].listSeach[j].end + 1, select[i].listSeach[j+1].start)
                    }
                }
            }
    
            // Удаляем элементы со старым текстом
            for (let i = 0; i < select.length; i++) {
                if (this.isInPage(select[i].node)) {
                    select[i].node.parentNode.removeChild(select[i].node);
                }
            }
        }
    }
    
    $(function() {
        // Клонируем содержание элемента для восстановления его после поиска
        $("#page_content_clone").append($("#page_content").children().clone(true));
    
        // Выполняем поиски при вводе символов в поле поиска
        $("#page_seach").on("keyup", function () {
            // Получаем значение из поля поиска
            var seach = $(this).val();
    
            // Восстанавливаем исходное содержание слоя page_content
            $("#page_content").empty().append($("#page_content_clone").children().clone(true));
    
            // Выполняем поиск если длинна поисковая фраза больше трёх символов.
            if (seach.length >= 3) {
                // Выполняем поиск и подсветку найденного
                var textSearch = new TextSearch($("#page_content")[0], seach);
                textSearch.findAndReplace();
            }
        });
    })
```

Вариант 3.

Разметка документа для третьего варианта такая же, как для второго. Принцип работы алгоритма похож на предыдущий 
вариант, но основан на использовании встроенных средств браузера, а именно на выделение текста в указанном диапазоне. 
Однако нужно учитывать его поддержку в разных браузерах.

```JavaScript
    /**
     * Метод для поиска по элементу, основанный на выделение текста в документе
     * @param seach - поисковая фраза
     */
    function findAndReplace(seach)
    {
        var parentEl = null;
        // Проверяем поддержку метода find()
        if(window.find) {
            // Выполняем поиск
            while (window.find(seach)) {
                // Получаем элемент, где нашли текст
                var rng = window.getSelection().getRangeAt(0);
                parentEl = rng.commonAncestorContainer;
                if (parentEl.nodeType != 1) {
                    parentEl = parentEl.parentNode;
                }
                // Указываем по какому элементу выполнить поиск
                if (parentEl && $(parentEl).closest("#page_content").length) {
                    // Помечаем найденный текст
                    var node = document.createElement('span');
                    node.classList.add('alert-info', 'text-info');
                    node.appendChild(document.createTextNode(rng.toString()));
                    rng.deleteContents();
                    rng.insertNode(node);
                }
            }
            // Убираем выделение
            window.getSelection().removeAllRanges();
        }
        // Проверяем поддержку метода createTextRange() 
        else if(document.body.createTextRange) {
            // Указываем по какому элементу выполнить поиск
            var rng = document.body.createTextRange();
            rng.moveToElementText($("#page_content")[0])
            // Выполняем поиск
            while (rng.findText(seach)) {
                // Помечаем найденный текст
                rng.pasteHTML('<span class="alert-info text-info">' + rng.text + '</span>');
            }
            // Убираем выделение
            document.selection.empty();
        }
    }

    $(function() {
        // Параметры для исправления потери фокуса с поля поиска
        var selectionStart = 0;
        var selectionEnd = 0;

        // Клонируем содержание элемента для восстановления его после поиска
        $("#page_content_clone").append($("#page_content").children().clone(true));

        // Выполняем поиски при вводе символов в поле поиска
        $("#page_seach").on("keyup", function () {
            // Получаем значение из поля поиска
            var seach = $(this).val();

            // Восстанавливаем исходное содержание слоя page_content
            $("#page_content").empty().append($("#page_content_clone").children().clone(true));

            selectionStart = $(this)[0].selectionStart;
            selectionEnd = $(this)[0].selectionEnd;
            
            // Выполняем поиск если длинна поисковая фраза больше трёх символов.
            if (seach.length >= 3) {
                // Выполняем поиск и подсветку найденного
                findAndReplace(seach);
            }

            // Восстанавливаем фокус в поле поиска
            $(this).blur();
            $(this).focus();
            $(this)[0].setSelectionRange(selectionStart, selectionEnd);
        });
    })
```

> **Примечание**
> 
> При использовании данного варианта возникла проблема с потерей фокуса поискового поля. Чтобы это исправить 
> выполняется фокусировка на поле и с помощью метода setSelectionRange восстанавливается позиция курсора.

[Содержание](../SUMMARY.md)