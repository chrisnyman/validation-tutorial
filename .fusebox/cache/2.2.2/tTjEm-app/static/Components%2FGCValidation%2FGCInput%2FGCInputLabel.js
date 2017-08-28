module.exports = { contents: "'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = GCInputLabel;\n\nvar _react = require('react');\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _lodash = require('lodash');\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction GCInputLabel(_ref) {\n  var title = _ref.title,\n      required = _ref.required,\n      name = _ref.name,\n      value = _ref.value;\n\n  var inlineClass = _lodash2.default.isEmpty(value) ? 'gc-input__label--inline' : '';\n  var requiredClass = required ? 'gc-input__label--required' : '';\n  if (!_lodash2.default.isEmpty(title)) {\n    return _react2.default.createElement(\n      'label',\n      {\n        className: 'gc-input__label ' + inlineClass + ' ' + requiredClass,\n        htmlFor: name },\n      title\n    );\n  }\n  return null;\n}\n// import PropTypes from 'prop-types';\n;",
dependencies: ["react","lodash"],
sourceMap: {},
headerContent: undefined,
mtime: 1503951121000,
devLibsRequired : undefined
};