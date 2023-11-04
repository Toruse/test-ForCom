(function($){
    $.fn.drags = function() {
        var nameSpace = '.drageventmouse';
        var doc = $(document);

        return this.each(function(){
            $(this).css("position", "relative");

            $(this).on("mousedown", function(event) {
                event.stopPropagation();

                if (event.which !== 1) return;

                var that = this;
                var pos = $(that).offset();
                pos.eventLeft = event.pageX - pos.left;
                pos.eventTop = event.pageY - pos.top;

                doc.on("mousemove" + nameSpace, function(event){
                    event.preventDefault();

                    $(that).offset({
                        top: event.pageY - pos.eventTop,
                        left: event.pageX - pos.eventLeft
                    });
                });
                doc.on("mouseup" + nameSpace, function(){
                    doc.off(nameSpace);
                });
            });
        });
    };
})(jQuery);