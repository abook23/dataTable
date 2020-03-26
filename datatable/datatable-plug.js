(function ($) {
    $.fn.dataTableTemplate = {
        input: input,
        select: select,
        date: date,
        dateTime: dateTime
    };

    function input(name, value) {
        var input = $('<input>').addClass('form-control');
        input.attr('name', name).attr('autocomplete','off');
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
        var input = $('<input>').addClass('form-control').val(value);
        input.datepicker({
            language: 'zh-CN',//显示中文
            autoclose: true,//选中自动关闭
            format: 'yyyy-mm-dd',
            startDate: '-3d',
        });
        return input;
    }

    function dateTime(name, value) {
        $.fn.datetimepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
            meridiem: ["上午", "下午"],
            suffix: ["st", "nd", "rd", "th"],
            today: "今天",
            clear: "清除"
        };
        var input = $('<input>').addClass('form-control').val(value);
        input.datetimepicker({
            language: 'zh-CN',//显示中文
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
        });
        return input;
    }
})(jQuery);