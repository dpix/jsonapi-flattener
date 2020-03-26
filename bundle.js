"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var findIncluded = function findIncluded(id, type, included) {
  var data = included.find(function (i) {
    return i.id === id && i.type === type;
  }); // eslint-disable-next-line no-use-before-define

  return data ? normalize(data, included) : {};
};

var normalizeRelationships = function normalizeRelationships(relationships, included) {
  var flattenedRelationships = Object.entries(relationships).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        value = _ref2[1];

    return value && value.data;
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        propertyName = _ref4[0],
        value = _ref4[1];

    var isArray = Array.isArray(value.data);
    return _defineProperty({}, propertyName, isArray ? value.data.map(function (d) {
      return _objectSpread({}, d, {}, findIncluded(d.id, d.type, included));
    }) : _objectSpread({
      id: value.data.id,
      type: value.data.type
    }, findIncluded(value.data.id, value.data.type, included)));
  }).reduce(function (acc, current) {
    return _objectSpread({}, acc, {}, current);
  }, {});
  return flattenedRelationships;
};

var normalize = function normalize() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var included = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var id = data.id,
      type = data.type,
      _data$attributes = data.attributes,
      attributes = _data$attributes === void 0 ? {} : _data$attributes,
      _data$relationships = data.relationships,
      relationships = _data$relationships === void 0 ? {} : _data$relationships;

  var normalizedAttributes = _objectSpread({
    id: id,
    type: type
  }, attributes);

  var normalizedRelationships = normalizeRelationships(relationships, included);
  return _objectSpread({}, normalizedAttributes, {}, normalizedRelationships);
};

var normalizeResponse = function normalizeResponse(_ref6) {
  var data = _ref6.data,
      _ref6$included = _ref6.included,
      included = _ref6$included === void 0 ? [] : _ref6$included,
      _ref6$meta = _ref6.meta,
      meta = _ref6$meta === void 0 ? {} : _ref6$meta;

  if (Array.isArray(data)) {
    return _objectSpread({
      data: data.map(function (d) {
        return normalize(d, included);
      })
    }, meta);
  }

  return _objectSpread({}, normalize(data, included), {}, meta);
};

var _default = normalizeResponse;
exports["default"] = _default;
