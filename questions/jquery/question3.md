## Третий вопрос

_Вопрос:_

Напишите __jQuery__-плагин __drags__, который позволит перетаскивать произвольный DOM объект. Без использования 
__jQueryUI__ ;) Сохранением позиции точки перетаскивания можно пренебречь.

_Ответ:_

Принцип перетягивание объектов в документе основывается на свойстве _position_ с параметром _absolute_ или _relative_. 
Указав его, мы получим возможность при помощи _top_ и _left_ задавать позицию элемента в документе. В данном плагине 
используется _position: relative_, что позволяет перетягивать элементы не сломав разметку в документе.

```javascript
// Создаем плагин drags
(function($){
    $.fn.drags = function() {
        // Задаём пространственное имя для событий плагина
        var nameSpace = '.drageventmouse';
        // Упрощаем обращение к документу
        var doc = $(document);

        // Перебираем полученные элементы
        return this.each(function(){
            // Указывает элементу свойству position значение relative
            $(this).css("position", "relative");

            // Назначаем элементу событие нажатия кнопки мыши вниз
            $(this).on("mousedown", function(event) {
                // Останавливаем всплытие события
                event.stopPropagation();

                // Была нажата левая кнопка мыши
                if (event.which !== 1) return;

                // Делаем перетягиваемый элемент доступный глобальных событий документа
                var that = this;
                // Определяем координаты курсора мыши на элементе, нужно во избежание сдвига элемента к координатам 
                // курсора
                var pos = $(that).offset();
                pos.eventLeft = event.pageX - pos.left;
                pos.eventTop = event.pageY - pos.top;

                // Назначаем документу событие на передвижение курсора с пространственным именем drageventmouse
                doc.on("mousemove" + nameSpace, function(event) {
                    // Отключаем действие по умолчанию
                    event.preventDefault();

                    // На основе позиции курсора задаем новые координаты элементу
                    $(that).offset({
                        top: event.pageY - pos.eventTop,
                        left: event.pageX - pos.eventLeft
                    });
                });
                // Назначаем документу событие на отпускание кнопки мыши с пространственным именем drageventmouse
                doc.on("mouseup" + nameSpace, function(){
                    // Удаляем событие с пространственным именем drageventmouse
                    doc.off(nameSpace);
                });
            });
        });
    };
})(jQuery);
```

Применение:

```javascript
    $(function() {
        $(".card").drags();
    });
```

[Содержание](../SUMMARY.md)