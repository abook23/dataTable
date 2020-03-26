我是一名 从事大厂的 web 开发高级开发工程师,平常就喜欢提高工作效率偷懒,结合国内外的各种table表格生成器,的的优缺点,自己写一个 dataTable表格生成器,已经经过大项目实践,觉得好点个赞,想要什么功能,就在下面给我留了,我来迭代实现

## 简书地址 https://www.jianshu.com/p/f5a3d08042f4
## 预览地址 http://abook23.com:8081/login
用户名密码:system/system

### 项目js引入
```
<link href="/page/datatable/datatable.css" rel="stylesheet" type="text/css">
<script src="/page/datatable/datatable.js"></script>
<script src="/page/datatable/datatable-plug.js"></script>
```
```
<!--    时间选择器 可以自定义-->
<script src="/js/laydate/laydate.js"></script>
```

### 一句话生成查询条件
```
{search: true},
```
![](https://upload-images.jianshu.io/upload_images/5319344-690935920e834955.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 一句话时间选择器
```
type: 'dateTime', search: true,
```
可以自定义成你们系统的时间选择器
![image.png](https://upload-images.jianshu.io/upload_images/5319344-d3fd5eb2156fe237.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 一句话下拉框
```
option: [{'name': '前台用户', 'value': 1}, {'name': '后台用户', 'value': 2}],
```
![image.png](https://upload-images.jianshu.io/upload_images/5319344-4fa5a4564c56a941.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 一句话添加按钮
```
button: [
            {name: "add", text: "新增",class: 'btn-info', click: "addPage()"},
            {name: "edit", text: "编辑",class: 'btn-info', click: 'editPage()'},
            {name: "del", text: "删除", class: 'btn-warning',click: 'delUser()'}
        ],
```
![](https://upload-images.jianshu.io/upload_images/5319344-ec8a17a006f0d016.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 一句话的功能太多了
- 编辑行
- 自定义子表,自定义行详情,
- 等等,自己往下看吧

![1.png](https://upload-images.jianshu.io/upload_images/5319344-ca77f50c718a9b38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

数据格式
```
{
data: []
totalElements: 10001
totalPages: 667
}
```

简洁
----
```
var table = $('#table').dataTable({
        url: "/user/list",
        no: true,//默认值 false
        button: [
            {name: "add", text: "新增",class: 'btn-info', click: "addPage()"},
            {name: "edit", text: "编辑",class: 'btn-info', click: 'editPage()'},
            {name: "del", text: "删除", class: 'btn-warning',click: 'delUser()'}
        ],
        columns: [
            {field: 'userId', name: 'id',},
            {field: 'userName', name: '用户名', search: true,},
            {
                field: 'type', name: '用户类型', search: true,
                option: [{'name': '前台用户', 'value': 1}, {'name': '后台用户', 'value': 2}],
            },
            {
                field: 'status', name: '状态', search: true,
                option: [{'name': '有效', 'value': 1}, {'name': '禁用', 'value': 0}],
            },
            {
                field: 'createTime', name: '时间', type: 'dateTime', search: true,
                sort: true,
                formatter: function (value, rowData, rowIndex) {
                    return rowData.userInfo.createTime;
                }
            },
            // {
            //     name: "操作",
            //     rowInfo: false,//详情中不显示
            //     export: false,//导出 默认true
            //     formatter: function (value, rowData, rowIndex) {
            //         var edit = $('<button class="btn btn-default btn-sm"></button>').text('编辑');
            //         var save = $('<button class="btn btn-default btn-sm"></button>').text('保存').hide();
            //         edit.click(function () {
            //             table.editRow(rowIndex);
            //             edit.hide();
            //             save.show();
            //         });
            //         save.click(function () {
            //             table.editRow(rowIndex, false);
            //             edit.show();
            //             save.hide();
            //         });
            //         return [edit, save];
            //     }
            // }
        ],
    });
    table.onClickRow(function (index, row) {
        rowData = row
    });
```
=======

表格参数
========


| 名称           | 类型             | 默认              | 示例                                                                                                                                                                        | 描述                                      |
|----------------|------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| url            | string           | \--               | /user/list                                                                                                                                                                  | 服务器地址                                |
| data           | array            | [ ]               |                                                                                                                                                                             | 本地数据                                  |
| dataSrc        | String           | data              |                                                                                                                                                                             | 数据来源                                  |
| param          | object           |                   | {id:5,type:6}                                                                                                                                                               | 参数                                      |
| no             | boolean          | true              |                                                                                                                                                                             | 行编号, false不显示                       |
| radio          | boolean          | fasle             |                                                                                                                                                                             | 点选框                                    |
| checkbox       | boolean          | false             |                                                                                                                                                                             | 多选框                                    |
| rowInfo        | boolean Function | false             | function(index, rowData){ return obj }                                                                                                                                      | 点击行后显示行详情,                       |
| search         | boolean          | true              |                                                                                                                                                                             | 自动生成 搜索框,具体生成规则 参考 columns |
| exportExcel    | boolean          | false             |                                                                                                                                                                             | 导出表格                                  |
| pageSize       | int              | 15                |                                                                                                                                                                             | 每页请求条数                              |
| pageSizeMenu   | boolean/array    | [15, 20, 50, 100] | [15, 20, 50, 100]                                                                                                                                                           | 请求数量下拉框 true or [] 时显示          |
| addRow         | boolean          | false             |                                                                                                                                                                             | 显示添加行菜单                            |
| button         | array            | []                | [{name: "add", text: "新增", class: 'btn-info', click: "addPage()"} ]                                                                                                       | name: name属性                            |
| showToolButton | boolean          | true              | false                                                                                                                                                                       | false 不显示table 生成的按钮              |
| columns        | array            | \--               | []                                                                                                                                                                          | 列配置项,详情请查看列参数表格             |
| formatter      | function         | \--               | formatter: function (value, rowData, rowIndex) {                                                                                                                            | value:当前字段的值                        |

formatter
```
formatter: function (value, rowData, rowIndex) {
    if (value == 0) {
        return '<font color="#d9534f">禁用</font>';
    } else {
        return '<font color="#5cb85c">启用</font>';
    }
}
```


列表配置columns
===============

| 名称    | 类型       | 默认  | 示例                                                         | 描述                                                             |
|---------|------------|-------|--------------------------------------------------------------|------------------------------------------------------------------|
| field   | string     | \--   | userId                                                       | 设定字段名。字段名的设定非常重要                                 |
| name    | string     | \--   | 用户ID                                                       | 标题名                                                           |
| width   | int/string | \--   | 40/80px                                                      | 设定列宽，若不填写，则自动分配；若填写，则支持值为：数字、百分比 |
| searh   | boolean    | false |                                                              | 自动生成搜索框                                                   |
| type    | string     | \--   | input                                                        | 设定列类型,搜索框会自动生成相应的类型,可选值有：                 |
| sort    | boolean    | false |                                                              | 排序                                                             |
| edit    | boolean    | true  |                                                              | 是否可以编辑行: table.editRow(rowIndex)                          |
| option  | array      | [ ]   | [{'name': '有效', 'value': 1}, {'name': '禁用', 'value': 0}] | type 为 select 有效 name:下拉框的 name value:下拉框的value       |
| ur      | string     |       | /user/userType                                               | type 为select有效,自动追加到 option                                input:输入框 select:下拉框 参考select data: yyyy-mm-dd dataTime: yyyy-mm-dd hh:ii|
| rowInfo | boolean    | true  |                                                              | 默认展示,如果是操作列,可以设置rowInfo= fasle 进行关闭            |
| hidden  | boolean    | false |                                                              | 隐藏,不可见,多用于权限控制                                       |
| export  | boolean    | true  |                                                              | 一般用于,不导出该列                                              |



事件
====

| 名称            | name                 | 示例                                                                                                                          | 描述                      |
|-----------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| 选择行          | onClickRow           | table.onClickRow(function (index, rowData) { console.log(rowData); table.editRow(index); });                                  | index:行                  |
| 单选多选        | onSelect             | //单选多选 回调 table.onSelect(function(rowData, checked, index) { console.log(rowData); //table.getSelections();获取全部 }); | 单选多选 回调             |
| 获取多选数据    | getSelections()      | table.getSelections()                                                                                                         | 获取选择的数据            |
| 添加行          | addRow()             | table.addRow();                                                                                                               | 添加一行数据              |
| 编辑行          | editRow(index)       | table.editRow(index);                                                                                                         | index 代表行              |
| 保存编辑        | editRow(index,false) | table.editRow(index,false);                                                                                                   | false 代表不编辑,编辑完成 |
| 搜索/查询       | search               | table.search()                                                                                                                |                           |
| 刷新当前页      | refresh              | table.refresh();                                                                                                              |                           |
| 重新加载        | reload               | table.reload()                                                                                                                |                           |



示例
====


全部说明
--------
```
 var readOnly = false;
    var table = $('#table').dataTable({
        url: "/user/list",
        param: {},//默认 {}
        no: true,//默认值 false
        radio: true,//默认值 false
        checkbox: true,//默认值 false 覆盖 radio
        rowInfo: true,//默认值 false 或者 function(index, rowData) return obj/html
        readOnly: readOnly,//默认值 false
        search: true,//默认true
        exportExcel: true,//默认false
        pageSize: 15,//默认15
        pageSizeMenu: true,//默认 [15, 20, 50, 100]  pageSizeMenu: [5, 15, 25, 35, 50],//自定义
        addRow: true,//默认true
        button: [{name: "add", text: "新增"}, {name: "edit", text: "编辑"}, {name: "del", text: "删除"}],
        showToolButton:true,//默认true 显示用户添加的按钮
        columns: [
            {field: 'userId', name: 'id',},
            {
                field: 'userName',
                name: '用户名',
                type: 'input',// input select
                rowInfo: true,//默认true
                search: true,
                sort: true//排序 默认值 false
            },
            {
                field: 'type',
                name: '用户类型',
                type: 'select',
                search: true,
                edit:false,
                option: [{'name': '前台用户', 'value': 1}, {'name': '后台用户', 'value': 2}],
            },
            {
                field: 'status',
                name: '状态',
                type: 'select',
                search: true,
                option: [{'name': '有效', 'value': 1}, {'name': '禁用', 'value': 0}],
                url: ""
            },
            {field: 'userInfo.createTime', name: '时间', type: 'dateTime', search: true, sort: true},
            {
                name: "操作",
                rowInfo: false,//详情中不显示
                hidden: readOnly,//默认值 false
                export: false,//导出 默认true
                formatter: function (value, rowData, rowIndex) {
                    var edit = $('<button class="btn btn-default btn-sm"></button>').text('编辑');
                    var save = $('<button class="btn btn-default btn-sm"></button>').text('保存').hide();
                    edit.click(function () {
                        table.editRow(rowIndex);
                        edit.hide();
                        save.show();
                    });
                    save.click(function () {
                        table.editRow(rowIndex, false);
                        edit.show();
                        save.hide();
                    });
                    return [edit, save];
                }
            }
        ],
    });
    // table.onClickRow(function (index, rowData) {
    //     console.log(rowData);
    //     table.editRow(index);
    // });
    table.onSelect(function (rowData, checked, index) {//单选多选 回调
        console.log(rowData);
        //table.getSelections();获取全部
    });

    $('#addRow').click(function () {
        table.addRow();
    })
```

![2.png](https://upload-images.jianshu.io/upload_images/5319344-d497c1ed69b21d87.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![3.png](https://upload-images.jianshu.io/upload_images/5319344-c2d36e73f8e29599.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![4.png](https://upload-images.jianshu.io/upload_images/5319344-aa31d46ae08272f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![5.png](https://upload-images.jianshu.io/upload_images/5319344-e81deb8ad3e38f5d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
