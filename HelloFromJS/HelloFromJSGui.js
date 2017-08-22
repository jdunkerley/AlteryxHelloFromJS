"use strict";
/// <reference path="../AlteryxDesigner.d.ts" />
var fields = [];
var preview = {};
var modes = ['Constant', 'Expression', 'Function'];
function previewCallback(d) {
    var fieldsElement = document.getElementById('functionValues');
    if (d.fields) {
        d.fields.forEach(function (n, i) {
            fields.push(n);
            preview[n.strName] = d.data[0][i];
        });
        console.log('preview');
    }
    if (fieldsElement) {
        if (d.errorMsg) {
            fieldsElement.style.color = 'red';
            fieldsElement.innerHTML = d.errorMsg;
        }
        else {
            fieldsElement.innerHTML = '<table>' + fields.map(function (f) { return "<tr><td><abbr title=\"" + f.strType + " : " + f.strSource + "\">" + f.strName + "</abbr></td><td>" + preview[f.strName] + "</td></tr>"; }).join('\r\n') + '</table>';
        }
        if (fieldsElement.parentElement) {
            fieldsElement.parentElement.style.display = 'block';
        }
    }
}
Alteryx.Gui.BeforeLoad = function (manager, dataItems) {
    if (!manager.GetDataItemByDataName('ColumnName')) {
        manager.AddDataItem(new dataItems.SimpleString({ dataname: 'ColumnName', id: 'ColumnName', initialValue: 'HelloFromJS' }));
    }
    var modeItem = manager.GetDataItemByDataName('Mode');
    var mode = modeItem ? modeItem.getValue() : modes[0];
    manager.RemoveDataItemByDataName('Mode');
    var newModeItem = new dataItems.StringSelector({ dataname: 'Mode', id: 'Mode' });
    newModeItem.setStringList(modes.map(function (n) { return { dataname: n.toLowerCase(), uiobject: n, default: n === mode }; }));
    manager.AddDataItem(newModeItem);
    if (!manager.GetDataItemByDataName('Value')) {
        manager.AddDataItem(new dataItems.SimpleString({ dataname: 'Value', id: 'Value', initialValue: 'Hello From JavaScript' }));
    }
    if (!manager.GetDataItemByDataName('Expression')) {
        manager.AddDataItem(new dataItems.SimpleString({ dataname: 'Expression', id: 'Expression', initialValue: 'Hello From JavaScript' }));
    }
    if (!manager.GetDataItemByDataName('Function')) {
        manager.AddDataItem(new dataItems.SimpleString({ dataname: 'Function', id: 'Function', initialValue: '(r, i) => `${i} - $`JSON.stringify(r)`' }));
    }
};
Alteryx.Gui.AfterLoad = function (manager) {
    var ColumnNameItem = manager.GetDataItemByDataName('ColumnName');
    ColumnNameItem.BindUserDataChanged(function (newValue) {
        var newString = (newValue || '').toString();
        var element = document.getElementById('fieldNameValid');
        if (element)
            element.innerHTML = (newString.trim() === '') ? 'You must enter a field name' : '';
    });
    Alteryx.JsEvent(JSON.stringify({ Event: 'Message', Type: 1, Message: 'Hello from JS: AfterLoad' }));
    var modeItem = manager.GetDataItemByDataName('Mode');
    function modeItemChanged() {
        var modeValue = modeItem.getValue();
        modes.map(function (m) { return m.toLowerCase(); }).forEach(function (m) { return (document.getElementById(m) || { style: { display: '' } }).style.display = (m === modeValue ? 'block' : 'none'); });
    }
    modeItem.BindUserDataChanged(modeItemChanged);
    modeItemChanged();
    Alteryx.JsEvent(JSON.stringify({
        Event: 'GetInputData',
        callback: 'previewCallback',
        anchorIndex: 0,
        connectionName: '',
        numRecs: 1,
        offset: 0
    }));
};
Alteryx.Gui.Annotation = function (manager) {
    var ColumnNameItem = manager.GetDataItemByDataName('ColumnName');
    var ValueItem = manager.GetDataItemByDataName('Value');
    return (ColumnNameItem.getValue()) + ":\r\n" + ValueItem.getValue().replace(/^(.{27}).{3,}/, '$1...');
};
Alteryx.Gui.BeforeGetConfiguration = function (json) {
    if ((json.Configuration.ColumnName || '').trim() === '') {
        json.Configuration.ColumnName = 'NewJSColumn';
        json.Annotation = "NewJSColumn:\r\n" + (json.Annotation || '').replace(/^.*?:\r\n/, '');
    }
    return json;
};
//# sourceMappingURL=HelloFromJSGui.js.map