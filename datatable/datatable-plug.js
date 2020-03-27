dataTableTemplate = function () {
    return {
        input: input,
        select: select,
        date: date,
        dateTime: dateTime,
        defaultView: defaultView
    };

    function defaultView(column, field, value) {
        return '<a>未定义 type</a>'
    }

    function input(name, value) {
        var input = $('<input>').addClass('form-control');
        input.attr('name', name).attr('autocomplete', 'off');
        input.val(value);
        return input;
    }

    function select(name, value, options, column) {
        function addOptions(options) {
            $.each(options, function (i, item) {
                var option = $('<option>').text(item.name).val(item.value);
                select.append(option);
            })
        }

        var select = $('<select>').addClass('form-control');
        select.attr('name', name);
        if ($.isArray(options)) {
            addOptions(options)
        }
        if (column.all) {
            var option = $('<option>').text('全部').attr('selected', '').val('-1');
            select.prepend(option);
        }
        if (value)
            select.val(value);
        return select;
    }

    function date(name, value) {
        var laydateClass = 'laydate' + new Date().getTime();
        var input = $('<input type="text">').addClass('form-control').addClass(laydateClass).val(value);
        setTimeout(function () {
            // laydate必须在元素加载完成,才能有效 只能用 setTimeout
            laydate.render({
                elem: '.' + laydateClass //指定元素
                , format: 'yyyy-MM-dd'
            });
        }, 180);
        return input;
    }

    function dateTime(name, value) {
        var laydateClass = 'laydate' + new Date().getTime();
        var input = $('<input type="text">').addClass('form-control').addClass(laydateClass).val(value);
        setTimeout(function () {
            // laydate必须在元素加载完成,才能有效 只能用 setTimeout
            laydate.render({
                elem: '.' + laydateClass //指定元素
                , format: 'yyyy-MM-dd HH:mm:ss'
                , type: 'datetime'
            });
        }, 180);
        return input;
    }
}();