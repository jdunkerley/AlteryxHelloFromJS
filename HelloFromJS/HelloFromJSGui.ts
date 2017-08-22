/// <reference path="../AlteryxDesigner.d.ts" />

const fields: Alteryx.FieldInfo[] = []
const preview: any = {}
const modes = ['Constant', 'Expression', 'Function']

function previewCallback(d: any): void {
  const fieldsElement = document.getElementById('functionValues')

  if (d.fields) {
    d.fields.forEach((n: Alteryx.FieldInfo, i: number) => {
      fields.push(n)
      preview[n.strName] = d.data[0][i]
    })
    console.log('preview')
  }

  if (fieldsElement) {
    if (d.errorMsg) {
      fieldsElement.style.color = 'red'
      fieldsElement.innerHTML = d.errorMsg
    } else {
      fieldsElement.innerHTML = '<table>' + fields.map(f => `<tr><td><abbr title="${f.strType} : ${f.strSource}">${f.strName}</abbr></td><td>${preview[f.strName]}</td></tr>`).join('\r\n') + '</table>'
    }

    if (fieldsElement.parentElement) {
      fieldsElement.parentElement.style.display = 'block'
    }
  }
}

Alteryx.Gui.BeforeLoad = (manager, dataItems) => {
  if (!manager.GetDataItemByDataName('ColumnName')) {
    manager.AddDataItem(new dataItems.SimpleString({ dataname: 'ColumnName', id: 'ColumnName', initialValue: 'HelloFromJS' }))
  }

  const modeItem = manager.GetDataItemByDataName('Mode')
  const mode = modeItem ? modeItem.getValue() : modes[0]
  manager.RemoveDataItemByDataName('Mode')
  const newModeItem = new dataItems.StringSelector({dataname: 'Mode', id: 'Mode'})
  newModeItem.setStringList(modes.map(n => { return {dataname: n.toLowerCase(), uiobject: n, default: n === mode } }))
  manager.AddDataItem(newModeItem)

  if (!manager.GetDataItemByDataName('Value')) {
    manager.AddDataItem(new dataItems.SimpleString({ dataname: 'Value', id: 'Value', initialValue: 'Hello From JavaScript' }))
  }
  if (!manager.GetDataItemByDataName('Expression')) {
    manager.AddDataItem(new dataItems.SimpleString({ dataname: 'Expression', id: 'Expression', initialValue: 'Hello From JavaScript' }))
  }
  if (!manager.GetDataItemByDataName('Function')) {
    manager.AddDataItem(new dataItems.SimpleString({ dataname: 'Function', id: 'Function', initialValue: '(r, i) => `${i} - $`JSON.stringify(r)`' }))
  }
}

Alteryx.Gui.AfterLoad = (manager) => {
  const ColumnNameItem: AlteryxDataItems.SimpleString = manager.GetDataItemByDataName('ColumnName')
  ColumnNameItem.BindUserDataChanged((newValue) => {
    const newString: string = (newValue || '').toString()
    const element = document.getElementById('fieldNameValid')
    if (element) element.innerHTML = (newString.trim() === '') ? 'You must enter a field name' : ''
  })
  Alteryx.JsEvent(JSON.stringify({Event: 'Message', Type: 1, Message: 'Hello from JS: AfterLoad'}))

  const modeItem = manager.GetDataItemByDataName('Mode')
  function modeItemChanged() {
    const modeValue = modeItem.getValue()
    modes.map(m => m.toLowerCase()).forEach(m => (document.getElementById(m) || { style: { display: ''} }).style.display = (m === modeValue ? 'block' : 'none'))
  }
  modeItem.BindUserDataChanged(modeItemChanged)
  modeItemChanged()

  Alteryx.JsEvent(JSON.stringify({
    Event: 'GetInputData',
    callback: 'previewCallback',
    anchorIndex: 0,
    connectionName: '',
    numRecs: 1,
    offset: 0
  }))
}

Alteryx.Gui.Annotation = (manager) => {
  const ColumnNameItem: AlteryxDataItems.SimpleString = manager.GetDataItemByDataName('ColumnName')
  const ValueItem: AlteryxDataItems.SimpleString = manager.GetDataItemByDataName('Value')
  return `${(ColumnNameItem.getValue())}:\r\n${ValueItem.getValue().replace(/^(.{27}).{3,}/, '$1...')}`
}

Alteryx.Gui.BeforeGetConfiguration = (json) => {
  if ((json.Configuration.ColumnName || '').trim() === '') {
    json.Configuration.ColumnName = 'NewJSColumn'
    json.Annotation = `NewJSColumn:\r\n${(json.Annotation || '').replace(/^.*?:\r\n/, '')}`
  }
  return json
}
