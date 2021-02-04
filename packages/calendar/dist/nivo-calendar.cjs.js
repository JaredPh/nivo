'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var core = require('@nivo/core');
var legends = require('@nivo/legends');
var PropTypes = _interopDefault(require('prop-types'));
var d3TimeFormat = require('d3-time-format');
var tooltip = require('@nivo/tooltip');
var memoize = _interopDefault(require('lodash.memoize'));
var isDate = _interopDefault(require('lodash.isdate'));
var range = _interopDefault(require('lodash.range'));
var d3Time = require('d3-time');
var d3Scale = require('d3-scale');

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

var CalendarTooltip = React.memo(function (_ref) {
  var value = _ref.value,
      day = _ref.day,
      color = _ref.color;
  if (value === undefined || isNaN(value)) return null;
  return React__default.createElement(tooltip.BasicTooltip, {
    id: day,
    value: value,
    color: color,
    enableChip: true
  });
});
CalendarTooltip.displayName = 'CalendarTooltip';

var monthLabelFormat = d3TimeFormat.timeFormat('%b');
var commonPropTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired,
  align: PropTypes.oneOf(core.boxAlignments).isRequired,
  minValue: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  maxValue: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorScale: PropTypes.func,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  emptyColor: PropTypes.string.isRequired,
  yearLegend: PropTypes.func.isRequired,
  yearSpacing: PropTypes.number.isRequired,
  yearLegendPosition: PropTypes.oneOf(['before', 'after']).isRequired,
  yearLegendOffset: PropTypes.number.isRequired,
  monthBorderWidth: PropTypes.number.isRequired,
  monthBorderColor: PropTypes.string.isRequired,
  monthLegend: PropTypes.func.isRequired,
  monthSpacing: PropTypes.number.isRequired,
  monthLegendPosition: PropTypes.oneOf(['before', 'after']).isRequired,
  monthLegendOffset: PropTypes.number.isRequired,
  daySpacing: PropTypes.number.isRequired,
  dayBorderWidth: PropTypes.number.isRequired,
  dayBorderColor: PropTypes.string.isRequired,
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  valueFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  legendFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  legends: PropTypes.arrayOf(PropTypes.shape(_objectSpread2(_objectSpread2({}, legends.LegendPropShape), {}, {
    itemCount: PropTypes.number.isRequired
  }))).isRequired
};
var CalendarPropTypes = _objectSpread2(_objectSpread2({}, commonPropTypes), {}, {
  role: PropTypes.string.isRequired
});
var CalendarCanvasPropTypes = _objectSpread2(_objectSpread2({}, commonPropTypes), {}, {
  pixelRatio: PropTypes.number.isRequired
});
var commonDefaultProps = {
  colors: ['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
  align: 'center',
  direction: 'horizontal',
  emptyColor: '#fff',
  minValue: 0,
  maxValue: 'auto',
  yearSpacing: 30,
  yearLegend: function yearLegend(year) {
    return year;
  },
  yearLegendPosition: 'before',
  yearLegendOffset: 10,
  monthBorderWidth: 2,
  monthBorderColor: '#000',
  monthSpacing: 0,
  monthLegend: function monthLegend(year, month, date) {
    return monthLabelFormat(date);
  },
  monthLegendPosition: 'before',
  monthLegendOffset: 10,
  weekdayLegend: function weekdayLegend(d) {
    return d;
  },
  daySpacing: 0,
  dayBorderWidth: 1,
  dayBorderColor: '#000',
  isInteractive: true,
  legends: [],
  tooltip: CalendarTooltip
};
var CalendarDefaultProps = _objectSpread2(_objectSpread2({}, commonDefaultProps), {}, {
  role: 'img'
});
var CalendarCanvasDefaultProps = _objectSpread2(_objectSpread2({}, commonDefaultProps), {}, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});

var CalendarYearLegends = React.memo(function (_ref) {
  var years = _ref.years,
      legend = _ref.legend,
      theme = _ref.theme;
  return React__default.createElement(React__default.Fragment, null, years.map(function (year) {
    return React__default.createElement("text", {
      key: year.year,
      transform: "translate(".concat(year.x, ",").concat(year.y, ") rotate(").concat(year.rotation, ")"),
      textAnchor: "middle",
      style: theme.labels.text
    }, legend(year.year));
  }));
});
CalendarYearLegends.displayName = 'CalendarYearLegends';

var CalendarMonthPath = React.memo(function (_ref) {
  var path = _ref.path,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor;
  return React__default.createElement("path", {
    d: path,
    style: {
      fill: 'none',
      strokeWidth: borderWidth,
      stroke: borderColor,
      pointerEvents: 'none'
    }
  });
});
CalendarMonthPath.displayName = 'CalendarMonthPath';

var CalendarMonthLegends = React.memo(function (_ref) {
  var months = _ref.months,
      legend = _ref.legend,
      theme = _ref.theme;
  return React__default.createElement(React__default.Fragment, null, months.map(function (month) {
    return React__default.createElement("text", {
      key: "".concat(month.date.toString(), ".legend"),
      transform: "translate(".concat(month.x, ",").concat(month.y, ") rotate(").concat(month.rotation, ")"),
      textAnchor: "middle",
      style: theme.labels.text
    }, legend(month.year, month.month, month.date));
  }));
});
CalendarMonthLegends.displayName = 'CalendarMonthLegends';

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var computeCellSize = function computeCellSize(_ref) {
  var width = _ref.width,
      height = _ref.height,
      direction = _ref.direction,
      yearRange = _ref.yearRange,
      yearSpacing = _ref.yearSpacing,
      monthSpacing = _ref.monthSpacing,
      daySpacing = _ref.daySpacing,
      maxWeeks = _ref.maxWeeks;
  var hCellSize;
  var vCellSize;
  if (direction === 'horizontal') {
    hCellSize = (width - monthSpacing * 12 - daySpacing * maxWeeks) / maxWeeks;
    vCellSize = (height - (yearRange.length - 1) * yearSpacing - yearRange.length * (8 * daySpacing)) / (yearRange.length * 7);
  } else {
    hCellSize = (width - (yearRange.length - 1) * yearSpacing - yearRange.length * (8 * daySpacing)) / (yearRange.length * 7);
    vCellSize = (height - monthSpacing * 12 - daySpacing * maxWeeks) / maxWeeks;
  }
  return Math.min(hCellSize, vCellSize);
};
var monthPathAndBBox = function monthPathAndBBox(_ref2) {
  var date = _ref2.date,
      cellSize = _ref2.cellSize,
      yearIndex = _ref2.yearIndex,
      yearSpacing = _ref2.yearSpacing,
      monthSpacing = _ref2.monthSpacing,
      daySpacing = _ref2.daySpacing,
      direction = _ref2.direction,
      originX = _ref2.originX,
      originY = _ref2.originY;
  var t1 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var firstWeek = d3Time.timeWeek.count(d3Time.timeYear(date), date);
  var lastWeek = d3Time.timeWeek.count(d3Time.timeYear(t1), t1);
  var firstDay = date.getDay();
  var lastDay = t1.getDay();
  var xO = originX;
  var yO = originY;
  var yearOffset = yearIndex * (7 * (cellSize + daySpacing) + yearSpacing);
  var monthOffset = date.getMonth() * monthSpacing;
  if (direction === 'horizontal') {
    yO += yearOffset;
    xO += monthOffset;
  } else {
    yO += monthOffset;
    xO += yearOffset;
  }
  var path;
  var bbox = {
    x: xO,
    y: yO,
    width: 0,
    height: 0
  };
  if (direction === 'horizontal') {
    path = ["M".concat(xO + (firstWeek + 1) * (cellSize + daySpacing), ",").concat(yO + firstDay * (cellSize + daySpacing)), "H".concat(xO + firstWeek * (cellSize + daySpacing), "V").concat(yO + 7 * (cellSize + daySpacing)), "H".concat(xO + lastWeek * (cellSize + daySpacing), "V").concat(yO + (lastDay + 1) * (cellSize + daySpacing)), "H".concat(xO + (lastWeek + 1) * (cellSize + daySpacing), "V").concat(yO), "H".concat(xO + (firstWeek + 1) * (cellSize + daySpacing), "Z")].join('');
    bbox.x = xO + firstWeek * (cellSize + daySpacing);
    bbox.width = xO + (lastWeek + 1) * (cellSize + daySpacing) - bbox.x;
    bbox.height = 7 * (cellSize + daySpacing);
  } else {
    path = ["M".concat(xO + firstDay * (cellSize + daySpacing), ",").concat(yO + (firstWeek + 1) * (cellSize + daySpacing)), "H".concat(xO, "V").concat(yO + (lastWeek + 1) * (cellSize + daySpacing)), "H".concat(xO + (lastDay + 1) * (cellSize + daySpacing), "V").concat(yO + lastWeek * (cellSize + daySpacing)), "H".concat(xO + 7 * (cellSize + daySpacing), "V").concat(yO + firstWeek * (cellSize + daySpacing)), "H".concat(xO + firstDay * (cellSize + daySpacing), "Z")].join('');
    bbox.y = yO + firstWeek * (cellSize + daySpacing);
    bbox.width = 7 * (cellSize + daySpacing);
    bbox.height = yO + (lastWeek + 1) * (cellSize + daySpacing) - bbox.y;
  }
  return {
    path: path,
    bbox: bbox
  };
};
var memoMonthPathAndBBox = memoize(monthPathAndBBox, function (_ref3) {
  var date = _ref3.date,
      cellSize = _ref3.cellSize,
      yearIndex = _ref3.yearIndex,
      yearSpacing = _ref3.yearSpacing,
      monthSpacing = _ref3.monthSpacing,
      daySpacing = _ref3.daySpacing,
      direction = _ref3.direction,
      originX = _ref3.originX,
      originY = _ref3.originY;
  return "".concat(date.toString(), ".").concat(cellSize, ".").concat(yearIndex, ".").concat(yearSpacing, ".").concat(monthSpacing, ".").concat(daySpacing, ".").concat(direction, ".").concat(originX, ".").concat(originY);
});
var cellPositionHorizontal = function cellPositionHorizontal(cellSize, yearSpacing, monthSpacing, daySpacing) {
  return function (originX, originY, d, yearIndex) {
    var weekOfYear = d3Time.timeWeek.count(d3Time.timeYear(d), d);
    return {
      x: originX + weekOfYear * (cellSize + daySpacing) + daySpacing / 2 + d.getMonth() * monthSpacing,
      y: originY + d.getDay() * (cellSize + daySpacing) + daySpacing / 2 + yearIndex * (yearSpacing + 7 * (cellSize + daySpacing))
    };
  };
};
var cellPositionVertical = function cellPositionVertical(cellSize, yearSpacing, monthSpacing, daySpacing) {
  return function (originX, originY, d, yearIndex) {
    var weekOfYear = d3Time.timeWeek.count(d3Time.timeYear(d), d);
    return {
      x: originX + d.getDay() * (cellSize + daySpacing) + daySpacing / 2 + yearIndex * (yearSpacing + 7 * (cellSize + daySpacing)),
      y: originY + weekOfYear * (cellSize + daySpacing) + daySpacing / 2 + d.getMonth() * monthSpacing
    };
  };
};
var dayFormat = d3TimeFormat.timeFormat('%Y-%m-%d');
var computeLayout = function computeLayout(_ref4) {
  var width = _ref4.width,
      height = _ref4.height,
      from = _ref4.from,
      to = _ref4.to,
      direction = _ref4.direction,
      yearSpacing = _ref4.yearSpacing,
      monthSpacing = _ref4.monthSpacing,
      daySpacing = _ref4.daySpacing,
      align = _ref4.align;
  var fromDate = isDate(from) ? from : new Date(from);
  var toDate = isDate(to) ? to : new Date(to);
  var yearRange = range(fromDate.getFullYear(), toDate.getFullYear() + 1);
  var maxWeeks = Math.max.apply(Math, _toConsumableArray(yearRange.map(function (year) {
    return d3Time.timeWeeks(new Date(year, 0, 1), new Date(year + 1, 0, 1)).length;
  }))) + 1;
  var cellSize = computeCellSize({
    width: width,
    height: height,
    direction: direction,
    yearRange: yearRange,
    yearSpacing: yearSpacing,
    monthSpacing: monthSpacing,
    daySpacing: daySpacing,
    maxWeeks: maxWeeks
  });
  var monthsSize = cellSize * maxWeeks + daySpacing * maxWeeks + monthSpacing * 12;
  var yearsSize = (cellSize + daySpacing) * 7 * yearRange.length + yearSpacing * (yearRange.length - 1);
  var calendarWidth = direction === 'horizontal' ? monthsSize : yearsSize;
  var calendarHeight = direction === 'horizontal' ? yearsSize : monthsSize;
  var _alignBox = core.alignBox({
    x: 0,
    y: 0,
    width: calendarWidth,
    height: calendarHeight
  }, {
    x: 0,
    y: 0,
    width: width,
    height: height
  }, align),
      _alignBox2 = _slicedToArray(_alignBox, 2),
      originX = _alignBox2[0],
      originY = _alignBox2[1];
  var cellPosition;
  if (direction === 'horizontal') {
    cellPosition = cellPositionHorizontal(cellSize, yearSpacing, monthSpacing, daySpacing);
  } else {
    cellPosition = cellPositionVertical(cellSize, yearSpacing, monthSpacing, daySpacing);
  }
  var years = [];
  var months = [];
  var days = [];
  yearRange.forEach(function (year, i) {
    var yearStart = new Date(year, 0, 1);
    var yearEnd = new Date(year + 1, 0, 1);
    days = days.concat(d3Time.timeDays(yearStart, yearEnd).map(function (dayDate) {
      return _objectSpread2({
        date: dayDate,
        day: dayFormat(dayDate),
        size: cellSize
      }, cellPosition(originX, originY, dayDate, i));
    }));
    var yearMonths = d3Time.timeMonths(yearStart, yearEnd).map(function (monthDate) {
      return _objectSpread2({
        date: monthDate,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth()
      }, memoMonthPathAndBBox({
        originX: originX,
        originY: originY,
        date: monthDate,
        direction: direction,
        yearIndex: i,
        yearSpacing: yearSpacing,
        monthSpacing: monthSpacing,
        daySpacing: daySpacing,
        cellSize: cellSize
      }));
    });
    months = months.concat(yearMonths);
    years.push({
      year: year,
      bbox: {
        x: yearMonths[0].bbox.x,
        y: yearMonths[0].bbox.y,
        width: yearMonths[11].bbox.x - yearMonths[0].bbox.x + yearMonths[11].bbox.width,
        height: yearMonths[11].bbox.y - yearMonths[0].bbox.y + yearMonths[11].bbox.height
      }
    });
  });
  return {
    years: years,
    months: months,
    days: days,
    cellSize: cellSize,
    calendarWidth: calendarWidth,
    calendarHeight: calendarHeight,
    originX: originX,
    originY: originY
  };
};

var useCalendarLayout = function useCalendarLayout(_ref) {
  var width = _ref.width,
      height = _ref.height,
      from = _ref.from,
      to = _ref.to,
      direction = _ref.direction,
      yearSpacing = _ref.yearSpacing,
      monthSpacing = _ref.monthSpacing,
      daySpacing = _ref.daySpacing,
      align = _ref.align;
  return React.useMemo(function () {
    return computeLayout({
      width: width,
      height: height,
      from: from,
      to: to,
      direction: direction,
      yearSpacing: yearSpacing,
      monthSpacing: monthSpacing,
      daySpacing: daySpacing,
      align: align
    });
  }, [width, height, from, to, direction, yearSpacing, monthSpacing, daySpacing, align]);
};

var computeDomain = function computeDomain(data, minSpec, maxSpec) {
  var allValues = data.map(function (d) {
    return d.value;
  });
  var minValue = minSpec === 'auto' ? Math.min.apply(Math, _toConsumableArray(allValues)) : minSpec;
  var maxValue = maxSpec === 'auto' ? Math.max.apply(Math, _toConsumableArray(allValues)) : maxSpec;
  return [minValue, maxValue];
};
var computeMonthLegendPositions = function computeMonthLegendPositions(_ref) {
  var months = _ref.months,
      direction = _ref.direction,
      position = _ref.position,
      offset = _ref.offset;
  return months.map(function (month) {
    var x = 0;
    var y = 0;
    var rotation = 0;
    if (direction === 'horizontal' && position === 'before') {
      x = month.bbox.x + month.bbox.width / 2;
      y = month.bbox.y - offset;
    } else if (direction === 'horizontal' && position === 'after') {
      x = month.bbox.x + month.bbox.width / 2;
      y = month.bbox.y + month.bbox.height + offset;
    } else if (direction === 'vertical' && position === 'before') {
      x = month.bbox.x - offset;
      y = month.bbox.y + month.bbox.height / 2;
      rotation = -90;
    } else {
      x = month.bbox.x + month.bbox.width + offset;
      y = month.bbox.y + month.bbox.height / 2;
      rotation = -90;
    }
    return _objectSpread2(_objectSpread2({}, month), {}, {
      x: x,
      y: y,
      rotation: rotation
    });
  });
};
var bindDaysData = function bindDaysData(_ref2) {
  var days = _ref2.days,
      data = _ref2.data,
      colorScale = _ref2.colorScale,
      emptyColor = _ref2.emptyColor;
  return days.map(function (day) {
    day.color = emptyColor;
    data.forEach(function (dayData) {
      if (dayData.day === day.day) {
        day.value = dayData.value;
        day.color = colorScale(dayData.value);
        day.data = dayData;
      }
    });
    return day;
  });
};
var computeBlockLegendPositions = function computeBlockLegendPositions(_ref3) {
  var blocks = _ref3.blocks,
      direction = _ref3.direction,
      position = _ref3.position,
      offset = _ref3.offset;
  return blocks.map(function (block) {
    var x = 0;
    var y = 0;
    var rotation = 0;
    if (direction === 'horizontal' && position === 'before') {
      x = block.bbox.x - offset;
      y = block.bbox.y + block.bbox.height / 2;
      rotation = -90;
    } else if (direction === 'horizontal' && position === 'after') {
      x = block.bbox.x + block.bbox.width + offset;
      y = block.bbox.y + block.bbox.height / 2;
      rotation = -90;
    } else if (direction === 'vertical' && position === 'before') {
      x = block.bbox.x + block.bbox.width / 2;
      y = block.bbox.y - offset;
    } else {
      x = block.bbox.x + block.bbox.width / 2;
      y = block.bbox.y + block.bbox.height + offset;
    }
    return _objectSpread2(_objectSpread2({}, block), {}, {
      x: x,
      y: y,
      rotation: rotation
    });
  });
};

var useColorScale = function useColorScale(_ref) {
  var data = _ref.data,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      colors = _ref.colors,
      colorScale = _ref.colorScale;
  return React.useMemo(function () {
    if (colorScale) return colorScale;
    var domain = computeDomain(data, minValue, maxValue);
    var defaultColorScale = d3Scale.scaleQuantize().domain(domain).range(colors);
    return defaultColorScale;
  }, [data, minValue, maxValue, colors, colorScale]);
};
var useBlockLegends = function useBlockLegends(_ref2) {
  var blocks = _ref2.blocks,
      direction = _ref2.direction,
      blockLegendPosition = _ref2.blockLegendPosition,
      blockLegendOffset = _ref2.blockLegendOffset;
  return React.useMemo(function () {
    return computeBlockLegendPositions({
      blocks: blocks,
      direction: direction,
      position: blockLegendPosition,
      offset: blockLegendOffset
    });
  }, [blocks, direction, blockLegendPosition, blockLegendOffset]);
};
var useDays = function useDays(_ref3) {
  var days = _ref3.days,
      data = _ref3.data,
      colorScale = _ref3.colorScale,
      emptyColor = _ref3.emptyColor;
  return React.useMemo(function () {
    return bindDaysData({
      days: days,
      data: data,
      colorScale: colorScale,
      emptyColor: emptyColor
    });
  }, [days, data, colorScale, emptyColor]);
};
var useMonthLegends = function useMonthLegends(_ref4) {
  var months = _ref4.months,
      direction = _ref4.direction,
      monthLegendPosition = _ref4.monthLegendPosition,
      monthLegendOffset = _ref4.monthLegendOffset;
  return React.useMemo(function () {
    return computeMonthLegendPositions({
      months: months,
      direction: direction,
      position: monthLegendPosition,
      offset: monthLegendOffset
    });
  }, [months, direction, monthLegendPosition, monthLegendOffset]);
};

var CalendarDay = React.memo(function (_ref) {
  var data = _ref.data,
      x = _ref.x,
      y = _ref.y,
      size = _ref.size,
      color = _ref.color,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      isInteractive = _ref.isInteractive,
      tooltip$1 = _ref.tooltip,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick,
      formatValue = _ref.formatValue;
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseEnter = React.useCallback(function (event) {
    var formatedData = _objectSpread2(_objectSpread2({}, data), {}, {
      value: formatValue(data.value),
      data: _objectSpread2({}, data.data)
    });
    showTooltipFromEvent(React__default.createElement(tooltip$1, _objectSpread2({}, formatedData)), event);
    onMouseEnter && onMouseEnter(data, event);
  }, [showTooltipFromEvent, tooltip$1, data, onMouseEnter, formatValue]);
  var handleMouseMove = React.useCallback(function (event) {
    var formatedData = _objectSpread2(_objectSpread2({}, data), {}, {
      value: formatValue(data.value),
      data: _objectSpread2({}, data.data)
    });
    showTooltipFromEvent(React__default.createElement(tooltip$1, _objectSpread2({}, formatedData)), event);
    onMouseMove && onMouseMove(data, event);
  }, [showTooltipFromEvent, tooltip$1, data, onMouseMove, formatValue]);
  var handleMouseLeave = React.useCallback(function (event) {
    hideTooltip();
    onMouseLeave && onMouseLeave(data, event);
  }, [hideTooltip, data, onMouseLeave]);
  var handleClick = React.useCallback(function (event) {
    return onClick && onClick(data, event);
  }, [data, onClick]);
  return React__default.createElement("rect", {
    x: x,
    y: y,
    width: size,
    height: size,
    style: {
      fill: color,
      strokeWidth: borderWidth,
      stroke: borderColor
    },
    onMouseEnter: isInteractive ? handleMouseEnter : undefined,
    onMouseMove: isInteractive ? handleMouseMove : undefined,
    onMouseLeave: isInteractive ? handleMouseLeave : undefined,
    onClick: isInteractive ? handleClick : undefined
  });
});
CalendarDay.displayName = 'CalendarDay';

var Calendar = function Calendar(_ref) {
  var partialMargin = _ref.margin,
      width = _ref.width,
      height = _ref.height,
      align = _ref.align,
      colors = _ref.colors,
      colorScale = _ref.colorScale,
      data = _ref.data,
      direction = _ref.direction,
      emptyColor = _ref.emptyColor,
      from = _ref.from,
      to = _ref.to,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      valueFormat = _ref.valueFormat,
      legendFormat = _ref.legendFormat,
      yearLegend = _ref.yearLegend,
      yearLegendOffset = _ref.yearLegendOffset,
      yearLegendPosition = _ref.yearLegendPosition,
      yearSpacing = _ref.yearSpacing,
      monthBorderColor = _ref.monthBorderColor,
      monthBorderWidth = _ref.monthBorderWidth,
      monthLegend = _ref.monthLegend,
      monthLegendOffset = _ref.monthLegendOffset,
      monthLegendPosition = _ref.monthLegendPosition,
      monthSpacing = _ref.monthSpacing,
      dayBorderColor = _ref.dayBorderColor,
      dayBorderWidth = _ref.dayBorderWidth,
      daySpacing = _ref.daySpacing,
      isInteractive = _ref.isInteractive,
      tooltip = _ref.tooltip,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseMove = _ref.onMouseMove,
      legends$1 = _ref.legends,
      role = _ref.role;
  var theme = core.useTheme();
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useCalendarLayout = useCalendarLayout({
    width: innerWidth,
    height: innerHeight,
    from: from,
    to: to,
    direction: direction,
    yearSpacing: yearSpacing,
    monthSpacing: monthSpacing,
    daySpacing: daySpacing,
    align: align
  }),
      months = _useCalendarLayout.months,
      years = _useCalendarLayout.years,
      rest = _objectWithoutProperties(_useCalendarLayout, ["months", "years"]);
  var colorScaleFn = useColorScale({
    data: data,
    minValue: minValue,
    maxValue: maxValue,
    colors: colors,
    colorScale: colorScale
  });
  var monthLegends = useMonthLegends({
    months: months,
    direction: direction,
    monthLegendPosition: monthLegendPosition,
    monthLegendOffset: monthLegendOffset
  });
  var yearLegends = useBlockLegends({
    blocks: years,
    direction: direction,
    blockLegendPosition: yearLegendPosition,
    blockLegendOffset: yearLegendOffset
  });
  var days = useDays({
    days: rest.days,
    data: data,
    colorScale: colorScaleFn,
    emptyColor: emptyColor
  });
  var formatLegend = core.useValueFormatter(legendFormat);
  var formatValue = core.useValueFormatter(valueFormat);
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin,
    theme: theme,
    role: role
  }, days.map(function (d) {
    return React__default.createElement(CalendarDay, {
      key: d.date.toString(),
      data: d,
      x: d.x,
      y: d.y,
      size: d.size,
      spacing: daySpacing,
      color: d.color,
      borderWidth: dayBorderWidth,
      borderColor: dayBorderColor,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onMouseMove: onMouseMove,
      isInteractive: isInteractive,
      tooltip: tooltip,
      theme: theme,
      onClick: onClick,
      formatValue: formatValue
    });
  }), months.map(function (m) {
    return React__default.createElement(CalendarMonthPath, {
      key: m.date.toString(),
      path: m.path,
      borderWidth: monthBorderWidth,
      borderColor: monthBorderColor
    });
  }), React__default.createElement(CalendarMonthLegends, {
    months: monthLegends,
    legend: monthLegend,
    theme: theme
  }), React__default.createElement(CalendarYearLegends, {
    years: yearLegends,
    legend: yearLegend,
    theme: theme
  }), legends$1.map(function (legend, i) {
    var legendData = colorScaleFn.ticks(legend.itemCount).map(function (value) {
      return {
        id: value,
        label: formatLegend(value),
        color: colorScaleFn(value)
      };
    });
    return React__default.createElement(legends.BoxLegendSvg, Object.assign({
      key: i
    }, legend, {
      containerWidth: width,
      containerHeight: height,
      data: legendData,
      theme: theme
    }));
  }));
};
Calendar.displayName = 'Calendar';
Calendar.defaultProps = CalendarDefaultProps;
var Calendar$1 = core.withContainer(Calendar);

var CalendarBlockLegends = React.memo(function (_ref) {
  var blocks = _ref.blocks,
      legend = _ref.legend,
      theme = _ref.theme;
  return React__default.createElement(React__default.Fragment, null, blocks.map(function (block) {
    return React__default.createElement("text", {
      key: String(block.firstYear) + String(block.firstMonth) + String(block.lastYear) + String(block.lastMonth),
      transform: "translate(".concat(block.x, ",").concat(block.y, ") rotate(").concat(block.rotation, ")"),
      textAnchor: "middle",
      style: theme.labels.text
    }, legend(block));
  }));
});
CalendarBlockLegends.displayName = 'CalendarBlockLegends';

var computeDomain$1 = function computeDomain(data, minSpec, maxSpec) {
  var allValues = data.map(function (d) {
    return d.value;
  });
  var minValue = minSpec === 'auto' ? Math.min.apply(Math, _toConsumableArray(allValues)) : minSpec;
  var maxValue = maxSpec === 'auto' ? Math.max.apply(Math, _toConsumableArray(allValues)) : maxSpec;
  return [minValue, maxValue];
};
var computeCellSize$1 = function computeCellSize(_ref) {
  var width = _ref.width,
      height = _ref.height,
      direction = _ref.direction,
      blocks = _ref.blocks,
      blockSpacing = _ref.blockSpacing,
      monthSpacing = _ref.monthSpacing,
      daySpacing = _ref.daySpacing,
      maxRowsMonth = _ref.maxRowsMonth,
      maxColumnsGroup = _ref.maxColumnsGroup,
      monthsPerGroup = _ref.monthsPerGroup;
  var hCellSize;
  var vCellSize;
  if (direction === 'horizontal') {
    hCellSize = (width - monthSpacing * monthsPerGroup - daySpacing * maxColumnsGroup) / maxColumnsGroup;
    vCellSize = (height - (blocks - 1) * blockSpacing - blocks * (maxRowsMonth * daySpacing)) / (blocks * maxRowsMonth);
  } else {
    hCellSize = (width - (blocks - 1) * blockSpacing - blocks * (maxRowsMonth * daySpacing)) / (blocks * maxRowsMonth);
    vCellSize = (height - monthSpacing * monthsPerGroup - daySpacing * maxColumnsGroup) / maxColumnsGroup;
  }
  return Math.min(hCellSize, vCellSize);
};
var monthPathAndBBox$1 = function monthPathAndBBox(_ref2) {
  var date = _ref2.date,
      cellSize = _ref2.cellSize,
      blockIndex = _ref2.blockIndex,
      blockSpacing = _ref2.blockSpacing,
      monthSpacing = _ref2.monthSpacing,
      daySpacing = _ref2.daySpacing,
      direction = _ref2.direction,
      originX = _ref2.originX,
      originY = _ref2.originY,
      startDate = _ref2.startDate,
      maxRowsMonth = _ref2.maxRowsMonth,
      weekDirection = _ref2.weekDirection;
  var t1 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var elapsedMonths = getElapsedMonths(startDate, date);
  var firstWeek;
  var lastWeek = direction === weekDirection ? d3Time.timeWeek.count(date, t1) : d3Time.timeWeek.count(startDate, t1);
  var firstDay = date.getDay();
  var lastDay = t1.getDay();
  var xO = originX;
  var yO = originY;
  if (direction === 'vertical' && weekDirection === 'vertical') {
    yO += elapsedMonths * (maxRowsMonth * (cellSize + daySpacing) + monthSpacing);
    xO += blockIndex * (7 * (cellSize + daySpacing) + blockSpacing);
    firstWeek = 0;
  } else if (direction === 'vertical' && weekDirection === 'horizontal') {
    firstWeek = d3Time.timeWeek.count(startDate, date);
    yO += elapsedMonths * monthSpacing;
    xO += blockIndex * (maxRowsMonth * (cellSize + daySpacing) + blockSpacing);
  } else if (direction === 'horizontal' && weekDirection === 'vertical') {
    firstWeek = d3Time.timeWeek.count(startDate, date);
    xO += elapsedMonths * monthSpacing;
    yO += blockIndex * (7 * (cellSize + daySpacing) + blockSpacing);
  } else {
    firstWeek = 0;
    xO += elapsedMonths * (monthSpacing + 7 * (cellSize + daySpacing));
    yO += blockIndex * (maxRowsMonth * (cellSize + daySpacing) + blockSpacing);
  }
  var path;
  var bbox = {
    x: xO,
    y: yO,
    width: 0,
    height: 0
  };
  if (weekDirection === 'vertical') {
    path = ["M".concat(xO + (firstWeek + 1) * (cellSize + daySpacing), ",").concat(yO + firstDay * (cellSize + daySpacing)), "H".concat(xO + firstWeek * (cellSize + daySpacing), "V").concat(yO + 7 * (cellSize + daySpacing)), "H".concat(xO + lastWeek * (cellSize + daySpacing), "V").concat(yO + (lastDay + 1) * (cellSize + daySpacing)), "H".concat(xO + (lastWeek + 1) * (cellSize + daySpacing), "V").concat(yO), "H".concat(xO + (firstWeek + 1) * (cellSize + daySpacing), "Z")].join('');
    bbox.x = xO + firstWeek * (cellSize + daySpacing);
    bbox.width = xO + (lastWeek + 1) * (cellSize + daySpacing) - bbox.x;
    bbox.height = 7 * (cellSize + daySpacing);
  } else {
    path = ["M".concat(xO + firstDay * (cellSize + daySpacing), ",").concat(yO + (firstWeek + 1) * (cellSize + daySpacing)), "H".concat(xO, "V").concat(yO + (lastWeek + 1) * (cellSize + daySpacing)), "H".concat(xO + (lastDay + 1) * (cellSize + daySpacing), "V").concat(yO + lastWeek * (cellSize + daySpacing)), "H".concat(xO + 7 * (cellSize + daySpacing), "V").concat(yO + firstWeek * (cellSize + daySpacing)), "H".concat(xO + firstDay * (cellSize + daySpacing), "Z")].join('');
    bbox.y = yO + firstWeek * (cellSize + daySpacing);
    bbox.width = 7 * (cellSize + daySpacing);
    bbox.height = yO + (lastWeek + 1) * (cellSize + daySpacing) - bbox.y;
  }
  return {
    path: path,
    bbox: bbox
  };
};
var getElapsedMonths = function getElapsedMonths(from, to) {
  return to.getMonth() - from.getMonth() + 12 * (to.getFullYear() - from.getFullYear());
};
var getA = function getA(d, blockIndex, blockSpacing, daySpacing, maxRowsMonth, cellSize) {
  var weekOfMonth = getWeekOfTheMonth(d);
  return weekOfMonth * (cellSize + daySpacing) + daySpacing / 2 + blockIndex * (blockSpacing + maxRowsMonth * (cellSize + daySpacing));
};
var getB = function getB(d, startDate, monthSpacing, daySpacing, cellSize) {
  var elapsedMonths = getElapsedMonths(startDate, d);
  return elapsedMonths * 7 * (cellSize + daySpacing) + d.getDay() * (cellSize + daySpacing) + daySpacing / 2 + elapsedMonths * monthSpacing;
};
var getC = function getC(d, blockIndex, blockSpacing, daySpacing, maxRowsMonth, cellSize) {
  return d.getDay() * (cellSize + daySpacing) + daySpacing / 2 + blockIndex * (blockSpacing + maxRowsMonth * (cellSize + daySpacing));
};
var getD = function getD(d, startDate, monthSpacing, daySpacing, cellSize) {
  var elapsedWeeks = d3Time.timeWeek.count(startDate, d);
  var elapsedMonths = getElapsedMonths(startDate, d);
  return elapsedWeeks * (cellSize + daySpacing) + daySpacing / 2 + elapsedMonths * monthSpacing;
};
var getWeekOfTheMonth = function getWeekOfTheMonth(date) {
  var firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  var offsetDate = date.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7);
};
var memoMonthPathAndBBox$1 = memoize(monthPathAndBBox$1, function (_ref3) {
  var date = _ref3.date,
      cellSize = _ref3.cellSize,
      blockIndex = _ref3.blockIndex,
      blockSpacing = _ref3.blockSpacing,
      monthSpacing = _ref3.monthSpacing,
      daySpacing = _ref3.daySpacing,
      direction = _ref3.direction,
      originX = _ref3.originX,
      originY = _ref3.originY,
      startDate = _ref3.startDate,
      maxRowsMonth = _ref3.maxRowsMonth,
      weekDirection = _ref3.weekDirection;
  return "".concat(date.toString(), ".").concat(startDate.toString(), ".").concat(maxRowsMonth, ".").concat(weekDirection, ".").concat(cellSize, ".").concat(blockIndex, ".").concat(blockSpacing, ".").concat(monthSpacing, ".").concat(daySpacing, ".").concat(direction, ".").concat(originX, ".").concat(originY);
});
var cellPositionHorizontalVertical = function cellPositionHorizontalVertical(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth) {
  return function (originX, originY, d, blockIndex, startDate) {
    return {
      x: originX + getD(d, startDate, monthSpacing, daySpacing, cellSize),
      y: originY + getC(d, blockIndex, blockSpacing, daySpacing, maxRowsMonth, cellSize)
    };
  };
};
var cellPositionVerticalHorizontal = function cellPositionVerticalHorizontal(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth) {
  return function (originX, originY, d, blockIndex, startDate) {
    return {
      x: originX + getC(d, blockIndex, blockSpacing, daySpacing, maxRowsMonth, cellSize),
      y: originY + getD(d, startDate, monthSpacing, daySpacing, cellSize)
    };
  };
};
var cellPositionVerticalVertical = function cellPositionVerticalVertical(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth) {
  return function (originX, originY, d, blockIndex, startDate) {
    return {
      x: originX + getA(d, blockIndex, blockSpacing, daySpacing, maxRowsMonth, cellSize),
      y: originY + getB(d, startDate, monthSpacing, daySpacing, cellSize)
    };
  };
};
var cellPositionHorizontalHorizontal = function cellPositionHorizontalHorizontal(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth) {
  return function (originX, originY, d, blockIndex, startDate) {
    return {
      x: originX + getB(d, startDate, monthSpacing, daySpacing, cellSize),
      y: originY + getA(d, blockIndex, blockSpacing, daySpacing, maxRowsMonth, cellSize)
    };
  };
};
var dayFormat$1 = d3TimeFormat.timeFormat('%Y-%m-%d');
var computeLayout$1 = function computeLayout(_ref4) {
  var width = _ref4.width,
      height = _ref4.height,
      from = _ref4.from,
      to = _ref4.to,
      direction = _ref4.direction,
      blockSpacing = _ref4.blockSpacing,
      monthSpacing = _ref4.monthSpacing,
      daySpacing = _ref4.daySpacing,
      align = _ref4.align,
      weekDirection = _ref4.weekDirection,
      granularity = _ref4.granularity,
      breakpoint = _ref4.breakpoint;
  var fromDate = isDate(from) ? from : new Date(from);
  var toDate = isDate(to) ? to : new Date(to);
  if (weekDirection === 'auto') {
    weekDirection = direction === 'vertical' ? 'horizontal' : 'vertical';
  }
  if (breakpoint === 'auto') {
    if (granularity === 'year') {
      breakpoint = 1;
    } else {
      breakpoint = getElapsedMonths(fromDate, toDate) + 1;
    }
  }
  var monthsPerGroup;
  var dates = [];
  var maxRowsMonth;
  var maxColumnsGroup = 0;
  if (granularity === 'year') {
    maxRowsMonth = weekDirection === 'horizontal' ? 6 : 7;
    maxColumnsGroup = 0;
    var yearRange = range(fromDate.getFullYear(), toDate.getFullYear() + 1);
    monthsPerGroup = Math.min(yearRange.length, breakpoint) * 12;
    while (yearRange.length) {
      var arr = yearRange.splice(0, breakpoint);
      var begin = new Date(arr[0], 0, 1);
      var end = new Date(arr[arr.length - 1] + 1, 0, 1);
      dates.push([begin, end]);
      maxColumnsGroup = Math.max(maxColumnsGroup, d3Time.timeWeeks(begin, end).length);
    }
    maxColumnsGroup += 1;
  } else {
    monthsPerGroup = Math.min(getElapsedMonths(fromDate, toDate) + 1, breakpoint);
    var date = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    var aux = new Date(date.getTime());
    while (date < toDate) {
      if (weekDirection === 'horizontal' && maxRowsMonth !== 6) {
        var i = 1;
        while (i <= breakpoint) {
          var weekDay = new Date(aux.getFullYear(), aux.getMonth() + i - 1, 1).getDay();
          var _days = new Date(date.getFullYear(), date.getMonth() + i, 0).getDate();
          if (_days + weekDay >= 36) {
            maxRowsMonth = 6;
            break;
          } else if (_days + weekDay == 28) {
            maxRowsMonth = Math.max(maxRowsMonth, 4);
          } else {
            maxRowsMonth = 5;
          }
          i += 1;
        }
      }
      aux.setMonth(aux.getMonth() + breakpoint);
      var pair = [date, new Date(aux.getTime() - 1)];
      dates.push(pair);
      if (direction !== weekDirection) {
        maxColumnsGroup = Math.max(d3Time.timeWeeks(pair[0], pair[1]).length + 1, maxColumnsGroup);
      }
      date = new Date(aux.getTime());
    }
    if (weekDirection === 'vertical') {
      maxRowsMonth = 7;
    }
  }
  if (direction === weekDirection) {
    maxColumnsGroup = 7 * monthsPerGroup;
  }
  var cellSize = computeCellSize$1({
    width: width,
    height: height,
    direction: direction,
    blocks: dates.length,
    blockSpacing: blockSpacing,
    monthSpacing: monthSpacing,
    daySpacing: daySpacing,
    maxRowsMonth: maxRowsMonth,
    maxColumnsGroup: maxColumnsGroup,
    monthsPerGroup: monthsPerGroup
  });
  var monthsSize = cellSize * maxColumnsGroup + daySpacing * maxColumnsGroup + monthSpacing * monthsPerGroup;
  var yearsSize = (cellSize + daySpacing) * maxRowsMonth * dates.length + blockSpacing * (dates.length > 1 ? dates.length : 0);
  var calendarWidth = direction === 'horizontal' ? monthsSize : yearsSize;
  var calendarHeight = direction === 'horizontal' ? yearsSize : monthsSize;
  var _alignBox = core.alignBox({
    x: 0,
    y: 0,
    width: calendarWidth,
    height: calendarHeight
  }, {
    x: 0,
    y: 0,
    width: width,
    height: height
  }, align),
      _alignBox2 = _slicedToArray(_alignBox, 2),
      originX = _alignBox2[0],
      originY = _alignBox2[1];
  var cellPosition;
  if (direction === 'horizontal') {
    if (weekDirection === 'horizontal') {
      cellPosition = cellPositionHorizontalHorizontal(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth);
    } else {
      cellPosition = cellPositionHorizontalVertical(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth);
    }
  } else {
    if (weekDirection === 'horizontal') {
      cellPosition = cellPositionVerticalHorizontal(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth);
    } else {
      cellPosition = cellPositionVerticalVertical(cellSize, blockSpacing, monthSpacing, daySpacing, maxRowsMonth);
    }
  }
  var blocks = [];
  var months = [];
  var days = [];
  dates.forEach(function (date, i) {
    days = days.concat(d3Time.timeDays(date[0], date[1]).map(function (dayDate) {
      return _objectSpread2({
        date: dayDate,
        day: dayFormat$1(dayDate),
        size: cellSize
      }, cellPosition(originX, originY, dayDate, i, date[0]));
    }));
    var blockMonths = d3Time.timeMonths(date[0], date[1]).map(function (monthDate) {
      return _objectSpread2({
        date: monthDate,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth()
      }, memoMonthPathAndBBox$1({
        originX: originX,
        originY: originY,
        date: monthDate,
        direction: direction,
        blockIndex: i,
        blockSpacing: blockSpacing,
        monthSpacing: monthSpacing,
        daySpacing: daySpacing,
        cellSize: cellSize,
        startDate: date[0],
        maxRowsMonth: maxRowsMonth,
        weekDirection: weekDirection
      }));
    });
    months = months.concat(blockMonths);
    blocks.push({
      firstMonth: date[0].getMonth(),
      firstYear: date[0].getFullYear(),
      lastMonth: date[1].getMonth(),
      lastYear: date[1].getFullYear(),
      bbox: {
        x: blockMonths[0].bbox.x,
        y: blockMonths[0].bbox.y,
        width: blockMonths[blockMonths.length - 1].bbox.x - blockMonths[0].bbox.x + blockMonths[blockMonths.length - 1].bbox.width,
        height: blockMonths[blockMonths.length - 1].bbox.y - blockMonths[0].bbox.y + blockMonths[blockMonths.length - 1].bbox.height
      }
    });
  });
  return {
    blocks: blocks,
    months: months,
    days: days,
    cellSize: cellSize,
    calendarWidth: calendarWidth,
    calendarHeight: calendarHeight,
    originX: originX,
    originY: originY
  };
};

var useCalendarLayout$1 = function useCalendarLayout(_ref) {
  var width = _ref.width,
      height = _ref.height,
      from = _ref.from,
      to = _ref.to,
      direction = _ref.direction,
      blockSpacing = _ref.blockSpacing,
      monthSpacing = _ref.monthSpacing,
      daySpacing = _ref.daySpacing,
      align = _ref.align,
      granularity = _ref.granularity,
      weekDirection = _ref.weekDirection,
      breakpoint = _ref.breakpoint;
  return React.useMemo(function () {
    return computeLayout$1({
      width: width,
      height: height,
      from: from,
      to: to,
      direction: direction,
      blockSpacing: blockSpacing,
      monthSpacing: monthSpacing,
      daySpacing: daySpacing,
      align: align,
      granularity: granularity,
      weekDirection: weekDirection,
      breakpoint: breakpoint
    });
  }, [width, height, from, to, direction, blockSpacing, monthSpacing, daySpacing, align, granularity, weekDirection, breakpoint]);
};

var yearLegend = CalendarPropTypes.yearLegend,
    yearSpacing = CalendarPropTypes.yearSpacing,
    yearLegendPosition = CalendarPropTypes.yearLegendPosition,
    yearLegendOffset = CalendarPropTypes.yearLegendOffset,
    filteredPropTypes = _objectWithoutProperties(CalendarPropTypes, ["yearLegend", "yearSpacing", "yearLegendPosition", "yearLegendOffset"]);
var enhancedCommonPropTypes = _objectSpread2(_objectSpread2({}, filteredPropTypes), {}, {
  granularity: PropTypes.oneOf(['year', 'month']).isRequired,
  weekDirection: PropTypes.oneOf(['auto', 'horizontal', 'vertical']).isRequired,
  breakpoint: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  blockLegend: PropTypes.func.isRequired,
  blockSpacing: PropTypes.number.isRequired,
  blockLegendPosition: PropTypes.oneOf(['before', 'after']).isRequired,
  blockLegendOffset: PropTypes.number.isRequired
});
var EnhancedCalendarPropTypes = enhancedCommonPropTypes;
var EnhancedCalendarCanvasPropTypes = _objectSpread2(_objectSpread2({}, enhancedCommonPropTypes), {}, {
  pixelRatio: PropTypes.number.isRequired
});
var yearSpacingDefault = CalendarDefaultProps['yearSpacing'],
    yearLegendDefault = CalendarDefaultProps['yearLegend'],
    yearLegendPositionDefault = CalendarDefaultProps['yearLegendPosition'],
    yearLegendOffsetDefault = CalendarDefaultProps['yearLegendOffset'],
    filteredDefaultProps = _objectWithoutProperties(CalendarDefaultProps, ["yearSpacing", "yearLegend", "yearLegendPosition", "yearLegendOffset"]);
var enhancedCommonDefaultProps = _objectSpread2(_objectSpread2({}, filteredDefaultProps), {}, {
  granularity: 'year',
  weekDirection: 'auto',
  breakpoint: 'auto',
  blockSpacing: 30,
  blockLegend: function blockLegend(block) {
    return block.firstYear;
  },
  blockLegendPosition: 'before',
  blockLegendOffset: 10
});
var EnhancedCalendarDefaultProps = enhancedCommonDefaultProps;
var EnhancedCalendarCanvasDefaultProps = _objectSpread2(_objectSpread2({}, enhancedCommonDefaultProps), {}, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});

var EnhancedCalendar = function EnhancedCalendar(_ref) {
  var partialMargin = _ref.margin,
      width = _ref.width,
      height = _ref.height,
      align = _ref.align,
      colors = _ref.colors,
      colorScale = _ref.colorScale,
      data = _ref.data,
      direction = _ref.direction,
      emptyColor = _ref.emptyColor,
      from = _ref.from,
      to = _ref.to,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      valueFormat = _ref.valueFormat,
      legendFormat = _ref.legendFormat,
      blockLegend = _ref.blockLegend,
      blockLegendOffset = _ref.blockLegendOffset,
      blockLegendPosition = _ref.blockLegendPosition,
      blockSpacing = _ref.blockSpacing,
      monthBorderColor = _ref.monthBorderColor,
      monthBorderWidth = _ref.monthBorderWidth,
      monthLegend = _ref.monthLegend,
      monthLegendOffset = _ref.monthLegendOffset,
      monthLegendPosition = _ref.monthLegendPosition,
      monthSpacing = _ref.monthSpacing,
      dayBorderColor = _ref.dayBorderColor,
      dayBorderWidth = _ref.dayBorderWidth,
      daySpacing = _ref.daySpacing,
      granularity = _ref.granularity,
      weekDirection = _ref.weekDirection,
      breakpoint = _ref.breakpoint,
      isInteractive = _ref.isInteractive,
      tooltip = _ref.tooltip,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseMove = _ref.onMouseMove,
      legends$1 = _ref.legends,
      role = _ref.role;
  var theme = core.useTheme();
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useCalendarLayout = useCalendarLayout$1({
    width: innerWidth,
    height: innerHeight,
    from: from,
    to: to,
    direction: direction,
    blockSpacing: blockSpacing,
    monthSpacing: monthSpacing,
    daySpacing: daySpacing,
    align: align,
    granularity: granularity,
    weekDirection: weekDirection,
    breakpoint: breakpoint
  }),
      months = _useCalendarLayout.months,
      blocks = _useCalendarLayout.blocks,
      days = _useCalendarLayout.days;
  colorScale = useColorScale({
    data: data,
    minValue: minValue,
    maxValue: maxValue,
    colors: colors,
    colorScale: colorScale
  });
  var monthLegends = useMonthLegends({
    months: months,
    direction: direction,
    monthLegendPosition: monthLegendPosition,
    monthLegendOffset: monthLegendOffset
  });
  var blockLegends = useBlockLegends({
    blocks: blocks,
    direction: direction,
    blockLegendPosition: blockLegendPosition,
    blockLegendOffset: blockLegendOffset
  });
  days = useDays({
    days: days,
    data: data,
    colorScale: colorScale,
    emptyColor: emptyColor
  });
  var formatLegend = core.useValueFormatter(legendFormat);
  var formatValue = core.useValueFormatter(valueFormat);
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin,
    theme: theme,
    role: role
  }, days.map(function (d) {
    return React__default.createElement(CalendarDay, {
      key: d.date.toString(),
      data: d,
      x: d.x,
      y: d.y,
      size: d.size,
      spacing: daySpacing,
      color: d.color,
      borderWidth: dayBorderWidth,
      borderColor: dayBorderColor,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onMouseMove: onMouseMove,
      isInteractive: isInteractive,
      tooltip: tooltip,
      theme: theme,
      onClick: onClick,
      formatValue: formatValue
    });
  }), months.map(function (m) {
    return React__default.createElement(CalendarMonthPath, {
      key: m.date.toString(),
      path: m.path,
      borderWidth: monthBorderWidth,
      borderColor: monthBorderColor
    });
  }), React__default.createElement(CalendarMonthLegends, {
    months: monthLegends,
    legend: monthLegend,
    theme: theme
  }), React__default.createElement(CalendarBlockLegends, {
    blocks: blockLegends,
    legend: blockLegend,
    theme: theme
  }), legends$1.map(function (legend, i) {
    var legendData = colorScale.ticks(legend.itemCount).map(function (value) {
      return {
        id: value,
        label: formatLegend(value),
        color: colorScale(value)
      };
    });
    return React__default.createElement(legends.BoxLegendSvg, Object.assign({
      key: i
    }, legend, {
      containerWidth: width,
      containerHeight: height,
      data: legendData,
      theme: theme
    }));
  }));
};
EnhancedCalendar.displayName = 'EnhancedCalendar';
EnhancedCalendar.defaultProps = EnhancedCalendarDefaultProps;
var EnhancedCalendar$1 = core.withContainer(EnhancedCalendar);

var ResponsiveCalendar = function ResponsiveCalendar(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(Calendar$1, Object.assign({
      width: width,
      height: height
    }, props));
  });
};

var ResponsiveEnhancedCalendar = function ResponsiveEnhancedCalendar(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(EnhancedCalendar$1, Object.assign({
      width: width,
      height: height
    }, props));
  });
};

var findDayUnderCursor = function findDayUnderCursor(event, canvasEl, days, size, dayBorderWidth, margin) {
  var _getRelativeCursor = core.getRelativeCursor(canvasEl, event),
      _getRelativeCursor2 = _slicedToArray(_getRelativeCursor, 2),
      x = _getRelativeCursor2[0],
      y = _getRelativeCursor2[1];
  return days.find(function (day) {
    return day.value !== undefined && core.isCursorInRect(day.x + margin.left - dayBorderWidth / 2, day.y + margin.top - dayBorderWidth / 2, size + dayBorderWidth, size + dayBorderWidth, x, y);
  });
};
var CalendarCanvas = React.memo(function (_ref) {
  var partialMargin = _ref.margin,
      width = _ref.width,
      height = _ref.height,
      pixelRatio = _ref.pixelRatio,
      align = _ref.align,
      colors = _ref.colors,
      colorScale = _ref.colorScale,
      data = _ref.data,
      direction = _ref.direction,
      emptyColor = _ref.emptyColor,
      from = _ref.from,
      to = _ref.to,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      valueFormat = _ref.valueFormat,
      legendFormat = _ref.legendFormat,
      yearLegend = _ref.yearLegend,
      yearLegendOffset = _ref.yearLegendOffset,
      yearLegendPosition = _ref.yearLegendPosition,
      yearSpacing = _ref.yearSpacing,
      monthLegend = _ref.monthLegend,
      monthLegendOffset = _ref.monthLegendOffset,
      monthLegendPosition = _ref.monthLegendPosition,
      monthSpacing = _ref.monthSpacing,
      dayBorderColor = _ref.dayBorderColor,
      dayBorderWidth = _ref.dayBorderWidth,
      daySpacing = _ref.daySpacing,
      isInteractive = _ref.isInteractive,
      tooltip$1 = _ref.tooltip,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseMove = _ref.onMouseMove,
      legends$1 = _ref.legends;
  var canvasEl = React.useRef(null);
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight,
      margin = _useDimensions.margin;
  var _useCalendarLayout = useCalendarLayout({
    width: innerWidth,
    height: innerHeight,
    from: from,
    to: to,
    direction: direction,
    yearSpacing: yearSpacing,
    monthSpacing: monthSpacing,
    daySpacing: daySpacing,
    align: align
  }),
      months = _useCalendarLayout.months,
      years = _useCalendarLayout.years,
      rest = _objectWithoutProperties(_useCalendarLayout, ["months", "years"]);
  var colorScaleFn = useColorScale({
    data: data,
    minValue: minValue,
    maxValue: maxValue,
    colors: colors,
    colorScale: colorScale
  });
  var monthLegends = useMonthLegends({
    months: months,
    direction: direction,
    monthLegendPosition: monthLegendPosition,
    monthLegendOffset: monthLegendOffset
  });
  var yearLegends = useBlockLegends({
    blocks: years,
    direction: direction,
    blockLegendPosition: yearLegendPosition,
    blockLegendOffset: yearLegendOffset
  });
  var days = useDays({
    days: rest.days,
    data: data,
    colorScale: colorScaleFn,
    emptyColor: emptyColor
  });
  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentDay = _useState2[0],
      setCurrentDay = _useState2[1];
  var theme = core.useTheme();
  var formatValue = core.useValueFormatter(valueFormat);
  var formatLegend = core.useValueFormatter(legendFormat);
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  React.useEffect(function () {
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    days.forEach(function (day) {
      ctx.fillStyle = day.color;
      if (dayBorderWidth > 0) {
        ctx.strokeStyle = dayBorderColor;
        ctx.lineWidth = dayBorderWidth;
      }
      ctx.beginPath();
      ctx.rect(day.x, day.y, day.size, day.size);
      ctx.fill();
      if (dayBorderWidth > 0) {
        ctx.stroke();
      }
    });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.labels.text.fill;
    ctx.font = "".concat(theme.labels.text.fontSize, "px ").concat(theme.labels.text.fontFamily);
    monthLegends.forEach(function (month) {
      ctx.save();
      ctx.translate(month.x, month.y);
      ctx.rotate(core.degreesToRadians(month.rotation));
      ctx.fillText(monthLegend(month.year, month.month, month.date), 0, 0);
      ctx.restore();
    });
    yearLegends.forEach(function (year) {
      ctx.save();
      ctx.translate(year.x, year.y);
      ctx.rotate(core.degreesToRadians(year.rotation));
      ctx.fillText(yearLegend(year.year), 0, 0);
      ctx.restore();
    });
    legends$1.forEach(function (legend) {
      var legendData = colorScaleFn.ticks(legend.itemCount).map(function (value) {
        return {
          id: value,
          label: formatLegend(value),
          color: colorScaleFn(value)
        };
      });
      legends.renderLegendToCanvas(ctx, _objectSpread2(_objectSpread2({}, legend), {}, {
        data: legendData,
        containerWidth: innerWidth,
        containerHeight: innerHeight,
        theme: theme
      }));
    });
  }, [canvasEl, innerHeight, innerWidth, outerWidth, outerHeight, pixelRatio, margin, days, dayBorderColor, dayBorderWidth, colorScale, yearLegend, yearLegends, monthLegend, monthLegends, legends$1, theme, formatLegend]);
  var handleMouseHover = React.useCallback(function (event) {
    var data = findDayUnderCursor(event, canvasEl.current, days, days[0].size, dayBorderWidth, margin);
    if (data) {
      setCurrentDay(data);
      var formatedData = _objectSpread2(_objectSpread2({}, data), {}, {
        value: formatValue(data.value),
        data: _objectSpread2({}, data.data)
      });
      showTooltipFromEvent(React__default.createElement(tooltip$1, _objectSpread2({}, formatedData)), event);
      !currentDay && onMouseEnter && onMouseEnter(data, event);
      onMouseMove && onMouseMove(data, event);
      currentDay && currentDay.id !== data.id && onMouseLeave && onMouseLeave(data, event);
    } else {
      hideTooltip();
      onMouseLeave && onMouseLeave(data, event);
    }
  }, [canvasEl, margin, days, setCurrentDay, formatValue, daySpacing, showTooltipFromEvent, hideTooltip, onMouseEnter, onMouseMove, onMouseLeave]);
  var handleMouseLeave = React.useCallback(function () {
    setCurrentDay(null);
    hideTooltip();
  }, [setCurrentDay, hideTooltip]);
  var handleClick = React.useCallback(function (event) {
    if (!onClick) return;
    var data = findDayUnderCursor(event, canvasEl.current, days, days[0].size, daySpacing, margin);
    data && onClick(data, event);
  }, [canvasEl, daySpacing, margin, setCurrentDay, days, onClick]);
  return React__default.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight
    },
    onMouseEnter: isInteractive ? handleMouseHover : undefined,
    onMouseMove: isInteractive ? handleMouseHover : undefined,
    onMouseLeave: isInteractive ? handleMouseLeave : undefined,
    onClick: isInteractive ? handleClick : undefined
  });
});
CalendarCanvas.displayName = 'CalendarCanvas';
CalendarCanvas.defaultProps = CalendarCanvasDefaultProps;
var CalendarCanvas$1 = core.withContainer(CalendarCanvas);

var findDayUnderCursor$1 = function findDayUnderCursor(event, canvasEl, days, size, dayBorderWidth, margin) {
  var _getRelativeCursor = core.getRelativeCursor(canvasEl, event),
      _getRelativeCursor2 = _slicedToArray(_getRelativeCursor, 2),
      x = _getRelativeCursor2[0],
      y = _getRelativeCursor2[1];
  return days.find(function (day) {
    return day.value !== undefined && core.isCursorInRect(day.x + margin.left - dayBorderWidth / 2, day.y + margin.top - dayBorderWidth / 2, size + dayBorderWidth, size + dayBorderWidth, x, y);
  });
};
var EnhancedCalendarCanvas = React.memo(function (_ref) {
  var partialMargin = _ref.margin,
      width = _ref.width,
      height = _ref.height,
      pixelRatio = _ref.pixelRatio,
      align = _ref.align,
      colors = _ref.colors,
      colorScale = _ref.colorScale,
      data = _ref.data,
      direction = _ref.direction,
      emptyColor = _ref.emptyColor,
      from = _ref.from,
      to = _ref.to,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      valueFormat = _ref.valueFormat,
      legendFormat = _ref.legendFormat,
      blockLegend = _ref.blockLegend,
      blockLegendOffset = _ref.blockLegendOffset,
      blockLegendPosition = _ref.blockLegendPosition,
      blockSpacing = _ref.blockSpacing,
      monthLegend = _ref.monthLegend,
      monthLegendOffset = _ref.monthLegendOffset,
      monthLegendPosition = _ref.monthLegendPosition,
      monthSpacing = _ref.monthSpacing,
      dayBorderColor = _ref.dayBorderColor,
      dayBorderWidth = _ref.dayBorderWidth,
      daySpacing = _ref.daySpacing,
      granularity = _ref.granularity,
      weekDirection = _ref.weekDirection,
      breakpoint = _ref.breakpoint,
      isInteractive = _ref.isInteractive,
      tooltip$1 = _ref.tooltip,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseMove = _ref.onMouseMove,
      legends$1 = _ref.legends;
  var canvasEl = React.useRef(null);
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight,
      margin = _useDimensions.margin;
  var _useCalendarLayout = useCalendarLayout$1({
    width: innerWidth,
    height: innerHeight,
    from: from,
    to: to,
    direction: direction,
    blockSpacing: blockSpacing,
    monthSpacing: monthSpacing,
    daySpacing: daySpacing,
    align: align,
    granularity: granularity,
    weekDirection: weekDirection,
    breakpoint: breakpoint
  }),
      months = _useCalendarLayout.months,
      blocks = _useCalendarLayout.blocks,
      rest = _objectWithoutProperties(_useCalendarLayout, ["months", "blocks"]);
  var colorScaleFn = useColorScale({
    data: data,
    minValue: minValue,
    maxValue: maxValue,
    colors: colors,
    colorScale: colorScale
  });
  var monthLegends = useMonthLegends({
    months: months,
    direction: direction,
    monthLegendPosition: monthLegendPosition,
    monthLegendOffset: monthLegendOffset
  });
  var blockLegends = useBlockLegends({
    blocks: blocks,
    direction: direction,
    blockLegendPosition: blockLegendPosition,
    blockLegendOffset: blockLegendOffset
  });
  var days = useDays({
    days: rest.days,
    data: data,
    colorScale: colorScaleFn,
    emptyColor: emptyColor
  });
  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentDay = _useState2[0],
      setCurrentDay = _useState2[1];
  var theme = core.useTheme();
  var formatValue = core.useValueFormatter(valueFormat);
  var formatLegend = core.useValueFormatter(legendFormat);
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  React.useEffect(function () {
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    days.forEach(function (day) {
      ctx.fillStyle = day.color;
      if (dayBorderWidth > 0) {
        ctx.strokeStyle = dayBorderColor;
        ctx.lineWidth = dayBorderWidth;
      }
      ctx.beginPath();
      ctx.rect(day.x, day.y, day.size, day.size);
      ctx.fill();
      if (dayBorderWidth > 0) {
        ctx.stroke();
      }
    });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.labels.text.fill;
    ctx.font = "".concat(theme.labels.text.fontSize, "px ").concat(theme.labels.text.fontFamily);
    monthLegends.forEach(function (month) {
      ctx.save();
      ctx.translate(month.x, month.y);
      ctx.rotate(core.degreesToRadians(month.rotation));
      ctx.fillText(monthLegend(month.year, month.month, month.date), 0, 0);
      ctx.restore();
    });
    blockLegends.forEach(function (block) {
      ctx.save();
      ctx.translate(block.x, block.y);
      ctx.rotate(core.degreesToRadians(block.rotation));
      ctx.fillText(blockLegend(block), 0, 0);
      ctx.restore();
    });
    legends$1.forEach(function (legend) {
      var legendData = colorScaleFn.ticks(legend.itemCount).map(function (value) {
        return {
          id: value,
          label: formatLegend(value),
          color: colorScaleFn(value)
        };
      });
      legends.renderLegendToCanvas(ctx, _objectSpread2(_objectSpread2({}, legend), {}, {
        data: legendData,
        containerWidth: innerWidth,
        containerHeight: innerHeight,
        theme: theme
      }));
    });
  }, [canvasEl, innerHeight, innerWidth, outerWidth, outerHeight, pixelRatio, margin, days, dayBorderColor, dayBorderWidth, colorScale, blockLegend, blockLegends, monthLegend, monthLegends, legends$1, theme, formatLegend]);
  var handleMouseHover = React.useCallback(function (event) {
    var data = findDayUnderCursor$1(event, canvasEl.current, days, days[0].size, dayBorderWidth, margin);
    if (data) {
      setCurrentDay(data);
      var formatedData = _objectSpread2(_objectSpread2({}, data), {}, {
        value: formatValue(data.value),
        data: _objectSpread2({}, data.data)
      });
      showTooltipFromEvent(React__default.createElement(tooltip$1, _objectSpread2({}, formatedData)), event);
      !currentDay && onMouseEnter && onMouseEnter(data, event);
      onMouseMove && onMouseMove(data, event);
      currentDay && currentDay.id !== data.id && onMouseLeave && onMouseLeave(data, event);
    } else {
      hideTooltip();
      onMouseLeave && onMouseLeave(data, event);
    }
  }, [canvasEl, margin, days, setCurrentDay, formatValue, daySpacing, showTooltipFromEvent, hideTooltip, onMouseEnter, onMouseMove, onMouseLeave]);
  var handleMouseLeave = React.useCallback(function () {
    setCurrentDay(null);
    hideTooltip();
  }, [setCurrentDay, hideTooltip]);
  var handleClick = React.useCallback(function (event) {
    if (!onClick) return;
    var data = findDayUnderCursor$1(event, canvasEl.current, days, days[0].size, daySpacing, margin);
    data && onClick(data, event);
  }, [canvasEl, daySpacing, margin, setCurrentDay, days, onClick]);
  return React__default.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight
    },
    onMouseEnter: isInteractive ? handleMouseHover : undefined,
    onMouseMove: isInteractive ? handleMouseHover : undefined,
    onMouseLeave: isInteractive ? handleMouseLeave : undefined,
    onClick: isInteractive ? handleClick : undefined
  });
});
EnhancedCalendarCanvas.displayName = 'EnhancedCalendarCanvas';
EnhancedCalendarCanvas.defaultProps = EnhancedCalendarCanvasDefaultProps;
var EnhancedCalendarCanvas$1 = core.withContainer(EnhancedCalendarCanvas);

var ResponsiveCalendarCanvas = function ResponsiveCalendarCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(CalendarCanvas$1, Object.assign({
      width: width,
      height: height
    }, props));
  });
};

var ResponsiveEnhancedCalendarCanvas = function ResponsiveEnhancedCalendarCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(EnhancedCalendarCanvas$1, Object.assign({
      width: width,
      height: height
    }, props));
  });
};

exports.Calendar = Calendar$1;
exports.CalendarCanvas = CalendarCanvas$1;
exports.CalendarCanvasDefaultProps = CalendarCanvasDefaultProps;
exports.CalendarCanvasPropTypes = CalendarCanvasPropTypes;
exports.CalendarDefaultProps = CalendarDefaultProps;
exports.CalendarPropTypes = CalendarPropTypes;
exports.EnhancedCalendar = EnhancedCalendar$1;
exports.EnhancedCalendarCanvas = EnhancedCalendarCanvas$1;
exports.EnhancedCalendarCanvasDefaultProps = EnhancedCalendarCanvasDefaultProps;
exports.EnhancedCalendarCanvasPropTypes = EnhancedCalendarCanvasPropTypes;
exports.EnhancedCalendarDefaultProps = EnhancedCalendarDefaultProps;
exports.EnhancedCalendarPropTypes = EnhancedCalendarPropTypes;
exports.ResponsiveCalendar = ResponsiveCalendar;
exports.ResponsiveCalendarCanvas = ResponsiveCalendarCanvas;
exports.ResponsiveEnhancedCalendar = ResponsiveEnhancedCalendar;
exports.ResponsiveEnhancedCalendarCanvas = ResponsiveEnhancedCalendarCanvas;
exports.bindDaysData = bindDaysData;
exports.computeBlockLegendPositions = computeBlockLegendPositions;
exports.computeDomain = computeDomain$1;
exports.computeLayout = computeLayout;
exports.computeMonthLegendPositions = computeMonthLegendPositions;
exports.useBlockLegends = useBlockLegends;
exports.useCalendarLayout = useCalendarLayout;
exports.useColorScale = useColorScale;
exports.useDays = useDays;
exports.useMonthLegends = useMonthLegends;
//# sourceMappingURL=nivo-calendar.cjs.js.map
