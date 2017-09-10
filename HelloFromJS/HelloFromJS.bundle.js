/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 82);
/******/ })
/************************************************************************/
/******/ ({

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../AlteryxEngine.d.ts" />
const globalConfiguration = {
    state: '',
    columnName: 'HelloFromJS',
    value: 'Hello from JavaScript'
};
Alteryx.Plugin.DefineConnections = () => {
    console.log('DefineConnections Called.');
    return {
        IncomingConnections: [{ type: 'Input' }],
        OutgoingConnections: [{ name: 'Output' }]
    };
};
Alteryx.Plugin.PI_Init = (config) => {
    console.log('PI_Init Called.');
    globalConfiguration.state = 'Inited';
    if (config.Configuration) {
        globalConfiguration.columnName = config.Configuration['ColumnName'] || globalConfiguration.columnName;
        globalConfiguration.value = config.Configuration['Function'] || config.Configuration['Value'] || globalConfiguration.value;
    }
};
Alteryx.Plugin.II_Init = (metaInfo) => {
    console.log(`II_Init Called: ${metaInfo.Connection}.`);
    globalConfiguration.state = 'Connected';
    const newField = { name: globalConfiguration.columnName, type: 'V_WString', size: 64532 };
    Alteryx.Engine.SendMessage.RecordInfo('Output', { Field: [...metaInfo.RecordInfo.Field, newField] });
};
Alteryx.Plugin.II_PushRecords = (data) => {
    console.log(`II_PushRecords Called: ${data.Connection}.`);
    Alteryx.Engine.SendMessage.PushRecords('Output', data.Records.map(r => [...r, globalConfiguration.value]));
    Alteryx.JsEvent(JSON.stringify({ Event: 'PushRecords', Connection: 'Output', ToolProgress: data.Progress, Records: '[]' }));
};
Alteryx.Plugin.II_AllClosed = () => {
    console.log('II_AllClosed Called.');
    globalConfiguration.state = 'Closed.';
    Alteryx.Engine.SendMessage.CloseOutput('Output');
    Alteryx.Engine.SendMessage.Complete();
};
Alteryx.Plugin.PI_Close = () => {
    console.log('PI_Close Called.');
    if (globalConfiguration.state === 'Inited') {
        Alteryx.Engine.SendMessage.Error('HelloFromJS requires an Input connection');
    }
    Alteryx.Engine.SendMessage.PI_Close();
};
//# sourceMappingURL=HelloFromJS.js.map

/***/ })

/******/ });