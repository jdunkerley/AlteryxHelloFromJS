const path = require('path')

module.exports = {
  entry: {
    HelloFromJS: './HelloFromJS/HelloFromJS.js',
    HelloFromJSGui: './HelloFromJS/HelloFromJSGui.js'
  },
  output: {
    path: path.join(__dirname, 'HelloFromJS'),
    filename: '[name].bundle.js'
  }
}
