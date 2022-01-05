if (!String.prototype.eachOdd) {
    String.prototype.eachOdd = function (callback) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }

        if (typeof callback !== 'function') {
            throw new TypeError('Variable callback is not a function ');
        }

        var str = '' + this;

        for (var i = 0; i < str.length; i++) {
            if (i % 2 !== 0) callback(str[i]);
        }

        return this;
    }
}

'azxswedcvfrtgb'.eachOdd(function (symbol) {
    console.log(symbol)
});
