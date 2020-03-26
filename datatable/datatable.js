$(function () {
    $.fn.extend({
        dataTable: function (options) {
            var table = {};
            var rowDataTemp = {};
            var elem = $(this);

            var parenClass = elem.attr('id');
            var parenDiv = $('<div>').addClass(parenClass + "-paren");
            elem.before(parenDiv);
            parenDiv.append(elem);

            initParam();
            elem.addClass('table table-striped table-bordered table-hover table-condensed');//参考bootstarp
            elem.empty();
            var tableBefore = $('<div class="tableAfter">');
            var thead = $('<thead></thead>');
            var tbody = $('<tbody></tbody>');
            var tableAfter = $('<div class="tableAfter">');
            elem.before(tableBefore).append(thead).append(tbody).after(tableAfter);
            initTableBefore(elem, tableBefore);
            initTHead(elem, options.columns);
            initTBody(elem, options.data);
            initTableAfter(elem, tableAfter);
            table.editRow = editRow;
            table.search = tableSearch;
            table.addRow = addRow;
            table.onSelect = onSelect;
            table.onClickRow = addClickRow;//call(index,rowData)
            table.refresh = refresh;//刷新当前页
            table.reload = reload;//重新加载
            table.loadData = loadData;
            table.getRowData = getRowData;// 获取某一行数据 index
            table.getRowsData = getRowsData;//获取所有行数据
            table.getOptions = getOptions;
            table.getSelections = getSelections;
            table.exportExcel = exportExcel;
            table.exportExcelAll = exportExcelAll;
            table.options = options;

            function initTableBefore(elem, tableBefore) {
                if (options.search) {
                    addSearch(options.columns, tableBefore);
                }
                var div = $('<div class="pull-right">').css('padding', '0 0 8px 0');
                var toolsDiv = $('<div>').addClass('btn-group');

                if (options.showToolButton !== false) {
                    addToolButton(toolsDiv);
                }

                if (options.button) {
                    $.each(options.button, function (i, item) {
                        let button = $('<button type="button" class="btn btn-default">').text(item.text)
                            .attr('name', item.name).addClass(item.name).addClass(item.class)
                            .attr('onclick', item.click);
                        toolsDiv.append(button);
                    })
                }
                if (options.addRow === true) {
                    let addRow = $('<button type="button" class="btn btn-default">').text("添加行");
                    toolsDiv.append(addRow);
                    addRow.click(function () {
                        table.addRow()
                    })
                }
                if (options.showToolButton !== false) {
                    if (options.exportExcel === true) {
                        addExportExcel(toolsDiv);
                    }
                }

                div.append(toolsDiv);
                tableBefore.append(div);
            }

            function addToolButton(toolsDiv) {
                let query = $('<button>').addClass('btn btn-primary query').css('width', '64px').text("搜索");
                let reset = $('<button>').addClass('btn btn-primary reset').css('width', '64px').text("重置");
                toolsDiv.append(query, reset);

                reset.click(function () {
                    tableReset()
                });
                query.click(function () {
                    tableSearch();
                });
            }

            function tableSearch() {
                options.param = $('.table-search-form').serializeJson();
                options.pageNumber = 0;
                options.select_page = 1;
                refresh();
            }

            function tableReset() {
                $('.table-search-form')[0].reset();
                tableSearch();
            }

            function addSearch(columns, tableBefore) {
                var horizontal = $('<div class="form-horizontal table-search">');
                $.each(columns, function (i, column) {
                    if (column.search === true) {
                        var groupDiv = $('<div>').addClass('form-group col-md-3 col-sm-3 col-xs-3');
                        var div = $('<div>').addClass('');
                        var name = column.field;
                        var view;
                        if (column.type !== undefined) {
                            if (column.type === 'select') {
                                column.all = true;//添加选择 全部
                            }
                            view = getView(column, name);
                            if (column.type === 'select') {
                                column.all = false;
                            }
                        } else {
                            view = getInput(name)
                        }
                        var view_temp = $(view).addClass('form-control').attr('name', name).attr('id', name).attr('placeholder', column.name);
                        div.append(view_temp);
                        groupDiv.append(div);
                        horizontal.append(groupDiv);
                        // horizontal.prepend(groupDiv);
                    }
                });
                let form = $('<form class="table-search-form">').append(horizontal);
                tableBefore.append(form);

                horizontal.keydown(function (event) {
                    if (event.keyCode === 13) {
                        tableSearch();
                    }
                });
            }

            function initTableAfter(elem, tableAfter) {
                addPageSize(tableAfter)
            }

            function initTHead(elem, columns) {
                var tr = $('<tr></tr>');
                options.startColumn = 0;
                if (options.no) {//行编号
                    options.startColumn++;
                    var th = $('<th>#</th>').css('width', '48px');
                    tr.append(th);
                }
                if (options.radio || options.checkbox) {//单选多选
                    var th = $('<th></th>');
                    if (options.checkbox) {
                        var checkbox = $('<input>').attr('type', 'checkbox');
                        th.append(checkbox);
                        checkboxClick(elem, checkbox);
                    }
                    th.css('width', '38px');
                    tr.append(th);
                    options.checkColumn = options.startColumn;
                    options.startColumn++;
                }
                $.each(columns, function (i, column) {
                    if (column.hide) {
                        return true;
                    }
                    rowDataTemp[column.field] = '';
                    var th = $('<th></th>');
                    if (column.title) {
                        th.append(column.title)
                    } else if (column.name) {
                        th.append(column.name)
                    }
                    if (column.width) {
                        elem.css('table-layout', 'auto');
                    }
                    if (column.width) {
                        th.attr('width', column.width);
                    }
                    addSort(th, column);
                    tr.append(th)
                });
                thead.prepend(tr);
            }

            function initTBody(elem, data) {
                if ($.isArray(data)) {//加载本地数据
                    loadData(data);
                } else {//网络数据
                    var param = options.param;
                    param.pageSize = options.pageSize;
                    param.pageNumber = options.pageNumber;
                    $.get(options.url, param, function (obj) {
                        var rowsData;
                        options.totalPages = obj.totalPages;
                        options.totalElements = obj.totalElements;
                        if (options.totalPages===undefined || options.totalPages===null){
                            options.totalPages = options.totalElements/options.pageSize
                        }
                        if (options.dataSrc !== undefined)
                            rowsData = obj[options.dataSrc];
                        else {
                            rowsData = obj;
                        }
                        loadData(rowsData);
                    });
                }
            }

            function addSort(th, column) {
                if (column.sort === true) {
                    th.addClass('sorting').attr("sort", true);
                    th.click(function () {
                        var sort = '';
                        var field = column.field;
                        th.siblings("[sort='true']").removeAttr('class').addClass('sorting');
                        switch (th.attr('class')) {
                            case 'sorting':
                                th.removeClass('sorting').addClass('sorting_asc');
                                sort = 'asc';
                                break;
                            case 'sorting_asc':
                                th.removeClass('sorting_asc').addClass('sorting_desc');
                                sort = 'desc';
                                break;
                            case 'sorting_desc':
                                th.removeClass('sorting_desc').addClass('sorting_asc');
                                sort = 'asc';
                                break;
                            default:
                                break;
                        }
                        options.param.sort = field + " " + sort;
                        options.pageNumber = 0;
                        refresh();
                    });
                }
            }

            function refresh() {
                initTBody(elem);
            }

            function reload(option) {
                if(!option){
                    option = {}
                }
                let {param, pageNumber} = option;
                if (param){
                    for(let key in param){
                        options.param[key] = param[key]
                    }
                }
                if (!pageNumber) {
                    options.pageNumber = 0;
                }
                options.select_page = 1;
                refresh();
            }

            function loadData(rowsData) {
                options.selectionRowIndex = [];
                options.selectionRow = [];
                if ($.isArray(rowsData)) {
                    tbody.empty();
                    options.rowsData = rowsData;
                    $.each(rowsData, function (rowIndex, rowData) {
                        addRow(rowIndex, rowData);
                    });
                    if (options.totalPages>0){
                        addTableNavigation(options.totalPages);
                    }
                    if ($.isFunction(options.onload)) {
                        options.onload(getRowsData());//加载完成回调
                    }
                }
            }

            function addRow(rowIndex, rowData) {
                if (rowIndex === undefined) {
                    rowIndex = tbody.find('tr').length;
                }
                if (rowData === undefined) {
                    rowData = rowDataTemp
                }
                var tr = $('<tr></tr>').attr('row', rowIndex);//row很关键的设计,避免添加了新的 tr,但与真实数据无关
                if (options.no) {
                    var td = $('<td></td>').append(rowIndex + 1);
                    tr.append(td);
                }
                if (options.checkbox || options.radio) {//单选多选
                    var name = elem.attr('id');
                    var type = options.checkbox ? "checkbox" : "radio";
                    var input = $('<input>').attr('type', type).attr('name', name);
                    if (rowData.checked || rowData.checked == 1) {
                        input.attr('checked', true);
                    }
                    var td = $('<td></td>').append(input);
                    tr.append(td);
                    input.click(function () {
                        var index = rowIndex;
                        var checked = $(this).is(':checked');
                        var rowData = getRowData(index);
                        if ($.isFunction(options.onSelect)) {
                            options.onSelect(rowData, checked, index)
                        }
                        var selectionRowIndex = options.selectionRowIndex;
                        if (checked) {
                            selectionRowIndex.push(index);
                            options.selectionRow.push(rowData);
                        } else {
                            let sn = $.inArray(index, selectionRowIndex);
                            selectionRowIndex.splice(sn, 1);
                            options.selectionRow.splice(sn, 1);
                        }
                        options.isCheck = 1;
                    })
                }
                $.each(options.columns, function (j, column) {//填充数据
                    if (column.hide) {
                        return true;
                    }
                    var td = $('<td></td>');
                    var value = rowData[column.field];
                    // td.attr('name', column.field);
                    if (column.type === 'checkbox' || column.type === 'radio') {
                        var input = $('<input>').attr('type', column.type).attr('name', column.field);
                        td.append(input);
                    } else {
                        td.append(value);
                    }
                    if ($.isFunction(column.formatter)) {//数据格式化
                        var formatter = column.formatter(value, rowData, rowIndex);
                        if (formatter !== undefined) {
                            td.empty();
                            td.append(formatter);
                        }
                    } else if (column.option) {
                        value = getOptionName(value, column);
                        td.empty();
                        td.append(value);
                    }
                    tr.append(td);
                });
                tbody.append(tr);
                onClickRow(tr, rowIndex, options.onClickRow);
                stopPropagation(tr);
            }

            function addPageSize(div) {
                if (options.pageSizeArray !== undefined) {
                    var lable = $('<label class="hidden-xs hidden-sm"></label>');
                    var select = $('<select></select>').attr('name', 'table_lenght').addClass('form-control');
                    $.each(options.pageSizeArray, function (i, pageSize) {
                        var option = $('<option>').val(pageSize).text(pageSize);
                        select.append(option);
                    });
                    select.change(function () {
                        options.pageSize = $(this).val();
                        options.pageNumber = 0;
                        refresh();
                    });
                    lable.append(select);
                    div.append(lable);
                }
            }

            function addTableNavigation(totalPages) {
                tablepage({
                    elem: tableAfter,
                    count: totalPages,
                    select_page: options.select_page,
                    jump: function (select_page, pagination) {
                        options.pageNumber = select_page - 1;
                        options.select_page = select_page;
                        refresh();
                    }
                })
            }

            /**
             *
             * @param param.elem
             * @param param.count
             * @param param.select_page
             * @param param.jump: function (position,obj)
             */
            function tablepage(param) {
                var select_page = 1;
                if (param.select_page) {
                    select_page = param.select_page;
                }
                var pagination = $('<ul class="pagination"></ul>');

                function pageItem(count, selectPage) {
                    var page_pre = '<li class="page-item page-pre"><a class="page-link">‹</a></li>\n';
                    var page_item = '';
                    if (selectPage < 5) {
                        let _count = count < 5 ? count : 5;
                        for (var i = 0; i < _count; i++) {
                            page_item += '<li class="page-item "><a class="page-link" >' + (i + 1) + '</a></li>';
                        }
                        if (count >= 5) {
                            page_item += '<li class="page-item page-more"><a class="page-link" >...</a></li>';
                            page_item += '<li class="page-item"><a class="page-link" >' + count + '</a></li>';
                        }
                    } else if (selectPage > count - 4) {
                        page_item += '<li class="page-item"><a class="page-link" >' + 1 + '</a></li>';
                        page_item += '<li class="page-item page-more"><a class="page-link" >...</a></li>';
                        for (var i = count - 4; i <= count; i++) {
                            page_item += '<li class="page-item"><a class="page-link" >' + i + '</a></li>';
                        }
                    } else {
                        page_item += '<li class="page-item"><a class="page-link" >1</a></li>';
                        page_item += '<li class="page-item page-more"><a class="page-link">...</a></li>';
                        for (var i = selectPage - 2; i <= selectPage + 2; i++) {
                            page_item += '<li class="page-item"><a class="page-link" >' + i + '</a></li>';
                        }
                        page_item += '<li class="page-item page-more"><a class="page-link">...</a></li>';
                        page_item += '<li class="page-item"><a class="page-link">' + count + '</a></li>';
                    }
                    var page_next = '<li class="page-item page-next"><a class="page-link" >›</a></li>\n';
                    pagination.empty().append(page_pre).append(page_item).append(page_next);
                    //点击某一页
                    pagination.find('.page-item').click(function () {
                        var val = $(this).text();
                        select_page = parseInt(val);
                        pageItem(param.count, select_page)
                        if ($.isFunction(param.jump)) {
                            param.jump(select_page, pagination)
                        }
                    });
                    pagination.find('.page-more,.page-pre,.page-next').unbind('click');
                    // pagination.find('.page-pre').unbind('click');
                    // pagination.find('.page-next').unbind('click');
                    //上一页
                    pagination.find('.page-pre').click(function () {
                        select_page--;
                        if (select_page <= 1) {
                            select_page = 1;
                        }
                        pageItem(param.count, select_page);
                        if ($.isFunction(param.jump)) {
                            param.jump(select_page, pagination)
                        }

                    });
                    //下一页
                    pagination.find('.page-next').click(function () {
                        select_page++;
                        if (select_page >= param.count) {
                            select_page = param.count;
                        }
                        pageItem(param.count, select_page)
                        if ($.isFunction(param.jump)) {
                            param.jump(select_page, pagination)
                        }
                    });
                    pagination.find('.page-item').each(function () {
                        var text = $(this).text();
                        $(this).find('a').attr('href', 'javascript:;');
                        if (text == select_page) {
                            $(this).addClass("page-item-curr").addClass('active');
                        }
                    })
                }

                pageItem(param.count, select_page);
                $(param.elem).find('.pagination').remove();
                $(param.elem).append(pagination);
            }

            function editRow(index, flag, call) {//编辑 和 取消编辑
                if (options.readOnly === true) {
                    console.log("readOnly:" + options.readOnly);
                    return;
                }
                var rowData = getRowData(index);
                if (rowData === undefined) {
                    rowData = {}
                }
                //tbody.find("tr").eq(index) 找到的不是真实的行,过程中可能有其他 tr
                var tr = tbody.find("tr[row='" + index + "']");// 找到 tr row=index 的行
                if ($.isFunction(call)) {
                    var status = call(tr, rowData)
                    if (status === false) {
                        return;
                    }
                }
                tr.find('td').each(function () {
                    var td = $(this);
                    var td_index = td.index();
                    var column = options.columns[td_index - options.startColumn];
                    if (column === undefined || column.type === undefined || column.hide === true || column.edit === false) {
                        return true;
                    } else if (flag === undefined || flag === true) {//编辑
                        var field = column.field;
                        var value = rowData[field];
                        var view = getView(column, field, value);
                        td.empty().append(view);
                    } else {//取消编辑
                        var child = td.children();
                        if (child.length > 0) {
                            var value = child.eq(0).val();
                            rowData[column.field] = value;
                            if (column.formatter) {
                                value = column.formatter(value, rowData)
                            } else if (column.option) {
                                value = getOptionName(value, column)
                            }
                            td.empty().append(value);
                        }
                    }
                });
                stopPropagation(tr);
            }

            function getView(column, field, value) {
                switch (column.type) {
                    case 'input':
                        return getInput(field, value);
                    case 'select':
                        return getSelect(field, value, column.option, column);
                    case 'date':
                        return getDateView(field, value);
                    case 'dateTime':
                        return getDateTimeView(field, value);
                    default:
                        break;
                }
            }

            function stopPropagation(tr) {
                tr.find('td').children().click(function (e) {
                    e.stopPropagation();//终止事件冒泡
                });
            }

            function initParam() {
                if (!options.dataSrc)
                    options.dataSrc = "data";
                options.pageNumber = 0;
                if (options.pageSizeMenu === true) {
                    options.pageSizeArray = [15, 20, 35, 50, 100];
                } else if ($.isArray(options.pageSizeMenu)) {
                    options.pageSizeArray = options.pageSizeMenu;
                }
                options.pageSize = options.pageSize === undefined ? 15 : options.pageSize;
                options.param = options.param === undefined ? {} : options.param;
                options.title = options.title === undefined ? "表单" : options.title;
                options.exportExcel = options.exportExcel === undefined ? true : options.exportExcel;
                options.search = options.search === undefined ? true : options.search;

                options.template = $.extend({}, $.fn.dataTableTemplate);
            }

            function getOptions() {
                return options;
            }

            function getRowData(index) {
                return options.rowsData[index];
            }

            function getRowsData() {
                return options.rowsData;
            }

            function getSelections() {
                return options.selectionRow;
            }

            function checkboxClick(elem, checkbox) {
                options.isCheck = 0;
                checkbox.click(function () {
                    elem.find('tbody tr').each(function () {
                        var checkbox = $(this).find('td').eq(options.checkColumn).find('input');
                        if (options.isCheck === 0) {//全选
                            $(checkbox).prop('checked', true)
                        } else if (options.isCheck === 1) {//反选
                            $(checkbox).prop('checked', !$(checkbox).is(':checked'))
                        } else {
                            $(checkbox).prop('checked', false)
                        }
                    });
                    if (options.isCheck === 0) {
                        $(this).prop('checked', true);
                        options.isCheck = 2;
                    } else if (options.isCheck === 1) {
                        $(this).prop('checked', true);
                        options.isCheck = 0;
                    } else if (options.isCheck === 2) {
                        options.isCheck = 0;
                    }
                });
            }

            function onClickRow(tr, rowIndex, call) {
                // if ($.isFunction(call) || options.rowInfo) {
                tr.click(function () {
                    elem.find('.info').removeClass('info');
                    $(this).addClass('info');
                    /**
                     * 不能取 $(this).index() 因为 tr中可能别 rowInfo 占用
                     */
                        // var index = $(this).index();
                    var index = rowIndex;
                    var rowData = getRowData(index);
                    if ($.isFunction(call)) {
                        call(index, rowData);
                    }
                    if (options.rowInfo && rowData !== undefined) {
                        var rowInfo = tr.attr("rowInfo");
                        if (rowInfo === undefined) {
                            tr.attr("rowInfo", true);
                            var trRowInfo = $('<tr>').addClass('rowInfo');
                            var td = $('<td>').attr('colspan', thead.find('th').length);
                            trRowInfo.append(td);
                            if ($.isFunction(options.rowInfo)) {//自定义显示
                                var rowInfoHtml = options.rowInfo(index, rowData);
                                if (rowInfoHtml !== undefined) {
                                    td.empty();
                                    td.append(rowInfoHtml);
                                }
                            } else {
                                addRowInfo(td, rowData);
                            }
                            tr.after(trRowInfo);
                        } else if (rowInfo === 'true') {
                            tr.removeAttr("rowInfo");
                            tr.next().remove();
                        }
                    }
                });
                // }
            }

            function addRowInfo(td, rowData) {
                var table = $('<table></table>');
                var tbody = $('<tbody></tbody>');
                table.append(tbody);
                $.each(options.columns, function (i, column) {
                    if (column.rowInfo === false) {
                        return true;
                    }
                    if (column.rowInfo !== false) {
                        var tr = $('<tr>');
                        var td1 = $('<td>').text(column.name + ":");
                        var td2 = $('<td>').text(rowData[column.field]);
                        tr.append(td1).append(td2);
                        tbody.append(tr);
                    }
                });
                td.append(table);
            }

            function addClickRow(call) {
                options.onClickRow = call;
            }

            function onSelect(call) {
                options.onSelect = call
            }

            function getInput(field, value) {
                var input = options.template.input(field, value);
                return input;
            }

            function getSelect(field, value, option, column) {
                var select = options.template.select(field, value, option, column);
                return select;
            }

            function getDateView(field, value) {
                var date = options.template.date(field, value);
                return date;
            }

            function getDateTimeView(field, value) {
                var dateTiem = options.template.dateTime(field, value);
                return dateTiem;
            }

            function getOptionName(value, column) {
                var valueTemp;
                if (column.option) {
                    $.each(column.option, function (i, item) {
                        if (item.value == value) {
                            valueTemp = item.name;
                            return false;
                        }
                    })
                }
                return valueTemp;
            }

            function addExportExcel(toolsDiv) {
                var dropdown = $('<button>').text("工具").addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown');
                var i = $('<i>').addClass('fa fa-angle-down');
                dropdown.append(i);
                toolsDiv.append(dropdown);

                var ul = $('<ul>').addClass('dropdown-menu pull-right');
                var li1 = $('<li>').append($('<a href="#">').text('下载当页'));
                var li2 = $('<li>').append($('<a href="#">').text('下载全部'));
                ul.append(li1).append(li2);
                toolsDiv.append(ul);

                li1.click(function () {
                    exportExcel()
                });
                li2.click(function () {
                    exportExcelAll();
                })
            }

            function exportExcel() {
                toExcel(getRowsData());
            }

            function exportExcelAll() {
                var param = options.param;
                param.searchValue = undefined;
                param.pageSize = options.totalElements;
                param.pageNumber = 0;
                $.get(options.url, param, function (obj) {
                    var rowsData;
                    if (options.dataSrc !== undefined) {
                        rowsData = obj[options.dataSrc];
                    } else {
                        rowsData = obj;
                    }
                    toExcel(rowsData);
                });
            }

            function toExcel(rowsData) {
                //列标题，逗号隔开，每一个逗号就是隔开一个单元格
                var title = "";
                var data = "";
                $.each(options.columns, function (i, column) {
                    if (column.export !== false)
                        title += column.name + ",";
                });
                title = title.substring(0, title.length - 1);
                title += "\n";
                $.each(rowsData, function (j, rowData) {
                    $.each(options.columns, function (i, column) {
                        var value = rowData[column.field];
                        if (value === undefined) {
                            value = "";
                        }
                        if ($.isFunction(column.formatter)) {//数据格式化
                            var formatter = column.formatter(value, rowData, j);
                            if (formatter !== undefined) {
                                value = formatter;
                            }
                        } else if (column.option) {
                            value = getOptionName(value, column);
                        }
                        if (column.export !== false)
                            data += value + '\t,';
                    });
                    data += "\n";
                });
                //encodeURIComponent解决中文乱码
                var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(title + data);
                var download = $('<a>').attr('href', uri).attr('download', options.title + '数据导出.csv');
                elem.after(download);
                download[0].click();
                download.remove();
            }

            return table;
        }
    });

    $.fn.serializeJson = function () {
        var data = {};
        var array=this.serializeArray();
        $.each(array,function (i,item) {
            data[item.name] = item.value
        });
        // this.find('input,select').each(function () {
        //     var name = $(this).attr("name");
        //     var type = $(this).attr("type");
        //     if (type === "checkbox" || type === "radio") {
        //         data[name] = $(this).is(':checked') ? 1 : 0
        //     } else {
        //         data[name] = $(this).val()
        //     }
        // });
        return data;
    };
});