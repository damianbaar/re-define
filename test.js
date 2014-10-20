//warning: re-define rewrite only static require calls <File "index.js"> /Users/damianbaar/Documents/Workspaces/HTML:JS:Node/re-define/lib/index.js require(t)
//warning: circular dependency found in readable-stream/lib/_stream_duplex referenced by index.
//warning: circular dependency found in ast-types/lib/node-path referenced by index.
//externals: stream,util,buffer,events,fs,path,tty,source-map,assert 
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, __req, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(!!require) return require.apply(null, arguments);
        else if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) __req(name);
  return __req;
})
({ 
'lodash': [function(exports, require, module, __filename, __dirname) { 
    ;
    (function () {
      var undefined;
      var arrayPool = [], objectPool = [];
      var idCounter = 0;
      var keyPrefix = +new Date() + '';
      var largeArraySize = 75;
      var maxPoolSize = 40;
      var whitespace = ' \t\x0B\f\xA0\uFEFF' + '\n\r\u2028\u2029' + '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reFuncName = /^\s*function[ \n\r\t]+\w/;
      var reInterpolate = /<%=([\s\S]+?)%>/g;
      var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');
      var reNoMatch = /($^)/;
      var reThis = /\bthis\b/;
      var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
      var contextProps = [
          'Array',
          'Boolean',
          'Date',
          'Function',
          'Math',
          'Number',
          'Object',
          'RegExp',
          'String',
          '_',
          'attachEvent',
          'clearTimeout',
          'isFinite',
          'isNaN',
          'parseInt',
          'setTimeout'
        ];
      var templateCounter = 0;
      var argsClass = '[object Arguments]', arrayClass = '[object Array]', boolClass = '[object Boolean]', dateClass = '[object Date]', funcClass = '[object Function]', numberClass = '[object Number]', objectClass = '[object Object]', regexpClass = '[object RegExp]', stringClass = '[object String]';
      var cloneableClasses = {};
      cloneableClasses[funcClass] = false;
      cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;
      var debounceOptions = {
          'leading': false,
          'maxWait': 0,
          'trailing': false
        };
      var descriptor = {
          'configurable': false,
          'enumerable': false,
          'value': null,
          'writable': false
        };
      var objectTypes = {
          'boolean': false,
          'function': true,
          'object': true,
          'number': false,
          'string': false,
          'undefined': false
        };
      var stringEscapes = {
          '\\': '\\',
          '\'': '\'',
          '\n': 'n',
          '\r': 'r',
          '\t': 't',
          '\u2028': 'u2028',
          '\u2029': 'u2029'
        };
      var root = objectTypes[typeof window] && window || this;
      var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
      var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
      var freeGlobal = objectTypes[typeof global] && global;
      if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
      }
      function baseIndexOf(array, value, fromIndex) {
        var index = (fromIndex || 0) - 1, length = array ? array.length : 0;
        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function cacheIndexOf(cache, value) {
        var type = typeof value;
        cache = cache.cache;
        if (type == 'boolean' || value == null) {
          return cache[value] ? 0 : -1;
        }
        if (type != 'number' && type != 'string') {
          type = 'object';
        }
        var key = type == 'number' ? value : keyPrefix + value;
        cache = (cache = cache[type]) && cache[key];
        return type == 'object' ? cache && baseIndexOf(cache, value) > -1 ? 0 : -1 : cache ? 0 : -1;
      }
      function cachePush(value) {
        var cache = this.cache, type = typeof value;
        if (type == 'boolean' || value == null) {
          cache[value] = true;
        } else {
          if (type != 'number' && type != 'string') {
            type = 'object';
          }
          var key = type == 'number' ? value : keyPrefix + value, typeCache = cache[type] || (cache[type] = {});
          if (type == 'object') {
            (typeCache[key] || (typeCache[key] = [])).push(value);
          } else {
            typeCache[key] = true;
          }
        }
      }
      function charAtCallback(value) {
        return value.charCodeAt(0);
      }
      function compareAscending(a, b) {
        var ac = a.criteria, bc = b.criteria, index = -1, length = ac.length;
        while (++index < length) {
          var value = ac[index], other = bc[index];
          if (value !== other) {
            if (value > other || typeof value == 'undefined') {
              return 1;
            }
            if (value < other || typeof other == 'undefined') {
              return -1;
            }
          }
        }
        return a.index - b.index;
      }
      function createCache(array) {
        var index = -1, length = array.length, first = array[0], mid = array[length / 2 | 0], last = array[length - 1];
        if (first && typeof first == 'object' && mid && typeof mid == 'object' && last && typeof last == 'object') {
          return false;
        }
        var cache = getObject();
        cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;
        var result = getObject();
        result.array = array;
        result.cache = cache;
        result.push = cachePush;
        while (++index < length) {
          result.push(array[index]);
        }
        return result;
      }
      function escapeStringChar(match) {
        return '\\' + stringEscapes[match];
      }
      function getArray() {
        return arrayPool.pop() || [];
      }
      function getObject() {
        return objectPool.pop() || {
          'array': null,
          'cache': null,
          'criteria': null,
          'false': false,
          'index': 0,
          'null': false,
          'number': null,
          'object': null,
          'push': null,
          'string': null,
          'true': false,
          'undefined': false,
          'value': null
        };
      }
      function releaseArray(array) {
        array.length = 0;
        if (arrayPool.length < maxPoolSize) {
          arrayPool.push(array);
        }
      }
      function releaseObject(object) {
        var cache = object.cache;
        if (cache) {
          releaseObject(cache);
        }
        object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
        if (objectPool.length < maxPoolSize) {
          objectPool.push(object);
        }
      }
      function slice(array, start, end) {
        start || (start = 0);
        if (typeof end == 'undefined') {
          end = array ? array.length : 0;
        }
        var index = -1, length = end - start || 0, result = Array(length < 0 ? 0 : length);
        while (++index < length) {
          result[index] = array[start + index];
        }
        return result;
      }
      function runInContext(context) {
        context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
        var Array = context.Array, Boolean = context.Boolean, Date = context.Date, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
        var arrayRef = [];
        var objectProto = Object.prototype;
        var oldDash = context._;
        var toString = objectProto.toString;
        var reNative = RegExp('^' + String(toString).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/toString| for [^\]]+/g, '.*?') + '$');
        var ceil = Math.ceil, clearTimeout = context.clearTimeout, floor = Math.floor, fnToString = Function.prototype.toString, getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty = objectProto.hasOwnProperty, push = arrayRef.push, setTimeout = context.setTimeout, splice = arrayRef.splice, unshift = arrayRef.unshift;
        var defineProperty = function () {
            try {
              var o = {}, func = isNative(func = Object.defineProperty) && func, result = func(o, o, o) && func;
            } catch (e) {
            }
            return result;
          }();
        var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate, nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite = context.isFinite, nativeIsNaN = context.isNaN, nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeParseInt = context.parseInt, nativeRandom = Math.random;
        var ctorByClass = {};
        ctorByClass[arrayClass] = Array;
        ctorByClass[boolClass] = Boolean;
        ctorByClass[dateClass] = Date;
        ctorByClass[funcClass] = Function;
        ctorByClass[objectClass] = Object;
        ctorByClass[numberClass] = Number;
        ctorByClass[regexpClass] = RegExp;
        ctorByClass[stringClass] = String;
        function lodash(value) {
          return value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__') ? value : new lodashWrapper(value);
        }
        function lodashWrapper(value, chainAll) {
          this.__chain__ = !!chainAll;
          this.__wrapped__ = value;
        }
        lodashWrapper.prototype = lodash.prototype;
        var support = lodash.support = {};
        support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);
        support.funcNames = typeof Function.name == 'string';
        lodash.templateSettings = {
          'escape': /<%-([\s\S]+?)%>/g,
          'evaluate': /<%([\s\S]+?)%>/g,
          'interpolate': reInterpolate,
          'variable': '',
          'imports': { '_': lodash }
        };
        function baseBind(bindData) {
          var func = bindData[0], partialArgs = bindData[2], thisArg = bindData[4];
          function bound() {
            if (partialArgs) {
              var args = slice(partialArgs);
              push.apply(args, arguments);
            }
            if (this instanceof bound) {
              var thisBinding = baseCreate(func.prototype), result = func.apply(thisBinding, args || arguments);
              return isObject(result) ? result : thisBinding;
            }
            return func.apply(thisArg, args || arguments);
          }
          setBindData(bound, bindData);
          return bound;
        }
        function baseClone(value, isDeep, callback, stackA, stackB) {
          if (callback) {
            var result = callback(value);
            if (typeof result != 'undefined') {
              return result;
            }
          }
          var isObj = isObject(value);
          if (isObj) {
            var className = toString.call(value);
            if (!cloneableClasses[className]) {
              return value;
            }
            var ctor = ctorByClass[className];
            switch (className) {
            case boolClass:
            case dateClass:
              return new ctor(+value);
            case numberClass:
            case stringClass:
              return new ctor(value);
            case regexpClass:
              result = ctor(value.source, reFlags.exec(value));
              result.lastIndex = value.lastIndex;
              return result;
            }
          } else {
            return value;
          }
          var isArr = isArray(value);
          if (isDeep) {
            var initedStack = !stackA;
            stackA || (stackA = getArray());
            stackB || (stackB = getArray());
            var length = stackA.length;
            while (length--) {
              if (stackA[length] == value) {
                return stackB[length];
              }
            }
            result = isArr ? ctor(value.length) : {};
          } else {
            result = isArr ? slice(value) : assign({}, value);
          }
          if (isArr) {
            if (hasOwnProperty.call(value, 'index')) {
              result.index = value.index;
            }
            if (hasOwnProperty.call(value, 'input')) {
              result.input = value.input;
            }
          }
          if (!isDeep) {
            return result;
          }
          stackA.push(value);
          stackB.push(result);
          (isArr ? forEach : forOwn)(value, function (objValue, key) {
            result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
          });
          if (initedStack) {
            releaseArray(stackA);
            releaseArray(stackB);
          }
          return result;
        }
        function baseCreate(prototype, properties) {
          return isObject(prototype) ? nativeCreate(prototype) : {};
        }
        if (!nativeCreate) {
          baseCreate = function () {
            function Object() {
            }
            return function (prototype) {
              if (isObject(prototype)) {
                Object.prototype = prototype;
                var result = new Object();
                Object.prototype = null;
              }
              return result || context.Object();
            };
          }();
        }
        function baseCreateCallback(func, thisArg, argCount) {
          if (typeof func != 'function') {
            return identity;
          }
          if (typeof thisArg == 'undefined' || !('prototype' in func)) {
            return func;
          }
          var bindData = func.__bindData__;
          if (typeof bindData == 'undefined') {
            if (support.funcNames) {
              bindData = !func.name;
            }
            bindData = bindData || !support.funcDecomp;
            if (!bindData) {
              var source = fnToString.call(func);
              if (!support.funcNames) {
                bindData = !reFuncName.test(source);
              }
              if (!bindData) {
                bindData = reThis.test(source);
                setBindData(func, bindData);
              }
            }
          }
          if (bindData === false || bindData !== true && bindData[1] & 1) {
            return func;
          }
          switch (argCount) {
          case 1:
            return function (value) {
              return func.call(thisArg, value);
            };
          case 2:
            return function (a, b) {
              return func.call(thisArg, a, b);
            };
          case 3:
            return function (value, index, collection) {
              return func.call(thisArg, value, index, collection);
            };
          case 4:
            return function (accumulator, value, index, collection) {
              return func.call(thisArg, accumulator, value, index, collection);
            };
          }
          return bind(func, thisArg);
        }
        function baseCreateWrapper(bindData) {
          var func = bindData[0], bitmask = bindData[1], partialArgs = bindData[2], partialRightArgs = bindData[3], thisArg = bindData[4], arity = bindData[5];
          var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, key = func;
          function bound() {
            var thisBinding = isBind ? thisArg : this;
            if (partialArgs) {
              var args = slice(partialArgs);
              push.apply(args, arguments);
            }
            if (partialRightArgs || isCurry) {
              args || (args = slice(arguments));
              if (partialRightArgs) {
                push.apply(args, partialRightArgs);
              }
              if (isCurry && args.length < arity) {
                bitmask |= 16 & ~32;
                return baseCreateWrapper([
                  func,
                  isCurryBound ? bitmask : bitmask & ~3,
                  args,
                  null,
                  thisArg,
                  arity
                ]);
              }
            }
            args || (args = arguments);
            if (isBindKey) {
              func = thisBinding[key];
            }
            if (this instanceof bound) {
              thisBinding = baseCreate(func.prototype);
              var result = func.apply(thisBinding, args);
              return isObject(result) ? result : thisBinding;
            }
            return func.apply(thisBinding, args);
          }
          setBindData(bound, bindData);
          return bound;
        }
        function baseDifference(array, values) {
          var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, isLarge = length >= largeArraySize && indexOf === baseIndexOf, result = [];
          if (isLarge) {
            var cache = createCache(values);
            if (cache) {
              indexOf = cacheIndexOf;
              values = cache;
            } else {
              isLarge = false;
            }
          }
          while (++index < length) {
            var value = array[index];
            if (indexOf(values, value) < 0) {
              result.push(value);
            }
          }
          if (isLarge) {
            releaseObject(values);
          }
          return result;
        }
        function baseFlatten(array, isShallow, isStrict, fromIndex) {
          var index = (fromIndex || 0) - 1, length = array ? array.length : 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (value && typeof value == 'object' && typeof value.length == 'number' && (isArray(value) || isArguments(value))) {
              if (!isShallow) {
                value = baseFlatten(value, isShallow, isStrict);
              }
              var valIndex = -1, valLength = value.length, resIndex = result.length;
              result.length += valLength;
              while (++valIndex < valLength) {
                result[resIndex++] = value[valIndex];
              }
            } else if (!isStrict) {
              result.push(value);
            }
          }
          return result;
        }
        function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
          if (callback) {
            var result = callback(a, b);
            if (typeof result != 'undefined') {
              return !!result;
            }
          }
          if (a === b) {
            return a !== 0 || 1 / a == 1 / b;
          }
          var type = typeof a, otherType = typeof b;
          if (a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])) {
            return false;
          }
          if (a == null || b == null) {
            return a === b;
          }
          var className = toString.call(a), otherClass = toString.call(b);
          if (className == argsClass) {
            className = objectClass;
          }
          if (otherClass == argsClass) {
            otherClass = objectClass;
          }
          if (className != otherClass) {
            return false;
          }
          switch (className) {
          case boolClass:
          case dateClass:
            return +a == +b;
          case numberClass:
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
          case regexpClass:
          case stringClass:
            return a == String(b);
          }
          var isArr = className == arrayClass;
          if (!isArr) {
            var aWrapped = hasOwnProperty.call(a, '__wrapped__'), bWrapped = hasOwnProperty.call(b, '__wrapped__');
            if (aWrapped || bWrapped) {
              return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
            }
            if (className != objectClass) {
              return false;
            }
            var ctorA = a.constructor, ctorB = b.constructor;
            if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ('constructor' in a && 'constructor' in b)) {
              return false;
            }
          }
          var initedStack = !stackA;
          stackA || (stackA = getArray());
          stackB || (stackB = getArray());
          var length = stackA.length;
          while (length--) {
            if (stackA[length] == a) {
              return stackB[length] == b;
            }
          }
          var size = 0;
          result = true;
          stackA.push(a);
          stackB.push(b);
          if (isArr) {
            length = a.length;
            size = b.length;
            result = size == length;
            if (result || isWhere) {
              while (size--) {
                var index = length, value = b[size];
                if (isWhere) {
                  while (index--) {
                    if (result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB)) {
                      break;
                    }
                  }
                } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            }
          } else {
            forIn(b, function (value, key, b) {
              if (hasOwnProperty.call(b, key)) {
                size++;
                return result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB);
              }
            });
            if (result && !isWhere) {
              forIn(a, function (value, key, a) {
                if (hasOwnProperty.call(a, key)) {
                  return result = --size > -1;
                }
              });
            }
          }
          stackA.pop();
          stackB.pop();
          if (initedStack) {
            releaseArray(stackA);
            releaseArray(stackB);
          }
          return result;
        }
        function baseMerge(object, source, callback, stackA, stackB) {
          (isArray(source) ? forEach : forOwn)(source, function (source, key) {
            var found, isArr, result = source, value = object[key];
            if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
              var stackLength = stackA.length;
              while (stackLength--) {
                if (found = stackA[stackLength] == source) {
                  value = stackB[stackLength];
                  break;
                }
              }
              if (!found) {
                var isShallow;
                if (callback) {
                  result = callback(value, source);
                  if (isShallow = typeof result != 'undefined') {
                    value = result;
                  }
                }
                if (!isShallow) {
                  value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {};
                }
                stackA.push(source);
                stackB.push(value);
                if (!isShallow) {
                  baseMerge(value, source, callback, stackA, stackB);
                }
              }
            } else {
              if (callback) {
                result = callback(value, source);
                if (typeof result == 'undefined') {
                  result = source;
                }
              }
              if (typeof result != 'undefined') {
                value = result;
              }
            }
            object[key] = value;
          });
        }
        function baseRandom(min, max) {
          return min + floor(nativeRandom() * (max - min + 1));
        }
        function baseUniq(array, isSorted, callback) {
          var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [];
          var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf, seen = callback || isLarge ? getArray() : result;
          if (isLarge) {
            var cache = createCache(seen);
            indexOf = cacheIndexOf;
            seen = cache;
          }
          while (++index < length) {
            var value = array[index], computed = callback ? callback(value, index, array) : value;
            if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
              if (callback || isLarge) {
                seen.push(computed);
              }
              result.push(value);
            }
          }
          if (isLarge) {
            releaseArray(seen.array);
            releaseObject(seen);
          } else if (callback) {
            releaseArray(seen);
          }
          return result;
        }
        function createAggregator(setter) {
          return function (collection, callback, thisArg) {
            var result = {};
            callback = lodash.createCallback(callback, thisArg, 3);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
              while (++index < length) {
                var value = collection[index];
                setter(result, value, callback(value, index, collection), collection);
              }
            } else {
              forOwn(collection, function (value, key, collection) {
                setter(result, value, callback(value, key, collection), collection);
              });
            }
            return result;
          };
        }
        function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
          var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, isPartial = bitmask & 16, isPartialRight = bitmask & 32;
          if (!isBindKey && !isFunction(func)) {
            throw new TypeError();
          }
          if (isPartial && !partialArgs.length) {
            bitmask &= ~16;
            isPartial = partialArgs = false;
          }
          if (isPartialRight && !partialRightArgs.length) {
            bitmask &= ~32;
            isPartialRight = partialRightArgs = false;
          }
          var bindData = func && func.__bindData__;
          if (bindData && bindData !== true) {
            bindData = slice(bindData);
            if (bindData[2]) {
              bindData[2] = slice(bindData[2]);
            }
            if (bindData[3]) {
              bindData[3] = slice(bindData[3]);
            }
            if (isBind && !(bindData[1] & 1)) {
              bindData[4] = thisArg;
            }
            if (!isBind && bindData[1] & 1) {
              bitmask |= 8;
            }
            if (isCurry && !(bindData[1] & 4)) {
              bindData[5] = arity;
            }
            if (isPartial) {
              push.apply(bindData[2] || (bindData[2] = []), partialArgs);
            }
            if (isPartialRight) {
              unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
            }
            bindData[1] |= bitmask;
            return createWrapper.apply(null, bindData);
          }
          var creater = bitmask == 1 || bitmask === 17 ? baseBind : baseCreateWrapper;
          return creater([
            func,
            bitmask,
            partialArgs,
            partialRightArgs,
            thisArg,
            arity
          ]);
        }
        function escapeHtmlChar(match) {
          return htmlEscapes[match];
        }
        function getIndexOf() {
          var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
          return result;
        }
        function isNative(value) {
          return typeof value == 'function' && reNative.test(value);
        }
        var setBindData = !defineProperty ? noop : function (func, value) {
            descriptor.value = value;
            defineProperty(func, '__bindData__', descriptor);
          };
        function shimIsPlainObject(value) {
          var ctor, result;
          if (!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
            return false;
          }
          forIn(value, function (value, key) {
            result = key;
          });
          return typeof result == 'undefined' || hasOwnProperty.call(value, result);
        }
        function unescapeHtmlChar(match) {
          return htmlUnescapes[match];
        }
        function isArguments(value) {
          return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == argsClass || false;
        }
        var isArray = nativeIsArray || function (value) {
            return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == arrayClass || false;
          };
        var shimKeys = function (object) {
          var index, iterable = object, result = [];
          if (!iterable)
            return result;
          if (!objectTypes[typeof object])
            return result;
          for (index in iterable) {
            if (hasOwnProperty.call(iterable, index)) {
              result.push(index);
            }
          }
          return result;
        };
        var keys = !nativeKeys ? shimKeys : function (object) {
            if (!isObject(object)) {
              return [];
            }
            return nativeKeys(object);
          };
        var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'
          };
        var htmlUnescapes = invert(htmlEscapes);
        var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'), reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');
        var assign = function (object, source, guard) {
          var index, iterable = object, result = iterable;
          if (!iterable)
            return result;
          var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
          if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
            var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
          } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
            callback = args[--argsLength];
          }
          while (++argsIndex < argsLength) {
            iterable = args[argsIndex];
            if (iterable && objectTypes[typeof iterable]) {
              var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
              while (++ownIndex < length) {
                index = ownProps[ownIndex];
                result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
              }
            }
          }
          return result;
        };
        function clone(value, isDeep, callback, thisArg) {
          if (typeof isDeep != 'boolean' && isDeep != null) {
            thisArg = callback;
            callback = isDeep;
            isDeep = false;
          }
          return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
        }
        function cloneDeep(value, callback, thisArg) {
          return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
        }
        function create(prototype, properties) {
          var result = baseCreate(prototype);
          return properties ? assign(result, properties) : result;
        }
        var defaults = function (object, source, guard) {
          var index, iterable = object, result = iterable;
          if (!iterable)
            return result;
          var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
          while (++argsIndex < argsLength) {
            iterable = args[argsIndex];
            if (iterable && objectTypes[typeof iterable]) {
              var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
              while (++ownIndex < length) {
                index = ownProps[ownIndex];
                if (typeof result[index] == 'undefined')
                  result[index] = iterable[index];
              }
            }
          }
          return result;
        };
        function findKey(object, callback, thisArg) {
          var result;
          callback = lodash.createCallback(callback, thisArg, 3);
          forOwn(object, function (value, key, object) {
            if (callback(value, key, object)) {
              result = key;
              return false;
            }
          });
          return result;
        }
        function findLastKey(object, callback, thisArg) {
          var result;
          callback = lodash.createCallback(callback, thisArg, 3);
          forOwnRight(object, function (value, key, object) {
            if (callback(value, key, object)) {
              result = key;
              return false;
            }
          });
          return result;
        }
        var forIn = function (collection, callback, thisArg) {
          var index, iterable = collection, result = iterable;
          if (!iterable)
            return result;
          if (!objectTypes[typeof iterable])
            return result;
          callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
          for (index in iterable) {
            if (callback(iterable[index], index, collection) === false)
              return result;
          }
          return result;
        };
        function forInRight(object, callback, thisArg) {
          var pairs = [];
          forIn(object, function (value, key) {
            pairs.push(key, value);
          });
          var length = pairs.length;
          callback = baseCreateCallback(callback, thisArg, 3);
          while (length--) {
            if (callback(pairs[length--], pairs[length], object) === false) {
              break;
            }
          }
          return object;
        }
        var forOwn = function (collection, callback, thisArg) {
          var index, iterable = collection, result = iterable;
          if (!iterable)
            return result;
          if (!objectTypes[typeof iterable])
            return result;
          callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
          var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
          while (++ownIndex < length) {
            index = ownProps[ownIndex];
            if (callback(iterable[index], index, collection) === false)
              return result;
          }
          return result;
        };
        function forOwnRight(object, callback, thisArg) {
          var props = keys(object), length = props.length;
          callback = baseCreateCallback(callback, thisArg, 3);
          while (length--) {
            var key = props[length];
            if (callback(object[key], key, object) === false) {
              break;
            }
          }
          return object;
        }
        function functions(object) {
          var result = [];
          forIn(object, function (value, key) {
            if (isFunction(value)) {
              result.push(key);
            }
          });
          return result.sort();
        }
        function has(object, key) {
          return object ? hasOwnProperty.call(object, key) : false;
        }
        function invert(object) {
          var index = -1, props = keys(object), length = props.length, result = {};
          while (++index < length) {
            var key = props[index];
            result[object[key]] = key;
          }
          return result;
        }
        function isBoolean(value) {
          return value === true || value === false || value && typeof value == 'object' && toString.call(value) == boolClass || false;
        }
        function isDate(value) {
          return value && typeof value == 'object' && toString.call(value) == dateClass || false;
        }
        function isElement(value) {
          return value && value.nodeType === 1 || false;
        }
        function isEmpty(value) {
          var result = true;
          if (!value) {
            return result;
          }
          var className = toString.call(value), length = value.length;
          if (className == arrayClass || className == stringClass || className == argsClass || className == objectClass && typeof length == 'number' && isFunction(value.splice)) {
            return !length;
          }
          forOwn(value, function () {
            return result = false;
          });
          return result;
        }
        function isEqual(a, b, callback, thisArg) {
          return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
        }
        function isFinite(value) {
          return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
        }
        function isFunction(value) {
          return typeof value == 'function';
        }
        function isObject(value) {
          return !!(value && objectTypes[typeof value]);
        }
        function isNaN(value) {
          return isNumber(value) && value != +value;
        }
        function isNull(value) {
          return value === null;
        }
        function isNumber(value) {
          return typeof value == 'number' || value && typeof value == 'object' && toString.call(value) == numberClass || false;
        }
        var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function (value) {
            if (!(value && toString.call(value) == objectClass)) {
              return false;
            }
            var valueOf = value.valueOf, objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
            return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
          };
        function isRegExp(value) {
          return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
        }
        function isString(value) {
          return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == stringClass || false;
        }
        function isUndefined(value) {
          return typeof value == 'undefined';
        }
        function mapValues(object, callback, thisArg) {
          var result = {};
          callback = lodash.createCallback(callback, thisArg, 3);
          forOwn(object, function (value, key, object) {
            result[key] = callback(value, key, object);
          });
          return result;
        }
        function merge(object) {
          var args = arguments, length = 2;
          if (!isObject(object)) {
            return object;
          }
          if (typeof args[2] != 'number') {
            length = args.length;
          }
          if (length > 3 && typeof args[length - 2] == 'function') {
            var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
          } else if (length > 2 && typeof args[length - 1] == 'function') {
            callback = args[--length];
          }
          var sources = slice(arguments, 1, length), index = -1, stackA = getArray(), stackB = getArray();
          while (++index < length) {
            baseMerge(object, sources[index], callback, stackA, stackB);
          }
          releaseArray(stackA);
          releaseArray(stackB);
          return object;
        }
        function omit(object, callback, thisArg) {
          var result = {};
          if (typeof callback != 'function') {
            var props = [];
            forIn(object, function (value, key) {
              props.push(key);
            });
            props = baseDifference(props, baseFlatten(arguments, true, false, 1));
            var index = -1, length = props.length;
            while (++index < length) {
              var key = props[index];
              result[key] = object[key];
            }
          } else {
            callback = lodash.createCallback(callback, thisArg, 3);
            forIn(object, function (value, key, object) {
              if (!callback(value, key, object)) {
                result[key] = value;
              }
            });
          }
          return result;
        }
        function pairs(object) {
          var index = -1, props = keys(object), length = props.length, result = Array(length);
          while (++index < length) {
            var key = props[index];
            result[index] = [
              key,
              object[key]
            ];
          }
          return result;
        }
        function pick(object, callback, thisArg) {
          var result = {};
          if (typeof callback != 'function') {
            var index = -1, props = baseFlatten(arguments, true, false, 1), length = isObject(object) ? props.length : 0;
            while (++index < length) {
              var key = props[index];
              if (key in object) {
                result[key] = object[key];
              }
            }
          } else {
            callback = lodash.createCallback(callback, thisArg, 3);
            forIn(object, function (value, key, object) {
              if (callback(value, key, object)) {
                result[key] = value;
              }
            });
          }
          return result;
        }
        function transform(object, callback, accumulator, thisArg) {
          var isArr = isArray(object);
          if (accumulator == null) {
            if (isArr) {
              accumulator = [];
            } else {
              var ctor = object && object.constructor, proto = ctor && ctor.prototype;
              accumulator = baseCreate(proto);
            }
          }
          if (callback) {
            callback = lodash.createCallback(callback, thisArg, 4);
            (isArr ? forEach : forOwn)(object, function (value, index, object) {
              return callback(accumulator, value, index, object);
            });
          }
          return accumulator;
        }
        function values(object) {
          var index = -1, props = keys(object), length = props.length, result = Array(length);
          while (++index < length) {
            result[index] = object[props[index]];
          }
          return result;
        }
        function at(collection) {
          var args = arguments, index = -1, props = baseFlatten(args, true, false, 1), length = args[2] && args[2][args[1]] === collection ? 1 : props.length, result = Array(length);
          while (++index < length) {
            result[index] = collection[props[index]];
          }
          return result;
        }
        function contains(collection, target, fromIndex) {
          var index = -1, indexOf = getIndexOf(), length = collection ? collection.length : 0, result = false;
          fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
          if (isArray(collection)) {
            result = indexOf(collection, target, fromIndex) > -1;
          } else if (typeof length == 'number') {
            result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
          } else {
            forOwn(collection, function (value) {
              if (++index >= fromIndex) {
                return !(result = value === target);
              }
            });
          }
          return result;
        }
        var countBy = createAggregator(function (result, value, key) {
            hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1;
          });
        function every(collection, callback, thisArg) {
          var result = true;
          callback = lodash.createCallback(callback, thisArg, 3);
          var index = -1, length = collection ? collection.length : 0;
          if (typeof length == 'number') {
            while (++index < length) {
              if (!(result = !!callback(collection[index], index, collection))) {
                break;
              }
            }
          } else {
            forOwn(collection, function (value, index, collection) {
              return result = !!callback(value, index, collection);
            });
          }
          return result;
        }
        function filter(collection, callback, thisArg) {
          var result = [];
          callback = lodash.createCallback(callback, thisArg, 3);
          var index = -1, length = collection ? collection.length : 0;
          if (typeof length == 'number') {
            while (++index < length) {
              var value = collection[index];
              if (callback(value, index, collection)) {
                result.push(value);
              }
            }
          } else {
            forOwn(collection, function (value, index, collection) {
              if (callback(value, index, collection)) {
                result.push(value);
              }
            });
          }
          return result;
        }
        function find(collection, callback, thisArg) {
          callback = lodash.createCallback(callback, thisArg, 3);
          var index = -1, length = collection ? collection.length : 0;
          if (typeof length == 'number') {
            while (++index < length) {
              var value = collection[index];
              if (callback(value, index, collection)) {
                return value;
              }
            }
          } else {
            var result;
            forOwn(collection, function (value, index, collection) {
              if (callback(value, index, collection)) {
                result = value;
                return false;
              }
            });
            return result;
          }
        }
        function findLast(collection, callback, thisArg) {
          var result;
          callback = lodash.createCallback(callback, thisArg, 3);
          forEachRight(collection, function (value, index, collection) {
            if (callback(value, index, collection)) {
              result = value;
              return false;
            }
          });
          return result;
        }
        function forEach(collection, callback, thisArg) {
          var index = -1, length = collection ? collection.length : 0;
          callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
          if (typeof length == 'number') {
            while (++index < length) {
              if (callback(collection[index], index, collection) === false) {
                break;
              }
            }
          } else {
            forOwn(collection, callback);
          }
          return collection;
        }
        function forEachRight(collection, callback, thisArg) {
          var length = collection ? collection.length : 0;
          callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
          if (typeof length == 'number') {
            while (length--) {
              if (callback(collection[length], length, collection) === false) {
                break;
              }
            }
          } else {
            var props = keys(collection);
            length = props.length;
            forOwn(collection, function (value, key, collection) {
              key = props ? props[--length] : --length;
              return callback(collection[key], key, collection);
            });
          }
          return collection;
        }
        var groupBy = createAggregator(function (result, value, key) {
            (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
          });
        var indexBy = createAggregator(function (result, value, key) {
            result[key] = value;
          });
        function invoke(collection, methodName) {
          var args = slice(arguments, 2), index = -1, isFunc = typeof methodName == 'function', length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
          forEach(collection, function (value) {
            result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
          });
          return result;
        }
        function map(collection, callback, thisArg) {
          var index = -1, length = collection ? collection.length : 0;
          callback = lodash.createCallback(callback, thisArg, 3);
          if (typeof length == 'number') {
            var result = Array(length);
            while (++index < length) {
              result[index] = callback(collection[index], index, collection);
            }
          } else {
            result = [];
            forOwn(collection, function (value, key, collection) {
              result[++index] = callback(value, key, collection);
            });
          }
          return result;
        }
        function max(collection, callback, thisArg) {
          var computed = -Infinity, result = computed;
          if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
            callback = null;
          }
          if (callback == null && isArray(collection)) {
            var index = -1, length = collection.length;
            while (++index < length) {
              var value = collection[index];
              if (value > result) {
                result = value;
              }
            }
          } else {
            callback = callback == null && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg, 3);
            forEach(collection, function (value, index, collection) {
              var current = callback(value, index, collection);
              if (current > computed) {
                computed = current;
                result = value;
              }
            });
          }
          return result;
        }
        function min(collection, callback, thisArg) {
          var computed = Infinity, result = computed;
          if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
            callback = null;
          }
          if (callback == null && isArray(collection)) {
            var index = -1, length = collection.length;
            while (++index < length) {
              var value = collection[index];
              if (value < result) {
                result = value;
              }
            }
          } else {
            callback = callback == null && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg, 3);
            forEach(collection, function (value, index, collection) {
              var current = callback(value, index, collection);
              if (current < computed) {
                computed = current;
                result = value;
              }
            });
          }
          return result;
        }
        var pluck = map;
        function reduce(collection, callback, accumulator, thisArg) {
          if (!collection)
            return accumulator;
          var noaccum = arguments.length < 3;
          callback = lodash.createCallback(callback, thisArg, 4);
          var index = -1, length = collection.length;
          if (typeof length == 'number') {
            if (noaccum) {
              accumulator = collection[++index];
            }
            while (++index < length) {
              accumulator = callback(accumulator, collection[index], index, collection);
            }
          } else {
            forOwn(collection, function (value, index, collection) {
              accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
            });
          }
          return accumulator;
        }
        function reduceRight(collection, callback, accumulator, thisArg) {
          var noaccum = arguments.length < 3;
          callback = lodash.createCallback(callback, thisArg, 4);
          forEachRight(collection, function (value, index, collection) {
            accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
          });
          return accumulator;
        }
        function reject(collection, callback, thisArg) {
          callback = lodash.createCallback(callback, thisArg, 3);
          return filter(collection, function (value, index, collection) {
            return !callback(value, index, collection);
          });
        }
        function sample(collection, n, guard) {
          if (collection && typeof collection.length != 'number') {
            collection = values(collection);
          }
          if (n == null || guard) {
            return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
          }
          var result = shuffle(collection);
          result.length = nativeMin(nativeMax(0, n), result.length);
          return result;
        }
        function shuffle(collection) {
          var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
          forEach(collection, function (value) {
            var rand = baseRandom(0, ++index);
            result[index] = result[rand];
            result[rand] = value;
          });
          return result;
        }
        function size(collection) {
          var length = collection ? collection.length : 0;
          return typeof length == 'number' ? length : keys(collection).length;
        }
        function some(collection, callback, thisArg) {
          var result;
          callback = lodash.createCallback(callback, thisArg, 3);
          var index = -1, length = collection ? collection.length : 0;
          if (typeof length == 'number') {
            while (++index < length) {
              if (result = callback(collection[index], index, collection)) {
                break;
              }
            }
          } else {
            forOwn(collection, function (value, index, collection) {
              return !(result = callback(value, index, collection));
            });
          }
          return !!result;
        }
        function sortBy(collection, callback, thisArg) {
          var index = -1, isArr = isArray(callback), length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
          if (!isArr) {
            callback = lodash.createCallback(callback, thisArg, 3);
          }
          forEach(collection, function (value, key, collection) {
            var object = result[++index] = getObject();
            if (isArr) {
              object.criteria = map(callback, function (key) {
                return value[key];
              });
            } else {
              (object.criteria = getArray())[0] = callback(value, key, collection);
            }
            object.index = index;
            object.value = value;
          });
          length = result.length;
          result.sort(compareAscending);
          while (length--) {
            var object = result[length];
            result[length] = object.value;
            if (!isArr) {
              releaseArray(object.criteria);
            }
            releaseObject(object);
          }
          return result;
        }
        function toArray(collection) {
          if (collection && typeof collection.length == 'number') {
            return slice(collection);
          }
          return values(collection);
        }
        var where = filter;
        function compact(array) {
          var index = -1, length = array ? array.length : 0, result = [];
          while (++index < length) {
            var value = array[index];
            if (value) {
              result.push(value);
            }
          }
          return result;
        }
        function difference(array) {
          return baseDifference(array, baseFlatten(arguments, true, true, 1));
        }
        function findIndex(array, callback, thisArg) {
          var index = -1, length = array ? array.length : 0;
          callback = lodash.createCallback(callback, thisArg, 3);
          while (++index < length) {
            if (callback(array[index], index, array)) {
              return index;
            }
          }
          return -1;
        }
        function findLastIndex(array, callback, thisArg) {
          var length = array ? array.length : 0;
          callback = lodash.createCallback(callback, thisArg, 3);
          while (length--) {
            if (callback(array[length], length, array)) {
              return length;
            }
          }
          return -1;
        }
        function first(array, callback, thisArg) {
          var n = 0, length = array ? array.length : 0;
          if (typeof callback != 'number' && callback != null) {
            var index = -1;
            callback = lodash.createCallback(callback, thisArg, 3);
            while (++index < length && callback(array[index], index, array)) {
              n++;
            }
          } else {
            n = callback;
            if (n == null || thisArg) {
              return array ? array[0] : undefined;
            }
          }
          return slice(array, 0, nativeMin(nativeMax(0, n), length));
        }
        function flatten(array, isShallow, callback, thisArg) {
          if (typeof isShallow != 'boolean' && isShallow != null) {
            thisArg = callback;
            callback = typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array ? null : isShallow;
            isShallow = false;
          }
          if (callback != null) {
            array = map(array, callback, thisArg);
          }
          return baseFlatten(array, isShallow);
        }
        function indexOf(array, value, fromIndex) {
          if (typeof fromIndex == 'number') {
            var length = array ? array.length : 0;
            fromIndex = fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0;
          } else if (fromIndex) {
            var index = sortedIndex(array, value);
            return array[index] === value ? index : -1;
          }
          return baseIndexOf(array, value, fromIndex);
        }
        function initial(array, callback, thisArg) {
          var n = 0, length = array ? array.length : 0;
          if (typeof callback != 'number' && callback != null) {
            var index = length;
            callback = lodash.createCallback(callback, thisArg, 3);
            while (index-- && callback(array[index], index, array)) {
              n++;
            }
          } else {
            n = callback == null || thisArg ? 1 : callback || n;
          }
          return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
        }
        function intersection() {
          var args = [], argsIndex = -1, argsLength = arguments.length, caches = getArray(), indexOf = getIndexOf(), trustIndexOf = indexOf === baseIndexOf, seen = getArray();
          while (++argsIndex < argsLength) {
            var value = arguments[argsIndex];
            if (isArray(value) || isArguments(value)) {
              args.push(value);
              caches.push(trustIndexOf && value.length >= largeArraySize && createCache(argsIndex ? args[argsIndex] : seen));
            }
          }
          var array = args[0], index = -1, length = array ? array.length : 0, result = [];
          outer:
            while (++index < length) {
              var cache = caches[0];
              value = array[index];
              if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
                argsIndex = argsLength;
                (cache || seen).push(value);
                while (--argsIndex) {
                  cache = caches[argsIndex];
                  if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
                    continue outer;
                  }
                }
                result.push(value);
              }
            }
          while (argsLength--) {
            cache = caches[argsLength];
            if (cache) {
              releaseObject(cache);
            }
          }
          releaseArray(caches);
          releaseArray(seen);
          return result;
        }
        function last(array, callback, thisArg) {
          var n = 0, length = array ? array.length : 0;
          if (typeof callback != 'number' && callback != null) {
            var index = length;
            callback = lodash.createCallback(callback, thisArg, 3);
            while (index-- && callback(array[index], index, array)) {
              n++;
            }
          } else {
            n = callback;
            if (n == null || thisArg) {
              return array ? array[length - 1] : undefined;
            }
          }
          return slice(array, nativeMax(0, length - n));
        }
        function lastIndexOf(array, value, fromIndex) {
          var index = array ? array.length : 0;
          if (typeof fromIndex == 'number') {
            index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
          }
          while (index--) {
            if (array[index] === value) {
              return index;
            }
          }
          return -1;
        }
        function pull(array) {
          var args = arguments, argsIndex = 0, argsLength = args.length, length = array ? array.length : 0;
          while (++argsIndex < argsLength) {
            var index = -1, value = args[argsIndex];
            while (++index < length) {
              if (array[index] === value) {
                splice.call(array, index--, 1);
                length--;
              }
            }
          }
          return array;
        }
        function range(start, end, step) {
          start = +start || 0;
          step = typeof step == 'number' ? step : +step || 1;
          if (end == null) {
            end = start;
            start = 0;
          }
          var index = -1, length = nativeMax(0, ceil((end - start) / (step || 1))), result = Array(length);
          while (++index < length) {
            result[index] = start;
            start += step;
          }
          return result;
        }
        function remove(array, callback, thisArg) {
          var index = -1, length = array ? array.length : 0, result = [];
          callback = lodash.createCallback(callback, thisArg, 3);
          while (++index < length) {
            var value = array[index];
            if (callback(value, index, array)) {
              result.push(value);
              splice.call(array, index--, 1);
              length--;
            }
          }
          return result;
        }
        function rest(array, callback, thisArg) {
          if (typeof callback != 'number' && callback != null) {
            var n = 0, index = -1, length = array ? array.length : 0;
            callback = lodash.createCallback(callback, thisArg, 3);
            while (++index < length && callback(array[index], index, array)) {
              n++;
            }
          } else {
            n = callback == null || thisArg ? 1 : nativeMax(0, callback);
          }
          return slice(array, n);
        }
        function sortedIndex(array, value, callback, thisArg) {
          var low = 0, high = array ? array.length : low;
          callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
          value = callback(value);
          while (low < high) {
            var mid = low + high >>> 1;
            callback(array[mid]) < value ? low = mid + 1 : high = mid;
          }
          return low;
        }
        function union() {
          return baseUniq(baseFlatten(arguments, true, true));
        }
        function uniq(array, isSorted, callback, thisArg) {
          if (typeof isSorted != 'boolean' && isSorted != null) {
            thisArg = callback;
            callback = typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array ? null : isSorted;
            isSorted = false;
          }
          if (callback != null) {
            callback = lodash.createCallback(callback, thisArg, 3);
          }
          return baseUniq(array, isSorted, callback);
        }
        function without(array) {
          return baseDifference(array, slice(arguments, 1));
        }
        function xor() {
          var index = -1, length = arguments.length;
          while (++index < length) {
            var array = arguments[index];
            if (isArray(array) || isArguments(array)) {
              var result = result ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result))) : array;
            }
          }
          return result || [];
        }
        function zip() {
          var array = arguments.length > 1 ? arguments : arguments[0], index = -1, length = array ? max(pluck(array, 'length')) : 0, result = Array(length < 0 ? 0 : length);
          while (++index < length) {
            result[index] = pluck(array, index);
          }
          return result;
        }
        function zipObject(keys, values) {
          var index = -1, length = keys ? keys.length : 0, result = {};
          if (!values && length && !isArray(keys[0])) {
            values = [];
          }
          while (++index < length) {
            var key = keys[index];
            if (values) {
              result[key] = values[index];
            } else if (key) {
              result[key[0]] = key[1];
            }
          }
          return result;
        }
        function after(n, func) {
          if (!isFunction(func)) {
            throw new TypeError();
          }
          return function () {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        function bind(func, thisArg) {
          return arguments.length > 2 ? createWrapper(func, 17, slice(arguments, 2), null, thisArg) : createWrapper(func, 1, null, null, thisArg);
        }
        function bindAll(object) {
          var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object), index = -1, length = funcs.length;
          while (++index < length) {
            var key = funcs[index];
            object[key] = createWrapper(object[key], 1, null, null, object);
          }
          return object;
        }
        function bindKey(object, key) {
          return arguments.length > 2 ? createWrapper(key, 19, slice(arguments, 2), null, object) : createWrapper(key, 3, null, null, object);
        }
        function compose() {
          var funcs = arguments, length = funcs.length;
          while (length--) {
            if (!isFunction(funcs[length])) {
              throw new TypeError();
            }
          }
          return function () {
            var args = arguments, length = funcs.length;
            while (length--) {
              args = [funcs[length].apply(this, args)];
            }
            return args[0];
          };
        }
        function curry(func, arity) {
          arity = typeof arity == 'number' ? arity : +arity || func.length;
          return createWrapper(func, 4, null, null, null, arity);
        }
        function debounce(func, wait, options) {
          var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = false, trailing = true;
          if (!isFunction(func)) {
            throw new TypeError();
          }
          wait = nativeMax(0, wait) || 0;
          if (options === true) {
            var leading = true;
            trailing = false;
          } else if (isObject(options)) {
            leading = options.leading;
            maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
            trailing = 'trailing' in options ? options.trailing : trailing;
          }
          var delayed = function () {
            var remaining = wait - (now() - stamp);
            if (remaining <= 0) {
              if (maxTimeoutId) {
                clearTimeout(maxTimeoutId);
              }
              var isCalled = trailingCall;
              maxTimeoutId = timeoutId = trailingCall = undefined;
              if (isCalled) {
                lastCalled = now();
                result = func.apply(thisArg, args);
                if (!timeoutId && !maxTimeoutId) {
                  args = thisArg = null;
                }
              }
            } else {
              timeoutId = setTimeout(delayed, remaining);
            }
          };
          var maxDelayed = function () {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            maxTimeoutId = timeoutId = trailingCall = undefined;
            if (trailing || maxWait !== wait) {
              lastCalled = now();
              result = func.apply(thisArg, args);
              if (!timeoutId && !maxTimeoutId) {
                args = thisArg = null;
              }
            }
          };
          return function () {
            args = arguments;
            stamp = now();
            thisArg = this;
            trailingCall = trailing && (timeoutId || !leading);
            if (maxWait === false) {
              var leadingCall = leading && !timeoutId;
            } else {
              if (!maxTimeoutId && !leading) {
                lastCalled = stamp;
              }
              var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0;
              if (isCalled) {
                if (maxTimeoutId) {
                  maxTimeoutId = clearTimeout(maxTimeoutId);
                }
                lastCalled = stamp;
                result = func.apply(thisArg, args);
              } else if (!maxTimeoutId) {
                maxTimeoutId = setTimeout(maxDelayed, remaining);
              }
            }
            if (isCalled && timeoutId) {
              timeoutId = clearTimeout(timeoutId);
            } else if (!timeoutId && wait !== maxWait) {
              timeoutId = setTimeout(delayed, wait);
            }
            if (leadingCall) {
              isCalled = true;
              result = func.apply(thisArg, args);
            }
            if (isCalled && !timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
            return result;
          };
        }
        function defer(func) {
          if (!isFunction(func)) {
            throw new TypeError();
          }
          var args = slice(arguments, 1);
          return setTimeout(function () {
            func.apply(undefined, args);
          }, 1);
        }
        function delay(func, wait) {
          if (!isFunction(func)) {
            throw new TypeError();
          }
          var args = slice(arguments, 2);
          return setTimeout(function () {
            func.apply(undefined, args);
          }, wait);
        }
        function memoize(func, resolver) {
          if (!isFunction(func)) {
            throw new TypeError();
          }
          var memoized = function () {
            var cache = memoized.cache, key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
            return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments);
          };
          memoized.cache = {};
          return memoized;
        }
        function once(func) {
          var ran, result;
          if (!isFunction(func)) {
            throw new TypeError();
          }
          return function () {
            if (ran) {
              return result;
            }
            ran = true;
            result = func.apply(this, arguments);
            func = null;
            return result;
          };
        }
        function partial(func) {
          return createWrapper(func, 16, slice(arguments, 1));
        }
        function partialRight(func) {
          return createWrapper(func, 32, null, slice(arguments, 1));
        }
        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (!isFunction(func)) {
            throw new TypeError();
          }
          if (options === false) {
            leading = false;
          } else if (isObject(options)) {
            leading = 'leading' in options ? options.leading : leading;
            trailing = 'trailing' in options ? options.trailing : trailing;
          }
          debounceOptions.leading = leading;
          debounceOptions.maxWait = wait;
          debounceOptions.trailing = trailing;
          return debounce(func, wait, debounceOptions);
        }
        function wrap(value, wrapper) {
          return createWrapper(wrapper, 16, [value]);
        }
        function constant(value) {
          return function () {
            return value;
          };
        }
        function createCallback(func, thisArg, argCount) {
          var type = typeof func;
          if (func == null || type == 'function') {
            return baseCreateCallback(func, thisArg, argCount);
          }
          if (type != 'object') {
            return property(func);
          }
          var props = keys(func), key = props[0], a = func[key];
          if (props.length == 1 && a === a && !isObject(a)) {
            return function (object) {
              var b = object[key];
              return a === b && (a !== 0 || 1 / a == 1 / b);
            };
          }
          return function (object) {
            var length = props.length, result = false;
            while (length--) {
              if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
                break;
              }
            }
            return result;
          };
        }
        function escape(string) {
          return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
        }
        function identity(value) {
          return value;
        }
        function mixin(object, source, options) {
          var chain = true, methodNames = source && functions(source);
          if (!source || !options && !methodNames.length) {
            if (options == null) {
              options = source;
            }
            ctor = lodashWrapper;
            source = object;
            object = lodash;
            methodNames = functions(source);
          }
          if (options === false) {
            chain = false;
          } else if (isObject(options) && 'chain' in options) {
            chain = options.chain;
          }
          var ctor = object, isFunc = isFunction(ctor);
          forEach(methodNames, function (methodName) {
            var func = object[methodName] = source[methodName];
            if (isFunc) {
              ctor.prototype[methodName] = function () {
                var chainAll = this.__chain__, value = this.__wrapped__, args = [value];
                push.apply(args, arguments);
                var result = func.apply(object, args);
                if (chain || chainAll) {
                  if (value === result && isObject(result)) {
                    return this;
                  }
                  result = new ctor(result);
                  result.__chain__ = chainAll;
                }
                return result;
              };
            }
          });
        }
        function noConflict() {
          context._ = oldDash;
          return this;
        }
        function noop() {
        }
        var now = isNative(now = Date.now) && now || function () {
            return new Date().getTime();
          };
        var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function (value, radix) {
            return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
          };
        function property(key) {
          return function (object) {
            return object[key];
          };
        }
        function random(min, max, floating) {
          var noMin = min == null, noMax = max == null;
          if (floating == null) {
            if (typeof min == 'boolean' && noMax) {
              floating = min;
              min = 1;
            } else if (!noMax && typeof max == 'boolean') {
              floating = max;
              noMax = true;
            }
          }
          if (noMin && noMax) {
            max = 1;
          }
          min = +min || 0;
          if (noMax) {
            max = min;
            min = 0;
          } else {
            max = +max || 0;
          }
          if (floating || min % 1 || max % 1) {
            var rand = nativeRandom();
            return nativeMin(min + rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1))), max);
          }
          return baseRandom(min, max);
        }
        function result(object, key) {
          if (object) {
            var value = object[key];
            return isFunction(value) ? object[key]() : value;
          }
        }
        function template(text, data, options) {
          var settings = lodash.templateSettings;
          text = String(text || '');
          options = defaults({}, options, settings);
          var imports = defaults({}, options.imports, settings.imports), importsKeys = keys(imports), importsValues = values(imports);
          var isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = '__p += \'';
          var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
          text.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              source += '\' +\n__e(' + escapeValue + ') +\n\'';
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += '\';\n' + evaluateValue + ';\n__p += \'';
            }
            if (interpolateValue) {
              source += '\' +\n((__t = (' + interpolateValue + ')) == null ? \'\' : __t) +\n\'';
            }
            index = offset + match.length;
            return match;
          });
          source += '\';\n';
          var variable = options.variable, hasVariable = variable;
          if (!hasVariable) {
            variable = 'obj';
            source = 'with (' + variable + ') {\n' + source + '\n}\n';
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
          source = 'function(' + variable + ') {\n' + (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') + 'var __t, __p = \'\', __e = _.escape' + (isEvaluating ? ', __j = Array.prototype.join;\n' + 'function print() { __p += __j.call(arguments, \'\') }\n' : ';\n') + source + 'return __p\n}';
          var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + templateCounter++ + ']') + '\n*/';
          try {
            var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
          } catch (e) {
            e.source = source;
            throw e;
          }
          if (data) {
            return result(data);
          }
          result.source = source;
          return result;
        }
        function times(n, callback, thisArg) {
          n = (n = +n) > -1 ? n : 0;
          var index = -1, result = Array(n);
          callback = baseCreateCallback(callback, thisArg, 1);
          while (++index < n) {
            result[index] = callback(index);
          }
          return result;
        }
        function unescape(string) {
          return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
        }
        function uniqueId(prefix) {
          var id = ++idCounter;
          return String(prefix == null ? '' : prefix) + id;
        }
        function chain(value) {
          value = new lodashWrapper(value);
          value.__chain__ = true;
          return value;
        }
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        function wrapperChain() {
          this.__chain__ = true;
          return this;
        }
        function wrapperToString() {
          return String(this.__wrapped__);
        }
        function wrapperValueOf() {
          return this.__wrapped__;
        }
        lodash.after = after;
        lodash.assign = assign;
        lodash.at = at;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.chain = chain;
        lodash.compact = compact;
        lodash.compose = compose;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.createCallback = createCallback;
        lodash.curry = curry;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.filter = filter;
        lodash.flatten = flatten;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.functions = functions;
        lodash.groupBy = groupBy;
        lodash.indexBy = indexBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.invert = invert;
        lodash.invoke = invoke;
        lodash.keys = keys;
        lodash.map = map;
        lodash.mapValues = mapValues;
        lodash.max = max;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.min = min;
        lodash.omit = omit;
        lodash.once = once;
        lodash.pairs = pairs;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.pick = pick;
        lodash.pluck = pluck;
        lodash.property = property;
        lodash.pull = pull;
        lodash.range = range;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.shuffle = shuffle;
        lodash.sortBy = sortBy;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.times = times;
        lodash.toArray = toArray;
        lodash.transform = transform;
        lodash.union = union;
        lodash.uniq = uniq;
        lodash.values = values;
        lodash.where = where;
        lodash.without = without;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.collect = map;
        lodash.drop = rest;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.extend = assign;
        lodash.methods = functions;
        lodash.object = zipObject;
        lodash.select = filter;
        lodash.tail = rest;
        lodash.unique = uniq;
        lodash.unzip = zip;
        mixin(lodash);
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.contains = contains;
        lodash.escape = escape;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.has = has;
        lodash.identity = identity;
        lodash.indexOf = indexOf;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isBoolean = isBoolean;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isFinite = isFinite;
        lodash.isFunction = isFunction;
        lodash.isNaN = isNaN;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isString = isString;
        lodash.isUndefined = isUndefined;
        lodash.lastIndexOf = lastIndexOf;
        lodash.mixin = mixin;
        lodash.noConflict = noConflict;
        lodash.noop = noop;
        lodash.now = now;
        lodash.parseInt = parseInt;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.result = result;
        lodash.runInContext = runInContext;
        lodash.size = size;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.template = template;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.all = every;
        lodash.any = some;
        lodash.detect = find;
        lodash.findWhere = find;
        lodash.foldl = reduce;
        lodash.foldr = reduceRight;
        lodash.include = contains;
        lodash.inject = reduce;
        mixin(function () {
          var source = {};
          forOwn(lodash, function (func, methodName) {
            if (!lodash.prototype[methodName]) {
              source[methodName] = func;
            }
          });
          return source;
        }(), false);
        lodash.first = first;
        lodash.last = last;
        lodash.sample = sample;
        lodash.take = first;
        lodash.head = first;
        forOwn(lodash, function (func, methodName) {
          var callbackable = methodName !== 'sample';
          if (!lodash.prototype[methodName]) {
            lodash.prototype[methodName] = function (n, guard) {
              var chainAll = this.__chain__, result = func(this.__wrapped__, n, guard);
              return !chainAll && (n == null || guard && !(callbackable && typeof n == 'function')) ? result : new lodashWrapper(result, chainAll);
            };
          }
        });
        lodash.VERSION = '2.4.1';
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.toString = wrapperToString;
        lodash.prototype.value = wrapperValueOf;
        lodash.prototype.valueOf = wrapperValueOf;
        forEach([
          'join',
          'pop',
          'shift'
        ], function (methodName) {
          var func = arrayRef[methodName];
          lodash.prototype[methodName] = function () {
            var chainAll = this.__chain__, result = func.apply(this.__wrapped__, arguments);
            return chainAll ? new lodashWrapper(result, chainAll) : result;
          };
        });
        forEach([
          'push',
          'reverse',
          'sort',
          'unshift'
        ], function (methodName) {
          var func = arrayRef[methodName];
          lodash.prototype[methodName] = function () {
            func.apply(this.__wrapped__, arguments);
            return this;
          };
        });
        forEach([
          'concat',
          'slice',
          'splice'
        ], function (methodName) {
          var func = arrayRef[methodName];
          lodash.prototype[methodName] = function () {
            return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
          };
        });
        return lodash;
      }
      var _ = runInContext();
      if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        root._ = _;
        define(function () {
          return _;
        });
      } else if (freeExports && freeModule) {
        if (moduleExports) {
          (freeModule.exports = _)._ = _;
        } else {
          freeExports._ = _;
        }
      } else {
        root._ = _;
      }
    }.call(this));
}, {"__filename":"lodash.js","__dirname":"node_modules/lodash/dist"}], 
'duplexer': [function(exports, require, module, __filename, __dirname) { 
    var Stream = require('stream');
    var writeMethods = [
        'write',
        'end',
        'destroy'
      ];
    var readMethods = [
        'resume',
        'pause'
      ];
    var readEvents = [
        'data',
        'close'
      ];
    var slice = Array.prototype.slice;
    module.exports = duplex;
    function forEach(arr, fn) {
      if (arr.forEach) {
        return arr.forEach(fn);
      }
      for (var i = 0; i < arr.length; i++) {
        fn(arr[i], i);
      }
    }
    function duplex(writer, reader) {
      var stream = new Stream();
      var ended = false;
      forEach(writeMethods, proxyWriter);
      forEach(readMethods, proxyReader);
      forEach(readEvents, proxyStream);
      reader.on('end', handleEnd);
      writer.on('drain', function () {
        stream.emit('drain');
      });
      writer.on('error', reemit);
      reader.on('error', reemit);
      stream.writable = writer.writable;
      stream.readable = reader.readable;
      return stream;
      function proxyWriter(methodName) {
        stream[methodName] = method;
        function method() {
          return writer[methodName].apply(writer, arguments);
        }
      }
      function proxyReader(methodName) {
        stream[methodName] = method;
        function method() {
          stream.emit(methodName);
          var func = reader[methodName];
          if (func) {
            return func.apply(reader, arguments);
          }
          reader.emit(methodName);
        }
      }
      function proxyStream(methodName) {
        reader.on(methodName, reemit);
        function reemit() {
          var args = slice.call(arguments);
          args.unshift(methodName);
          stream.emit.apply(stream, args);
        }
      }
      function handleEnd() {
        if (ended) {
          return;
        }
        ended = true;
        var args = slice.call(arguments);
        args.unshift('end');
        stream.emit.apply(stream, args);
      }
      function reemit(err) {
        stream.emit('error', err);
      }
    }
}, {"__filename":"index.js","__dirname":"node_modules/stream-combiner/node_modules/duplexer"}], 
'through': [function(exports, require, module, __filename, __dirname) { 
    var Stream = require('stream');
    exports = module.exports = through;
    through.through = through;
    function through(write, end, opts) {
      write = write || function (data) {
        this.queue(data);
      };
      end = end || function () {
        this.queue(null);
      };
      var ended = false, destroyed = false, buffer = [], _ended = false;
      var stream = new Stream();
      stream.readable = stream.writable = true;
      stream.paused = false;
      stream.autoDestroy = !(opts && opts.autoDestroy === false);
      stream.write = function (data) {
        write.call(this, data);
        return !stream.paused;
      };
      function drain() {
        while (buffer.length && !stream.paused) {
          var data = buffer.shift();
          if (null === data)
            return stream.emit('end');
          else
            stream.emit('data', data);
        }
      }
      stream.queue = stream.push = function (data) {
        if (_ended)
          return stream;
        if (data == null)
          _ended = true;
        buffer.push(data);
        drain();
        return stream;
      };
      stream.on('end', function () {
        stream.readable = false;
        if (!stream.writable && stream.autoDestroy)
          process.nextTick(function () {
            stream.destroy();
          });
      });
      function _end() {
        stream.writable = false;
        end.call(stream);
        if (!stream.readable && stream.autoDestroy)
          stream.destroy();
      }
      stream.end = function (data) {
        if (ended)
          return;
        ended = true;
        if (arguments.length)
          stream.write(data);
        _end();
        return stream;
      };
      stream.destroy = function () {
        if (destroyed)
          return;
        destroyed = true;
        ended = true;
        buffer.length = 0;
        stream.writable = stream.readable = false;
        stream.emit('close');
        return stream;
      };
      stream.pause = function () {
        if (stream.paused)
          return;
        stream.paused = true;
        return stream;
      };
      stream.resume = function () {
        if (stream.paused) {
          stream.paused = false;
          stream.emit('resume');
        }
        drain();
        if (!stream.paused)
          stream.emit('drain');
        return stream;
      };
      return stream;
    }
}, {"__filename":"index.js","__dirname":"node_modules/stream-combiner/node_modules/through"}], 
'stream-combiner': [function(exports, require, module, __filename, __dirname) { 
    var duplexer = require('duplexer');
    var through = require('through');
    module.exports = function () {
      var streams;
      if (arguments.length == 1 && Array.isArray(arguments[0])) {
        streams = arguments[0];
      } else {
        streams = [].slice.call(arguments);
      }
      if (streams.length == 0)
        return through();
      else if (streams.length == 1)
        return streams[0];
      var first = streams[0], last = streams[streams.length - 1], thepipe = duplexer(first, last);
      function recurse(streams) {
        if (streams.length < 2)
          return;
        streams[0].pipe(streams[1]);
        recurse(streams.slice(1));
      }
      recurse(streams);
      function onerror() {
        var args = [].slice.call(arguments);
        args.unshift('error');
        thepipe.emit.apply(thepipe, args);
      }
      for (var i = 1; i < streams.length - 1; i++)
        streams[i].on('error', onerror);
      return thepipe;
    };
}, {"__filename":"index.js","__dirname":"node_modules/stream-combiner"}], 
'core-util-is': [function(exports, require, module, __filename, __dirname) { 
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;
    function isError(e) {
      return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;
    function isBuffer(arg) {
      return Buffer.isBuffer(arg);
    }
    exports.isBuffer = isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
}, {"__filename":"util.js","__dirname":"node_modules/through2/node_modules/readable-stream/node_modules/core-util-is/lib"}], 
'inherits': [function(exports, require, module, __filename, __dirname) { 
    module.exports = require('util').inherits;
}, {"__filename":"inherits.js","__dirname":"node_modules/through2/node_modules/readable-stream/node_modules/inherits"}], 
'isarray': [function(exports, require, module, __filename, __dirname) { 
    module.exports = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };
}, {"__filename":"index.js","__dirname":"node_modules/through2/node_modules/readable-stream/node_modules/isarray"}], 
'string_decoder': [function(exports, require, module, __filename, __dirname) { 
    var Buffer = require('buffer').Buffer;
    var isBufferEncoding = Buffer.isEncoding || function (encoding) {
        switch (encoding && encoding.toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
          return true;
        default:
          return false;
        }
      };
    function assertEncoding(encoding) {
      if (encoding && !isBufferEncoding(encoding)) {
        throw new Error('Unknown encoding: ' + encoding);
      }
    }
    var StringDecoder = exports.StringDecoder = function (encoding) {
        this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
        assertEncoding(encoding);
        switch (this.encoding) {
        case 'utf8':
          this.surrogateSize = 3;
          break;
        case 'ucs2':
        case 'utf16le':
          this.surrogateSize = 2;
          this.detectIncompleteChar = utf16DetectIncompleteChar;
          break;
        case 'base64':
          this.surrogateSize = 3;
          this.detectIncompleteChar = base64DetectIncompleteChar;
          break;
        default:
          this.write = passThroughWrite;
          return;
        }
        this.charBuffer = new Buffer(6);
        this.charReceived = 0;
        this.charLength = 0;
      };
    StringDecoder.prototype.write = function (buffer) {
      var charStr = '';
      while (this.charLength) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
        if (this.charReceived < this.charLength) {
          return '';
        }
        buffer = buffer.slice(available, buffer.length);
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize;
          charStr = '';
          continue;
        }
        this.charReceived = this.charLength = 0;
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      if (this.charLength) {
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
      charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function (buffer) {
      var i = buffer.length >= 3 ? 3 : buffer.length;
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i];
        if (i == 1 && c >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i <= 2 && c >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i <= 3 && c >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };
    StringDecoder.prototype.end = function (buffer) {
      var res = '';
      if (buffer && buffer.length)
        res = this.write(buffer);
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
    function passThroughWrite(buffer) {
      return buffer.toString(this.encoding);
    }
    function utf16DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 2;
      this.charLength = this.charReceived ? 2 : 0;
    }
    function base64DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 3;
      this.charLength = this.charReceived ? 3 : 0;
    }
}, {"__filename":"index.js","__dirname":"node_modules/through2/node_modules/readable-stream/node_modules/string_decoder"}], 
'readable-stream/lib/_stream_readable': [function(exports, require, module, __filename, __dirname) { 
    module.exports = Readable;
    var isArray = require('isarray');
    var Buffer = require('buffer').Buffer;
    Readable.ReadableState = ReadableState;
    var EE = require('events').EventEmitter;
    if (!EE.listenerCount)
      EE.listenerCount = function (emitter, type) {
        return emitter.listeners(type).length;
      };
    var Stream = require('stream');
    var util = require('core-util-is');
    util.inherits = require('inherits');
    var StringDecoder;
    util.inherits(Readable, Stream);
    function ReadableState(options, stream) {
      options = options || {};
      var hwm = options.highWaterMark;
      this.highWaterMark = hwm || hwm === 0 ? hwm : 16 * 1024;
      this.highWaterMark = ~~this.highWaterMark;
      this.buffer = [];
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = false;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.calledRead = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.objectMode = !!options.objectMode;
      this.defaultEncoding = options.defaultEncoding || 'utf8';
      this.ranOut = false;
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require('string_decoder').StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      if (!(this instanceof Readable))
        return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      Stream.call(this);
    }
    Readable.prototype.push = function (chunk, encoding) {
      var state = this._readableState;
      if (typeof chunk === 'string' && !state.objectMode) {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = new Buffer(chunk, encoding);
          encoding = '';
        }
      }
      return readableAddChunk(this, state, chunk, encoding, false);
    };
    Readable.prototype.unshift = function (chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, '', true);
    };
    function readableAddChunk(stream, state, chunk, encoding, addToFront) {
      var er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit('error', er);
      } else if (chunk === null || chunk === undefined) {
        state.reading = false;
        if (!state.ended)
          onEofChunk(stream, state);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (state.ended && !addToFront) {
          var e = new Error('stream.push() after EOF');
          stream.emit('error', e);
        } else if (state.endEmitted && addToFront) {
          var e = new Error('stream.unshift() after end event');
          stream.emit('error', e);
        } else {
          if (state.decoder && !addToFront && !encoding)
            chunk = state.decoder.write(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) {
            state.buffer.unshift(chunk);
          } else {
            state.reading = false;
            state.buffer.push(chunk);
          }
          if (state.needReadable)
            emitReadable(stream);
          maybeReadMore(stream, state);
        }
      } else if (!addToFront) {
        state.reading = false;
      }
      return needMoreData(state);
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.setEncoding = function (enc) {
      if (!StringDecoder)
        StringDecoder = require('string_decoder').StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
    };
    var MAX_HWM = 8388608;
    function roundUpToNextPowerOf2(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        for (var p = 1; p < 32; p <<= 1)
          n |= n >> p;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return n === 0 ? 0 : 1;
      if (n === null || isNaN(n)) {
        if (state.flowing && state.buffer.length)
          return state.buffer[0].length;
        else
          return state.length;
      }
      if (n <= 0)
        return 0;
      if (n > state.highWaterMark)
        state.highWaterMark = roundUpToNextPowerOf2(n);
      if (n > state.length) {
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        } else
          return state.length;
      }
      return n;
    }
    Readable.prototype.read = function (n) {
      var state = this._readableState;
      state.calledRead = true;
      var nOrig = n;
      var ret;
      if (typeof n !== 'number' || n > 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        ret = null;
        if (state.length > 0 && state.decoder) {
          ret = fromList(n, state);
          state.length -= ret.length;
        }
        if (state.length === 0)
          endReadable(this);
        return ret;
      }
      var doRead = state.needReadable;
      if (state.length - n <= state.highWaterMark)
        doRead = true;
      if (state.ended || state.reading)
        doRead = false;
      if (doRead) {
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
      }
      if (doRead && !state.reading)
        n = howMuchToRead(nOrig, state);
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      }
      state.length -= n;
      if (state.length === 0 && !state.ended)
        state.needReadable = true;
      if (state.ended && !state.endEmitted && state.length === 0)
        endReadable(this);
      return ret;
    };
    function chunkInvalid(state, chunk) {
      var er = null;
      if (!Buffer.isBuffer(chunk) && 'string' !== typeof chunk && chunk !== null && chunk !== undefined && !state.objectMode) {
        er = new TypeError('Invalid non-string/buffer chunk');
      }
      return er;
    }
    function onEofChunk(stream, state) {
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.length > 0)
        emitReadable(stream);
      else
        endReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (state.emittedReadable)
        return;
      state.emittedReadable = true;
      if (state.sync)
        process.nextTick(function () {
          emitReadable_(stream);
        });
      else
        emitReadable_(stream);
    }
    function emitReadable_(stream) {
      stream.emit('readable');
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(function () {
          maybeReadMore_(stream, state);
        });
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        stream.read(0);
        if (len === state.length)
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function (n) {
      this.emit('error', new Error('not implemented'));
    };
    Readable.prototype.pipe = function (dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [
          state.pipes,
          dest
        ];
        break;
      default:
        state.pipes.push(dest);
        break;
      }
      state.pipesCount += 1;
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : cleanup;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once('end', endFn);
      dest.on('unpipe', onunpipe);
      function onunpipe(readable) {
        if (readable !== src)
          return;
        cleanup();
      }
      function onend() {
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on('drain', ondrain);
      function cleanup() {
        dest.removeListener('close', onclose);
        dest.removeListener('finish', onfinish);
        dest.removeListener('drain', ondrain);
        dest.removeListener('error', onerror);
        dest.removeListener('unpipe', onunpipe);
        src.removeListener('end', onend);
        src.removeListener('end', cleanup);
        if (!dest._writableState || dest._writableState.needDrain)
          ondrain();
      }
      function onerror(er) {
        unpipe();
        dest.removeListener('error', onerror);
        if (EE.listenerCount(dest, 'error') === 0)
          dest.emit('error', er);
      }
      if (!dest._events || !dest._events.error)
        dest.on('error', onerror);
      else if (isArray(dest._events.error))
        dest._events.error.unshift(onerror);
      else
        dest._events.error = [
          onerror,
          dest._events.error
        ];
      function onclose() {
        dest.removeListener('finish', onfinish);
        unpipe();
      }
      dest.once('close', onclose);
      function onfinish() {
        dest.removeListener('close', onclose);
        unpipe();
      }
      dest.once('finish', onfinish);
      function unpipe() {
        src.unpipe(dest);
      }
      dest.emit('pipe', src);
      if (!state.flowing) {
        this.on('readable', pipeOnReadable);
        state.flowing = true;
        process.nextTick(function () {
          flow(src);
        });
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function () {
        var dest = this;
        var state = src._readableState;
        state.awaitDrain--;
        if (state.awaitDrain === 0)
          flow(src);
      };
    }
    function flow(src) {
      var state = src._readableState;
      var chunk;
      state.awaitDrain = 0;
      function write(dest, i, list) {
        var written = dest.write(chunk);
        if (false === written) {
          state.awaitDrain++;
        }
      }
      while (state.pipesCount && null !== (chunk = src.read())) {
        if (state.pipesCount === 1)
          write(state.pipes, 0, null);
        else
          forEach(state.pipes, write);
        src.emit('data', chunk);
        if (state.awaitDrain > 0)
          return;
      }
      if (state.pipesCount === 0) {
        state.flowing = false;
        if (EE.listenerCount(src, 'data') > 0)
          emitDataEvents(src);
        return;
      }
      state.ranOut = true;
    }
    function pipeOnReadable() {
      if (this._readableState.ranOut) {
        this._readableState.ranOut = false;
        flow(this);
      }
    }
    Readable.prototype.unpipe = function (dest) {
      var state = this._readableState;
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        this.removeListener('readable', pipeOnReadable);
        state.flowing = false;
        if (dest)
          dest.emit('unpipe', this);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        this.removeListener('readable', pipeOnReadable);
        state.flowing = false;
        for (var i = 0; i < len; i++)
          dests[i].emit('unpipe', this);
        return this;
      }
      var i = indexOf(state.pipes, dest);
      if (i === -1)
        return this;
      state.pipes.splice(i, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit('unpipe', this);
      return this;
    };
    Readable.prototype.on = function (ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === 'data' && !this._readableState.flowing)
        emitDataEvents(this);
      if (ev === 'readable' && this.readable) {
        var state = this._readableState;
        if (!state.readableListening) {
          state.readableListening = true;
          state.emittedReadable = false;
          state.needReadable = true;
          if (!state.reading) {
            this.read(0);
          } else if (state.length) {
            emitReadable(this, state);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.resume = function () {
      emitDataEvents(this);
      this.read(0);
      this.emit('resume');
    };
    Readable.prototype.pause = function () {
      emitDataEvents(this, true);
      this.emit('pause');
    };
    function emitDataEvents(stream, startPaused) {
      var state = stream._readableState;
      if (state.flowing) {
        throw new Error('Cannot switch to old mode now.');
      }
      var paused = startPaused || false;
      var readable = false;
      stream.readable = true;
      stream.pipe = Stream.prototype.pipe;
      stream.on = stream.addListener = Stream.prototype.on;
      stream.on('readable', function () {
        readable = true;
        var c;
        while (!paused && null !== (c = stream.read()))
          stream.emit('data', c);
        if (c === null) {
          readable = false;
          stream._readableState.needReadable = true;
        }
      });
      stream.pause = function () {
        paused = true;
        this.emit('pause');
      };
      stream.resume = function () {
        paused = false;
        if (readable)
          process.nextTick(function () {
            stream.emit('readable');
          });
        else
          this.read(0);
        this.emit('resume');
      };
      stream.emit('readable');
    }
    Readable.prototype.wrap = function (stream) {
      var state = this._readableState;
      var paused = false;
      var self = this;
      stream.on('end', function () {
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            self.push(chunk);
        }
        self.push(null);
      });
      stream.on('data', function (chunk) {
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === undefined))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = self.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (typeof stream[i] === 'function' && typeof this[i] === 'undefined') {
          this[i] = function (method) {
            return function () {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      var events = [
          'error',
          'close',
          'destroy',
          'pause',
          'resume'
        ];
      forEach(events, function (ev) {
        stream.on(ev, self.emit.bind(self, ev));
      });
      self._read = function (n) {
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return self;
    };
    Readable._fromList = fromList;
    function fromList(n, state) {
      var list = state.buffer;
      var length = state.length;
      var stringMode = !!state.decoder;
      var objectMode = !!state.objectMode;
      var ret;
      if (list.length === 0)
        return null;
      if (length === 0)
        ret = null;
      else if (objectMode)
        ret = list.shift();
      else if (!n || n >= length) {
        if (stringMode)
          ret = list.join('');
        else
          ret = Buffer.concat(list, length);
        list.length = 0;
      } else {
        if (n < list[0].length) {
          var buf = list[0];
          ret = buf.slice(0, n);
          list[0] = buf.slice(n);
        } else if (n === list[0].length) {
          ret = list.shift();
        } else {
          if (stringMode)
            ret = '';
          else
            ret = new Buffer(n);
          var c = 0;
          for (var i = 0, l = list.length; i < l && c < n; i++) {
            var buf = list[0];
            var cpy = Math.min(n - c, buf.length);
            if (stringMode)
              ret += buf.slice(0, cpy);
            else
              buf.copy(ret, c, 0, cpy);
            if (cpy < buf.length)
              list[0] = buf.slice(cpy);
            else
              list.shift();
            c += cpy;
          }
        }
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0)
        throw new Error('endReadable called on non-empty stream');
      if (!state.endEmitted && state.calledRead) {
        state.ended = true;
        process.nextTick(function () {
          if (!state.endEmitted && state.length === 0) {
            state.endEmitted = true;
            stream.readable = false;
            stream.emit('end');
          }
        });
      }
    }
    function forEach(xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i);
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
}, {"__filename":"_stream_readable.js","__dirname":"node_modules/through2/node_modules/readable-stream/lib"}], 
'readable-stream/lib/_stream_writable': [function(exports, require, module, __filename, __dirname) { 
    module.exports = Writable;
    var Buffer = require('buffer').Buffer;
    Writable.WritableState = WritableState;
    var util = require('core-util-is');
    util.inherits = require('inherits');
    var Stream = require('stream');
    util.inherits(Writable, Stream);
    function WriteReq(chunk, encoding, cb) {
      this.chunk = chunk;
      this.encoding = encoding;
      this.callback = cb;
    }
    function WritableState(options, stream) {
      options = options || {};
      var hwm = options.highWaterMark;
      this.highWaterMark = hwm || hwm === 0 ? hwm : 16 * 1024;
      this.objectMode = !!options.objectMode;
      this.highWaterMark = ~~this.highWaterMark;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || 'utf8';
      this.length = 0;
      this.writing = false;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function (er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.buffer = [];
      this.errorEmitted = false;
    }
    function Writable(options) {
      var Duplex = require('readable-stream/lib/_stream_duplex');
      if (!(this instanceof Writable) && !(this instanceof Duplex))
        return new Writable(options);
      this._writableState = new WritableState(options, this);
      this.writable = true;
      Stream.call(this);
    }
    Writable.prototype.pipe = function () {
      this.emit('error', new Error('Cannot pipe. Not readable.'));
    };
    function writeAfterEnd(stream, state, cb) {
      var er = new Error('write after end');
      stream.emit('error', er);
      process.nextTick(function () {
        cb(er);
      });
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      if (!Buffer.isBuffer(chunk) && 'string' !== typeof chunk && chunk !== null && chunk !== undefined && !state.objectMode) {
        var er = new TypeError('Invalid non-string/buffer chunk');
        stream.emit('error', er);
        process.nextTick(function () {
          cb(er);
        });
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function (chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
      if (Buffer.isBuffer(chunk))
        encoding = 'buffer';
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== 'function')
        cb = function () {
        };
      if (state.ended)
        writeAfterEnd(this, state, cb);
      else if (validChunk(this, state, chunk, cb))
        ret = writeOrBuffer(this, state, chunk, encoding, cb);
      return ret;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
        chunk = new Buffer(chunk, encoding);
      }
      return chunk;
    }
    function writeOrBuffer(stream, state, chunk, encoding, cb) {
      chunk = decodeChunk(state, chunk, encoding);
      if (Buffer.isBuffer(chunk))
        encoding = 'buffer';
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing)
        state.buffer.push(new WriteReq(chunk, encoding, cb));
      else
        doWrite(stream, state, len, chunk, encoding, cb);
      return ret;
    }
    function doWrite(stream, state, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      if (sync)
        process.nextTick(function () {
          cb(er);
        });
      else
        cb(er);
      stream._writableState.errorEmitted = true;
      stream.emit('error', er);
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(stream, state);
        if (!finished && !state.bufferProcessing && state.buffer.length)
          clearBuffer(stream, state);
        if (sync) {
          process.nextTick(function () {
            afterWrite(stream, state, finished, cb);
          });
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      cb();
      if (finished)
        finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit('drain');
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      for (var c = 0; c < state.buffer.length; c++) {
        var entry = state.buffer[c];
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream, state, len, chunk, encoding, cb);
        if (state.writing) {
          c++;
          break;
        }
      }
      state.bufferProcessing = false;
      if (c < state.buffer.length)
        state.buffer = state.buffer.slice(c);
      else
        state.buffer.length = 0;
    }
    Writable.prototype._write = function (chunk, encoding, cb) {
      cb(new Error('not implemented'));
    };
    Writable.prototype.end = function (chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === 'function') {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
      if (typeof chunk !== 'undefined' && chunk !== null)
        this.write(chunk, encoding);
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };
    function needFinish(stream, state) {
      return state.ending && state.length === 0 && !state.finished && !state.writing;
    }
    function finishMaybe(stream, state) {
      var need = needFinish(stream, state);
      if (need) {
        state.finished = true;
        stream.emit('finish');
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once('finish', cb);
      }
      state.ended = true;
    }
}, {"__filename":"_stream_writable.js","__dirname":"node_modules/through2/node_modules/readable-stream/lib"}], 
'readable-stream/lib/_stream_duplex': [function(exports, require, module, __filename, __dirname) { 
    module.exports = Duplex;
    var objectKeys = Object.keys || function (obj) {
        var keys = [];
        for (var key in obj)
          keys.push(key);
        return keys;
      };
    var util = require('core-util-is');
    util.inherits = require('inherits');
    var Readable = require('readable-stream/lib/_stream_readable');
    var Writable = require('readable-stream/lib/_stream_writable');
    util.inherits(Duplex, Readable);
    forEach(objectKeys(Writable.prototype), function (method) {
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    });
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false)
        this.readable = false;
      if (options && options.writable === false)
        this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;
      this.once('end', onend);
    }
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended)
        return;
      process.nextTick(this.end.bind(this));
    }
    function forEach(xs, f) {
      for (var i = 0, l = xs.length; i < l; i++) {
        f(xs[i], i);
      }
    }
}, {"__filename":"_stream_duplex.js","__dirname":"node_modules/through2/node_modules/readable-stream/lib"}], 
'readable-stream/lib/_stream_transform': [function(exports, require, module, __filename, __dirname) { 
    module.exports = Transform;
    var Duplex = require('readable-stream/lib/_stream_duplex');
    var util = require('core-util-is');
    util.inherits = require('inherits');
    util.inherits(Transform, Duplex);
    function TransformState(options, stream) {
      this.afterTransform = function (er, data) {
        return afterTransform(stream, er, data);
      };
      this.needTransform = false;
      this.transforming = false;
      this.writecb = null;
      this.writechunk = null;
    }
    function afterTransform(stream, er, data) {
      var ts = stream._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb)
        return stream.emit('error', new Error('no writecb in Transform class'));
      ts.writechunk = null;
      ts.writecb = null;
      if (data !== null && data !== undefined)
        stream.push(data);
      if (cb)
        cb(er);
      var rs = stream._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        stream._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      var ts = this._transformState = new TransformState(options, this);
      var stream = this;
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      this.once('finish', function () {
        if ('function' === typeof this._flush)
          this._flush(function (er) {
            done(stream, er);
          });
        else
          done(stream);
      });
    }
    Transform.prototype.push = function (chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function (chunk, encoding, cb) {
      throw new Error('not implemented');
    };
    Transform.prototype._write = function (chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function (n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    function done(stream, er) {
      if (er)
        return stream.emit('error', er);
      var ws = stream._writableState;
      var rs = stream._readableState;
      var ts = stream._transformState;
      if (ws.length)
        throw new Error('calling transform done when ws.length != 0');
      if (ts.transforming)
        throw new Error('calling transform done when still transforming');
      return stream.push(null);
    }
}, {"__filename":"_stream_transform.js","__dirname":"node_modules/through2/node_modules/readable-stream/lib"}], 
'readable-stream/transform': [function(exports, require, module, __filename, __dirname) { 
    module.exports = require('readable-stream/lib/_stream_transform');
}, {"__filename":"transform.js","__dirname":"node_modules/through2/node_modules/readable-stream"}], 
'object-keys/foreach': [function(exports, require, module, __filename, __dirname) { 
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    var isFunction = function (fn) {
      var isFunc = typeof fn === 'function' && !(fn instanceof RegExp) || toString.call(fn) === '[object Function]';
      if (!isFunc && typeof window !== 'undefined') {
        isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
      }
      return isFunc;
    };
    module.exports = function forEach(obj, fn) {
      if (!isFunction(fn)) {
        throw new TypeError('iterator must be a function');
      }
      var i, k, isString = typeof obj === 'string', l = obj.length, context = arguments.length > 2 ? arguments[2] : null;
      if (l === +l) {
        for (i = 0; i < l; i++) {
          if (context === null) {
            fn(isString ? obj.charAt(i) : obj[i], i, obj);
          } else {
            fn.call(context, isString ? obj.charAt(i) : obj[i], i, obj);
          }
        }
      } else {
        for (k in obj) {
          if (hasOwn.call(obj, k)) {
            if (context === null) {
              fn(obj[k], k, obj);
            } else {
              fn.call(context, obj[k], k, obj);
            }
          }
        }
      }
    };
}, {"__filename":"foreach.js","__dirname":"node_modules/through2/node_modules/xtend/node_modules/object-keys"}], 
'object-keys/isArguments': [function(exports, require, module, __filename, __dirname) { 
    var toString = Object.prototype.toString;
    module.exports = function isArguments(value) {
      var str = toString.call(value);
      var isArguments = str === '[object Arguments]';
      if (!isArguments) {
        isArguments = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toString.call(value.callee) === '[object Function]';
      }
      return isArguments;
    };
}, {"__filename":"isArguments.js","__dirname":"node_modules/through2/node_modules/xtend/node_modules/object-keys"}], 
'object-keys/shim': [function(exports, require, module, __filename, __dirname) { 
    (function () {
      'use strict';
      var has = Object.prototype.hasOwnProperty, toString = Object.prototype.toString, forEach = require('object-keys/foreach'), isArgs = require('object-keys/isArguments'), hasDontEnumBug = !{ 'toString': null }.propertyIsEnumerable('toString'), hasProtoEnumBug = function () {
        }.propertyIsEnumerable('prototype'), dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ], keysShim;
      keysShim = function keys(object) {
        var isObject = object !== null && typeof object === 'object', isFunction = toString.call(object) === '[object Function]', isArguments = isArgs(object), theKeys = [];
        if (!isObject && !isFunction && !isArguments) {
          throw new TypeError('Object.keys called on a non-object');
        }
        if (isArguments) {
          forEach(object, function (value) {
            theKeys.push(value);
          });
        } else {
          var name, skipProto = hasProtoEnumBug && isFunction;
          for (name in object) {
            if (!(skipProto && name === 'prototype') && has.call(object, name)) {
              theKeys.push(name);
            }
          }
        }
        if (hasDontEnumBug) {
          var ctor = object.constructor, skipConstructor = ctor && ctor.prototype === object;
          forEach(dontEnums, function (dontEnum) {
            if (!(skipConstructor && dontEnum === 'constructor') && has.call(object, dontEnum)) {
              theKeys.push(dontEnum);
            }
          });
        }
        return theKeys;
      };
      module.exports = keysShim;
    }());
}, {"__filename":"shim.js","__dirname":"node_modules/through2/node_modules/xtend/node_modules/object-keys"}], 
'object-keys': [function(exports, require, module, __filename, __dirname) { 
    module.exports = Object.keys || require('object-keys/shim');
}, {"__filename":"index.js","__dirname":"node_modules/through2/node_modules/xtend/node_modules/object-keys"}], 
'xtend/has-keys': [function(exports, require, module, __filename, __dirname) { 
    module.exports = hasKeys;
    function hasKeys(source) {
      return source !== null && (typeof source === 'object' || typeof source === 'function');
    }
}, {"__filename":"has-keys.js","__dirname":"node_modules/through2/node_modules/xtend"}], 
'xtend': [function(exports, require, module, __filename, __dirname) { 
    var Keys = require('object-keys');
    var hasKeys = require('xtend/has-keys');
    module.exports = extend;
    function extend() {
      var target = {};
      for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];
        if (!hasKeys(source)) {
          continue;
        }
        var keys = Keys(source);
        for (var j = 0; j < keys.length; j++) {
          var name = keys[j];
          target[name] = source[name];
        }
      }
      return target;
    }
}, {"__filename":"index.js","__dirname":"node_modules/through2/node_modules/xtend"}], 
'through2': [function(exports, require, module, __filename, __dirname) { 
    var Transform = require('readable-stream/transform'), inherits = require('util').inherits, xtend = require('xtend');
    function noop(chunk, enc, callback) {
      callback(null, chunk);
    }
    function through2(construct) {
      return function (options, transform, flush) {
        if (typeof options == 'function') {
          flush = transform;
          transform = options;
          options = {};
        }
        if (typeof transform != 'function')
          transform = noop;
        if (typeof flush != 'function')
          flush = null;
        return construct(options, transform, flush);
      };
    }
    module.exports = through2(function (options, transform, flush) {
      var t2 = new Transform(options);
      t2._transform = transform;
      if (flush)
        t2._flush = flush;
      return t2;
    });
    module.exports.ctor = through2(function (options, transform, flush) {
      function Through2(override) {
        if (!(this instanceof Through2))
          return new Through2(override);
        this.options = xtend(options, override);
        Transform.call(this, this.options);
      }
      inherits(Through2, Transform);
      Through2.prototype._transform = transform;
      if (flush)
        Through2.prototype._flush = flush;
      return Through2;
    });
    module.exports.obj = through2(function (options, transform, flush) {
      var t2 = new Transform(xtend({ objectMode: true }, options));
      t2._transform = transform;
      if (flush)
        t2._flush = flush;
      return t2;
    });
}, {"__filename":"through2.js","__dirname":"node_modules/through2"}], 
'clone-stats': [function(exports, require, module, __filename, __dirname) { 
    var Stat = require('fs').Stats;
    module.exports = cloneStats;
    function cloneStats(stats) {
      var replacement = new Stat();
      Object.keys(stats).forEach(function (key) {
        replacement[key] = stats[key];
      });
      return replacement;
    }
}, {"__filename":"index.js","__dirname":"node_modules/vinyl/node_modules/clone-stats"}], 
'vinyl/lib/isBuffer': [function(exports, require, module, __filename, __dirname) { 
    var buf = require('buffer');
    var Buffer = buf.Buffer;
    module.exports = function (o) {
      return typeof o === 'object' && o instanceof Buffer;
    };
}, {"__filename":"isBuffer.js","__dirname":"node_modules/vinyl/lib"}], 
'vinyl/lib/isStream': [function(exports, require, module, __filename, __dirname) { 
    var Stream = require('stream').Stream;
    module.exports = function (o) {
      return !!o && o instanceof Stream;
    };
}, {"__filename":"isStream.js","__dirname":"node_modules/vinyl/lib"}], 
'vinyl/lib/isNull': [function(exports, require, module, __filename, __dirname) { 
    module.exports = function (v) {
      return v === null;
    };
}, {"__filename":"isNull.js","__dirname":"node_modules/vinyl/lib"}], 
'vinyl/lib/inspectStream': [function(exports, require, module, __filename, __dirname) { 
    var Stream = require('stream').Stream;
    var isStream = require('vinyl/lib/isStream');
    module.exports = function (stream) {
      if (!isStream(stream))
        return;
      var streamType = stream.constructor.name;
      if (streamType === 'Stream')
        streamType = '';
      return '<' + streamType + 'Stream>';
    };
}, {"__filename":"inspectStream.js","__dirname":"node_modules/vinyl/lib"}], 
'vinyl/lib/cloneBuffer': [function(exports, require, module, __filename, __dirname) { 
    var Buffer = require('buffer').Buffer;
    module.exports = function (buf) {
      var out = new Buffer(buf.length);
      buf.copy(out);
      return out;
    };
}, {"__filename":"cloneBuffer.js","__dirname":"node_modules/vinyl/lib"}], 
'vinyl': [function(exports, require, module, __filename, __dirname) { 
    var path = require('path');
    var cloneStats = require('clone-stats');
    var isBuffer = require('vinyl/lib/isBuffer');
    var isStream = require('vinyl/lib/isStream');
    var isNull = require('vinyl/lib/isNull');
    var inspectStream = require('vinyl/lib/inspectStream');
    var cloneBuffer = require('vinyl/lib/cloneBuffer');
    function File(file) {
      if (!file)
        file = {};
      this.cwd = file.cwd || process.cwd();
      this.base = file.base || this.cwd;
      this.path = file.path || null;
      this.stat = file.stat || null;
      this.contents = file.contents || null;
    }
    File.prototype.isBuffer = function () {
      return isBuffer(this.contents);
    };
    File.prototype.isStream = function () {
      return isStream(this.contents);
    };
    File.prototype.isNull = function () {
      return isNull(this.contents);
    };
    File.prototype.isDirectory = function () {
      return this.isNull() && this.stat && this.stat.isDirectory();
    };
    File.prototype.clone = function () {
      var clonedContents = this.isBuffer() ? cloneBuffer(this.contents) : this.contents;
      var clonedStat = this.stat ? cloneStats(this.stat) : null;
      return new File({
        cwd: this.cwd,
        base: this.base,
        path: this.path,
        stat: clonedStat,
        contents: clonedContents
      });
    };
    File.prototype.pipe = function (stream, opt) {
      if (!opt)
        opt = {};
      if (typeof opt.end === 'undefined')
        opt.end = true;
      if (this.isStream()) {
        return this.contents.pipe(stream, opt);
      }
      if (this.isBuffer()) {
        if (opt.end) {
          stream.end(this.contents);
        } else {
          stream.write(this.contents);
        }
        return stream;
      }
      if (this.isNull()) {
        if (opt.end)
          stream.end();
        return stream;
      }
      return stream;
    };
    File.prototype.inspect = function () {
      var inspect = [];
      var filePath = this.base && this.path ? this.relative : this.path;
      if (filePath) {
        inspect.push('"' + filePath + '"');
      }
      if (this.isBuffer()) {
        inspect.push(this.contents.inspect());
      }
      if (this.isStream()) {
        inspect.push(inspectStream(this.contents));
      }
      return '<File ' + inspect.join(' ') + '>';
    };
    Object.defineProperty(File.prototype, 'contents', {
      get: function () {
        return this._contents;
      },
      set: function (val) {
        if (!isBuffer(val) && !isStream(val) && !isNull(val)) {
          throw new Error('File.contents can only be a Buffer, a Stream, or null.');
        }
        this._contents = val;
      }
    });
    Object.defineProperty(File.prototype, 'relative', {
      get: function () {
        if (!this.base)
          throw new Error('No base specified! Can not get relative.');
        if (!this.path)
          throw new Error('No path specified! Can not get relative.');
        return path.relative(this.base, this.path);
      },
      set: function () {
        throw new Error('File.relative is generated from the base and path attributes. Do not modify it.');
      }
    });
    module.exports = File;
}, {"__filename":"index.js","__dirname":"node_modules/vinyl"}], 
're-define-module': [function(exports, require, module, __filename, __dirname) { 
    var util = require('util'), _ = require('lodash'), File = require('vinyl'), path = require('path'), isBuffer = require('vinyl/lib/isBuffer'), isStream = require('vinyl/lib/isStream'), isNull = require('vinyl/lib/isNull');
    module.exports = Module;
    util.inherits(Module, File);
    function Module(options) {
      if (options instanceof Module) {
        return options;
      }
      this._paths = [];
      this._deps = [];
      this._references = [];
      options = _.merge.apply(null, arguments);
      for (var i in options)
        this[i] = options[i];
      if (!(this instanceof Module))
        return new Module(options);
      File.call(this, options);
    }
    Object.defineProperty(Module.prototype, 'name', {
      get: function () {
        return escape(this._name || this.relative);
      },
      set: function (val) {
        this._name = val;
      }
    });
    Object.defineProperty(Module.prototype, 'path', {
      get: function () {
        return this._paths[this._paths.length - 1];
      },
      set: function (val) {
        if (this._paths.indexOf(val) === -1 && !!val) {
          !this.ext && (this.ext = path.extname(val));
          this._paths.push(val);
        }
      }
    });
    Object.defineProperty(Module.prototype, 'paths', {
      get: function () {
        return this._paths;
      }
    });
    Object.defineProperty(Module.prototype, 'requiredAs', {
      get: function () {
        return this._requiredAs;
      },
      set: function (val) {
        this._requiredAs = val;
      }
    });
    Object.defineProperty(Module.prototype, 'dependencies', {
      get: function () {
        return this._deps;
      },
      set: function (val) {
        if (_.isEmpty(val))
          return;
        this._deps = _.uniq(this._deps.concat(val), function (f) {
          return f.requiredAs;
        });
      }
    });
    Object.defineProperty(Module.prototype, 'references', {
      get: function () {
        return this._references;
      },
      set: function (val) {
        if (_.isEmpty(val))
          return;
        this._references.push(val);
      }
    });
    Object.defineProperty(Module.prototype, 'contents', {
      get: function () {
        return this._contents;
      },
      set: function (val) {
        if (!isBuffer(val) && !isStream(val) && !isNull(val) && !isAST(val))
          throw new Error('File.contents can only be a Buffer, a Stream, AST, or null.');
        this._contents = val;
      }
    });
    Module.prototype.isAST = function () {
      return isAST(this.contents);
    };
    function isAST(val) {
      return _.has(val, 'type') && val.type === 'Program';
    }
    function escape(val) {
      if (process.platform === 'win32')
        val = val.replace(/\\/g, '/');
      return val.replace(/.js$/g, '');
    }
}, {"__filename":"index.js","__dirname":"node_modules/re-define-module"}], 
'ms': [function(exports, require, module, __filename, __dirname) { 
    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module.exports = function (val, options) {
      options = options || {};
      if ('string' == typeof val)
        return parse(val);
      return options.long ? long(val) : short(val);
    };
    function parse(str) {
      var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
      if (!match)
        return;
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
      case 'years':
      case 'year':
      case 'y':
        return n * y;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 's':
        return n * s;
      case 'ms':
        return n;
      }
    }
    function short(ms) {
      if (ms >= d)
        return Math.round(ms / d) + 'd';
      if (ms >= h)
        return Math.round(ms / h) + 'h';
      if (ms >= m)
        return Math.round(ms / m) + 'm';
      if (ms >= s)
        return Math.round(ms / s) + 's';
      return ms + 'ms';
    }
    function long(ms) {
      return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
    }
    function plural(ms, n, name) {
      if (ms < n)
        return;
      if (ms < n * 1.5)
        return Math.floor(ms / n) + ' ' + name;
      return Math.ceil(ms / n) + ' ' + name + 's';
    }
}, {"__filename":"index.js","__dirname":"node_modules/debug/node_modules/ms"}], 
'debug/debug': [function(exports, require, module, __filename, __dirname) { 
    exports = module.exports = debug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require('ms');
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevColor = 0;
    var prevTime;
    function selectColor() {
      return exports.colors[prevColor++ % exports.colors.length];
    }
    function debug(namespace) {
      function disabled() {
      }
      disabled.enabled = false;
      function enabled() {
        var self = enabled;
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        if (null == self.useColors)
          self.useColors = exports.useColors();
        if (null == self.color && self.useColors)
          self.color = selectColor();
        var args = Array.prototype.slice.call(arguments);
        args[0] = exports.coerce(args[0]);
        if ('string' !== typeof args[0]) {
          args = ['%o'].concat(args);
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
          if (match === '%%')
            return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        if ('function' === typeof exports.formatArgs) {
          args = exports.formatArgs.apply(self, args);
        }
        var logFn = enabled.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      enabled.enabled = true;
      var fn = exports.enabled(namespace) ? enabled : disabled;
      fn.namespace = namespace;
      return fn;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      var split = (namespaces || '').split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i])
          continue;
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }
    function disable() {
      exports.enable('');
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error)
        return val.stack || val.message;
      return val;
    }
}, {"__filename":"debug.js","__dirname":"node_modules/debug"}], 
'debug': [function(exports, require, module, __filename, __dirname) { 
    var tty = require('tty');
    var util = require('util');
    exports = module.exports = require('debug/debug');
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [
      6,
      2,
      3,
      4,
      5,
      1
    ];
    function useColors() {
      var debugColors = (process.env.DEBUG_COLORS || '').trim().toLowerCase();
      if (0 === debugColors.length) {
        return tty.isatty(1);
      } else {
        return '0' !== debugColors && 'no' !== debugColors && 'false' !== debugColors && 'disabled' !== debugColors;
      }
    }
    var inspect = 4 === util.inspect.length ? function (v, colors) {
        return util.inspect(v, void 0, void 0, colors);
      } : function (v, colors) {
        return util.inspect(v, { colors: colors });
      };
    exports.formatters.o = function (v) {
      return inspect(v, this.useColors).replace(/\s*\n\s*/g, ' ');
    };
    function formatArgs() {
      var args = arguments;
      var useColors = this.useColors;
      var name = this.namespace;
      if (useColors) {
        var c = this.color;
        args[0] = '  \x1B[9' + c + 'm' + name + ' ' + '\x1B[0m' + args[0] + '\x1B[3' + c + 'm' + ' +' + exports.humanize(this.diff) + '\x1B[0m';
      } else {
        args[0] = new Date().toUTCString() + ' ' + name + ' ' + args[0];
      }
      return args;
    }
    function log() {
      return console.log.apply(console, arguments);
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    exports.enable(load());
}, {"__filename":"node.js","__dirname":"node_modules/debug"}], 
'wrapper/external-template': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), debug = require('debug')('re-define:transform:external-template'), path = require('path');
    module.exports = function (template) {
      return function (modules, config, requestedFromTemplate) {
        if (!requestedFromTemplate) {
          var last = _.last(modules.internal);
          _.each(modules.internal, function (m) {
            var props = m.properties = {}, cwd = config.cwd && path.resolve(config.cwd) || process.cwd(), file = path.relative(!m.external ? m.base : cwd, m.path), dir = path.dirname(file);
            props['__filename'] = path.basename(escape(file));
            props['__dirname'] = path.join(escape(dir));
            function escape(val) {
              return val.replace(/\\\\|\\/g, '/');
            }
          });
          var names = _.pluck(modules.internal, 'name'), paths = _(modules.internal).pluck('path').map(function (d) {
              return path.resolve(d);
            }).value(), mods = _.zipObject(paths, names), returns = !!config.returns && path.resolve(config.returns);
          if (!path.extname(returns))
            returns = returns + '.js';
          returns = mods[returns];
          if (returns)
            config.returns = returns;
          if (!returns && !config.returns)
            config.returns = last.name;
        }
        var templateData = {
            config: _.omit(config, 'helpers'),
            files: modules.internal,
            external: modules.external
          }, util = config.helpers, imports;
        util.getTemplate = function (template, imports) {
          var conf = _.cloneDeep(config);
          if (!!imports)
            conf.imports = (imports || []).concat(config.imports);
          return _.template(config.wrappers[template](modules, conf, true), templateData, imports);
        };
        imports = {
          imports: {
            _: _,
            util: util
          }
        };
        return _.template(template, templateData, imports);
      };
    };
}, {"__filename":"external-template.js","__dirname":"lib/wrapper"}], 
'defaults': [function(exports, require, module, __filename, __dirname) { 
    module.exports = {
      names: {
        amd: 'amd/name',
        global: 'global.name'
      },
      project: '',
      returns: '',
      globals: {},
      cwd: '.',
      slice: { '**/**': 'bundle.js' },
      output: '',
      base: '',
      wrapper: 'default',
      namespace: '',
      alignToFolder: [
        'node_modules',
        'bower_components'
      ],
      excludeAMDModules: [
        '.css$',
        'require',
        'modules',
        'exports'
      ],
      plugins: ['^(text/?)*!'],
      imports: [],
      map: {},
      format: {
        indent: {
          style: '  ',
          base: 2
        },
        space: ' ',
        compact: false,
        safeConcatenation: false
      },
      showWarnings: true
    };
}, {"__filename":"defaults.js","__dirname":"lib"}], 
'config': [function(exports, require, module, __filename, __dirname) { 
    var template = require('wrapper/external-template');
    module.exports = function (userConfig) {
      var _ = require('lodash'), config = _.clone(require('defaults'));
      var readFile = _.compose(template, _.partialRight(require('fs').readFileSync, 'utf-8'), require('path').resolve);
      if (!userConfig)
        userConfig = {};
      if (!userConfig.names)
        userConfig.names = config.names;
      if (userConfig.names.global === config.names.global && userConfig.namespace)
        userConfig.names.global = userConfig.namespace;
      _.extend(config, {
        wrappers: {
          'default': readFile(__dirname, 'templates/default.tmpl'),
          'empty': readFile(__dirname, 'templates/empty.tmpl'),
          'iife': readFile(__dirname, 'templates/iife.tmpl'),
          'umd': readFile(__dirname, 'templates/umd.tmpl'),
          'amd-global': readFile(__dirname, 'templates/amd-global.tmpl'),
          'part/require': readFile(__dirname, 'templates/part/require.tmpl')
        }
      });
      userConfig.wrappers = _.reduce(userConfig.wrappers, function (memo, content, name) {
        memo[name] = _.isFunction(content) ? content : template(content.toString());
        return memo;
      }, {});
      _.extend(config, {
        helpers: {
          escape: function (d) {
            return d.replace(/\.\/|\!|\.|\/|\\|-/g, '_');
          },
          toGlobal: function (parent, dotPath, factory) {
            return _(dotPath.split('.')).reduce(function (memo, d, i) {
              i > 0 ? memo.push(memo[i - 1] + '.' + d) : memo.push(d);
              return memo;
            }, []).map(function (d, i, p) {
              return p.length - 1 > i ? parent + '.' + d + ' = parent.' + d + ' || {};' : parent + '.' + d + ' = ' + factory + ';';
            }).reduce(function (memo, p) {
              return memo + p + '\n';
            }, '');
          },
          namespace: function (ns, parent) {
            return _(ns.split('.')).reduce(function (memo, d, i) {
              i > 0 ? memo.push(memo[i - 1] + '.' + d) : memo.push(d);
              return memo;
            }, []).map(function (d, i, p) {
              return parent + '.' + d + ' = ' + parent + '.' + d + ' || {}';
            }).reduce(function (memo, p) {
              return memo + p + ';';
            }, '');
          },
          global: function (d) {
            var refs = config.globals;
            return refs && refs[d] || config.helpers.escape(d);
          }
        }
      });
      return _.merge(config, userConfig, function (a, b) {
        if (_.isArray(a) && _.isArray(b))
          return b.concat(a);
        if (_.isObject(a) && _.isObject(b))
          return _.extend(a, b);
        if (_.isBoolean(a) && _.isBoolean(b))
          return b;
        return b ? b : a;
      });
    };
}, {"__filename":"config.js","__dirname":"lib"}], 
'async': [function(exports, require, module, __filename, __dirname) { 
    (function () {
      var async = {};
      var root, previous_async;
      root = this;
      if (root != null) {
        previous_async = root.async;
      }
      async.noConflict = function () {
        root.async = previous_async;
        return async;
      };
      function only_once(fn) {
        var called = false;
        return function () {
          if (called)
            throw new Error('Callback was already called.');
          called = true;
          fn.apply(root, arguments);
        };
      }
      var _toString = Object.prototype.toString;
      var _isArray = Array.isArray || function (obj) {
          return _toString.call(obj) === '[object Array]';
        };
      var _each = function (arr, iterator) {
        if (arr.forEach) {
          return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
          iterator(arr[i], i, arr);
        }
      };
      var _map = function (arr, iterator) {
        if (arr.map) {
          return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
          results.push(iterator(x, i, a));
        });
        return results;
      };
      var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
          return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
          memo = iterator(memo, x, i, a);
        });
        return memo;
      };
      var _keys = function (obj) {
        if (Object.keys) {
          return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
        return keys;
      };
      if (typeof process === 'undefined' || !process.nextTick) {
        if (typeof setImmediate === 'function') {
          async.nextTick = function (fn) {
            setImmediate(fn);
          };
          async.setImmediate = async.nextTick;
        } else {
          async.nextTick = function (fn) {
            setTimeout(fn, 0);
          };
          async.setImmediate = async.nextTick;
        }
      } else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
          async.setImmediate = function (fn) {
            setImmediate(fn);
          };
        } else {
          async.setImmediate = async.nextTick;
        }
      }
      async.each = function (arr, iterator, callback) {
        callback = callback || function () {
        };
        if (!arr.length) {
          return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
          iterator(x, only_once(done));
        });
        function done(err) {
          if (err) {
            callback(err);
            callback = function () {
            };
          } else {
            completed += 1;
            if (completed >= arr.length) {
              callback();
            }
          }
        }
      };
      async.forEach = async.each;
      async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {
        };
        if (!arr.length) {
          return callback();
        }
        var completed = 0;
        var iterate = function () {
          iterator(arr[completed], function (err) {
            if (err) {
              callback(err);
              callback = function () {
              };
            } else {
              completed += 1;
              if (completed >= arr.length) {
                callback();
              } else {
                iterate();
              }
            }
          });
        };
        iterate();
      };
      async.forEachSeries = async.eachSeries;
      async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [
          arr,
          iterator,
          callback
        ]);
      };
      async.forEachLimit = async.eachLimit;
      var _eachLimit = function (limit) {
        return function (arr, iterator, callback) {
          callback = callback || function () {
          };
          if (!arr.length || limit <= 0) {
            return callback();
          }
          var completed = 0;
          var started = 0;
          var running = 0;
          (function replenish() {
            if (completed >= arr.length) {
              return callback();
            }
            while (running < limit && started < arr.length) {
              started += 1;
              running += 1;
              iterator(arr[started - 1], function (err) {
                if (err) {
                  callback(err);
                  callback = function () {
                  };
                } else {
                  completed += 1;
                  running -= 1;
                  if (completed >= arr.length) {
                    callback();
                  } else {
                    replenish();
                  }
                }
              });
            }
          }());
        };
      };
      var doParallel = function (fn) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          return fn.apply(null, [async.each].concat(args));
        };
      };
      var doParallelLimit = function (limit, fn) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
      };
      var doSeries = function (fn) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          return fn.apply(null, [async.eachSeries].concat(args));
        };
      };
      var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
          return {
            index: i,
            value: x
          };
        });
        if (!callback) {
          eachfn(arr, function (x, callback) {
            iterator(x.value, function (err) {
              callback(err);
            });
          });
        } else {
          var results = [];
          eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
              results[x.index] = v;
              callback(err);
            });
          }, function (err) {
            callback(err, results);
          });
        }
      };
      async.map = doParallel(_asyncMap);
      async.mapSeries = doSeries(_asyncMap);
      async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
      };
      var _mapLimit = function (limit) {
        return doParallelLimit(limit, _asyncMap);
      };
      async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
          iterator(memo, x, function (err, v) {
            memo = v;
            callback(err);
          });
        }, function (err) {
          callback(err, memo);
        });
      };
      async.inject = async.reduce;
      async.foldl = async.reduce;
      async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
          }).reverse();
        async.reduce(reversed, memo, iterator, callback);
      };
      async.foldr = async.reduceRight;
      var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
          return {
            index: i,
            value: x
          };
        });
        eachfn(arr, function (x, callback) {
          iterator(x.value, function (v) {
            if (v) {
              results.push(x);
            }
            callback();
          });
        }, function (err) {
          callback(_map(results.sort(function (a, b) {
            return a.index - b.index;
          }), function (x) {
            return x.value;
          }));
        });
      };
      async.filter = doParallel(_filter);
      async.filterSeries = doSeries(_filter);
      async.select = async.filter;
      async.selectSeries = async.filterSeries;
      var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
          return {
            index: i,
            value: x
          };
        });
        eachfn(arr, function (x, callback) {
          iterator(x.value, function (v) {
            if (!v) {
              results.push(x);
            }
            callback();
          });
        }, function (err) {
          callback(_map(results.sort(function (a, b) {
            return a.index - b.index;
          }), function (x) {
            return x.value;
          }));
        });
      };
      async.reject = doParallel(_reject);
      async.rejectSeries = doSeries(_reject);
      var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
          iterator(x, function (result) {
            if (result) {
              main_callback(x);
              main_callback = function () {
              };
            } else {
              callback();
            }
          });
        }, function (err) {
          main_callback();
        });
      };
      async.detect = doParallel(_detect);
      async.detectSeries = doSeries(_detect);
      async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
          iterator(x, function (v) {
            if (v) {
              main_callback(true);
              main_callback = function () {
              };
            }
            callback();
          });
        }, function (err) {
          main_callback(false);
        });
      };
      async.any = async.some;
      async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
          iterator(x, function (v) {
            if (!v) {
              main_callback(false);
              main_callback = function () {
              };
            }
            callback();
          });
        }, function (err) {
          main_callback(true);
        });
      };
      async.all = async.every;
      async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
          iterator(x, function (err, criteria) {
            if (err) {
              callback(err);
            } else {
              callback(null, {
                value: x,
                criteria: criteria
              });
            }
          });
        }, function (err, results) {
          if (err) {
            return callback(err);
          } else {
            var fn = function (left, right) {
              var a = left.criteria, b = right.criteria;
              return a < b ? -1 : a > b ? 1 : 0;
            };
            callback(null, _map(results.sort(fn), function (x) {
              return x.value;
            }));
          }
        });
      };
      async.auto = function (tasks, callback) {
        callback = callback || function () {
        };
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
          return callback();
        }
        var results = {};
        var listeners = [];
        var addListener = function (fn) {
          listeners.unshift(fn);
        };
        var removeListener = function (fn) {
          for (var i = 0; i < listeners.length; i += 1) {
            if (listeners[i] === fn) {
              listeners.splice(i, 1);
              return;
            }
          }
        };
        var taskComplete = function () {
          remainingTasks--;
          _each(listeners.slice(0), function (fn) {
            fn();
          });
        };
        addListener(function () {
          if (!remainingTasks) {
            var theCallback = callback;
            callback = function () {
            };
            theCallback(null, results);
          }
        });
        _each(keys, function (k) {
          var task = _isArray(tasks[k]) ? tasks[k] : [tasks[k]];
          var taskCallback = function (err) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (args.length <= 1) {
              args = args[0];
            }
            if (err) {
              var safeResults = {};
              _each(_keys(results), function (rkey) {
                safeResults[rkey] = results[rkey];
              });
              safeResults[k] = args;
              callback(err, safeResults);
              callback = function () {
              };
            } else {
              results[k] = args;
              async.setImmediate(taskComplete);
            }
          };
          var requires = task.slice(0, Math.abs(task.length - 1)) || [];
          var ready = function () {
            return _reduce(requires, function (a, x) {
              return a && results.hasOwnProperty(x);
            }, true) && !results.hasOwnProperty(k);
          };
          if (ready()) {
            task[task.length - 1](taskCallback, results);
          } else {
            var listener = function () {
              if (ready()) {
                removeListener(listener);
                task[task.length - 1](taskCallback, results);
              }
            };
            addListener(listener);
          }
        });
      };
      async.retry = function (times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        if (typeof times === 'function') {
          callback = task;
          task = times;
          times = DEFAULT_TIMES;
        }
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function (wrappedCallback, wrappedResults) {
          var retryAttempt = function (task, finalAttempt) {
            return function (seriesCallback) {
              task(function (err, result) {
                seriesCallback(!err || finalAttempt, {
                  err: err,
                  result: result
                });
              }, wrappedResults);
            };
          };
          while (times) {
            attempts.push(retryAttempt(task, !(times -= 1)));
          }
          async.series(attempts, function (done, data) {
            data = data[data.length - 1];
            (wrappedCallback || callback)(data.err, data.result);
          });
        };
        return callback ? wrappedTask() : wrappedTask;
      };
      async.waterfall = function (tasks, callback) {
        callback = callback || function () {
        };
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
          return callback();
        }
        var wrapIterator = function (iterator) {
          return function (err) {
            if (err) {
              callback.apply(null, arguments);
              callback = function () {
              };
            } else {
              var args = Array.prototype.slice.call(arguments, 1);
              var next = iterator.next();
              if (next) {
                args.push(wrapIterator(next));
              } else {
                args.push(callback);
              }
              async.setImmediate(function () {
                iterator.apply(null, args);
              });
            }
          };
        };
        wrapIterator(async.iterator(tasks))();
      };
      var _parallel = function (eachfn, tasks, callback) {
        callback = callback || function () {
        };
        if (_isArray(tasks)) {
          eachfn.map(tasks, function (fn, callback) {
            if (fn) {
              fn(function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                  args = args[0];
                }
                callback.call(null, err, args);
              });
            }
          }, callback);
        } else {
          var results = {};
          eachfn.each(_keys(tasks), function (k, callback) {
            tasks[k](function (err) {
              var args = Array.prototype.slice.call(arguments, 1);
              if (args.length <= 1) {
                args = args[0];
              }
              results[k] = args;
              callback(err);
            });
          }, function (err) {
            callback(err, results);
          });
        }
      };
      async.parallel = function (tasks, callback) {
        _parallel({
          map: async.map,
          each: async.each
        }, tasks, callback);
      };
      async.parallelLimit = function (tasks, limit, callback) {
        _parallel({
          map: _mapLimit(limit),
          each: _eachLimit(limit)
        }, tasks, callback);
      };
      async.series = function (tasks, callback) {
        callback = callback || function () {
        };
        if (_isArray(tasks)) {
          async.mapSeries(tasks, function (fn, callback) {
            if (fn) {
              fn(function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                  args = args[0];
                }
                callback.call(null, err, args);
              });
            }
          }, callback);
        } else {
          var results = {};
          async.eachSeries(_keys(tasks), function (k, callback) {
            tasks[k](function (err) {
              var args = Array.prototype.slice.call(arguments, 1);
              if (args.length <= 1) {
                args = args[0];
              }
              results[k] = args;
              callback(err);
            });
          }, function (err) {
            callback(err, results);
          });
        }
      };
      async.iterator = function (tasks) {
        var makeCallback = function (index) {
          var fn = function () {
            if (tasks.length) {
              tasks[index].apply(null, arguments);
            }
            return fn.next();
          };
          fn.next = function () {
            return index < tasks.length - 1 ? makeCallback(index + 1) : null;
          };
          return fn;
        };
        return makeCallback(0);
      };
      async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
          return fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));
        };
      };
      var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
          fn(x, function (err, y) {
            r = r.concat(y || []);
            cb(err);
          });
        }, function (err) {
          callback(err, r);
        });
      };
      async.concat = doParallel(_concat);
      async.concatSeries = doSeries(_concat);
      async.whilst = function (test, iterator, callback) {
        if (test()) {
          iterator(function (err) {
            if (err) {
              return callback(err);
            }
            async.whilst(test, iterator, callback);
          });
        } else {
          callback();
        }
      };
      async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
          if (err) {
            return callback(err);
          }
          var args = Array.prototype.slice.call(arguments, 1);
          if (test.apply(null, args)) {
            async.doWhilst(iterator, test, callback);
          } else {
            callback();
          }
        });
      };
      async.until = function (test, iterator, callback) {
        if (!test()) {
          iterator(function (err) {
            if (err) {
              return callback(err);
            }
            async.until(test, iterator, callback);
          });
        } else {
          callback();
        }
      };
      async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
          if (err) {
            return callback(err);
          }
          var args = Array.prototype.slice.call(arguments, 1);
          if (!test.apply(null, args)) {
            async.doUntil(iterator, test, callback);
          } else {
            callback();
          }
        });
      };
      async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
          concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started) {
            q.started = true;
          }
          if (!_isArray(data)) {
            data = [data];
          }
          if (data.length == 0) {
            return async.setImmediate(function () {
              if (q.drain) {
                q.drain();
              }
            });
          }
          _each(data, function (task) {
            var item = {
                data: task,
                callback: typeof callback === 'function' ? callback : null
              };
            if (pos) {
              q.tasks.unshift(item);
            } else {
              q.tasks.push(item);
            }
            if (q.saturated && q.tasks.length === q.concurrency) {
              q.saturated();
            }
            async.setImmediate(q.process);
          });
        }
        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
              if (!q.paused && workers < q.concurrency && q.tasks.length) {
                var task = q.tasks.shift();
                if (q.empty && q.tasks.length === 0) {
                  q.empty();
                }
                workers += 1;
                var next = function () {
                  workers -= 1;
                  if (task.callback) {
                    task.callback.apply(task, arguments);
                  }
                  if (q.drain && q.tasks.length + workers === 0) {
                    q.drain();
                  }
                  q.process();
                };
                var cb = only_once(next);
                worker(task.data, cb);
              }
            },
            length: function () {
              return q.tasks.length;
            },
            running: function () {
              return workers;
            },
            idle: function () {
              return q.tasks.length + workers === 0;
            },
            pause: function () {
              if (q.paused === true) {
                return;
              }
              q.paused = true;
              q.process();
            },
            resume: function () {
              if (q.paused === false) {
                return;
              }
              q.paused = false;
              q.process();
            }
          };
        return q;
      };
      async.priorityQueue = function (worker, concurrency) {
        function _compareTasks(a, b) {
          return a.priority - b.priority;
        }
        ;
        function _binarySearch(sequence, item, compare) {
          var beg = -1, end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + (end - beg + 1 >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        function _insert(q, data, priority, callback) {
          if (!q.started) {
            q.started = true;
          }
          if (!_isArray(data)) {
            data = [data];
          }
          if (data.length == 0) {
            return async.setImmediate(function () {
              if (q.drain) {
                q.drain();
              }
            });
          }
          _each(data, function (task) {
            var item = {
                data: task,
                priority: priority,
                callback: typeof callback === 'function' ? callback : null
              };
            q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);
            if (q.saturated && q.tasks.length === q.concurrency) {
              q.saturated();
            }
            async.setImmediate(q.process);
          });
        }
        var q = async.queue(worker, concurrency);
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        delete q.unshift;
        return q;
      };
      async.cargo = function (worker, payload) {
        var working = false, tasks = [];
        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
              if (!_isArray(data)) {
                data = [data];
              }
              _each(data, function (task) {
                tasks.push({
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
                });
                cargo.drained = false;
                if (cargo.saturated && tasks.length === payload) {
                  cargo.saturated();
                }
              });
              async.setImmediate(cargo.process);
            },
            process: function process() {
              if (working)
                return;
              if (tasks.length === 0) {
                if (cargo.drain && !cargo.drained)
                  cargo.drain();
                cargo.drained = true;
                return;
              }
              var ts = typeof payload === 'number' ? tasks.splice(0, payload) : tasks.splice(0, tasks.length);
              var ds = _map(ts, function (task) {
                  return task.data;
                });
              if (cargo.empty)
                cargo.empty();
              working = true;
              worker(ds, function () {
                working = false;
                var args = arguments;
                _each(ts, function (data) {
                  if (data.callback) {
                    data.callback.apply(null, args);
                  }
                });
                process();
              });
            },
            length: function () {
              return tasks.length;
            },
            running: function () {
              return working;
            }
          };
        return cargo;
      };
      var _console_fn = function (name) {
        return function (fn) {
          var args = Array.prototype.slice.call(arguments, 1);
          fn.apply(null, args.concat([function (err) {
              var args = Array.prototype.slice.call(arguments, 1);
              if (typeof console !== 'undefined') {
                if (err) {
                  if (console.error) {
                    console.error(err);
                  }
                } else if (console[name]) {
                  _each(args, function (x) {
                    console[name](x);
                  });
                }
              }
            }]));
        };
      };
      async.log = _console_fn('log');
      async.dir = _console_fn('dir');
      async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
          return x;
        };
        var memoized = function () {
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          var key = hasher.apply(null, args);
          if (key in memo) {
            async.nextTick(function () {
              callback.apply(null, memo[key]);
            });
          } else if (key in queues) {
            queues[key].push(callback);
          } else {
            queues[key] = [callback];
            fn.apply(null, args.concat([function () {
                memo[key] = arguments;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                  q[i].apply(null, arguments);
                }
              }]));
          }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
      };
      async.unmemoize = function (fn) {
        return function () {
          return (fn.unmemoized || fn).apply(null, arguments);
        };
      };
      async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
          counter.push(i);
        }
        return async.map(counter, iterator, callback);
      };
      async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
          counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
      };
      async.seq = function () {
        var fns = arguments;
        return function () {
          var that = this;
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          async.reduce(fns, args, function (newargs, fn, cb) {
            fn.apply(that, newargs.concat([function () {
                var err = arguments[0];
                var nextargs = Array.prototype.slice.call(arguments, 1);
                cb(err, nextargs);
              }]));
          }, function (err, results) {
            callback.apply(that, [err].concat(results));
          });
        };
      };
      async.compose = function () {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
      };
      var _applyEach = function (eachfn, fns) {
        var go = function () {
          var that = this;
          var args = Array.prototype.slice.call(arguments);
          var callback = args.pop();
          return eachfn(fns, function (fn, cb) {
            fn.apply(that, args.concat([cb]));
          }, callback);
        };
        if (arguments.length > 2) {
          var args = Array.prototype.slice.call(arguments, 2);
          return go.apply(this, args);
        } else {
          return go;
        }
      };
      async.applyEach = doParallel(_applyEach);
      async.applyEachSeries = doSeries(_applyEach);
      async.forever = function (fn, callback) {
        function next(err) {
          if (err) {
            if (callback) {
              return callback(err);
            }
            throw err;
          }
          fn(next);
        }
        next();
      };
      if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
      } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
          return async;
        });
      } else {
        root.async = async;
      }
    }());
}, {"__filename":"async.js","__dirname":"node_modules/async/lib"}], 
'file/load': [function(exports, require, module, __filename, __dirname) { 
    var through = require('through2'), fs = require('fs'), debug = require('debug')('re-define:file:load'), async = require('async'), _ = require('lodash');
    module.exports = function (config) {
      var alreadyLoaded = {};
      return through.obj(function (file, enc, next) {
        var self = this;
        if (!file.path || !file.isNull() || file.isBuffer()) {
          this.push(file);
          next();
          return;
        }
        if (file.isNull()) {
          var path = file.path && file.path.replace(file.ext, ''), paths = [
              'index.js',
              'main.js'
            ];
          paths = _.map(paths, function (p) {
            return path + '/' + p;
          });
          async.detect([file.path].concat(paths), fs.exists, function (p) {
            if (p) {
              file.path = p;
              if (!alreadyLoaded[file.path]) {
                file.contents = fs.createReadStream(p);
                loadFromStream();
              } else {
                self.emit('alreadyLoaded', file);
                file.stopProcessing = true;
                self.push(file);
                next();
              }
            } else {
              debug('File does not exists, passing it further:', file, file.path);
              self.push(file);
              next();
            }
          });
        }
        if (file.isStream())
          loadFromStream();
        function loadFromStream() {
          var buffers = [];
          alreadyLoaded[file.path] = true;
          file.pipe(through(function (chunk, enc, next) {
            buffers.push(chunk);
            next();
          }, function () {
            file.contents = Buffer.concat(buffers);
            self.push(file);
            next();
          }.bind(this)));
        }
      });
    };
}, {"__filename":"load.js","__dirname":"lib/file"}], 
'acorn/util/walk': [function(exports, require, module, __filename, __dirname) { 
    (function (mod) {
      if (typeof exports == 'object' && typeof module == 'object')
        return mod(exports);
      if (typeof define == 'function' && define.amd)
        return define(['exports'], mod);
      mod((this.acorn || (this.acorn = {})).walk = {});
    }(function (exports) {
      'use strict';
      exports.simple = function (node, visitors, base, state) {
        if (!base)
          base = exports.base;
        function c(node, st, override) {
          var type = override || node.type, found = visitors[type];
          base[type](node, st, c);
          if (found)
            found(node, st);
        }
        c(node, state);
      };
      exports.ancestor = function (node, visitors, base, state) {
        if (!base)
          base = exports.base;
        if (!state)
          state = [];
        function c(node, st, override) {
          var type = override || node.type, found = visitors[type];
          if (node != st[st.length - 1]) {
            st = st.slice();
            st.push(node);
          }
          base[type](node, st, c);
          if (found)
            found(node, st);
        }
        c(node, state);
      };
      exports.recursive = function (node, state, funcs, base) {
        var visitor = funcs ? exports.make(funcs, base) : base;
        function c(node, st, override) {
          visitor[override || node.type](node, st, c);
        }
        c(node, state);
      };
      function makeTest(test) {
        if (typeof test == 'string')
          return function (type) {
            return type == test;
          };
        else if (!test)
          return function () {
            return true;
          };
        else
          return test;
      }
      function Found(node, state) {
        this.node = node;
        this.state = state;
      }
      exports.findNodeAt = function (node, start, end, test, base, state) {
        test = makeTest(test);
        try {
          if (!base)
            base = exports.base;
          var c = function (node, st, override) {
            var type = override || node.type;
            if ((start == null || node.start <= start) && (end == null || node.end >= end))
              base[type](node, st, c);
            if (test(type, node) && (start == null || node.start == start) && (end == null || node.end == end))
              throw new Found(node, st);
          };
          c(node, state);
        } catch (e) {
          if (e instanceof Found)
            return e;
          throw e;
        }
      };
      exports.findNodeAround = function (node, pos, test, base, state) {
        test = makeTest(test);
        try {
          if (!base)
            base = exports.base;
          var c = function (node, st, override) {
            var type = override || node.type;
            if (node.start > pos || node.end < pos)
              return;
            base[type](node, st, c);
            if (test(type, node))
              throw new Found(node, st);
          };
          c(node, state);
        } catch (e) {
          if (e instanceof Found)
            return e;
          throw e;
        }
      };
      exports.findNodeAfter = function (node, pos, test, base, state) {
        test = makeTest(test);
        try {
          if (!base)
            base = exports.base;
          var c = function (node, st, override) {
            if (node.end < pos)
              return;
            var type = override || node.type;
            if (node.start >= pos && test(type, node))
              throw new Found(node, st);
            base[type](node, st, c);
          };
          c(node, state);
        } catch (e) {
          if (e instanceof Found)
            return e;
          throw e;
        }
      };
      exports.findNodeBefore = function (node, pos, test, base, state) {
        test = makeTest(test);
        if (!base)
          base = exports.base;
        var max;
        var c = function (node, st, override) {
          if (node.start > pos)
            return;
          var type = override || node.type;
          if (node.end <= pos && (!max || max.node.end < node.end) && test(type, node))
            max = new Found(node, st);
          base[type](node, st, c);
        };
        c(node, state);
        return max;
      };
      exports.make = function (funcs, base) {
        if (!base)
          base = exports.base;
        var visitor = {};
        for (var type in base)
          visitor[type] = base[type];
        for (var type in funcs)
          visitor[type] = funcs[type];
        return visitor;
      };
      function skipThrough(node, st, c) {
        c(node, st);
      }
      function ignore(_node, _st, _c) {
      }
      var base = exports.base = {};
      base.Program = base.BlockStatement = function (node, st, c) {
        for (var i = 0; i < node.body.length; ++i)
          c(node.body[i], st, 'Statement');
      };
      base.Statement = skipThrough;
      base.EmptyStatement = ignore;
      base.ExpressionStatement = function (node, st, c) {
        c(node.expression, st, 'Expression');
      };
      base.IfStatement = function (node, st, c) {
        c(node.test, st, 'Expression');
        c(node.consequent, st, 'Statement');
        if (node.alternate)
          c(node.alternate, st, 'Statement');
      };
      base.LabeledStatement = function (node, st, c) {
        c(node.body, st, 'Statement');
      };
      base.BreakStatement = base.ContinueStatement = ignore;
      base.WithStatement = function (node, st, c) {
        c(node.object, st, 'Expression');
        c(node.body, st, 'Statement');
      };
      base.SwitchStatement = function (node, st, c) {
        c(node.discriminant, st, 'Expression');
        for (var i = 0; i < node.cases.length; ++i) {
          var cs = node.cases[i];
          if (cs.test)
            c(cs.test, st, 'Expression');
          for (var j = 0; j < cs.consequent.length; ++j)
            c(cs.consequent[j], st, 'Statement');
        }
      };
      base.ReturnStatement = function (node, st, c) {
        if (node.argument)
          c(node.argument, st, 'Expression');
      };
      base.ThrowStatement = function (node, st, c) {
        c(node.argument, st, 'Expression');
      };
      base.TryStatement = function (node, st, c) {
        c(node.block, st, 'Statement');
        if (node.handler)
          c(node.handler.body, st, 'ScopeBody');
        if (node.finalizer)
          c(node.finalizer, st, 'Statement');
      };
      base.WhileStatement = function (node, st, c) {
        c(node.test, st, 'Expression');
        c(node.body, st, 'Statement');
      };
      base.DoWhileStatement = base.WhileStatement;
      base.ForStatement = function (node, st, c) {
        if (node.init)
          c(node.init, st, 'ForInit');
        if (node.test)
          c(node.test, st, 'Expression');
        if (node.update)
          c(node.update, st, 'Expression');
        c(node.body, st, 'Statement');
      };
      base.ForInStatement = function (node, st, c) {
        c(node.left, st, 'ForInit');
        c(node.right, st, 'Expression');
        c(node.body, st, 'Statement');
      };
      base.ForInit = function (node, st, c) {
        if (node.type == 'VariableDeclaration')
          c(node, st);
        else
          c(node, st, 'Expression');
      };
      base.DebuggerStatement = ignore;
      base.FunctionDeclaration = function (node, st, c) {
        c(node, st, 'Function');
      };
      base.VariableDeclaration = function (node, st, c) {
        for (var i = 0; i < node.declarations.length; ++i) {
          var decl = node.declarations[i];
          if (decl.init)
            c(decl.init, st, 'Expression');
        }
      };
      base.Function = function (node, st, c) {
        c(node.body, st, 'ScopeBody');
      };
      base.ScopeBody = function (node, st, c) {
        c(node, st, 'Statement');
      };
      base.Expression = skipThrough;
      base.ThisExpression = ignore;
      base.ArrayExpression = function (node, st, c) {
        for (var i = 0; i < node.elements.length; ++i) {
          var elt = node.elements[i];
          if (elt)
            c(elt, st, 'Expression');
        }
      };
      base.ObjectExpression = function (node, st, c) {
        for (var i = 0; i < node.properties.length; ++i)
          c(node.properties[i].value, st, 'Expression');
      };
      base.FunctionExpression = base.FunctionDeclaration;
      base.SequenceExpression = function (node, st, c) {
        for (var i = 0; i < node.expressions.length; ++i)
          c(node.expressions[i], st, 'Expression');
      };
      base.UnaryExpression = base.UpdateExpression = function (node, st, c) {
        c(node.argument, st, 'Expression');
      };
      base.BinaryExpression = base.AssignmentExpression = base.LogicalExpression = function (node, st, c) {
        c(node.left, st, 'Expression');
        c(node.right, st, 'Expression');
      };
      base.ConditionalExpression = function (node, st, c) {
        c(node.test, st, 'Expression');
        c(node.consequent, st, 'Expression');
        c(node.alternate, st, 'Expression');
      };
      base.NewExpression = base.CallExpression = function (node, st, c) {
        c(node.callee, st, 'Expression');
        if (node.arguments)
          for (var i = 0; i < node.arguments.length; ++i)
            c(node.arguments[i], st, 'Expression');
      };
      base.MemberExpression = function (node, st, c) {
        c(node.object, st, 'Expression');
        if (node.computed)
          c(node.property, st, 'Expression');
      };
      base.Identifier = base.Literal = ignore;
      function makeScope(prev, isCatch) {
        return {
          vars: Object.create(null),
          prev: prev,
          isCatch: isCatch
        };
      }
      function normalScope(scope) {
        while (scope.isCatch)
          scope = scope.prev;
        return scope;
      }
      exports.scopeVisitor = exports.make({
        Function: function (node, scope, c) {
          var inner = makeScope(scope);
          for (var i = 0; i < node.params.length; ++i)
            inner.vars[node.params[i].name] = {
              type: 'argument',
              node: node.params[i]
            };
          if (node.id) {
            var decl = node.type == 'FunctionDeclaration';
            (decl ? normalScope(scope) : inner).vars[node.id.name] = {
              type: decl ? 'function' : 'function name',
              node: node.id
            };
          }
          c(node.body, inner, 'ScopeBody');
        },
        TryStatement: function (node, scope, c) {
          c(node.block, scope, 'Statement');
          if (node.handler) {
            var inner = makeScope(scope, true);
            inner.vars[node.handler.param.name] = {
              type: 'catch clause',
              node: node.handler.param
            };
            c(node.handler.body, inner, 'ScopeBody');
          }
          if (node.finalizer)
            c(node.finalizer, scope, 'Statement');
        },
        VariableDeclaration: function (node, scope, c) {
          var target = normalScope(scope);
          for (var i = 0; i < node.declarations.length; ++i) {
            var decl = node.declarations[i];
            target.vars[decl.id.name] = {
              type: 'var',
              node: decl.id
            };
            if (decl.init)
              c(decl.init, scope, 'Expression');
          }
        }
      });
    }));
}, {"__filename":"walk.js","__dirname":"node_modules/acorn/util"}], 
'estraverse': [function(exports, require, module, __filename, __dirname) { 
    (function (root, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        factory(root.estraverse = {});
      }
    }(this, function (exports) {
      'use strict';
      var Syntax, isArray, VisitorOption, VisitorKeys, BREAK, SKIP;
      Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
      };
      function ignoreJSHintError() {
      }
      isArray = Array.isArray;
      if (!isArray) {
        isArray = function isArray(array) {
          return Object.prototype.toString.call(array) === '[object Array]';
        };
      }
      function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            val = obj[key];
            if (typeof val === 'object' && val !== null) {
              ret[key] = deepCopy(val);
            } else {
              ret[key] = val;
            }
          }
        }
        return ret;
      }
      function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            ret[key] = obj[key];
          }
        }
        return ret;
      }
      ignoreJSHintError(shallowCopy);
      function upperBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
          diff = len >>> 1;
          current = i + diff;
          if (func(array[current])) {
            len = diff;
          } else {
            i = current + 1;
            len -= diff + 1;
          }
        }
        return i;
      }
      function lowerBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
          diff = len >>> 1;
          current = i + diff;
          if (func(array[current])) {
            i = current + 1;
            len -= diff + 1;
          } else {
            len = diff;
          }
        }
        return i;
      }
      ignoreJSHintError(lowerBound);
      VisitorKeys = {
        AssignmentExpression: [
          'left',
          'right'
        ],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: [
          'params',
          'defaults',
          'rest',
          'body'
        ],
        BlockStatement: ['body'],
        BinaryExpression: [
          'left',
          'right'
        ],
        BreakStatement: ['label'],
        CallExpression: [
          'callee',
          'arguments'
        ],
        CatchClause: [
          'param',
          'body'
        ],
        ClassBody: ['body'],
        ClassDeclaration: [
          'id',
          'body',
          'superClass'
        ],
        ClassExpression: [
          'id',
          'body',
          'superClass'
        ],
        ConditionalExpression: [
          'test',
          'consequent',
          'alternate'
        ],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: [
          'body',
          'test'
        ],
        EmptyStatement: [],
        ExpressionStatement: ['expression'],
        ForStatement: [
          'init',
          'test',
          'update',
          'body'
        ],
        ForInStatement: [
          'left',
          'right',
          'body'
        ],
        ForOfStatement: [
          'left',
          'right',
          'body'
        ],
        FunctionDeclaration: [
          'id',
          'params',
          'defaults',
          'rest',
          'body'
        ],
        FunctionExpression: [
          'id',
          'params',
          'defaults',
          'rest',
          'body'
        ],
        Identifier: [],
        IfStatement: [
          'test',
          'consequent',
          'alternate'
        ],
        Literal: [],
        LabeledStatement: [
          'label',
          'body'
        ],
        LogicalExpression: [
          'left',
          'right'
        ],
        MemberExpression: [
          'object',
          'property'
        ],
        MethodDefinition: [
          'key',
          'value'
        ],
        NewExpression: [
          'callee',
          'arguments'
        ],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: [
          'key',
          'value'
        ],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SwitchStatement: [
          'discriminant',
          'cases'
        ],
        SwitchCase: [
          'test',
          'consequent'
        ],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: [
          'block',
          'handlers',
          'handler',
          'guardedHandlers',
          'finalizer'
        ],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: [
          'id',
          'init'
        ],
        WhileStatement: [
          'test',
          'body'
        ],
        WithStatement: [
          'object',
          'body'
        ],
        YieldExpression: ['argument']
      };
      BREAK = {};
      SKIP = {};
      VisitorOption = {
        Break: BREAK,
        Skip: SKIP
      };
      function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
      }
      Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
      };
      function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
      }
      function Controller() {
      }
      Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;
        function addToPath(result, path) {
          if (isArray(path)) {
            for (j = 0, jz = path.length; j < jz; ++j) {
              result.push(path[j]);
            }
          } else {
            result.push(path);
          }
        }
        if (!this.__current.path) {
          return null;
        }
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
          element = this.__leavelist[i];
          addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
      };
      Controller.prototype.parents = function parents() {
        var i, iz, result;
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
          result.push(this.__leavelist[i].node);
        }
        return result;
      };
      Controller.prototype.current = function current() {
        return this.__current.node;
      };
      Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;
        result = undefined;
        previous = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
          result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;
        return result;
      };
      Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
      };
      Controller.prototype.skip = function () {
        this.notify(SKIP);
      };
      Controller.prototype['break'] = function () {
        this.notify(BREAK);
      };
      Controller.prototype.__initialize = function (root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
      };
      Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
        this.__initialize(root, visitor);
        sentinel = {};
        worklist = this.__worklist;
        leavelist = this.__leavelist;
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));
        while (worklist.length) {
          element = worklist.pop();
          if (element === sentinel) {
            element = leavelist.pop();
            ret = this.__execute(visitor.leave, element);
            if (this.__state === BREAK || ret === BREAK) {
              return;
            }
            continue;
          }
          if (element.node) {
            ret = this.__execute(visitor.enter, element);
            if (this.__state === BREAK || ret === BREAK) {
              return;
            }
            worklist.push(sentinel);
            leavelist.push(element);
            if (this.__state === SKIP || ret === SKIP) {
              continue;
            }
            node = element.node;
            nodeType = element.wrap || node.type;
            candidates = VisitorKeys[nodeType];
            current = candidates.length;
            while ((current -= 1) >= 0) {
              key = candidates[current];
              candidate = node[key];
              if (!candidate) {
                continue;
              }
              if (!isArray(candidate)) {
                worklist.push(new Element(candidate, key, null, null));
                continue;
              }
              current2 = candidate.length;
              while ((current2 -= 1) >= 0) {
                if (!candidate[current2]) {
                  continue;
                }
                if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
                  element = new Element(candidate[current2], [
                    key,
                    current2
                  ], 'Property', null);
                } else {
                  element = new Element(candidate[current2], [
                    key,
                    current2
                  ], null, null);
                }
                worklist.push(element);
              }
            }
          }
        }
      };
      Controller.prototype.replace = function replace(root, visitor) {
        var worklist, leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
        this.__initialize(root, visitor);
        sentinel = {};
        worklist = this.__worklist;
        leavelist = this.__leavelist;
        outer = { root: root };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);
        while (worklist.length) {
          element = worklist.pop();
          if (element === sentinel) {
            element = leavelist.pop();
            target = this.__execute(visitor.leave, element);
            if (target !== undefined && target !== BREAK && target !== SKIP) {
              element.ref.replace(target);
            }
            if (this.__state === BREAK || target === BREAK) {
              return outer.root;
            }
            continue;
          }
          target = this.__execute(visitor.enter, element);
          if (target !== undefined && target !== BREAK && target !== SKIP) {
            element.ref.replace(target);
            element.node = target;
          }
          if (this.__state === BREAK || target === BREAK) {
            return outer.root;
          }
          node = element.node;
          if (!node) {
            continue;
          }
          worklist.push(sentinel);
          leavelist.push(element);
          if (this.__state === SKIP || target === SKIP) {
            continue;
          }
          nodeType = element.wrap || node.type;
          candidates = VisitorKeys[nodeType];
          current = candidates.length;
          while ((current -= 1) >= 0) {
            key = candidates[current];
            candidate = node[key];
            if (!candidate) {
              continue;
            }
            if (!isArray(candidate)) {
              worklist.push(new Element(candidate, key, null, new Reference(node, key)));
              continue;
            }
            current2 = candidate.length;
            while ((current2 -= 1) >= 0) {
              if (!candidate[current2]) {
                continue;
              }
              if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
                element = new Element(candidate[current2], [
                  key,
                  current2
                ], 'Property', new Reference(candidate, current2));
              } else {
                element = new Element(candidate[current2], [
                  key,
                  current2
                ], null, new Reference(candidate, current2));
              }
              worklist.push(element);
            }
          }
        }
        return outer.root;
      };
      function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
      }
      function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
      }
      function extendCommentRange(comment, tokens) {
        var target;
        target = upperBound(tokens, function search(token) {
          return token.range[0] > comment.range[0];
        });
        comment.extendedRange = [
          comment.range[0],
          comment.range[1]
        ];
        if (target !== tokens.length) {
          comment.extendedRange[1] = tokens[target].range[0];
        }
        target -= 1;
        if (target >= 0) {
          comment.extendedRange[0] = tokens[target].range[1];
        }
        return comment;
      }
      function attachComments(tree, providedComments, tokens) {
        var comments = [], comment, len, i, cursor;
        if (!tree.range) {
          throw new Error('attachComments needs range information');
        }
        if (!tokens.length) {
          if (providedComments.length) {
            for (i = 0, len = providedComments.length; i < len; i += 1) {
              comment = deepCopy(providedComments[i]);
              comment.extendedRange = [
                0,
                tree.range[0]
              ];
              comments.push(comment);
            }
            tree.leadingComments = comments;
          }
          return tree;
        }
        for (i = 0, len = providedComments.length; i < len; i += 1) {
          comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }
        cursor = 0;
        traverse(tree, {
          enter: function (node) {
            var comment;
            while (cursor < comments.length) {
              comment = comments[cursor];
              if (comment.extendedRange[1] > node.range[0]) {
                break;
              }
              if (comment.extendedRange[1] === node.range[0]) {
                if (!node.leadingComments) {
                  node.leadingComments = [];
                }
                node.leadingComments.push(comment);
                comments.splice(cursor, 1);
              } else {
                cursor += 1;
              }
            }
            if (cursor === comments.length) {
              return VisitorOption.Break;
            }
            if (comments[cursor].extendedRange[0] > node.range[1]) {
              return VisitorOption.Skip;
            }
          }
        });
        cursor = 0;
        traverse(tree, {
          leave: function (node) {
            var comment;
            while (cursor < comments.length) {
              comment = comments[cursor];
              if (node.range[1] < comment.extendedRange[0]) {
                break;
              }
              if (node.range[1] === comment.extendedRange[0]) {
                if (!node.trailingComments) {
                  node.trailingComments = [];
                }
                node.trailingComments.push(comment);
                comments.splice(cursor, 1);
              } else {
                cursor += 1;
              }
            }
            if (cursor === comments.length) {
              return VisitorOption.Break;
            }
            if (comments[cursor].extendedRange[0] > node.range[1]) {
              return VisitorOption.Skip;
            }
          }
        });
        return tree;
      }
      exports.version = '1.5.1-dev';
      exports.Syntax = Syntax;
      exports.traverse = traverse;
      exports.replace = replace;
      exports.attachComments = attachComments;
      exports.VisitorKeys = VisitorKeys;
      exports.VisitorOption = VisitorOption;
      exports.Controller = Controller;
    }));
}, {"__filename":"estraverse.js","__dirname":"node_modules/escodegen/node_modules/estraverse"}], 
'esutils/lib/code': [function(exports, require, module, __filename, __dirname) { 
    (function () {
      'use strict';
      var Regex;
      Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
      };
      function isDecimalDigit(ch) {
        return ch >= 48 && ch <= 57;
      }
      function isHexDigit(ch) {
        return isDecimalDigit(ch) || 97 <= ch && ch <= 102 || 65 <= ch && ch <= 70;
      }
      function isOctalDigit(ch) {
        return ch >= 48 && ch <= 55;
      }
      function isWhiteSpace(ch) {
        return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch >= 5760 && [
          5760,
          6158,
          8192,
          8193,
          8194,
          8195,
          8196,
          8197,
          8198,
          8199,
          8200,
          8201,
          8202,
          8239,
          8287,
          12288,
          65279
        ].indexOf(ch) >= 0;
      }
      function isLineTerminator(ch) {
        return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
      }
      function isIdentifierStart(ch) {
        return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch));
      }
      function isIdentifierPart(ch) {
        return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch >= 48 && ch <= 57 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch));
      }
      module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStart: isIdentifierStart,
        isIdentifierPart: isIdentifierPart
      };
    }());
}, {"__filename":"code.js","__dirname":"node_modules/escodegen/node_modules/esutils/lib"}], 
'esutils/lib/keyword': [function(exports, require, module, __filename, __dirname) { 
    (function () {
      'use strict';
      var code = require('esutils/lib/code');
      function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
          return true;
        default:
          return false;
        }
      }
      function isKeywordES5(id, strict) {
        if (!strict && id === 'yield') {
          return false;
        }
        return isKeywordES6(id, strict);
      }
      function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
          return true;
        }
        switch (id.length) {
        case 2:
          return id === 'if' || id === 'in' || id === 'do';
        case 3:
          return id === 'var' || id === 'for' || id === 'new' || id === 'try';
        case 4:
          return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
        case 5:
          return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
        case 6:
          return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
        case 7:
          return id === 'default' || id === 'finally' || id === 'extends';
        case 8:
          return id === 'function' || id === 'continue' || id === 'debugger';
        case 10:
          return id === 'instanceof';
        default:
          return false;
        }
      }
      function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
      }
      function isIdentifierName(id) {
        var i, iz, ch;
        if (id.length === 0) {
          return false;
        }
        ch = id.charCodeAt(0);
        if (!code.isIdentifierStart(ch) || ch === 92) {
          return false;
        }
        for (i = 1, iz = id.length; i < iz; ++i) {
          ch = id.charCodeAt(i);
          if (!code.isIdentifierPart(ch) || ch === 92) {
            return false;
          }
        }
        return true;
      }
      module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierName: isIdentifierName
      };
    }());
}, {"__filename":"keyword.js","__dirname":"node_modules/escodegen/node_modules/esutils/lib"}], 
'esutils': [function(exports, require, module, __filename, __dirname) { 
    (function () {
      'use strict';
      exports.code = require('esutils/lib/code');
      exports.keyword = require('esutils/lib/keyword');
    }());
}, {"__filename":"utils.js","__dirname":"node_modules/escodegen/node_modules/esutils/lib"}], 
'escodegen/package.json': [function(exports, require, module, __filename, __dirname) { 
module.exports = {
  "name": "escodegen",
  "description": "ECMAScript code generator",
  "homepage": "http://github.com/Constellation/escodegen",
  "main": "escodegen.js",
  "bin": {
    "esgenerate": "./bin/esgenerate.js",
    "escodegen": "./bin/escodegen.js"
  },
  "version": "1.2.0",
  "engines": {
    "node": ">=0.4.0"
  },
  "maintainers": [
    {
      "name": "Yusuke Suzuki",
      "email": "utatane.tea@gmail.com",
      "url": "http://github.com/Constellation"
    }
  ],
  "repository": {
    "type": "git",
    "url": "http://github.com/Constellation/escodegen.git"
  },
  "dependencies": {
    "esprima": "~1.0.4",
    "estraverse": "~1.5.0",
    "esutils": "~1.0.0",
    "source-map": "~0.1.30"
  },
  "optionalDependencies": {
    "source-map": "~0.1.30"
  },
  "devDependencies": {
    "esprima-moz": "*",
    "q": "*",
    "bower": "*",
    "semver": "*",
    "chai": "~1.7.2",
    "gulp": "~3.5.0",
    "gulp-mocha": "~0.4.1",
    "gulp-eslint": "~0.1.2",
    "jshint-stylish": "~0.1.5",
    "gulp-jshint": "~1.4.0",
    "commonjs-everywhere": "~0.9.6"
  },
  "licenses": [
    {
      "type": "BSD",
      "url": "http://github.com/Constellation/escodegen/raw/master/LICENSE.BSD"
    }
  ],
  "scripts": {
    "test": "gulp travis",
    "unit-test": "gulp test",
    "lint": "gulp lint",
    "release": "node tools/release.js",
    "build-min": "cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",
    "build": "cjsify -a path: tools/entry-point.js > escodegen.browser.js"
  },
  "readme": "\n### Escodegen [![Build Status](https://secure.travis-ci.org/Constellation/escodegen.png)](http://travis-ci.org/Constellation/escodegen) [![Build Status](https://drone.io/github.com/Constellation/escodegen/status.png)](https://drone.io/github.com/Constellation/escodegen/latest)\n\nEscodegen ([escodegen](http://github.com/Constellation/escodegen)) is\n[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)\n(also popularly known as [JavaScript](http://en.wikipedia.org/wiki/JavaScript>JavaScript))\ncode generator from [Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API) AST.\nSee [online generator demo](http://constellation.github.com/escodegen/demo/index.html).\n\n\n### Install\n\nEscodegen can be used in a web browser:\n\n    <script src=\"escodegen.browser.js\"></script>\n\nescodegen.browser.js is found in tagged-revision. See Tags on GitHub.\n\nOr in a Node.js application via the package manager:\n\n    npm install escodegen\n\n### Usage\n\nA simple example: the program\n\n    escodegen.generate({\n        type: 'BinaryExpression',\n        operator: '+',\n        left: { type: 'Literal', value: 40 },\n        right: { type: 'Literal', value: 2 }\n    });\n\nproduces the string `'40 + 2'`\n\nSee the [API page](https://github.com/Constellation/escodegen/wiki/API) for\noptions. To run the tests, execute `npm test` in the root directory.\n\n### Building browser bundle / minified browser bundle\n\nAt first, executing `npm install` to install the all dev dependencies.\nAfter that,\n\n    npm run-script build\n\nwill generate `escodegen.browser.js`, it is used on the browser environment.\n\nAnd,\n\n    npm run-script build-min\n\nwill generate minified `escodegen.browser.min.js`.\n\n### License\n\n#### Escodegen\n\nCopyright (C) 2012 [Yusuke Suzuki](http://github.com/Constellation)\n (twitter: [@Constellation](http://twitter.com/Constellation)) and other contributors.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n  * Redistributions of source code must retain the above copyright\n    notice, this list of conditions and the following disclaimer.\n\n  * Redistributions in binary form must reproduce the above copyright\n    notice, this list of conditions and the following disclaimer in the\n    documentation and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\nARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY\nDIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\nLOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND\nON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\nTHIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\n#### source-map\n\nSourceNodeMocks has a limited interface of mozilla/source-map SourceNode implementations.\n\nCopyright (c) 2009-2011, Mozilla Foundation and contributors\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n* Redistributions of source code must retain the above copyright notice, this\n  list of conditions and the following disclaimer.\n\n* Redistributions in binary form must reproduce the above copyright notice,\n  this list of conditions and the following disclaimer in the documentation\n  and/or other materials provided with the distribution.\n\n* Neither the names of the Mozilla Foundation nor the names of project\n  contributors may be used to endorse or promote products derived from this\n  software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND\nANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\nWARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n",
  "readmeFilename": "README.md",
  "bugs": {
    "url": "https://github.com/Constellation/escodegen/issues"
  },
  "_id": "escodegen@1.2.0",
  "_from": "escodegen@~1.2.0"
}

}, {"__filename":"package.json","__dirname":"node_modules/escodegen"}], 
'escodegen': [function(exports, require, module, __filename, __dirname) { 
    (function () {
      'use strict';
      var Syntax, Precedence, BinaryPrecedence, SourceNode, estraverse, esutils, isArray, base, indent, json, renumber, hexadecimal, quotes, escapeless, newline, space, parentheses, semicolons, safeConcatenation, directive, extra, parse, sourceMap, FORMAT_MINIFY, FORMAT_DEFAULTS;
      estraverse = require('estraverse');
      esutils = require('esutils');
      Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ComprehensionBlock: 'ComprehensionBlock',
        ComprehensionExpression: 'ComprehensionExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExportDeclaration: 'ExportDeclaration',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        ForOfStatement: 'ForOfStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        GeneratorExpression: 'GeneratorExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
      };
      Precedence = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        LogicalOR: 3,
        LogicalAND: 4,
        BitwiseOR: 5,
        BitwiseXOR: 6,
        BitwiseAND: 7,
        Equality: 8,
        Relational: 9,
        BitwiseSHIFT: 10,
        Additive: 11,
        Multiplicative: 12,
        Unary: 13,
        Postfix: 14,
        Call: 15,
        New: 16,
        Member: 17,
        Primary: 18
      };
      BinaryPrecedence = {
        '||': Precedence.LogicalOR,
        '&&': Precedence.LogicalAND,
        '|': Precedence.BitwiseOR,
        '^': Precedence.BitwiseXOR,
        '&': Precedence.BitwiseAND,
        '==': Precedence.Equality,
        '!=': Precedence.Equality,
        '===': Precedence.Equality,
        '!==': Precedence.Equality,
        'is': Precedence.Equality,
        'isnt': Precedence.Equality,
        '<': Precedence.Relational,
        '>': Precedence.Relational,
        '<=': Precedence.Relational,
        '>=': Precedence.Relational,
        'in': Precedence.Relational,
        'instanceof': Precedence.Relational,
        '<<': Precedence.BitwiseSHIFT,
        '>>': Precedence.BitwiseSHIFT,
        '>>>': Precedence.BitwiseSHIFT,
        '+': Precedence.Additive,
        '-': Precedence.Additive,
        '*': Precedence.Multiplicative,
        '%': Precedence.Multiplicative,
        '/': Precedence.Multiplicative
      };
      function getDefaultOptions() {
        return {
          indent: null,
          base: null,
          parse: null,
          comment: false,
          format: {
            indent: {
              style: '    ',
              base: 0,
              adjustMultilineComment: false
            },
            newline: '\n',
            space: ' ',
            json: false,
            renumber: false,
            hexadecimal: false,
            quotes: 'single',
            escapeless: false,
            compact: false,
            parentheses: true,
            semicolons: true,
            safeConcatenation: false
          },
          moz: {
            comprehensionExpressionStartsWithAssignment: false,
            starlessGenerator: false,
            parenthesizedComprehensionBlock: false
          },
          sourceMap: null,
          sourceMapRoot: null,
          sourceMapWithCode: false,
          directive: false,
          verbatim: null
        };
      }
      function stringRepeat(str, num) {
        var result = '';
        for (num |= 0; num > 0; num >>>= 1, str += str) {
          if (num & 1) {
            result += str;
          }
        }
        return result;
      }
      isArray = Array.isArray;
      if (!isArray) {
        isArray = function isArray(array) {
          return Object.prototype.toString.call(array) === '[object Array]';
        };
      }
      function hasLineTerminator(str) {
        return /[\r\n]/g.test(str);
      }
      function endsWithLineTerminator(str) {
        var len = str.length;
        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
      }
      function updateDeeply(target, override) {
        var key, val;
        function isHashObject(target) {
          return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
        }
        for (key in override) {
          if (override.hasOwnProperty(key)) {
            val = override[key];
            if (isHashObject(val)) {
              if (isHashObject(target[key])) {
                updateDeeply(target[key], val);
              } else {
                target[key] = updateDeeply({}, val);
              }
            } else {
              target[key] = val;
            }
          }
        }
        return target;
      }
      function generateNumber(value) {
        var result, point, temp, exponent, pos;
        if (value !== value) {
          throw new Error('Numeric literal whose value is NaN');
        }
        if (value < 0 || value === 0 && 1 / value < 0) {
          throw new Error('Numeric literal whose value is negative');
        }
        if (value === 1 / 0) {
          return json ? 'null' : renumber ? '1e400' : '1e+400';
        }
        result = '' + value;
        if (!renumber || result.length < 3) {
          return result;
        }
        point = result.indexOf('.');
        if (!json && result.charCodeAt(0) === 48 && point === 1) {
          point = 0;
          result = result.slice(1);
        }
        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;
        if ((pos = temp.indexOf('e')) > 0) {
          exponent = +temp.slice(pos + 1);
          temp = temp.slice(0, pos);
        }
        if (point >= 0) {
          exponent -= temp.length - point - 1;
          temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;
        while (temp.charCodeAt(temp.length + pos - 1) === 48) {
          --pos;
        }
        if (pos !== 0) {
          exponent -= pos;
          temp = temp.slice(0, pos);
        }
        if (exponent !== 0) {
          temp += 'e' + exponent;
        }
        if ((temp.length < result.length || hexadecimal && value > 1000000000000 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length) && +temp === value) {
          result = temp;
        }
        return result;
      }
      function escapeRegExpCharacter(ch, previousIsBackslash) {
        if ((ch & ~1) === 8232) {
          return (previousIsBackslash ? 'u' : '\\u') + (ch === 8232 ? '2028' : '2029');
        } else if (ch === 10 || ch === 13) {
          return (previousIsBackslash ? '' : '\\') + (ch === 10 ? 'n' : 'r');
        }
        return String.fromCharCode(ch);
      }
      function generateRegExp(reg) {
        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;
        result = reg.toString();
        if (reg.source) {
          match = result.match(/\/([^/]*)$/);
          if (!match) {
            return result;
          }
          flags = match[1];
          result = '';
          characterInBrack = false;
          previousIsBackslash = false;
          for (i = 0, iz = reg.source.length; i < iz; ++i) {
            ch = reg.source.charCodeAt(i);
            if (!previousIsBackslash) {
              if (characterInBrack) {
                if (ch === 93) {
                  characterInBrack = false;
                }
              } else {
                if (ch === 47) {
                  result += '\\';
                } else if (ch === 91) {
                  characterInBrack = true;
                }
              }
              result += escapeRegExpCharacter(ch, previousIsBackslash);
              previousIsBackslash = ch === 92;
            } else {
              result += escapeRegExpCharacter(ch, previousIsBackslash);
              previousIsBackslash = false;
            }
          }
          return '/' + result + '/' + flags;
        }
        return result;
      }
      function escapeAllowedCharacter(code, next) {
        var hex, result = '\\';
        switch (code) {
        case 8:
          result += 'b';
          break;
        case 12:
          result += 'f';
          break;
        case 9:
          result += 't';
          break;
        default:
          hex = code.toString(16).toUpperCase();
          if (json || code > 255) {
            result += 'u' + '0000'.slice(hex.length) + hex;
          } else if (code === 0 && !esutils.code.isDecimalDigit(next)) {
            result += '0';
          } else if (code === 11) {
            result += 'x0B';
          } else {
            result += 'x' + '00'.slice(hex.length) + hex;
          }
          break;
        }
        return result;
      }
      function escapeDisallowedCharacter(code) {
        var result = '\\';
        switch (code) {
        case 92:
          result += '\\';
          break;
        case 10:
          result += 'n';
          break;
        case 13:
          result += 'r';
          break;
        case 8232:
          result += 'u2028';
          break;
        case 8233:
          result += 'u2029';
          break;
        default:
          throw new Error('Incorrectly classified character');
        }
        return result;
      }
      function escapeDirective(str) {
        var i, iz, code, quote;
        quote = quotes === 'double' ? '"' : '\'';
        for (i = 0, iz = str.length; i < iz; ++i) {
          code = str.charCodeAt(i);
          if (code === 39) {
            quote = '"';
            break;
          } else if (code === 34) {
            quote = '\'';
            break;
          } else if (code === 92) {
            ++i;
          }
        }
        return quote + str + quote;
      }
      function escapeString(str) {
        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;
        for (i = 0, len = str.length; i < len; ++i) {
          code = str.charCodeAt(i);
          if (code === 39) {
            ++singleQuotes;
          } else if (code === 34) {
            ++doubleQuotes;
          } else if (code === 47 && json) {
            result += '\\';
          } else if (esutils.code.isLineTerminator(code) || code === 92) {
            result += escapeDisallowedCharacter(code);
            continue;
          } else if (json && code < 32 || !(json || escapeless || code >= 32 && code <= 126)) {
            result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
            continue;
          }
          result += String.fromCharCode(code);
        }
        single = !(quotes === 'double' || quotes === 'auto' && doubleQuotes < singleQuotes);
        quote = single ? '\'' : '"';
        if (!(single ? singleQuotes : doubleQuotes)) {
          return quote + result + quote;
        }
        str = result;
        result = quote;
        for (i = 0, len = str.length; i < len; ++i) {
          code = str.charCodeAt(i);
          if (code === 39 && single || code === 34 && !single) {
            result += '\\';
          }
          result += String.fromCharCode(code);
        }
        return result + quote;
      }
      function flattenToString(arr) {
        var i, iz, elem, result = '';
        for (i = 0, iz = arr.length; i < iz; ++i) {
          elem = arr[i];
          result += isArray(elem) ? flattenToString(elem) : elem;
        }
        return result;
      }
      function toSourceNodeWhenNeeded(generated, node) {
        if (!sourceMap) {
          if (isArray(generated)) {
            return flattenToString(generated);
          } else {
            return generated;
          }
        }
        if (node == null) {
          if (generated instanceof SourceNode) {
            return generated;
          } else {
            node = {};
          }
        }
        if (node.loc == null) {
          return new SourceNode(null, null, sourceMap, generated, node.name || null);
        }
        return new SourceNode(node.loc.start.line, node.loc.start.column, sourceMap === true ? node.loc.source || null : sourceMap, generated, node.name || null);
      }
      function noEmptySpace() {
        return space ? space : ' ';
      }
      function join(left, right) {
        var leftSource = toSourceNodeWhenNeeded(left).toString(), rightSource = toSourceNodeWhenNeeded(right).toString(), leftCharCode = leftSource.charCodeAt(leftSource.length - 1), rightCharCode = rightSource.charCodeAt(0);
        if ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode) || leftCharCode === 47 && rightCharCode === 105) {
          return [
            left,
            noEmptySpace(),
            right
          ];
        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) || esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
          return [
            left,
            right
          ];
        }
        return [
          left,
          space,
          right
        ];
      }
      function addIndent(stmt) {
        return [
          base,
          stmt
        ];
      }
      function withIndent(fn) {
        var previousBase, result;
        previousBase = base;
        base += indent;
        result = fn.call(this, base);
        base = previousBase;
        return result;
      }
      function calculateSpaces(str) {
        var i;
        for (i = str.length - 1; i >= 0; --i) {
          if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
            break;
          }
        }
        return str.length - 1 - i;
      }
      function adjustMultilineComment(value, specialBase) {
        var array, i, len, line, j, spaces, previousBase, sn;
        array = value.split(/\r\n|[\r\n]/);
        spaces = Number.MAX_VALUE;
        for (i = 1, len = array.length; i < len; ++i) {
          line = array[i];
          j = 0;
          while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
            ++j;
          }
          if (spaces > j) {
            spaces = j;
          }
        }
        if (typeof specialBase !== 'undefined') {
          previousBase = base;
          if (array[1][spaces] === '*') {
            specialBase += ' ';
          }
          base = specialBase;
        } else {
          if (spaces & 1) {
            --spaces;
          }
          previousBase = base;
        }
        for (i = 1, len = array.length; i < len; ++i) {
          sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
          array[i] = sourceMap ? sn.join('') : sn;
        }
        base = previousBase;
        return array.join('\n');
      }
      function generateComment(comment, specialBase) {
        if (comment.type === 'Line') {
          if (endsWithLineTerminator(comment.value)) {
            return '//' + comment.value;
          } else {
            return '//' + comment.value + '\n';
          }
        }
        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
          return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
        }
        return '/*' + comment.value + '*/';
      }
      function addCommentsToStatement(stmt, result) {
        var i, len, comment, save, tailingToStatement, specialBase, fragment;
        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
          save = result;
          comment = stmt.leadingComments[0];
          result = [];
          if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
            result.push('\n');
          }
          result.push(generateComment(comment));
          if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push('\n');
          }
          for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
            comment = stmt.leadingComments[i];
            fragment = [generateComment(comment)];
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              fragment.push('\n');
            }
            result.push(addIndent(fragment));
          }
          result.push(addIndent(save));
        }
        if (stmt.trailingComments) {
          tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
          specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([
            base,
            result,
            indent
          ]).toString()));
          for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
            comment = stmt.trailingComments[i];
            if (tailingToStatement) {
              if (i === 0) {
                result = [
                  result,
                  indent
                ];
              } else {
                result = [
                  result,
                  specialBase
                ];
              }
              result.push(generateComment(comment, specialBase));
            } else {
              result = [
                result,
                addIndent(generateComment(comment))
              ];
            }
            if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
              result = [
                result,
                '\n'
              ];
            }
          }
        }
        return result;
      }
      function parenthesize(text, current, should) {
        if (current < should) {
          return [
            '(',
            text,
            ')'
          ];
        }
        return text;
      }
      function maybeBlock(stmt, semicolonOptional, functionBody) {
        var result, noLeadingComment;
        noLeadingComment = !extra.comment || !stmt.leadingComments;
        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
          return [
            space,
            generateStatement(stmt, { functionBody: functionBody })
          ];
        }
        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
          return ';';
        }
        withIndent(function () {
          result = [
            newline,
            addIndent(generateStatement(stmt, {
              semicolonOptional: semicolonOptional,
              functionBody: functionBody
            }))
          ];
        });
        return result;
      }
      function maybeBlockSuffix(stmt, result) {
        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
          return [
            result,
            space
          ];
        }
        if (ends) {
          return [
            result,
            base
          ];
        }
        return [
          result,
          newline,
          base
        ];
      }
      function generateVerbatim(expr, option) {
        var i, result;
        result = expr[extra.verbatim].split(/\r\n|\n/);
        for (i = 1; i < result.length; i++) {
          result[i] = newline + base + result[i];
        }
        result = parenthesize(result, Precedence.Sequence, option.precedence);
        return toSourceNodeWhenNeeded(result, expr);
      }
      function generateIdentifier(node) {
        return toSourceNodeWhenNeeded(node.name, node);
      }
      function generatePattern(node, options) {
        var result;
        if (node.type === Syntax.Identifier) {
          result = generateIdentifier(node);
        } else {
          result = generateExpression(node, {
            precedence: options.precedence,
            allowIn: options.allowIn,
            allowCall: true
          });
        }
        return result;
      }
      function generateFunctionBody(node) {
        var result, i, len, expr, arrow;
        arrow = node.type === Syntax.ArrowFunctionExpression;
        if (arrow && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
          result = [generateIdentifier(node.params[0])];
        } else {
          result = ['('];
          for (i = 0, len = node.params.length; i < len; ++i) {
            result.push(generatePattern(node.params[i], {
              precedence: Precedence.Assignment,
              allowIn: true
            }));
            if (i + 1 < len) {
              result.push(',' + space);
            }
          }
          result.push(')');
        }
        if (arrow) {
          result.push(space);
          result.push('=>');
        }
        if (node.expression) {
          result.push(space);
          expr = generateExpression(node.body, {
            precedence: Precedence.Assignment,
            allowIn: true,
            allowCall: true
          });
          if (expr.toString().charAt(0) === '{') {
            expr = [
              '(',
              expr,
              ')'
            ];
          }
          result.push(expr);
        } else {
          result.push(maybeBlock(node.body, false, true));
        }
        return result;
      }
      function generateIterationForStatement(operator, stmt, semicolonIsNotNeeded) {
        var result = ['for' + space + '('];
        withIndent(function () {
          if (stmt.left.type === Syntax.VariableDeclaration) {
            withIndent(function () {
              result.push(stmt.left.kind + noEmptySpace());
              result.push(generateStatement(stmt.left.declarations[0], { allowIn: false }));
            });
          } else {
            result.push(generateExpression(stmt.left, {
              precedence: Precedence.Call,
              allowIn: true,
              allowCall: true
            }));
          }
          result = join(result, operator);
          result = [
            join(result, generateExpression(stmt.right, {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: true
            })),
            ')'
          ];
        });
        result.push(maybeBlock(stmt.body, semicolonIsNotNeeded));
        return result;
      }
      function generateExpression(expr, option) {
        var result, precedence, type, currentPrecedence, i, len, raw, fragment, multiline, leftCharCode, leftSource, rightCharCode, allowIn, allowCall, allowUnparenthesizedNew, property, isGenerator;
        precedence = option.precedence;
        allowIn = option.allowIn;
        allowCall = option.allowCall;
        type = expr.type || option.type;
        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
          return generateVerbatim(expr, option);
        }
        switch (type) {
        case Syntax.SequenceExpression:
          result = [];
          allowIn |= Precedence.Sequence < precedence;
          for (i = 0, len = expr.expressions.length; i < len; ++i) {
            result.push(generateExpression(expr.expressions[i], {
              precedence: Precedence.Assignment,
              allowIn: allowIn,
              allowCall: true
            }));
            if (i + 1 < len) {
              result.push(',' + space);
            }
          }
          result = parenthesize(result, Precedence.Sequence, precedence);
          break;
        case Syntax.AssignmentExpression:
          allowIn |= Precedence.Assignment < precedence;
          result = parenthesize([
            generateExpression(expr.left, {
              precedence: Precedence.Call,
              allowIn: allowIn,
              allowCall: true
            }),
            space + expr.operator + space,
            generateExpression(expr.right, {
              precedence: Precedence.Assignment,
              allowIn: allowIn,
              allowCall: true
            })
          ], Precedence.Assignment, precedence);
          break;
        case Syntax.ArrowFunctionExpression:
          allowIn |= Precedence.ArrowFunction < precedence;
          result = parenthesize(generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
          break;
        case Syntax.ConditionalExpression:
          allowIn |= Precedence.Conditional < precedence;
          result = parenthesize([
            generateExpression(expr.test, {
              precedence: Precedence.LogicalOR,
              allowIn: allowIn,
              allowCall: true
            }),
            space + '?' + space,
            generateExpression(expr.consequent, {
              precedence: Precedence.Assignment,
              allowIn: allowIn,
              allowCall: true
            }),
            space + ':' + space,
            generateExpression(expr.alternate, {
              precedence: Precedence.Assignment,
              allowIn: allowIn,
              allowCall: true
            })
          ], Precedence.Conditional, precedence);
          break;
        case Syntax.LogicalExpression:
        case Syntax.BinaryExpression:
          currentPrecedence = BinaryPrecedence[expr.operator];
          allowIn |= currentPrecedence < precedence;
          fragment = generateExpression(expr.left, {
            precedence: currentPrecedence,
            allowIn: allowIn,
            allowCall: true
          });
          leftSource = fragment.toString();
          if (leftSource.charCodeAt(leftSource.length - 1) === 47 && esutils.code.isIdentifierPart(expr.operator.charCodeAt(0))) {
            result = [
              fragment,
              noEmptySpace(),
              expr.operator
            ];
          } else {
            result = join(fragment, expr.operator);
          }
          fragment = generateExpression(expr.right, {
            precedence: currentPrecedence + 1,
            allowIn: allowIn,
            allowCall: true
          });
          if (expr.operator === '/' && fragment.toString().charAt(0) === '/' || expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
            result.push(noEmptySpace());
            result.push(fragment);
          } else {
            result = join(result, fragment);
          }
          if (expr.operator === 'in' && !allowIn) {
            result = [
              '(',
              result,
              ')'
            ];
          } else {
            result = parenthesize(result, currentPrecedence, precedence);
          }
          break;
        case Syntax.CallExpression:
          result = [generateExpression(expr.callee, {
              precedence: Precedence.Call,
              allowIn: true,
              allowCall: true,
              allowUnparenthesizedNew: false
            })];
          result.push('(');
          for (i = 0, len = expr['arguments'].length; i < len; ++i) {
            result.push(generateExpression(expr['arguments'][i], {
              precedence: Precedence.Assignment,
              allowIn: true,
              allowCall: true
            }));
            if (i + 1 < len) {
              result.push(',' + space);
            }
          }
          result.push(')');
          if (!allowCall) {
            result = [
              '(',
              result,
              ')'
            ];
          } else {
            result = parenthesize(result, Precedence.Call, precedence);
          }
          break;
        case Syntax.NewExpression:
          len = expr['arguments'].length;
          allowUnparenthesizedNew = option.allowUnparenthesizedNew === undefined || option.allowUnparenthesizedNew;
          result = join('new', generateExpression(expr.callee, {
            precedence: Precedence.New,
            allowIn: true,
            allowCall: false,
            allowUnparenthesizedNew: allowUnparenthesizedNew && !parentheses && len === 0
          }));
          if (!allowUnparenthesizedNew || parentheses || len > 0) {
            result.push('(');
            for (i = 0; i < len; ++i) {
              result.push(generateExpression(expr['arguments'][i], {
                precedence: Precedence.Assignment,
                allowIn: true,
                allowCall: true
              }));
              if (i + 1 < len) {
                result.push(',' + space);
              }
            }
            result.push(')');
          }
          result = parenthesize(result, Precedence.New, precedence);
          break;
        case Syntax.MemberExpression:
          result = [generateExpression(expr.object, {
              precedence: Precedence.Call,
              allowIn: true,
              allowCall: allowCall,
              allowUnparenthesizedNew: false
            })];
          if (expr.computed) {
            result.push('[');
            result.push(generateExpression(expr.property, {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: allowCall
            }));
            result.push(']');
          } else {
            if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
              fragment = toSourceNodeWhenNeeded(result).toString();
              if (fragment.indexOf('.') < 0 && !/[eExX]/.test(fragment) && esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) && !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)) {
                result.push('.');
              }
            }
            result.push('.');
            result.push(generateIdentifier(expr.property));
          }
          result = parenthesize(result, Precedence.Member, precedence);
          break;
        case Syntax.UnaryExpression:
          fragment = generateExpression(expr.argument, {
            precedence: Precedence.Unary,
            allowIn: true,
            allowCall: true
          });
          if (space === '') {
            result = join(expr.operator, fragment);
          } else {
            result = [expr.operator];
            if (expr.operator.length > 2) {
              result = join(result, fragment);
            } else {
              leftSource = toSourceNodeWhenNeeded(result).toString();
              leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
              rightCharCode = fragment.toString().charCodeAt(0);
              if ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode)) {
                result.push(noEmptySpace());
                result.push(fragment);
              } else {
                result.push(fragment);
              }
            }
          }
          result = parenthesize(result, Precedence.Unary, precedence);
          break;
        case Syntax.YieldExpression:
          if (expr.delegate) {
            result = 'yield*';
          } else {
            result = 'yield';
          }
          if (expr.argument) {
            result = join(result, generateExpression(expr.argument, {
              precedence: Precedence.Yield,
              allowIn: true,
              allowCall: true
            }));
          }
          result = parenthesize(result, Precedence.Yield, precedence);
          break;
        case Syntax.UpdateExpression:
          if (expr.prefix) {
            result = parenthesize([
              expr.operator,
              generateExpression(expr.argument, {
                precedence: Precedence.Unary,
                allowIn: true,
                allowCall: true
              })
            ], Precedence.Unary, precedence);
          } else {
            result = parenthesize([
              generateExpression(expr.argument, {
                precedence: Precedence.Postfix,
                allowIn: true,
                allowCall: true
              }),
              expr.operator
            ], Precedence.Postfix, precedence);
          }
          break;
        case Syntax.FunctionExpression:
          isGenerator = expr.generator && !extra.moz.starlessGenerator;
          result = isGenerator ? 'function*' : 'function';
          if (expr.id) {
            result = [
              result,
              isGenerator ? space : noEmptySpace(),
              generateIdentifier(expr.id),
              generateFunctionBody(expr)
            ];
          } else {
            result = [
              result + space,
              generateFunctionBody(expr)
            ];
          }
          break;
        case Syntax.ArrayPattern:
        case Syntax.ArrayExpression:
          if (!expr.elements.length) {
            result = '[]';
            break;
          }
          multiline = expr.elements.length > 1;
          result = [
            '[',
            multiline ? newline : ''
          ];
          withIndent(function (indent) {
            for (i = 0, len = expr.elements.length; i < len; ++i) {
              if (!expr.elements[i]) {
                if (multiline) {
                  result.push(indent);
                }
                if (i + 1 === len) {
                  result.push(',');
                }
              } else {
                result.push(multiline ? indent : '');
                result.push(generateExpression(expr.elements[i], {
                  precedence: Precedence.Assignment,
                  allowIn: true,
                  allowCall: true
                }));
              }
              if (i + 1 < len) {
                result.push(',' + (multiline ? newline : space));
              }
            }
          });
          if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(multiline ? base : '');
          result.push(']');
          break;
        case Syntax.Property:
          if (expr.kind === 'get' || expr.kind === 'set') {
            result = [
              expr.kind,
              noEmptySpace(),
              generateExpression(expr.key, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }),
              generateFunctionBody(expr.value)
            ];
          } else {
            if (expr.shorthand) {
              result = generateExpression(expr.key, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              });
            } else if (expr.method) {
              result = [];
              if (expr.value.generator) {
                result.push('*');
              }
              result.push(generateExpression(expr.key, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }));
              result.push(generateFunctionBody(expr.value));
            } else {
              result = [
                generateExpression(expr.key, {
                  precedence: Precedence.Sequence,
                  allowIn: true,
                  allowCall: true
                }),
                ':' + space,
                generateExpression(expr.value, {
                  precedence: Precedence.Assignment,
                  allowIn: true,
                  allowCall: true
                })
              ];
            }
          }
          break;
        case Syntax.ObjectExpression:
          if (!expr.properties.length) {
            result = '{}';
            break;
          }
          multiline = expr.properties.length > 1;
          withIndent(function () {
            fragment = generateExpression(expr.properties[0], {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: true,
              type: Syntax.Property
            });
          });
          if (!multiline) {
            if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              result = [
                '{',
                space,
                fragment,
                space,
                '}'
              ];
              break;
            }
          }
          withIndent(function (indent) {
            result = [
              '{',
              newline,
              indent,
              fragment
            ];
            if (multiline) {
              result.push(',' + newline);
              for (i = 1, len = expr.properties.length; i < len; ++i) {
                result.push(indent);
                result.push(generateExpression(expr.properties[i], {
                  precedence: Precedence.Sequence,
                  allowIn: true,
                  allowCall: true,
                  type: Syntax.Property
                }));
                if (i + 1 < len) {
                  result.push(',' + newline);
                }
              }
            }
          });
          if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(base);
          result.push('}');
          break;
        case Syntax.ObjectPattern:
          if (!expr.properties.length) {
            result = '{}';
            break;
          }
          multiline = false;
          if (expr.properties.length === 1) {
            property = expr.properties[0];
            if (property.value.type !== Syntax.Identifier) {
              multiline = true;
            }
          } else {
            for (i = 0, len = expr.properties.length; i < len; ++i) {
              property = expr.properties[i];
              if (!property.shorthand) {
                multiline = true;
                break;
              }
            }
          }
          result = [
            '{',
            multiline ? newline : ''
          ];
          withIndent(function (indent) {
            for (i = 0, len = expr.properties.length; i < len; ++i) {
              result.push(multiline ? indent : '');
              result.push(generateExpression(expr.properties[i], {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }));
              if (i + 1 < len) {
                result.push(',' + (multiline ? newline : space));
              }
            }
          });
          if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(multiline ? base : '');
          result.push('}');
          break;
        case Syntax.ThisExpression:
          result = 'this';
          break;
        case Syntax.Identifier:
          result = generateIdentifier(expr);
          break;
        case Syntax.Literal:
          if (expr.hasOwnProperty('raw') && parse) {
            try {
              raw = parse(expr.raw).body[0].expression;
              if (raw.type === Syntax.Literal) {
                if (raw.value === expr.value) {
                  result = expr.raw;
                  break;
                }
              }
            } catch (e) {
            }
          }
          if (expr.value === null) {
            result = 'null';
            break;
          }
          if (typeof expr.value === 'string') {
            result = escapeString(expr.value);
            break;
          }
          if (typeof expr.value === 'number') {
            result = generateNumber(expr.value);
            break;
          }
          if (typeof expr.value === 'boolean') {
            result = expr.value ? 'true' : 'false';
            break;
          }
          result = generateRegExp(expr.value);
          break;
        case Syntax.GeneratorExpression:
        case Syntax.ComprehensionExpression:
          result = type === Syntax.GeneratorExpression ? ['('] : ['['];
          if (extra.moz.comprehensionExpressionStartsWithAssignment) {
            fragment = generateExpression(expr.body, {
              precedence: Precedence.Assignment,
              allowIn: true,
              allowCall: true
            });
            result.push(fragment);
          }
          if (expr.blocks) {
            withIndent(function () {
              for (i = 0, len = expr.blocks.length; i < len; ++i) {
                fragment = generateExpression(expr.blocks[i], {
                  precedence: Precedence.Sequence,
                  allowIn: true,
                  allowCall: true
                });
                if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                  result = join(result, fragment);
                } else {
                  result.push(fragment);
                }
              }
            });
          }
          if (expr.filter) {
            result = join(result, 'if' + space);
            fragment = generateExpression(expr.filter, {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: true
            });
            if (extra.moz.parenthesizedComprehensionBlock) {
              result = join(result, [
                '(',
                fragment,
                ')'
              ]);
            } else {
              result = join(result, fragment);
            }
          }
          if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
            fragment = generateExpression(expr.body, {
              precedence: Precedence.Assignment,
              allowIn: true,
              allowCall: true
            });
            result = join(result, fragment);
          }
          result.push(type === Syntax.GeneratorExpression ? ')' : ']');
          break;
        case Syntax.ComprehensionBlock:
          if (expr.left.type === Syntax.VariableDeclaration) {
            fragment = [
              expr.left.kind,
              noEmptySpace(),
              generateStatement(expr.left.declarations[0], { allowIn: false })
            ];
          } else {
            fragment = generateExpression(expr.left, {
              precedence: Precedence.Call,
              allowIn: true,
              allowCall: true
            });
          }
          fragment = join(fragment, expr.of ? 'of' : 'in');
          fragment = join(fragment, generateExpression(expr.right, {
            precedence: Precedence.Sequence,
            allowIn: true,
            allowCall: true
          }));
          if (extra.moz.parenthesizedComprehensionBlock) {
            result = [
              'for' + space + '(',
              fragment,
              ')'
            ];
          } else {
            result = join('for' + space, fragment);
          }
          break;
        default:
          throw new Error('Unknown expression type: ' + expr.type);
        }
        return toSourceNodeWhenNeeded(result, expr);
      }
      function generateStatement(stmt, option) {
        var i, len, result, node, allowIn, functionBody, directiveContext, fragment, semicolon, isGenerator;
        allowIn = true;
        semicolon = ';';
        functionBody = false;
        directiveContext = false;
        if (option) {
          allowIn = option.allowIn === undefined || option.allowIn;
          if (!semicolons && option.semicolonOptional === true) {
            semicolon = '';
          }
          functionBody = option.functionBody;
          directiveContext = option.directiveContext;
        }
        switch (stmt.type) {
        case Syntax.BlockStatement:
          result = [
            '{',
            newline
          ];
          withIndent(function () {
            for (i = 0, len = stmt.body.length; i < len; ++i) {
              fragment = addIndent(generateStatement(stmt.body[i], {
                semicolonOptional: i === len - 1,
                directiveContext: functionBody
              }));
              result.push(fragment);
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                result.push(newline);
              }
            }
          });
          result.push(addIndent('}'));
          break;
        case Syntax.BreakStatement:
          if (stmt.label) {
            result = 'break ' + stmt.label.name + semicolon;
          } else {
            result = 'break' + semicolon;
          }
          break;
        case Syntax.ContinueStatement:
          if (stmt.label) {
            result = 'continue ' + stmt.label.name + semicolon;
          } else {
            result = 'continue' + semicolon;
          }
          break;
        case Syntax.DirectiveStatement:
          if (stmt.raw) {
            result = stmt.raw + semicolon;
          } else {
            result = escapeDirective(stmt.directive) + semicolon;
          }
          break;
        case Syntax.DoWhileStatement:
          result = join('do', maybeBlock(stmt.body));
          result = maybeBlockSuffix(stmt.body, result);
          result = join(result, [
            'while' + space + '(',
            generateExpression(stmt.test, {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: true
            }),
            ')' + semicolon
          ]);
          break;
        case Syntax.CatchClause:
          withIndent(function () {
            var guard;
            result = [
              'catch' + space + '(',
              generateExpression(stmt.param, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }),
              ')'
            ];
            if (stmt.guard) {
              guard = generateExpression(stmt.guard, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              });
              result.splice(2, 0, ' if ', guard);
            }
          });
          result.push(maybeBlock(stmt.body));
          break;
        case Syntax.DebuggerStatement:
          result = 'debugger' + semicolon;
          break;
        case Syntax.EmptyStatement:
          result = ';';
          break;
        case Syntax.ExportDeclaration:
          result = 'export ';
          if (stmt.declaration) {
            result = [
              result,
              generateStatement(stmt.declaration, { semicolonOptional: semicolon === '' })
            ];
            break;
          }
          break;
        case Syntax.ExpressionStatement:
          result = [generateExpression(stmt.expression, {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: true
            })];
          fragment = toSourceNodeWhenNeeded(result).toString();
          if (fragment.charAt(0) === '{' || fragment.slice(0, 8) === 'function' && '* ('.indexOf(fragment.charAt(8)) >= 0 || directive && directiveContext && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string') {
            result = [
              '(',
              result,
              ')' + semicolon
            ];
          } else {
            result.push(semicolon);
          }
          break;
        case Syntax.VariableDeclarator:
          if (stmt.init) {
            result = [
              generateExpression(stmt.id, {
                precedence: Precedence.Assignment,
                allowIn: allowIn,
                allowCall: true
              }),
              space,
              '=',
              space,
              generateExpression(stmt.init, {
                precedence: Precedence.Assignment,
                allowIn: allowIn,
                allowCall: true
              })
            ];
          } else {
            result = generatePattern(stmt.id, {
              precedence: Precedence.Assignment,
              allowIn: allowIn
            });
          }
          break;
        case Syntax.VariableDeclaration:
          result = [stmt.kind];
          if (stmt.declarations.length === 1 && stmt.declarations[0].init && stmt.declarations[0].init.type === Syntax.FunctionExpression) {
            result.push(noEmptySpace());
            result.push(generateStatement(stmt.declarations[0], { allowIn: allowIn }));
          } else {
            withIndent(function () {
              node = stmt.declarations[0];
              if (extra.comment && node.leadingComments) {
                result.push('\n');
                result.push(addIndent(generateStatement(node, { allowIn: allowIn })));
              } else {
                result.push(noEmptySpace());
                result.push(generateStatement(node, { allowIn: allowIn }));
              }
              for (i = 1, len = stmt.declarations.length; i < len; ++i) {
                node = stmt.declarations[i];
                if (extra.comment && node.leadingComments) {
                  result.push(',' + newline);
                  result.push(addIndent(generateStatement(node, { allowIn: allowIn })));
                } else {
                  result.push(',' + space);
                  result.push(generateStatement(node, { allowIn: allowIn }));
                }
              }
            });
          }
          result.push(semicolon);
          break;
        case Syntax.ThrowStatement:
          result = [
            join('throw', generateExpression(stmt.argument, {
              precedence: Precedence.Sequence,
              allowIn: true,
              allowCall: true
            })),
            semicolon
          ];
          break;
        case Syntax.TryStatement:
          result = [
            'try',
            maybeBlock(stmt.block)
          ];
          result = maybeBlockSuffix(stmt.block, result);
          if (stmt.handlers) {
            for (i = 0, len = stmt.handlers.length; i < len; ++i) {
              result = join(result, generateStatement(stmt.handlers[i]));
              if (stmt.finalizer || i + 1 !== len) {
                result = maybeBlockSuffix(stmt.handlers[i].body, result);
              }
            }
          } else {
            stmt.guardedHandlers = stmt.guardedHandlers || [];
            for (i = 0, len = stmt.guardedHandlers.length; i < len; ++i) {
              result = join(result, generateStatement(stmt.guardedHandlers[i]));
              if (stmt.finalizer || i + 1 !== len) {
                result = maybeBlockSuffix(stmt.guardedHandlers[i].body, result);
              }
            }
            if (stmt.handler) {
              if (isArray(stmt.handler)) {
                for (i = 0, len = stmt.handler.length; i < len; ++i) {
                  result = join(result, generateStatement(stmt.handler[i]));
                  if (stmt.finalizer || i + 1 !== len) {
                    result = maybeBlockSuffix(stmt.handler[i].body, result);
                  }
                }
              } else {
                result = join(result, generateStatement(stmt.handler));
                if (stmt.finalizer) {
                  result = maybeBlockSuffix(stmt.handler.body, result);
                }
              }
            }
          }
          if (stmt.finalizer) {
            result = join(result, [
              'finally',
              maybeBlock(stmt.finalizer)
            ]);
          }
          break;
        case Syntax.SwitchStatement:
          withIndent(function () {
            result = [
              'switch' + space + '(',
              generateExpression(stmt.discriminant, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }),
              ')' + space + '{' + newline
            ];
          });
          if (stmt.cases) {
            for (i = 0, len = stmt.cases.length; i < len; ++i) {
              fragment = addIndent(generateStatement(stmt.cases[i], { semicolonOptional: i === len - 1 }));
              result.push(fragment);
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                result.push(newline);
              }
            }
          }
          result.push(addIndent('}'));
          break;
        case Syntax.SwitchCase:
          withIndent(function () {
            if (stmt.test) {
              result = [
                join('case', generateExpression(stmt.test, {
                  precedence: Precedence.Sequence,
                  allowIn: true,
                  allowCall: true
                })),
                ':'
              ];
            } else {
              result = ['default:'];
            }
            i = 0;
            len = stmt.consequent.length;
            if (len && stmt.consequent[0].type === Syntax.BlockStatement) {
              fragment = maybeBlock(stmt.consequent[0]);
              result.push(fragment);
              i = 1;
            }
            if (i !== len && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
              result.push(newline);
            }
            for (; i < len; ++i) {
              fragment = addIndent(generateStatement(stmt.consequent[i], { semicolonOptional: i === len - 1 && semicolon === '' }));
              result.push(fragment);
              if (i + 1 !== len && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                result.push(newline);
              }
            }
          });
          break;
        case Syntax.IfStatement:
          withIndent(function () {
            result = [
              'if' + space + '(',
              generateExpression(stmt.test, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }),
              ')'
            ];
          });
          if (stmt.alternate) {
            result.push(maybeBlock(stmt.consequent));
            result = maybeBlockSuffix(stmt.consequent, result);
            if (stmt.alternate.type === Syntax.IfStatement) {
              result = join(result, [
                'else ',
                generateStatement(stmt.alternate, { semicolonOptional: semicolon === '' })
              ]);
            } else {
              result = join(result, join('else', maybeBlock(stmt.alternate, semicolon === '')));
            }
          } else {
            result.push(maybeBlock(stmt.consequent, semicolon === ''));
          }
          break;
        case Syntax.ForStatement:
          withIndent(function () {
            result = ['for' + space + '('];
            if (stmt.init) {
              if (stmt.init.type === Syntax.VariableDeclaration) {
                result.push(generateStatement(stmt.init, { allowIn: false }));
              } else {
                result.push(generateExpression(stmt.init, {
                  precedence: Precedence.Sequence,
                  allowIn: false,
                  allowCall: true
                }));
                result.push(';');
              }
            } else {
              result.push(';');
            }
            if (stmt.test) {
              result.push(space);
              result.push(generateExpression(stmt.test, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }));
              result.push(';');
            } else {
              result.push(';');
            }
            if (stmt.update) {
              result.push(space);
              result.push(generateExpression(stmt.update, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }));
              result.push(')');
            } else {
              result.push(')');
            }
          });
          result.push(maybeBlock(stmt.body, semicolon === ''));
          break;
        case Syntax.ForInStatement:
          result = generateIterationForStatement('in', stmt, semicolon === '');
          break;
        case Syntax.ForOfStatement:
          result = generateIterationForStatement('of', stmt, semicolon === '');
          break;
        case Syntax.LabeledStatement:
          result = [
            stmt.label.name + ':',
            maybeBlock(stmt.body, semicolon === '')
          ];
          break;
        case Syntax.Program:
          len = stmt.body.length;
          result = [safeConcatenation && len > 0 ? '\n' : ''];
          for (i = 0; i < len; ++i) {
            fragment = addIndent(generateStatement(stmt.body[i], {
              semicolonOptional: !safeConcatenation && i === len - 1,
              directiveContext: true
            }));
            result.push(fragment);
            if (i + 1 < len && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              result.push(newline);
            }
          }
          break;
        case Syntax.FunctionDeclaration:
          isGenerator = stmt.generator && !extra.moz.starlessGenerator;
          result = [
            isGenerator ? 'function*' : 'function',
            isGenerator ? space : noEmptySpace(),
            generateIdentifier(stmt.id),
            generateFunctionBody(stmt)
          ];
          break;
        case Syntax.ReturnStatement:
          if (stmt.argument) {
            result = [
              join('return', generateExpression(stmt.argument, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              })),
              semicolon
            ];
          } else {
            result = ['return' + semicolon];
          }
          break;
        case Syntax.WhileStatement:
          withIndent(function () {
            result = [
              'while' + space + '(',
              generateExpression(stmt.test, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }),
              ')'
            ];
          });
          result.push(maybeBlock(stmt.body, semicolon === ''));
          break;
        case Syntax.WithStatement:
          withIndent(function () {
            result = [
              'with' + space + '(',
              generateExpression(stmt.object, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
              }),
              ')'
            ];
          });
          result.push(maybeBlock(stmt.body, semicolon === ''));
          break;
        default:
          throw new Error('Unknown statement type: ' + stmt.type);
        }
        if (extra.comment) {
          result = addCommentsToStatement(stmt, result);
        }
        fragment = toSourceNodeWhenNeeded(result).toString();
        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' && fragment.charAt(fragment.length - 1) === '\n') {
          result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
        }
        return toSourceNodeWhenNeeded(result, stmt);
      }
      function generate(node, options) {
        var defaultOptions = getDefaultOptions(), result, pair;
        if (options != null) {
          if (typeof options.indent === 'string') {
            defaultOptions.format.indent.style = options.indent;
          }
          if (typeof options.base === 'number') {
            defaultOptions.format.indent.base = options.base;
          }
          options = updateDeeply(defaultOptions, options);
          indent = options.format.indent.style;
          if (typeof options.base === 'string') {
            base = options.base;
          } else {
            base = stringRepeat(indent, options.format.indent.base);
          }
        } else {
          options = defaultOptions;
          indent = options.format.indent.style;
          base = stringRepeat(indent, options.format.indent.base);
        }
        json = options.format.json;
        renumber = options.format.renumber;
        hexadecimal = json ? false : options.format.hexadecimal;
        quotes = json ? 'double' : options.format.quotes;
        escapeless = options.format.escapeless;
        newline = options.format.newline;
        space = options.format.space;
        if (options.format.compact) {
          newline = space = indent = base = '';
        }
        parentheses = options.format.parentheses;
        semicolons = options.format.semicolons;
        safeConcatenation = options.format.safeConcatenation;
        directive = options.directive;
        parse = json ? null : options.parse;
        sourceMap = options.sourceMap;
        extra = options;
        if (sourceMap) {
          if (!exports.browser) {
            SourceNode = require('source-map').SourceNode;
          } else {
            SourceNode = global.sourceMap.SourceNode;
          }
        }
        switch (node.type) {
        case Syntax.BlockStatement:
        case Syntax.BreakStatement:
        case Syntax.CatchClause:
        case Syntax.ContinueStatement:
        case Syntax.DirectiveStatement:
        case Syntax.DoWhileStatement:
        case Syntax.DebuggerStatement:
        case Syntax.EmptyStatement:
        case Syntax.ExpressionStatement:
        case Syntax.ForStatement:
        case Syntax.ForInStatement:
        case Syntax.ForOfStatement:
        case Syntax.FunctionDeclaration:
        case Syntax.IfStatement:
        case Syntax.LabeledStatement:
        case Syntax.Program:
        case Syntax.ReturnStatement:
        case Syntax.SwitchStatement:
        case Syntax.SwitchCase:
        case Syntax.ThrowStatement:
        case Syntax.TryStatement:
        case Syntax.VariableDeclaration:
        case Syntax.VariableDeclarator:
        case Syntax.WhileStatement:
        case Syntax.WithStatement:
          result = generateStatement(node);
          break;
        case Syntax.AssignmentExpression:
        case Syntax.ArrayExpression:
        case Syntax.ArrayPattern:
        case Syntax.BinaryExpression:
        case Syntax.CallExpression:
        case Syntax.ConditionalExpression:
        case Syntax.FunctionExpression:
        case Syntax.Identifier:
        case Syntax.Literal:
        case Syntax.LogicalExpression:
        case Syntax.MemberExpression:
        case Syntax.NewExpression:
        case Syntax.ObjectExpression:
        case Syntax.ObjectPattern:
        case Syntax.Property:
        case Syntax.SequenceExpression:
        case Syntax.ThisExpression:
        case Syntax.UnaryExpression:
        case Syntax.UpdateExpression:
        case Syntax.YieldExpression:
          result = generateExpression(node, {
            precedence: Precedence.Sequence,
            allowIn: true,
            allowCall: true
          });
          break;
        default:
          throw new Error('Unknown node type: ' + node.type);
        }
        if (!sourceMap) {
          return result.toString();
        }
        pair = result.toStringWithSourceMap({
          file: options.file,
          sourceRoot: options.sourceMapRoot
        });
        if (options.sourceContent) {
          pair.map.setSourceContent(options.sourceMap, options.sourceContent);
        }
        if (options.sourceMapWithCode) {
          return pair;
        }
        return pair.map.toString();
      }
      FORMAT_MINIFY = {
        indent: {
          style: '',
          base: 0
        },
        renumber: true,
        hexadecimal: true,
        quotes: 'auto',
        escapeless: true,
        compact: true,
        parentheses: false,
        semicolons: false
      };
      FORMAT_DEFAULTS = getDefaultOptions().format;
      exports.version = require('escodegen/package.json').version;
      exports.generate = generate;
      exports.attachComments = estraverse.attachComments;
      exports.browser = false;
      exports.FORMAT_MINIFY = FORMAT_MINIFY;
      exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
    }());
}, {"__filename":"escodegen.js","__dirname":"node_modules/escodegen"}], 
'transform/get-deps': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), through = require('through2'), walk = require('acorn/util/walk'), path = require('path'), Module = require('re-define-module'), generate = require('escodegen').generate;
    module.exports = function (config, writer) {
      return through.obj(function (file, enc, next) {
        if (!file.isAST() || file.stopProcessing) {
          this.push(file);
          next();
          return;
        }
        var deps = [];
        walk.simple(file.contents, {
          CallExpression: function (node) {
            var callee = node.callee;
            if (callee && callee.name === 'require') {
              var args = node.arguments;
              if (!args)
                return;
              if (args.length === 1 && args[0].type === 'Literal') {
                var req = args[0].value;
                if (config.map && config.map[req])
                  req = config.map[req];
                var dep = Module({
                    base: file.base,
                    requiredAs: req
                  });
                var _filename = hasExt(req) ? req : req + '.js', _path = path.resolve(path.dirname(file.path), _filename), _rel = path.relative(file.base, _path);
                dep.path = _path;
                dep.name = _rel;
                dep.base = file.base;
                args[0].value = dep.name;
                dep.revert = function () {
                  args[0].value = req;
                  dep.path = dep.name = req;
                };
                dep.update = function (name) {
                  args[0].value = name;
                  dep.name = name;
                };
                deps.push(dep);
              } else {
                JSON.parse(config.showWarnings) && console.log('//warning: re-define rewrite only static require calls', file, file.path, generate(node));
              }
            }
          }
        });
        function hasExt(val) {
          return !!path.extname(val);
        }
        _.each(deps, function (d) {
          writer.write(d);
        });
        file.dependencies = deps;
        this.push(file);
        next();
      });
    };
}, {"__filename":"get-deps.js","__dirname":"lib/transform"}], 
'acorn': [function(exports, require, module, __filename, __dirname) { 
    (function (root, mod) {
      if (typeof exports == 'object' && typeof module == 'object')
        return mod(exports);
      if (typeof define == 'function' && define.amd)
        return define(['exports'], mod);
      mod(root.acorn || (root.acorn = {}));
    }(this, function (exports) {
      'use strict';
      exports.version = '0.6.0';
      var options, input, inputLen, sourceFile;
      exports.parse = function (inpt, opts) {
        input = String(inpt);
        inputLen = input.length;
        setOptions(opts);
        initTokenState();
        return parseTopLevel(options.program);
      };
      var defaultOptions = exports.defaultOptions = {
          ecmaVersion: 5,
          strictSemicolons: false,
          allowTrailingCommas: true,
          forbidReserved: false,
          allowReturnOutsideFunction: false,
          locations: false,
          onComment: null,
          ranges: false,
          program: null,
          sourceFile: null,
          directSourceFile: null
        };
      function setOptions(opts) {
        options = opts || {};
        for (var opt in defaultOptions)
          if (!Object.prototype.hasOwnProperty.call(options, opt))
            options[opt] = defaultOptions[opt];
        sourceFile = options.sourceFile || null;
        isKeyword = options.ecmaVersion >= 6 ? isEcma6Keyword : isEcma5AndLessKeyword;
      }
      var getLineInfo = exports.getLineInfo = function (input, offset) {
          for (var line = 1, cur = 0;;) {
            lineBreak.lastIndex = cur;
            var match = lineBreak.exec(input);
            if (match && match.index < offset) {
              ++line;
              cur = match.index + match[0].length;
            } else
              break;
          }
          return {
            line: line,
            column: offset - cur
          };
        };
      exports.tokenize = function (inpt, opts) {
        input = String(inpt);
        inputLen = input.length;
        setOptions(opts);
        initTokenState();
        var t = {};
        function getToken(forceRegexp) {
          lastEnd = tokEnd;
          readToken(forceRegexp);
          t.start = tokStart;
          t.end = tokEnd;
          t.startLoc = tokStartLoc;
          t.endLoc = tokEndLoc;
          t.type = tokType;
          t.value = tokVal;
          return t;
        }
        getToken.jumpTo = function (pos, reAllowed) {
          tokPos = pos;
          if (options.locations) {
            tokCurLine = 1;
            tokLineStart = lineBreak.lastIndex = 0;
            var match;
            while ((match = lineBreak.exec(input)) && match.index < pos) {
              ++tokCurLine;
              tokLineStart = match.index + match[0].length;
            }
          }
          tokRegexpAllowed = reAllowed;
          skipSpace();
        };
        return getToken;
      };
      var tokPos;
      var tokStart, tokEnd;
      var tokStartLoc, tokEndLoc;
      var tokType, tokVal;
      var tokRegexpAllowed;
      var tokCurLine, tokLineStart;
      var lastStart, lastEnd, lastEndLoc;
      var inFunction, labels, strict;
      function raise(pos, message) {
        var loc = getLineInfo(input, pos);
        message += ' (' + loc.line + ':' + loc.column + ')';
        var err = new SyntaxError(message);
        err.pos = pos;
        err.loc = loc;
        err.raisedAt = tokPos;
        throw err;
      }
      var empty = [];
      var _num = { type: 'num' }, _regexp = { type: 'regexp' }, _string = { type: 'string' };
      var _name = { type: 'name' }, _eof = { type: 'eof' };
      var _break = { keyword: 'break' }, _case = {
          keyword: 'case',
          beforeExpr: true
        }, _catch = { keyword: 'catch' };
      var _continue = { keyword: 'continue' }, _debugger = { keyword: 'debugger' }, _default = { keyword: 'default' };
      var _do = {
          keyword: 'do',
          isLoop: true
        }, _else = {
          keyword: 'else',
          beforeExpr: true
        };
      var _finally = { keyword: 'finally' }, _for = {
          keyword: 'for',
          isLoop: true
        }, _function = { keyword: 'function' };
      var _if = { keyword: 'if' }, _return = {
          keyword: 'return',
          beforeExpr: true
        }, _switch = { keyword: 'switch' };
      var _throw = {
          keyword: 'throw',
          beforeExpr: true
        }, _try = { keyword: 'try' }, _var = { keyword: 'var' };
      var _let = { keyword: 'let' }, _const = { keyword: 'const' };
      var _while = {
          keyword: 'while',
          isLoop: true
        }, _with = { keyword: 'with' }, _new = {
          keyword: 'new',
          beforeExpr: true
        };
      var _this = { keyword: 'this' };
      var _null = {
          keyword: 'null',
          atomValue: null
        }, _true = {
          keyword: 'true',
          atomValue: true
        };
      var _false = {
          keyword: 'false',
          atomValue: false
        };
      var _in = {
          keyword: 'in',
          binop: 7,
          beforeExpr: true
        };
      var keywordTypes = {
          'break': _break,
          'case': _case,
          'catch': _catch,
          'continue': _continue,
          'debugger': _debugger,
          'default': _default,
          'do': _do,
          'else': _else,
          'finally': _finally,
          'for': _for,
          'function': _function,
          'if': _if,
          'return': _return,
          'switch': _switch,
          'throw': _throw,
          'try': _try,
          'var': _var,
          'let': _let,
          'const': _const,
          'while': _while,
          'with': _with,
          'null': _null,
          'true': _true,
          'false': _false,
          'new': _new,
          'in': _in,
          'instanceof': {
            keyword: 'instanceof',
            binop: 7,
            beforeExpr: true
          },
          'this': _this,
          'typeof': {
            keyword: 'typeof',
            prefix: true,
            beforeExpr: true
          },
          'void': {
            keyword: 'void',
            prefix: true,
            beforeExpr: true
          },
          'delete': {
            keyword: 'delete',
            prefix: true,
            beforeExpr: true
          }
        };
      var _bracketL = {
          type: '[',
          beforeExpr: true
        }, _bracketR = { type: ']' }, _braceL = {
          type: '{',
          beforeExpr: true
        };
      var _braceR = { type: '}' }, _parenL = {
          type: '(',
          beforeExpr: true
        }, _parenR = { type: ')' };
      var _comma = {
          type: ',',
          beforeExpr: true
        }, _semi = {
          type: ';',
          beforeExpr: true
        };
      var _colon = {
          type: ':',
          beforeExpr: true
        }, _dot = { type: '.' }, _ellipsis = { type: '...' }, _question = {
          type: '?',
          beforeExpr: true
        };
      var _slash = {
          binop: 10,
          beforeExpr: true
        }, _eq = {
          isAssign: true,
          beforeExpr: true
        };
      var _assign = {
          isAssign: true,
          beforeExpr: true
        };
      var _incDec = {
          postfix: true,
          prefix: true,
          isUpdate: true
        }, _prefix = {
          prefix: true,
          beforeExpr: true
        };
      var _logicalOR = {
          binop: 1,
          beforeExpr: true
        };
      var _logicalAND = {
          binop: 2,
          beforeExpr: true
        };
      var _bitwiseOR = {
          binop: 3,
          beforeExpr: true
        };
      var _bitwiseXOR = {
          binop: 4,
          beforeExpr: true
        };
      var _bitwiseAND = {
          binop: 5,
          beforeExpr: true
        };
      var _equality = {
          binop: 6,
          beforeExpr: true
        };
      var _relational = {
          binop: 7,
          beforeExpr: true
        };
      var _bitShift = {
          binop: 8,
          beforeExpr: true
        };
      var _plusMin = {
          binop: 9,
          prefix: true,
          beforeExpr: true
        };
      var _multiplyModulo = {
          binop: 10,
          beforeExpr: true
        };
      exports.tokTypes = {
        bracketL: _bracketL,
        bracketR: _bracketR,
        braceL: _braceL,
        braceR: _braceR,
        parenL: _parenL,
        parenR: _parenR,
        comma: _comma,
        semi: _semi,
        colon: _colon,
        dot: _dot,
        ellipsis: _ellipsis,
        question: _question,
        slash: _slash,
        eq: _eq,
        name: _name,
        eof: _eof,
        num: _num,
        regexp: _regexp,
        string: _string
      };
      for (var kw in keywordTypes)
        exports.tokTypes['_' + kw] = keywordTypes[kw];
      function makePredicate(words) {
        words = words.split(' ');
        var f = '', cats = [];
        out:
          for (var i = 0; i < words.length; ++i) {
            for (var j = 0; j < cats.length; ++j)
              if (cats[j][0].length == words[i].length) {
                cats[j].push(words[i]);
                continue out;
              }
            cats.push([words[i]]);
          }
        function compareTo(arr) {
          if (arr.length == 1)
            return f += 'return str === ' + JSON.stringify(arr[0]) + ';';
          f += 'switch(str){';
          for (var i = 0; i < arr.length; ++i)
            f += 'case ' + JSON.stringify(arr[i]) + ':';
          f += 'return true}return false;';
        }
        if (cats.length > 3) {
          cats.sort(function (a, b) {
            return b.length - a.length;
          });
          f += 'switch(str.length){';
          for (var i = 0; i < cats.length; ++i) {
            var cat = cats[i];
            f += 'case ' + cat[0].length + ':';
            compareTo(cat);
          }
          f += '}';
        } else {
          compareTo(words);
        }
        return new Function('str', f);
      }
      var isReservedWord3 = makePredicate('abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile');
      var isReservedWord5 = makePredicate('class enum extends super const export import');
      var isStrictReservedWord = makePredicate('implements interface let package private protected public static yield');
      var isStrictBadIdWord = makePredicate('eval arguments');
      var ecma5AndLessKeywords = 'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this';
      var isEcma5AndLessKeyword = makePredicate(ecma5AndLessKeywords);
      var isEcma6Keyword = makePredicate(ecma5AndLessKeywords + ' let const');
      var isKeyword = isEcma5AndLessKeyword;
      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      var nonASCIIidentifierStartChars = '\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
      var nonASCIIidentifierChars = '\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u0620-\u0649\u0672-\u06D3\u06E7-\u06E8\u06FB-\u06FC\u0730-\u074A\u0800-\u0814\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0840-\u0857\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09D7\u09DF-\u09E0\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5F-\u0B60\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D46-\u0D48\u0D57\u0D62-\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E34-\u0E3A\u0E40-\u0E45\u0E50-\u0E59\u0EB4-\u0EB9\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F41-\u0F47\u0F71-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1029\u1040-\u1049\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u170E-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17B2\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1920-\u192B\u1930-\u193B\u1951-\u196D\u19B0-\u19C0\u19C8-\u19C9\u19D0-\u19D9\u1A00-\u1A15\u1A20-\u1A53\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1B46-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C00-\u1C22\u1C40-\u1C49\u1C5B-\u1C7D\u1CD0-\u1CD2\u1D00-\u1DBE\u1E01-\u1F15\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2D81-\u2D96\u2DE0-\u2DFF\u3021-\u3028\u3099\u309A\uA640-\uA66D\uA674-\uA67D\uA69F\uA6F0-\uA6F1\uA7F8-\uA800\uA806\uA80B\uA823-\uA827\uA880-\uA881\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8F3-\uA8F7\uA900-\uA909\uA926-\uA92D\uA930-\uA945\uA980-\uA983\uA9B3-\uA9C0\uAA00-\uAA27\uAA40-\uAA41\uAA4C-\uAA4D\uAA50-\uAA59\uAA7B\uAAE0-\uAAE9\uAAF2-\uAAF3\uABC0-\uABE1\uABEC\uABED\uABF0-\uABF9\uFB20-\uFB28\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F';
      var nonASCIIidentifierStart = new RegExp('[' + nonASCIIidentifierStartChars + ']');
      var nonASCIIidentifier = new RegExp('[' + nonASCIIidentifierStartChars + nonASCIIidentifierChars + ']');
      var newline = /[\n\r\u2028\u2029]/;
      var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;
      var isIdentifierStart = exports.isIdentifierStart = function (code) {
          if (code < 65)
            return code === 36;
          if (code < 91)
            return true;
          if (code < 97)
            return code === 95;
          if (code < 123)
            return true;
          return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
        };
      var isIdentifierChar = exports.isIdentifierChar = function (code) {
          if (code < 48)
            return code === 36;
          if (code < 58)
            return true;
          if (code < 65)
            return false;
          if (code < 91)
            return true;
          if (code < 97)
            return code === 95;
          if (code < 123)
            return true;
          return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
        };
      function Position() {
        this.line = tokCurLine;
        this.column = tokPos - tokLineStart;
      }
      function initTokenState() {
        tokCurLine = 1;
        tokPos = tokLineStart = 0;
        tokRegexpAllowed = true;
        skipSpace();
      }
      function finishToken(type, val) {
        tokEnd = tokPos;
        if (options.locations)
          tokEndLoc = new Position();
        tokType = type;
        skipSpace();
        tokVal = val;
        tokRegexpAllowed = type.beforeExpr;
      }
      function skipBlockComment() {
        var startLoc = options.onComment && options.locations && new Position();
        var start = tokPos, end = input.indexOf('*/', tokPos += 2);
        if (end === -1)
          raise(tokPos - 2, 'Unterminated comment');
        tokPos = end + 2;
        if (options.locations) {
          lineBreak.lastIndex = start;
          var match;
          while ((match = lineBreak.exec(input)) && match.index < tokPos) {
            ++tokCurLine;
            tokLineStart = match.index + match[0].length;
          }
        }
        if (options.onComment)
          options.onComment(true, input.slice(start + 2, end), start, tokPos, startLoc, options.locations && new Position());
      }
      function skipLineComment() {
        var start = tokPos;
        var startLoc = options.onComment && options.locations && new Position();
        var ch = input.charCodeAt(tokPos += 2);
        while (tokPos < inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
          ++tokPos;
          ch = input.charCodeAt(tokPos);
        }
        if (options.onComment)
          options.onComment(false, input.slice(start + 2, tokPos), start, tokPos, startLoc, options.locations && new Position());
      }
      function skipSpace() {
        while (tokPos < inputLen) {
          var ch = input.charCodeAt(tokPos);
          if (ch === 32) {
            ++tokPos;
          } else if (ch === 13) {
            ++tokPos;
            var next = input.charCodeAt(tokPos);
            if (next === 10) {
              ++tokPos;
            }
            if (options.locations) {
              ++tokCurLine;
              tokLineStart = tokPos;
            }
          } else if (ch === 10 || ch === 8232 || ch === 8233) {
            ++tokPos;
            if (options.locations) {
              ++tokCurLine;
              tokLineStart = tokPos;
            }
          } else if (ch > 8 && ch < 14) {
            ++tokPos;
          } else if (ch === 47) {
            var next = input.charCodeAt(tokPos + 1);
            if (next === 42) {
              skipBlockComment();
            } else if (next === 47) {
              skipLineComment();
            } else
              break;
          } else if (ch === 160) {
            ++tokPos;
          } else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
            ++tokPos;
          } else {
            break;
          }
        }
      }
      function readToken_dot() {
        var next = input.charCodeAt(tokPos + 1);
        if (next >= 48 && next <= 57)
          return readNumber(true);
        var next2 = input.charCodeAt(tokPos + 2);
        if (options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
          tokPos += 3;
          return finishToken(_ellipsis);
        } else {
          ++tokPos;
          return finishToken(_dot);
        }
      }
      function readToken_slash() {
        var next = input.charCodeAt(tokPos + 1);
        if (tokRegexpAllowed) {
          ++tokPos;
          return readRegexp();
        }
        if (next === 61)
          return finishOp(_assign, 2);
        return finishOp(_slash, 1);
      }
      function readToken_mult_modulo() {
        var next = input.charCodeAt(tokPos + 1);
        if (next === 61)
          return finishOp(_assign, 2);
        return finishOp(_multiplyModulo, 1);
      }
      function readToken_pipe_amp(code) {
        var next = input.charCodeAt(tokPos + 1);
        if (next === code)
          return finishOp(code === 124 ? _logicalOR : _logicalAND, 2);
        if (next === 61)
          return finishOp(_assign, 2);
        return finishOp(code === 124 ? _bitwiseOR : _bitwiseAND, 1);
      }
      function readToken_caret() {
        var next = input.charCodeAt(tokPos + 1);
        if (next === 61)
          return finishOp(_assign, 2);
        return finishOp(_bitwiseXOR, 1);
      }
      function readToken_plus_min(code) {
        var next = input.charCodeAt(tokPos + 1);
        if (next === code) {
          if (next == 45 && input.charCodeAt(tokPos + 2) == 62 && newline.test(input.slice(lastEnd, tokPos))) {
            tokPos += 3;
            skipLineComment();
            skipSpace();
            return readToken();
          }
          return finishOp(_incDec, 2);
        }
        if (next === 61)
          return finishOp(_assign, 2);
        return finishOp(_plusMin, 1);
      }
      function readToken_lt_gt(code) {
        var next = input.charCodeAt(tokPos + 1);
        var size = 1;
        if (next === code) {
          size = code === 62 && input.charCodeAt(tokPos + 2) === 62 ? 3 : 2;
          if (input.charCodeAt(tokPos + size) === 61)
            return finishOp(_assign, size + 1);
          return finishOp(_bitShift, size);
        }
        if (next == 33 && code == 60 && input.charCodeAt(tokPos + 2) == 45 && input.charCodeAt(tokPos + 3) == 45) {
          tokPos += 4;
          skipLineComment();
          skipSpace();
          return readToken();
        }
        if (next === 61)
          size = input.charCodeAt(tokPos + 2) === 61 ? 3 : 2;
        return finishOp(_relational, size);
      }
      function readToken_eq_excl(code) {
        var next = input.charCodeAt(tokPos + 1);
        if (next === 61)
          return finishOp(_equality, input.charCodeAt(tokPos + 2) === 61 ? 3 : 2);
        return finishOp(code === 61 ? _eq : _prefix, 1);
      }
      function getTokenFromCode(code) {
        switch (code) {
        case 46:
          return readToken_dot();
        case 40:
          ++tokPos;
          return finishToken(_parenL);
        case 41:
          ++tokPos;
          return finishToken(_parenR);
        case 59:
          ++tokPos;
          return finishToken(_semi);
        case 44:
          ++tokPos;
          return finishToken(_comma);
        case 91:
          ++tokPos;
          return finishToken(_bracketL);
        case 93:
          ++tokPos;
          return finishToken(_bracketR);
        case 123:
          ++tokPos;
          return finishToken(_braceL);
        case 125:
          ++tokPos;
          return finishToken(_braceR);
        case 58:
          ++tokPos;
          return finishToken(_colon);
        case 63:
          ++tokPos;
          return finishToken(_question);
        case 48:
          var next = input.charCodeAt(tokPos + 1);
          if (next === 120 || next === 88)
            return readHexNumber();
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          return readNumber(false);
        case 34:
        case 39:
          return readString(code);
        case 47:
          return readToken_slash();
        case 37:
        case 42:
          return readToken_mult_modulo();
        case 124:
        case 38:
          return readToken_pipe_amp(code);
        case 94:
          return readToken_caret();
        case 43:
        case 45:
          return readToken_plus_min(code);
        case 60:
        case 62:
          return readToken_lt_gt(code);
        case 61:
        case 33:
          return readToken_eq_excl(code);
        case 126:
          return finishOp(_prefix, 1);
        }
        return false;
      }
      function readToken(forceRegexp) {
        if (!forceRegexp)
          tokStart = tokPos;
        else
          tokPos = tokStart + 1;
        if (options.locations)
          tokStartLoc = new Position();
        if (forceRegexp)
          return readRegexp();
        if (tokPos >= inputLen)
          return finishToken(_eof);
        var code = input.charCodeAt(tokPos);
        if (isIdentifierStart(code) || code === 92)
          return readWord();
        var tok = getTokenFromCode(code);
        if (tok === false) {
          var ch = String.fromCharCode(code);
          if (ch === '\\' || nonASCIIidentifierStart.test(ch))
            return readWord();
          raise(tokPos, 'Unexpected character \'' + ch + '\'');
        }
        return tok;
      }
      function finishOp(type, size) {
        var str = input.slice(tokPos, tokPos + size);
        tokPos += size;
        finishToken(type, str);
      }
      function readRegexp() {
        var content = '', escaped, inClass, start = tokPos;
        for (;;) {
          if (tokPos >= inputLen)
            raise(start, 'Unterminated regular expression');
          var ch = input.charAt(tokPos);
          if (newline.test(ch))
            raise(start, 'Unterminated regular expression');
          if (!escaped) {
            if (ch === '[')
              inClass = true;
            else if (ch === ']' && inClass)
              inClass = false;
            else if (ch === '/' && !inClass)
              break;
            escaped = ch === '\\';
          } else
            escaped = false;
          ++tokPos;
        }
        var content = input.slice(start, tokPos);
        ++tokPos;
        var mods = readWord1();
        if (mods && !/^[gmsiy]*$/.test(mods))
          raise(start, 'Invalid regular expression flag');
        try {
          var value = new RegExp(content, mods);
        } catch (e) {
          if (e instanceof SyntaxError)
            raise(start, 'Error parsing regular expression: ' + e.message);
          raise(e);
        }
        return finishToken(_regexp, value);
      }
      function readInt(radix, len) {
        var start = tokPos, total = 0;
        for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
          var code = input.charCodeAt(tokPos), val;
          if (code >= 97)
            val = code - 97 + 10;
          else if (code >= 65)
            val = code - 65 + 10;
          else if (code >= 48 && code <= 57)
            val = code - 48;
          else
            val = Infinity;
          if (val >= radix)
            break;
          ++tokPos;
          total = total * radix + val;
        }
        if (tokPos === start || len != null && tokPos - start !== len)
          return null;
        return total;
      }
      function readHexNumber() {
        tokPos += 2;
        var val = readInt(16);
        if (val == null)
          raise(tokStart + 2, 'Expected hexadecimal number');
        if (isIdentifierStart(input.charCodeAt(tokPos)))
          raise(tokPos, 'Identifier directly after number');
        return finishToken(_num, val);
      }
      function readNumber(startsWithDot) {
        var start = tokPos, isFloat = false, octal = input.charCodeAt(tokPos) === 48;
        if (!startsWithDot && readInt(10) === null)
          raise(start, 'Invalid number');
        if (input.charCodeAt(tokPos) === 46) {
          ++tokPos;
          readInt(10);
          isFloat = true;
        }
        var next = input.charCodeAt(tokPos);
        if (next === 69 || next === 101) {
          next = input.charCodeAt(++tokPos);
          if (next === 43 || next === 45)
            ++tokPos;
          if (readInt(10) === null)
            raise(start, 'Invalid number');
          isFloat = true;
        }
        if (isIdentifierStart(input.charCodeAt(tokPos)))
          raise(tokPos, 'Identifier directly after number');
        var str = input.slice(start, tokPos), val;
        if (isFloat)
          val = parseFloat(str);
        else if (!octal || str.length === 1)
          val = parseInt(str, 10);
        else if (/[89]/.test(str) || strict)
          raise(start, 'Invalid number');
        else
          val = parseInt(str, 8);
        return finishToken(_num, val);
      }
      function readString(quote) {
        tokPos++;
        var out = '';
        for (;;) {
          if (tokPos >= inputLen)
            raise(tokStart, 'Unterminated string constant');
          var ch = input.charCodeAt(tokPos);
          if (ch === quote) {
            ++tokPos;
            return finishToken(_string, out);
          }
          if (ch === 92) {
            ch = input.charCodeAt(++tokPos);
            var octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
            if (octal)
              octal = octal[0];
            while (octal && parseInt(octal, 8) > 255)
              octal = octal.slice(0, -1);
            if (octal === '0')
              octal = null;
            ++tokPos;
            if (octal) {
              if (strict)
                raise(tokPos - 2, 'Octal literal in strict mode');
              out += String.fromCharCode(parseInt(octal, 8));
              tokPos += octal.length - 1;
            } else {
              switch (ch) {
              case 110:
                out += '\n';
                break;
              case 114:
                out += '\r';
                break;
              case 120:
                out += String.fromCharCode(readHexChar(2));
                break;
              case 117:
                out += String.fromCharCode(readHexChar(4));
                break;
              case 85:
                out += String.fromCharCode(readHexChar(8));
                break;
              case 116:
                out += '\t';
                break;
              case 98:
                out += '\b';
                break;
              case 118:
                out += '\x0B';
                break;
              case 102:
                out += '\f';
                break;
              case 48:
                out += '\0';
                break;
              case 13:
                if (input.charCodeAt(tokPos) === 10)
                  ++tokPos;
              case 10:
                if (options.locations) {
                  tokLineStart = tokPos;
                  ++tokCurLine;
                }
                break;
              default:
                out += String.fromCharCode(ch);
                break;
              }
            }
          } else {
            if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233)
              raise(tokStart, 'Unterminated string constant');
            out += String.fromCharCode(ch);
            ++tokPos;
          }
        }
      }
      function readHexChar(len) {
        var n = readInt(16, len);
        if (n === null)
          raise(tokStart, 'Bad character escape sequence');
        return n;
      }
      var containsEsc;
      function readWord1() {
        containsEsc = false;
        var word, first = true, start = tokPos;
        for (;;) {
          var ch = input.charCodeAt(tokPos);
          if (isIdentifierChar(ch)) {
            if (containsEsc)
              word += input.charAt(tokPos);
            ++tokPos;
          } else if (ch === 92) {
            if (!containsEsc)
              word = input.slice(start, tokPos);
            containsEsc = true;
            if (input.charCodeAt(++tokPos) != 117)
              raise(tokPos, 'Expecting Unicode escape sequence \\uXXXX');
            ++tokPos;
            var esc = readHexChar(4);
            var escStr = String.fromCharCode(esc);
            if (!escStr)
              raise(tokPos - 1, 'Invalid Unicode escape');
            if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc)))
              raise(tokPos - 4, 'Invalid Unicode escape');
            word += escStr;
          } else {
            break;
          }
          first = false;
        }
        return containsEsc ? word : input.slice(start, tokPos);
      }
      function readWord() {
        var word = readWord1();
        var type = _name;
        if (!containsEsc && isKeyword(word))
          type = keywordTypes[word];
        return finishToken(type, word);
      }
      function next() {
        lastStart = tokStart;
        lastEnd = tokEnd;
        lastEndLoc = tokEndLoc;
        readToken();
      }
      function setStrict(strct) {
        strict = strct;
        tokPos = tokStart;
        if (options.locations) {
          while (tokPos < tokLineStart) {
            tokLineStart = input.lastIndexOf('\n', tokLineStart - 2) + 1;
            --tokCurLine;
          }
        }
        skipSpace();
        readToken();
      }
      function Node() {
        this.type = null;
        this.start = tokStart;
        this.end = null;
      }
      exports.Node = Node;
      function SourceLocation() {
        this.start = tokStartLoc;
        this.end = null;
        if (sourceFile !== null)
          this.source = sourceFile;
      }
      function startNode() {
        var node = new Node();
        if (options.locations)
          node.loc = new SourceLocation();
        if (options.directSourceFile)
          node.sourceFile = options.directSourceFile;
        if (options.ranges)
          node.range = [
            tokStart,
            0
          ];
        return node;
      }
      function startNodeFrom(other) {
        var node = new Node();
        node.start = other.start;
        if (options.locations) {
          node.loc = new SourceLocation();
          node.loc.start = other.loc.start;
        }
        if (options.ranges)
          node.range = [
            other.range[0],
            0
          ];
        return node;
      }
      function finishNode(node, type) {
        node.type = type;
        node.end = lastEnd;
        if (options.locations)
          node.loc.end = lastEndLoc;
        if (options.ranges)
          node.range[1] = lastEnd;
        return node;
      }
      function isUseStrict(stmt) {
        return options.ecmaVersion >= 5 && stmt.type === 'ExpressionStatement' && stmt.expression.type === 'Literal' && stmt.expression.value === 'use strict';
      }
      function eat(type) {
        if (tokType === type) {
          next();
          return true;
        }
      }
      function canInsertSemicolon() {
        return !options.strictSemicolons && (tokType === _eof || tokType === _braceR || newline.test(input.slice(lastEnd, tokStart)));
      }
      function semicolon() {
        if (!eat(_semi) && !canInsertSemicolon())
          unexpected();
      }
      function expect(type) {
        if (tokType === type)
          next();
        else
          unexpected();
      }
      function unexpected() {
        raise(tokStart, 'Unexpected token');
      }
      function checkLVal(expr) {
        if (expr.type !== 'Identifier' && expr.type !== 'MemberExpression')
          raise(expr.start, 'Assigning to rvalue');
        if (strict && expr.type === 'Identifier' && isStrictBadIdWord(expr.name))
          raise(expr.start, 'Assigning to ' + expr.name + ' in strict mode');
      }
      function parseTopLevel(program) {
        lastStart = lastEnd = tokPos;
        if (options.locations)
          lastEndLoc = new Position();
        inFunction = strict = null;
        labels = [];
        readToken();
        var node = program || startNode(), first = true;
        if (!program)
          node.body = [];
        while (tokType !== _eof) {
          var stmt = parseStatement();
          node.body.push(stmt);
          if (first && isUseStrict(stmt))
            setStrict(true);
          first = false;
        }
        return finishNode(node, 'Program');
      }
      var loopLabel = { kind: 'loop' }, switchLabel = { kind: 'switch' };
      function parseStatement() {
        if (tokType === _slash || tokType === _assign && tokVal == '/=')
          readToken(true);
        var starttype = tokType, node = startNode();
        switch (starttype) {
        case _break:
        case _continue:
          return parseBreakContinueStatement(node, starttype.keyword);
        case _debugger:
          return parseDebuggerStatement(node);
        case _do:
          return parseDoStatement(node);
        case _for:
          return parseForStatement(node);
        case _function:
          return parseFunctionStatement(node);
        case _if:
          return parseIfStatement(node);
        case _return:
          return parseReturnStatement(node);
        case _switch:
          return parseSwitchStatement(node);
        case _throw:
          return parseThrowStatement(node);
        case _try:
          return parseTryStatement(node);
        case _var:
        case _let:
        case _const:
          return parseVarStatement(node, starttype.keyword);
        case _while:
          return parseWhileStatement(node);
        case _with:
          return parseWithStatement(node);
        case _braceL:
          return parseBlock();
        case _semi:
          return parseEmptyStatement(node);
        default:
          var maybeName = tokVal, expr = parseExpression();
          if (starttype === _name && expr.type === 'Identifier' && eat(_colon))
            return parseLabeledStatement(node, maybeName, expr);
          else
            return parseExpressionStatement(node, expr);
        }
      }
      function parseBreakContinueStatement(node, keyword) {
        var isBreak = keyword == 'break';
        next();
        if (eat(_semi) || canInsertSemicolon())
          node.label = null;
        else if (tokType !== _name)
          unexpected();
        else {
          node.label = parseIdent();
          semicolon();
        }
        for (var i = 0; i < labels.length; ++i) {
          var lab = labels[i];
          if (node.label == null || lab.name === node.label.name) {
            if (lab.kind != null && (isBreak || lab.kind === 'loop'))
              break;
            if (node.label && isBreak)
              break;
          }
        }
        if (i === labels.length)
          raise(node.start, 'Unsyntactic ' + keyword);
        return finishNode(node, isBreak ? 'BreakStatement' : 'ContinueStatement');
      }
      function parseDebuggerStatement(node) {
        next();
        semicolon();
        return finishNode(node, 'DebuggerStatement');
      }
      function parseDoStatement(node) {
        next();
        labels.push(loopLabel);
        node.body = parseStatement();
        labels.pop();
        expect(_while);
        node.test = parseParenExpression();
        semicolon();
        return finishNode(node, 'DoWhileStatement');
      }
      function parseForStatement(node) {
        next();
        labels.push(loopLabel);
        expect(_parenL);
        if (tokType === _semi)
          return parseFor(node, null);
        if (tokType === _var || tokType === _let) {
          var init = startNode(), varKind = tokType.keyword;
          next();
          parseVar(init, true, varKind);
          finishNode(init, 'VariableDeclaration');
          if (init.declarations.length === 1 && eat(_in))
            return parseForIn(node, init);
          return parseFor(node, init);
        }
        var init = parseExpression(false, true);
        if (eat(_in)) {
          checkLVal(init);
          return parseForIn(node, init);
        }
        return parseFor(node, init);
      }
      function parseFunctionStatement(node) {
        next();
        return parseFunction(node, true);
      }
      function parseIfStatement(node) {
        next();
        node.test = parseParenExpression();
        node.consequent = parseStatement();
        node.alternate = eat(_else) ? parseStatement() : null;
        return finishNode(node, 'IfStatement');
      }
      function parseReturnStatement(node) {
        if (!inFunction && !options.allowReturnOutsideFunction)
          raise(tokStart, '\'return\' outside of function');
        next();
        if (eat(_semi) || canInsertSemicolon())
          node.argument = null;
        else {
          node.argument = parseExpression();
          semicolon();
        }
        return finishNode(node, 'ReturnStatement');
      }
      function parseSwitchStatement(node) {
        next();
        node.discriminant = parseParenExpression();
        node.cases = [];
        expect(_braceL);
        labels.push(switchLabel);
        for (var cur, sawDefault; tokType != _braceR;) {
          if (tokType === _case || tokType === _default) {
            var isCase = tokType === _case;
            if (cur)
              finishNode(cur, 'SwitchCase');
            node.cases.push(cur = startNode());
            cur.consequent = [];
            next();
            if (isCase)
              cur.test = parseExpression();
            else {
              if (sawDefault)
                raise(lastStart, 'Multiple default clauses');
              sawDefault = true;
              cur.test = null;
            }
            expect(_colon);
          } else {
            if (!cur)
              unexpected();
            cur.consequent.push(parseStatement());
          }
        }
        if (cur)
          finishNode(cur, 'SwitchCase');
        next();
        labels.pop();
        return finishNode(node, 'SwitchStatement');
      }
      function parseThrowStatement(node) {
        next();
        if (newline.test(input.slice(lastEnd, tokStart)))
          raise(lastEnd, 'Illegal newline after throw');
        node.argument = parseExpression();
        semicolon();
        return finishNode(node, 'ThrowStatement');
        next();
        if (newline.test(input.slice(lastEnd, tokStart)))
          raise(lastEnd, 'Illegal newline after throw');
        node.argument = parseExpression();
        semicolon();
        return finishNode(node, 'ThrowStatement');
      }
      function parseTryStatement(node) {
        next();
        node.block = parseBlock();
        node.handler = null;
        if (tokType === _catch) {
          var clause = startNode();
          next();
          expect(_parenL);
          clause.param = parseIdent();
          if (strict && isStrictBadIdWord(clause.param.name))
            raise(clause.param.start, 'Binding ' + clause.param.name + ' in strict mode');
          expect(_parenR);
          clause.guard = null;
          clause.body = parseBlock();
          node.handler = finishNode(clause, 'CatchClause');
        }
        node.guardedHandlers = empty;
        node.finalizer = eat(_finally) ? parseBlock() : null;
        if (!node.handler && !node.finalizer)
          raise(node.start, 'Missing catch or finally clause');
        return finishNode(node, 'TryStatement');
      }
      function parseVarStatement(node, kind) {
        next();
        parseVar(node, false, kind);
        semicolon();
        return finishNode(node, 'VariableDeclaration');
      }
      function parseWhileStatement(node) {
        next();
        node.test = parseParenExpression();
        labels.push(loopLabel);
        node.body = parseStatement();
        labels.pop();
        return finishNode(node, 'WhileStatement');
      }
      function parseWithStatement(node) {
        if (strict)
          raise(tokStart, '\'with\' in strict mode');
        next();
        node.object = parseParenExpression();
        node.body = parseStatement();
        return finishNode(node, 'WithStatement');
      }
      function parseEmptyStatement(node) {
        next();
        return finishNode(node, 'EmptyStatement');
      }
      function parseLabeledStatement(node, maybeName, expr) {
        for (var i = 0; i < labels.length; ++i)
          if (labels[i].name === maybeName)
            raise(expr.start, 'Label \'' + maybeName + '\' is already declared');
        var kind = tokType.isLoop ? 'loop' : tokType === _switch ? 'switch' : null;
        labels.push({
          name: maybeName,
          kind: kind
        });
        node.body = parseStatement();
        labels.pop();
        node.label = expr;
        return finishNode(node, 'LabeledStatement');
      }
      function parseExpressionStatement(node, expr) {
        node.expression = expr;
        semicolon();
        return finishNode(node, 'ExpressionStatement');
      }
      function parseParenExpression() {
        expect(_parenL);
        var val = parseExpression();
        expect(_parenR);
        return val;
      }
      function parseBlock(allowStrict) {
        var node = startNode(), first = true, strict = false, oldStrict;
        node.body = [];
        expect(_braceL);
        while (!eat(_braceR)) {
          var stmt = parseStatement();
          node.body.push(stmt);
          if (first && allowStrict && isUseStrict(stmt)) {
            oldStrict = strict;
            setStrict(strict = true);
          }
          first = false;
        }
        if (strict && !oldStrict)
          setStrict(false);
        return finishNode(node, 'BlockStatement');
      }
      function parseFor(node, init) {
        node.init = init;
        expect(_semi);
        node.test = tokType === _semi ? null : parseExpression();
        expect(_semi);
        node.update = tokType === _parenR ? null : parseExpression();
        expect(_parenR);
        node.body = parseStatement();
        labels.pop();
        return finishNode(node, 'ForStatement');
      }
      function parseForIn(node, init) {
        node.left = init;
        node.right = parseExpression();
        expect(_parenR);
        node.body = parseStatement();
        labels.pop();
        return finishNode(node, 'ForInStatement');
      }
      function parseVar(node, noIn, kind) {
        node.declarations = [];
        node.kind = kind;
        for (;;) {
          var decl = startNode();
          decl.id = parseIdent();
          if (strict && isStrictBadIdWord(decl.id.name))
            raise(decl.id.start, 'Binding ' + decl.id.name + ' in strict mode');
          decl.init = eat(_eq) ? parseExpression(true, noIn) : kind === _const.keyword ? unexpected() : null;
          node.declarations.push(finishNode(decl, 'VariableDeclarator'));
          if (!eat(_comma))
            break;
        }
        return node;
      }
      function parseExpression(noComma, noIn) {
        var expr = parseMaybeAssign(noIn);
        if (!noComma && tokType === _comma) {
          var node = startNodeFrom(expr);
          node.expressions = [expr];
          while (eat(_comma))
            node.expressions.push(parseMaybeAssign(noIn));
          return finishNode(node, 'SequenceExpression');
        }
        return expr;
      }
      function parseMaybeAssign(noIn) {
        var left = parseMaybeConditional(noIn);
        if (tokType.isAssign) {
          var node = startNodeFrom(left);
          node.operator = tokVal;
          node.left = left;
          next();
          node.right = parseMaybeAssign(noIn);
          checkLVal(left);
          return finishNode(node, 'AssignmentExpression');
        }
        return left;
      }
      function parseMaybeConditional(noIn) {
        var expr = parseExprOps(noIn);
        if (eat(_question)) {
          var node = startNodeFrom(expr);
          node.test = expr;
          node.consequent = parseExpression(true);
          expect(_colon);
          node.alternate = parseExpression(true, noIn);
          return finishNode(node, 'ConditionalExpression');
        }
        return expr;
      }
      function parseExprOps(noIn) {
        return parseExprOp(parseMaybeUnary(), -1, noIn);
      }
      function parseExprOp(left, minPrec, noIn) {
        var prec = tokType.binop;
        if (prec != null && (!noIn || tokType !== _in)) {
          if (prec > minPrec) {
            var node = startNodeFrom(left);
            node.left = left;
            node.operator = tokVal;
            var op = tokType;
            next();
            node.right = parseExprOp(parseMaybeUnary(), prec, noIn);
            var exprNode = finishNode(node, op === _logicalOR || op === _logicalAND ? 'LogicalExpression' : 'BinaryExpression');
            return parseExprOp(exprNode, minPrec, noIn);
          }
        }
        return left;
      }
      function parseMaybeUnary() {
        if (tokType.prefix) {
          var node = startNode(), update = tokType.isUpdate;
          node.operator = tokVal;
          node.prefix = true;
          tokRegexpAllowed = true;
          next();
          node.argument = parseMaybeUnary();
          if (update)
            checkLVal(node.argument);
          else if (strict && node.operator === 'delete' && node.argument.type === 'Identifier')
            raise(node.start, 'Deleting local variable in strict mode');
          return finishNode(node, update ? 'UpdateExpression' : 'UnaryExpression');
        }
        var expr = parseExprSubscripts();
        while (tokType.postfix && !canInsertSemicolon()) {
          var node = startNodeFrom(expr);
          node.operator = tokVal;
          node.prefix = false;
          node.argument = expr;
          checkLVal(expr);
          next();
          expr = finishNode(node, 'UpdateExpression');
        }
        return expr;
      }
      function parseExprSubscripts() {
        return parseSubscripts(parseExprAtom());
      }
      function parseSubscripts(base, noCalls) {
        if (eat(_dot)) {
          var node = startNodeFrom(base);
          node.object = base;
          node.property = parseIdent(true);
          node.computed = false;
          return parseSubscripts(finishNode(node, 'MemberExpression'), noCalls);
        } else if (eat(_bracketL)) {
          var node = startNodeFrom(base);
          node.object = base;
          node.property = parseExpression();
          node.computed = true;
          expect(_bracketR);
          return parseSubscripts(finishNode(node, 'MemberExpression'), noCalls);
        } else if (!noCalls && eat(_parenL)) {
          var node = startNodeFrom(base);
          node.callee = base;
          node.arguments = parseExprList(_parenR, false);
          return parseSubscripts(finishNode(node, 'CallExpression'), noCalls);
        } else
          return base;
      }
      function parseExprAtom() {
        switch (tokType) {
        case _this:
          var node = startNode();
          next();
          return finishNode(node, 'ThisExpression');
        case _name:
          return parseIdent();
        case _num:
        case _string:
        case _regexp:
          var node = startNode();
          node.value = tokVal;
          node.raw = input.slice(tokStart, tokEnd);
          next();
          return finishNode(node, 'Literal');
        case _null:
        case _true:
        case _false:
          var node = startNode();
          node.value = tokType.atomValue;
          node.raw = tokType.keyword;
          next();
          return finishNode(node, 'Literal');
        case _parenL:
          var tokStartLoc1 = tokStartLoc, tokStart1 = tokStart;
          next();
          var val = parseExpression();
          val.start = tokStart1;
          val.end = tokEnd;
          if (options.locations) {
            val.loc.start = tokStartLoc1;
            val.loc.end = tokEndLoc;
          }
          if (options.ranges)
            val.range = [
              tokStart1,
              tokEnd
            ];
          expect(_parenR);
          return val;
        case _bracketL:
          var node = startNode();
          next();
          node.elements = parseExprList(_bracketR, true, true);
          return finishNode(node, 'ArrayExpression');
        case _braceL:
          return parseObj();
        case _function:
          var node = startNode();
          next();
          return parseFunction(node, false);
        case _new:
          return parseNew();
        default:
          unexpected();
        }
      }
      function parseNew() {
        var node = startNode();
        next();
        node.callee = parseSubscripts(parseExprAtom(), true);
        if (eat(_parenL))
          node.arguments = parseExprList(_parenR, false);
        else
          node.arguments = empty;
        return finishNode(node, 'NewExpression');
      }
      function parseObj() {
        var node = startNode(), first = true, sawGetSet = false;
        node.properties = [];
        next();
        while (!eat(_braceR)) {
          if (!first) {
            expect(_comma);
            if (options.allowTrailingCommas && eat(_braceR))
              break;
          } else
            first = false;
          var prop = { key: parsePropertyName() }, isGetSet = false, kind;
          if (eat(_colon)) {
            prop.value = parseExpression(true);
            kind = prop.kind = 'init';
          } else if (options.ecmaVersion >= 5 && prop.key.type === 'Identifier' && (prop.key.name === 'get' || prop.key.name === 'set')) {
            isGetSet = sawGetSet = true;
            kind = prop.kind = prop.key.name;
            prop.key = parsePropertyName();
            if (tokType !== _parenL)
              unexpected();
            prop.value = parseFunction(startNode(), false);
          } else
            unexpected();
          if (prop.key.type === 'Identifier' && (strict || sawGetSet)) {
            for (var i = 0; i < node.properties.length; ++i) {
              var other = node.properties[i];
              if (other.key.name === prop.key.name) {
                var conflict = kind == other.kind || isGetSet && other.kind === 'init' || kind === 'init' && (other.kind === 'get' || other.kind === 'set');
                if (conflict && !strict && kind === 'init' && other.kind === 'init')
                  conflict = false;
                if (conflict)
                  raise(prop.key.start, 'Redefinition of property');
              }
            }
          }
          node.properties.push(prop);
        }
        return finishNode(node, 'ObjectExpression');
      }
      function parsePropertyName() {
        if (tokType === _num || tokType === _string)
          return parseExprAtom();
        return parseIdent(true);
      }
      function parseFunction(node, isStatement) {
        if (tokType === _name)
          node.id = parseIdent();
        else if (isStatement)
          unexpected();
        else
          node.id = null;
        node.params = [];
        node.rest = null;
        expect(_parenL);
        for (;;) {
          if (eat(_parenR)) {
            break;
          } else if (options.ecmaVersion >= 6 && eat(_ellipsis)) {
            node.rest = parseIdent();
            expect(_parenR);
            break;
          } else {
            node.params.push(parseIdent());
            if (!eat(_comma)) {
              expect(_parenR);
              break;
            }
          }
        }
        var oldInFunc = inFunction, oldLabels = labels;
        inFunction = true;
        labels = [];
        node.body = parseBlock(true);
        inFunction = oldInFunc;
        labels = oldLabels;
        if (strict || node.body.body.length && isUseStrict(node.body.body[0])) {
          for (var i = -2, id; i < node.params.length; ++i) {
            if (i >= 0) {
              id = node.params[i];
            } else if (i == -2) {
              if (node.rest)
                id = node.rest;
              else
                continue;
            } else {
              if (node.id)
                id = node.id;
              else
                continue;
            }
            if (isStrictReservedWord(id.name) || isStrictBadIdWord(id.name))
              raise(id.start, 'Defining \'' + id.name + '\' in strict mode');
            if (i >= 0)
              for (var j = 0; j < i; ++j)
                if (id.name === node.params[j].name)
                  raise(id.start, 'Argument name clash in strict mode');
          }
        }
        return finishNode(node, isStatement ? 'FunctionDeclaration' : 'FunctionExpression');
      }
      function parseExprList(close, allowTrailingComma, allowEmpty) {
        var elts = [], first = true;
        while (!eat(close)) {
          if (!first) {
            expect(_comma);
            if (allowTrailingComma && options.allowTrailingCommas && eat(close))
              break;
          } else
            first = false;
          if (allowEmpty && tokType === _comma)
            elts.push(null);
          else
            elts.push(parseExpression(true));
        }
        return elts;
      }
      function parseIdent(liberal) {
        var node = startNode();
        if (liberal && options.forbidReserved == 'everywhere')
          liberal = false;
        if (tokType === _name) {
          if (!liberal && (options.forbidReserved && (options.ecmaVersion === 3 ? isReservedWord3 : isReservedWord5)(tokVal) || strict && isStrictReservedWord(tokVal)) && input.slice(tokStart, tokEnd).indexOf('\\') == -1)
            raise(tokStart, 'The keyword \'' + tokVal + '\' is reserved');
          node.name = tokVal;
        } else if (liberal && tokType.keyword) {
          node.name = tokType.keyword;
        } else {
          unexpected();
        }
        tokRegexpAllowed = false;
        next();
        return finishNode(node, 'Identifier');
      }
    }));
}, {"__filename":"acorn.js","__dirname":"node_modules/acorn"}], 
'transform/get-ast': [function(exports, require, module, __filename, __dirname) { 
    var acorn = require('acorn'), through = require('through2'), debug = require('debug')('re-define:transform:get-ast');
    module.exports = function (config) {
      return through.obj(function (file, enc, next) {
        if (file.isNull() || file.stopProcessing) {
          this.push(file);
          next();
          return;
        }
        debug('parsing file', file.path);
        var ast;
        try {
          ast = acorn.parse(file.contents);
        } catch (e) {
          file.stopProcessing = true;
          debug('Unable to parse', file, e);
        } finally {
          ast && (file.contents = ast);
        }
        this.push(file);
        next();
      });
    };
}, {"__filename":"get-ast.js","__dirname":"lib/transform"}], 
'ast-types/lib/types': [function(exports, require, module, __filename, __dirname) { 
    var assert = require('assert');
    var Ap = Array.prototype;
    var slice = Ap.slice;
    var map = Ap.map;
    var each = Ap.forEach;
    var Op = Object.prototype;
    var objToStr = Op.toString;
    var funObjStr = objToStr.call(function () {
      });
    var strObjStr = objToStr.call('');
    var hasOwn = Op.hasOwnProperty;
    function Type(check, name) {
      var self = this;
      assert.ok(self instanceof Type, self);
      assert.strictEqual(objToStr.call(check), funObjStr, check + ' is not a function');
      var nameObjStr = objToStr.call(name);
      assert.ok(nameObjStr === funObjStr || nameObjStr === strObjStr, name + ' is neither a function nor a string');
      Object.defineProperties(self, {
        name: { value: name },
        check: {
          value: function (value, deep) {
            var result = check.call(self, value, deep);
            if (!result && deep && objToStr.call(deep) === funObjStr)
              deep(self, value);
            return result;
          }
        }
      });
    }
    var Tp = Type.prototype;
    exports.Type = Type;
    Tp.assert = function (value, deep) {
      if (!this.check(value, deep)) {
        var str = shallowStringify(value);
        assert.ok(false, str + ' does not match type ' + this);
        return false;
      }
      return true;
    };
    function shallowStringify(value) {
      if (isObject.check(value))
        return '{' + Object.keys(value).map(function (key) {
          return key + ': ' + value[key];
        }).join(', ') + '}';
      if (isArray.check(value))
        return '[' + value.map(shallowStringify).join(', ') + ']';
      return JSON.stringify(value);
    }
    Tp.toString = function () {
      var name = this.name;
      if (isString.check(name))
        return name;
      if (isFunction.check(name))
        return name.call(this) + '';
      return name + ' type';
    };
    var builtInTypes = {};
    exports.builtInTypes = builtInTypes;
    function defBuiltInType(example, name) {
      var objStr = objToStr.call(example);
      Object.defineProperty(builtInTypes, name, {
        enumerable: true,
        value: new Type(function (value) {
          return objToStr.call(value) === objStr;
        }, name)
      });
      return builtInTypes[name];
    }
    var isString = defBuiltInType('', 'string');
    var isFunction = defBuiltInType(function () {
      }, 'function');
    var isArray = defBuiltInType([], 'array');
    var isObject = defBuiltInType({}, 'object');
    var isRegExp = defBuiltInType(/./, 'RegExp');
    var isDate = defBuiltInType(new Date(), 'Date');
    var isNumber = defBuiltInType(3, 'number');
    var isBoolean = defBuiltInType(true, 'boolean');
    var isNull = defBuiltInType(null, 'null');
    var isUndefined = defBuiltInType(void 0, 'undefined');
    function toType(from, name) {
      if (from instanceof Type)
        return from;
      if (from instanceof Def)
        return from.type;
      if (isArray.check(from))
        return Type.fromArray(from);
      if (isObject.check(from))
        return Type.fromObject(from);
      if (isFunction.check(from))
        return new Type(from, name);
      return new Type(function (value) {
        return value === from;
      }, isUndefined.check(name) ? function () {
        return from + '';
      } : name);
    }
    Type.or = function () {
      var types = [];
      var len = arguments.length;
      for (var i = 0; i < len; ++i)
        types.push(toType(arguments[i]));
      return new Type(function (value, deep) {
        for (var i = 0; i < len; ++i)
          if (types[i].check(value, deep))
            return true;
        return false;
      }, function () {
        return types.join(' | ');
      });
    };
    Type.fromArray = function (arr) {
      assert.ok(isArray.check(arr));
      assert.strictEqual(arr.length, 1, 'only one element type is permitted for typed arrays');
      return toType(arr[0]).arrayOf();
    };
    Tp.arrayOf = function () {
      var elemType = this;
      return new Type(function (value, deep) {
        return isArray.check(value) && value.every(function (elem) {
          return elemType.check(elem, deep);
        });
      }, function () {
        return '[' + elemType + ']';
      });
    };
    Type.fromObject = function (obj) {
      var fields = Object.keys(obj).map(function (name) {
          return new Field(name, obj[name]);
        });
      return new Type(function (value, deep) {
        return isObject.check(value) && fields.every(function (field) {
          return field.type.check(value[field.name], deep);
        });
      }, function () {
        return '{ ' + fields.join(', ') + ' }';
      });
    };
    function Field(name, type, defaultFn, hidden) {
      var self = this;
      assert.ok(self instanceof Field);
      isString.assert(name);
      type = toType(type);
      var properties = {
          name: { value: name },
          type: { value: type },
          hidden: { value: !!hidden }
        };
      if (isFunction.check(defaultFn)) {
        properties.defaultFn = { value: defaultFn };
      }
      Object.defineProperties(self, properties);
    }
    var Fp = Field.prototype;
    Fp.toString = function () {
      return JSON.stringify(this.name) + ': ' + this.type;
    };
    Fp.getValue = function (obj) {
      var value = obj[this.name];
      if (!isUndefined.check(value))
        return value;
      if (this.defaultFn)
        value = this.defaultFn.call(obj);
      return value;
    };
    Type.def = function (typeName) {
      isString.assert(typeName);
      return hasOwn.call(defCache, typeName) ? defCache[typeName] : defCache[typeName] = new Def(typeName);
    };
    var defCache = {};
    function Def(typeName) {
      var self = this;
      assert.ok(self instanceof Def);
      Object.defineProperties(self, {
        typeName: { value: typeName },
        baseNames: { value: [] },
        ownFields: { value: {} },
        allSupertypes: { value: {} },
        supertypeList: { value: [] },
        allFields: { value: {} },
        fieldNames: { value: [] },
        type: {
          value: new Type(function (value, deep) {
            return self.check(value, deep);
          }, typeName)
        }
      });
    }
    Def.fromValue = function (value) {
      if (value && typeof value === 'object') {
        var type = value.type;
        if (typeof type === 'string' && hasOwn.call(defCache, type)) {
          var d = defCache[type];
          if (d.finalized) {
            return d;
          }
        }
      }
      return null;
    };
    var Dp = Def.prototype;
    Dp.isSupertypeOf = function (that) {
      if (that instanceof Def) {
        assert.strictEqual(this.finalized, true);
        assert.strictEqual(that.finalized, true);
        return hasOwn.call(that.allSupertypes, this.typeName);
      } else {
        assert.ok(false, that + ' is not a Def');
      }
    };
    exports.computeSupertypeLookupTable = function (candidates) {
      var table = {};
      for (var typeName in defCache) {
        if (hasOwn.call(defCache, typeName)) {
          var d = defCache[typeName];
          assert.strictEqual(d.finalized, true);
          for (var i = 0; i < d.supertypeList.length; ++i) {
            var superTypeName = d.supertypeList[i];
            if (hasOwn.call(candidates, superTypeName)) {
              table[typeName] = superTypeName;
              break;
            }
          }
        }
      }
      return table;
    };
    Dp.checkAllFields = function (value, deep) {
      var allFields = this.allFields;
      assert.strictEqual(this.finalized, true);
      function checkFieldByName(name) {
        var field = allFields[name];
        var type = field.type;
        var child = field.getValue(value);
        return type.check(child, deep);
      }
      return isObject.check(value) && Object.keys(allFields).every(checkFieldByName);
    };
    Dp.check = function (value, deep) {
      assert.strictEqual(this.finalized, true, 'prematurely checking unfinalized type ' + this.typeName);
      if (!isObject.check(value))
        return false;
      var vDef = Def.fromValue(value);
      if (!vDef) {
        if (this.typeName === 'SourceLocation' || this.typeName === 'Position') {
          return this.checkAllFields(value, deep);
        }
        return false;
      }
      if (deep && vDef === this)
        return this.checkAllFields(value, deep);
      if (!this.isSupertypeOf(vDef))
        return false;
      if (!deep)
        return true;
      return vDef.checkAllFields(value, deep) && this.checkAllFields(value, false);
    };
    Dp.bases = function () {
      var bases = this.baseNames;
      assert.strictEqual(this.finalized, false);
      each.call(arguments, function (baseName) {
        isString.assert(baseName);
        if (bases.indexOf(baseName) < 0)
          bases.push(baseName);
      });
      return this;
    };
    Object.defineProperty(Dp, 'buildable', { value: false });
    var builders = {};
    exports.builders = builders;
    var nodePrototype = {};
    exports.defineMethod = function (name, func) {
      var old = nodePrototype[name];
      if (isUndefined.check(func)) {
        delete nodePrototype[name];
      } else {
        isFunction.assert(func);
        Object.defineProperty(nodePrototype, name, {
          enumerable: true,
          configurable: true,
          value: func
        });
      }
      return old;
    };
    Dp.build = function () {
      var self = this;
      Object.defineProperty(self, 'buildParams', {
        value: slice.call(arguments),
        writable: false,
        enumerable: false,
        configurable: true
      });
      assert.strictEqual(self.finalized, false);
      isString.arrayOf().assert(self.buildParams);
      if (self.buildable) {
        return self;
      }
      self.field('type', self.typeName, function () {
        return self.typeName;
      });
      Object.defineProperty(self, 'buildable', { value: true });
      Object.defineProperty(builders, getBuilderName(self.typeName), {
        enumerable: true,
        value: function () {
          var args = arguments;
          var argc = args.length;
          var built = Object.create(nodePrototype);
          assert.ok(self.finalized, 'attempting to instantiate unfinalized type ' + self.typeName);
          function add(param, i) {
            if (hasOwn.call(built, param))
              return;
            var all = self.allFields;
            assert.ok(hasOwn.call(all, param), param);
            var field = all[param];
            var type = field.type;
            var value;
            if (isNumber.check(i) && i < argc) {
              value = args[i];
            } else if (field.defaultFn) {
              value = field.defaultFn.call(built);
            } else {
              var message = 'no value or default function given for field ' + JSON.stringify(param) + ' of ' + self.typeName + '(' + self.buildParams.map(function (name) {
                  return all[name];
                }).join(', ') + ')';
              assert.ok(false, message);
            }
            assert.ok(type.check(value), shallowStringify(value) + ' does not match field ' + field + ' of type ' + self.typeName);
            built[param] = value;
          }
          self.buildParams.forEach(function (param, i) {
            add(param, i);
          });
          Object.keys(self.allFields).forEach(function (param) {
            add(param);
          });
          assert.strictEqual(built.type, self.typeName);
          return built;
        }
      });
      return self;
    };
    function getBuilderName(typeName) {
      return typeName.replace(/^[A-Z]+/, function (upperCasePrefix) {
        var len = upperCasePrefix.length;
        switch (len) {
        case 0:
          return '';
        case 1:
          return upperCasePrefix.toLowerCase();
        default:
          return upperCasePrefix.slice(0, len - 1).toLowerCase() + upperCasePrefix.charAt(len - 1);
        }
      });
    }
    Dp.field = function (name, type, defaultFn, hidden) {
      assert.strictEqual(this.finalized, false);
      this.ownFields[name] = new Field(name, type, defaultFn, hidden);
      return this;
    };
    var namedTypes = {};
    exports.namedTypes = namedTypes;
    function getFieldNames(object) {
      var d = Def.fromValue(object);
      if (d) {
        return d.fieldNames.slice(0);
      }
      assert.strictEqual('type' in object, false, 'did not recognize object of type ' + JSON.stringify(object.type));
      return Object.keys(object);
    }
    exports.getFieldNames = getFieldNames;
    function getFieldValue(object, fieldName) {
      var d = Def.fromValue(object);
      if (d) {
        var field = d.allFields[fieldName];
        if (field) {
          return field.getValue(object);
        }
      }
      return object[fieldName];
    }
    exports.getFieldValue = getFieldValue;
    exports.eachField = function (object, callback, context) {
      getFieldNames(object).forEach(function (name) {
        callback.call(this, name, getFieldValue(object, name));
      }, context);
    };
    exports.someField = function (object, callback, context) {
      return getFieldNames(object).some(function (name) {
        return callback.call(this, name, getFieldValue(object, name));
      }, context);
    };
    Object.defineProperty(Dp, 'finalized', { value: false });
    Dp.finalize = function () {
      if (!this.finalized) {
        var allFields = this.allFields;
        var allSupertypes = this.allSupertypes;
        this.baseNames.forEach(function (name) {
          var def = defCache[name];
          def.finalize();
          extend(allFields, def.allFields);
          extend(allSupertypes, def.allSupertypes);
        });
        extend(allFields, this.ownFields);
        allSupertypes[this.typeName] = this;
        this.fieldNames.length = 0;
        for (var fieldName in allFields) {
          if (hasOwn.call(allFields, fieldName) && !allFields[fieldName].hidden) {
            this.fieldNames.push(fieldName);
          }
        }
        Object.defineProperty(namedTypes, this.typeName, {
          enumerable: true,
          value: this.type
        });
        Object.defineProperty(this, 'finalized', { value: true });
        populateSupertypeList(this.typeName, this.supertypeList);
      }
    };
    function populateSupertypeList(typeName, list) {
      list.length = 0;
      list.push(typeName);
      var lastSeen = {};
      for (var pos = 0; pos < list.length; ++pos) {
        typeName = list[pos];
        var d = defCache[typeName];
        assert.strictEqual(d.finalized, true);
        if (hasOwn.call(lastSeen, typeName)) {
          delete list[lastSeen[typeName]];
        }
        lastSeen[typeName] = pos;
        list.push.apply(list, d.baseNames);
      }
      for (var to = 0, from = to, len = list.length; from < len; ++from) {
        if (hasOwn.call(list, from)) {
          list[to++] = list[from];
        }
      }
      list.length = to;
    }
    function extend(into, from) {
      Object.keys(from).forEach(function (name) {
        into[name] = from[name];
      });
      return into;
    }
    ;
    exports.finalize = function () {
      Object.keys(defCache).forEach(function (name) {
        defCache[name].finalize();
      });
    };
}, {"__filename":"types.js","__dirname":"node_modules/ast-types/lib"}], 
'ast-types/lib/shared': [function(exports, require, module, __filename, __dirname) { 
    var types = require('ast-types/lib/types');
    var Type = types.Type;
    var builtin = types.builtInTypes;
    var isNumber = builtin.number;
    exports.geq = function (than) {
      return new Type(function (value) {
        return isNumber.check(value) && value >= than;
      }, isNumber + ' >= ' + than);
    };
    exports.defaults = {
      'null': function () {
        return null;
      },
      'emptyArray': function () {
        return [];
      },
      'false': function () {
        return false;
      },
      'true': function () {
        return true;
      },
      'undefined': function () {
      }
    };
    var naiveIsPrimitive = Type.or(builtin.string, builtin.number, builtin.boolean, builtin.null, builtin.undefined);
    exports.isPrimitive = new Type(function (value) {
      if (value === null)
        return true;
      var type = typeof value;
      return !(type === 'object' || type === 'function');
    }, naiveIsPrimitive.toString());
}, {"__filename":"shared.js","__dirname":"node_modules/ast-types/lib"}], 
'ast-types/def/core': [function(exports, require, module, __filename, __dirname) { 
    var types = require('ast-types/lib/types');
    var Type = types.Type;
    var def = Type.def;
    var or = Type.or;
    var builtin = types.builtInTypes;
    var isString = builtin.string;
    var isNumber = builtin.number;
    var isBoolean = builtin.boolean;
    var isRegExp = builtin.RegExp;
    var shared = require('ast-types/lib/shared');
    var defaults = shared.defaults;
    var geq = shared.geq;
    def('Node').field('type', isString).field('loc', or(def('SourceLocation'), null), defaults['null'], true);
    def('SourceLocation').build('start', 'end', 'source').field('start', def('Position')).field('end', def('Position')).field('source', or(isString, null), defaults['null']);
    def('Position').build('line', 'column').field('line', geq(1)).field('column', geq(0));
    def('Program').bases('Node').build('body').field('body', [def('Statement')]);
    def('Function').bases('Node').field('id', or(def('Identifier'), null), defaults['null']).field('params', [def('Pattern')]).field('body', or(def('BlockStatement'), def('Expression')));
    def('Statement').bases('Node');
    def('EmptyStatement').bases('Statement').build();
    def('BlockStatement').bases('Statement').build('body').field('body', [def('Statement')]);
    def('ExpressionStatement').bases('Statement').build('expression').field('expression', def('Expression'));
    def('IfStatement').bases('Statement').build('test', 'consequent', 'alternate').field('test', def('Expression')).field('consequent', def('Statement')).field('alternate', or(def('Statement'), null), defaults['null']);
    def('LabeledStatement').bases('Statement').build('label', 'body').field('label', def('Identifier')).field('body', def('Statement'));
    def('BreakStatement').bases('Statement').build('label').field('label', or(def('Identifier'), null), defaults['null']);
    def('ContinueStatement').bases('Statement').build('label').field('label', or(def('Identifier'), null), defaults['null']);
    def('WithStatement').bases('Statement').build('object', 'body').field('object', def('Expression')).field('body', def('Statement'));
    def('SwitchStatement').bases('Statement').build('discriminant', 'cases', 'lexical').field('discriminant', def('Expression')).field('cases', [def('SwitchCase')]).field('lexical', isBoolean, defaults['false']);
    def('ReturnStatement').bases('Statement').build('argument').field('argument', or(def('Expression'), null));
    def('ThrowStatement').bases('Statement').build('argument').field('argument', def('Expression'));
    def('TryStatement').bases('Statement').build('block', 'handler', 'finalizer').field('block', def('BlockStatement')).field('handler', or(def('CatchClause'), null), function () {
      return this.handlers && this.handlers[0] || null;
    }).field('handlers', [def('CatchClause')], function () {
      return this.handler ? [this.handler] : [];
    }, true).field('guardedHandlers', [def('CatchClause')], defaults.emptyArray).field('finalizer', or(def('BlockStatement'), null), defaults['null']);
    def('CatchClause').bases('Node').build('param', 'guard', 'body').field('param', def('Pattern')).field('guard', or(def('Expression'), null), defaults['null']).field('body', def('BlockStatement'));
    def('WhileStatement').bases('Statement').build('test', 'body').field('test', def('Expression')).field('body', def('Statement'));
    def('DoWhileStatement').bases('Statement').build('body', 'test').field('body', def('Statement')).field('test', def('Expression'));
    def('ForStatement').bases('Statement').build('init', 'test', 'update', 'body').field('init', or(def('VariableDeclaration'), def('Expression'), null)).field('test', or(def('Expression'), null)).field('update', or(def('Expression'), null)).field('body', def('Statement'));
    def('ForInStatement').bases('Statement').build('left', 'right', 'body', 'each').field('left', or(def('VariableDeclaration'), def('Expression'))).field('right', def('Expression')).field('body', def('Statement')).field('each', isBoolean);
    def('DebuggerStatement').bases('Statement').build();
    def('Declaration').bases('Statement');
    def('FunctionDeclaration').bases('Function', 'Declaration').build('id', 'params', 'body').field('id', def('Identifier'));
    def('FunctionExpression').bases('Function', 'Expression').build('id', 'params', 'body');
    def('VariableDeclaration').bases('Declaration').build('kind', 'declarations').field('kind', or('var', 'let', 'const')).field('declarations', [or(def('VariableDeclarator'), def('Identifier'))]);
    def('VariableDeclarator').bases('Node').build('id', 'init').field('id', def('Pattern')).field('init', or(def('Expression'), null));
    def('Expression').bases('Node', 'Pattern');
    def('ThisExpression').bases('Expression').build();
    def('ArrayExpression').bases('Expression').build('elements').field('elements', [or(def('Expression'), null)]);
    def('ObjectExpression').bases('Expression').build('properties').field('properties', [def('Property')]);
    def('Property').bases('Node').build('kind', 'key', 'value').field('kind', or('init', 'get', 'set')).field('key', or(def('Literal'), def('Identifier'))).field('value', def('Expression'));
    def('SequenceExpression').bases('Expression').build('expressions').field('expressions', [def('Expression')]);
    var UnaryOperator = or('-', '+', '!', '~', 'typeof', 'void', 'delete');
    def('UnaryExpression').bases('Expression').build('operator', 'argument', 'prefix').field('operator', UnaryOperator).field('argument', def('Expression')).field('prefix', isBoolean, defaults['true']);
    var BinaryOperator = or('==', '!=', '===', '!==', '<', '<=', '>', '>=', '<<', '>>', '>>>', '+', '-', '*', '/', '%', '&', '|', '^', 'in', 'instanceof', '..');
    def('BinaryExpression').bases('Expression').build('operator', 'left', 'right').field('operator', BinaryOperator).field('left', def('Expression')).field('right', def('Expression'));
    var AssignmentOperator = or('=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=', '|=', '^=', '&=');
    def('AssignmentExpression').bases('Expression').build('operator', 'left', 'right').field('operator', AssignmentOperator).field('left', def('Expression')).field('right', def('Expression'));
    var UpdateOperator = or('++', '--');
    def('UpdateExpression').bases('Expression').build('operator', 'argument', 'prefix').field('operator', UpdateOperator).field('argument', def('Expression')).field('prefix', isBoolean);
    var LogicalOperator = or('||', '&&');
    def('LogicalExpression').bases('Expression').build('operator', 'left', 'right').field('operator', LogicalOperator).field('left', def('Expression')).field('right', def('Expression'));
    def('ConditionalExpression').bases('Expression').build('test', 'consequent', 'alternate').field('test', def('Expression')).field('consequent', def('Expression')).field('alternate', def('Expression'));
    def('NewExpression').bases('Expression').build('callee', 'arguments').field('callee', def('Expression')).field('arguments', [def('Expression')]);
    def('CallExpression').bases('Expression').build('callee', 'arguments').field('callee', def('Expression')).field('arguments', [def('Expression')]);
    def('MemberExpression').bases('Expression').build('object', 'property', 'computed').field('object', def('Expression')).field('property', or(def('Identifier'), def('Expression'))).field('computed', isBoolean);
    def('Pattern').bases('Node');
    def('ObjectPattern').bases('Pattern').build('properties').field('properties', [def('PropertyPattern')]);
    def('PropertyPattern').bases('Pattern').build('key', 'pattern').field('key', or(def('Literal'), def('Identifier'))).field('pattern', def('Pattern'));
    def('ArrayPattern').bases('Pattern').build('elements').field('elements', [or(def('Pattern'), null)]);
    def('SwitchCase').bases('Node').build('test', 'consequent').field('test', or(def('Expression'), null)).field('consequent', [def('Statement')]);
    def('Identifier').bases('Node', 'Expression', 'Pattern').build('name').field('name', isString);
    def('Literal').bases('Node', 'Expression').build('value').field('value', or(isString, isBoolean, null, isNumber, isRegExp));
}, {"__filename":"core.js","__dirname":"node_modules/ast-types/def"}], 
'ast-types/def/es6': [function(exports, require, module, __filename, __dirname) { 
    require('ast-types/def/core');
    var types = require('ast-types/lib/types');
    var def = types.Type.def;
    var or = types.Type.or;
    var builtin = types.builtInTypes;
    var isBoolean = builtin.boolean;
    var isObject = builtin.object;
    var isString = builtin.string;
    var defaults = require('ast-types/lib/shared').defaults;
    def('Function').field('generator', isBoolean, defaults['false']).field('expression', isBoolean, defaults['false']).field('defaults', [def('Expression')], defaults.emptyArray).field('rest', or(def('Identifier'), null), defaults['null']);
    def('FunctionDeclaration').build('id', 'params', 'body', 'generator', 'expression');
    def('FunctionExpression').build('id', 'params', 'body', 'generator', 'expression');
    def('ArrowFunctionExpression').bases('Function', 'Expression').build('params', 'body', 'expression').field('id', null, defaults['null']).field('generator', false);
    def('YieldExpression').bases('Expression').build('argument', 'delegate').field('argument', or(def('Expression'), null)).field('delegate', isBoolean, defaults['false']);
    def('GeneratorExpression').bases('Expression').build('body', 'blocks', 'filter').field('body', def('Expression')).field('blocks', [def('ComprehensionBlock')]).field('filter', or(def('Expression'), null));
    def('ComprehensionExpression').bases('Expression').build('body', 'blocks', 'filter').field('body', def('Expression')).field('blocks', [def('ComprehensionBlock')]).field('filter', or(def('Expression'), null));
    def('ComprehensionBlock').bases('Node').build('left', 'right', 'each').field('left', def('Pattern')).field('right', def('Expression')).field('each', isBoolean);
    def('ModuleSpecifier').bases('Specifier', 'Literal').field('value', isString);
    var ModuleSpecifier = def('Literal');
    def('ModuleDeclaration').bases('Declaration').build('id', 'from', 'body').field('id', or(def('Literal'), def('Identifier'))).field('source', or(ModuleSpecifier, null)).field('body', or(def('BlockStatement'), null));
    def('Property').field('method', isBoolean, defaults['false']).field('shorthand', isBoolean, defaults['false']).field('computed', isBoolean, defaults['false']);
    def('MethodDefinition').bases('Declaration').build('kind', 'key', 'value').field('kind', or('init', 'get', 'set', '')).field('key', or(def('Literal'), def('Identifier'))).field('value', def('Function'));
    def('SpreadElement').bases('Node').build('argument').field('argument', def('Expression'));
    def('ArrayExpression').field('elements', [or(def('Expression'), def('SpreadElement'), null)]);
    def('NewExpression').field('arguments', [or(def('Expression'), def('SpreadElement'))]);
    def('CallExpression').field('arguments', [or(def('Expression'), def('SpreadElement'))]);
    def('SpreadElementPattern').bases('Pattern').build('argument').field('argument', def('Pattern'));
    var ClassBodyElement = or(def('MethodDefinition'), def('VariableDeclarator'), def('ClassPropertyDefinition'));
    def('ClassPropertyDefinition').bases('Declaration').build('definition').field('definition', ClassBodyElement);
    def('ClassBody').bases('Declaration').build('body').field('body', [ClassBodyElement]);
    def('ClassDeclaration').bases('Declaration').build('id', 'body', 'superClass').field('id', def('Identifier')).field('body', def('ClassBody')).field('superClass', or(def('Expression'), null), defaults['null']);
    def('ClassExpression').bases('Expression').build('id', 'body', 'superClass').field('id', or(def('Identifier'), null), defaults['null']).field('body', def('ClassBody')).field('superClass', or(def('Expression'), null), defaults['null']);
    def('Specifier').bases('Node');
    def('NamedSpecifier').bases('Specifier').field('id', def('Identifier')).field('name', or(def('Identifier'), null), defaults['null']);
    def('ExportSpecifier').bases('NamedSpecifier').build('id', 'name');
    def('ExportBatchSpecifier').bases('Specifier').build();
    def('ImportSpecifier').bases('NamedSpecifier').build('id', 'name');
    def('ExportDeclaration').bases('Declaration').build('default', 'declaration', 'specifiers', 'source').field('default', isBoolean).field('declaration', or(def('Declaration'), def('Expression'))).field('specifiers', [or(def('ExportSpecifier'), def('ExportBatchSpecifier'))], defaults.emptyArray).field('source', or(ModuleSpecifier, null), defaults['null']);
    def('ImportDeclaration').bases('Declaration').build('specifiers', 'kind', 'source').field('specifiers', [def('ImportSpecifier')]).field('kind', or('named', 'default')).field('source', ModuleSpecifier);
    def('TaggedTemplateExpression').bases('Expression').field('tag', def('Expression')).field('quasi', def('TemplateLiteral'));
    def('TemplateLiteral').bases('Expression').build('quasis', 'expressions').field('quasis', [def('TemplateElement')]).field('expressions', [def('Expression')]);
    def('TemplateElement').bases('Node').build('value', 'tail').field('value', {
      'cooked': isString,
      'raw': isString
    }).field('tail', isBoolean);
}, {"__filename":"es6.js","__dirname":"node_modules/ast-types/def"}], 
'ast-types/def/es7': [function(exports, require, module, __filename, __dirname) { 
    require('ast-types/def/core');
    var types = require('ast-types/lib/types');
    var def = types.Type.def;
    var or = types.Type.or;
    var builtin = types.builtInTypes;
    var isBoolean = builtin.boolean;
    var defaults = require('ast-types/lib/shared').defaults;
    def('Function').field('async', isBoolean, defaults['false']);
    def('SpreadProperty').bases('Node').build('argument').field('argument', def('Expression'));
    def('ObjectExpression').field('properties', [or(def('Property'), def('SpreadProperty'))]);
    def('SpreadPropertyPattern').bases('Pattern').build('argument').field('argument', def('Pattern'));
    def('ObjectPattern').field('properties', [or(def('PropertyPattern'), def('SpreadPropertyPattern'))]);
    def('AwaitExpression').bases('Expression').build('argument', 'all').field('argument', or(def('Expression'), null)).field('all', isBoolean, defaults['false']);
}, {"__filename":"es7.js","__dirname":"node_modules/ast-types/def"}], 
'ast-types/def/mozilla': [function(exports, require, module, __filename, __dirname) { 
    require('ast-types/def/core');
    var types = require('ast-types/lib/types');
    var def = types.Type.def;
    var or = types.Type.or;
    var geq = require('ast-types/lib/shared').geq;
    def('ForOfStatement').bases('Statement').build('left', 'right', 'body').field('left', or(def('VariableDeclaration'), def('Expression'))).field('right', def('Expression')).field('body', def('Statement'));
    def('LetStatement').bases('Statement').build('head', 'body').field('head', [def('VariableDeclarator')]).field('body', def('Statement'));
    def('LetExpression').bases('Expression').build('head', 'body').field('head', [def('VariableDeclarator')]).field('body', def('Expression'));
    def('GraphExpression').bases('Expression').build('index', 'expression').field('index', geq(0)).field('expression', def('Literal'));
    def('GraphIndexExpression').bases('Expression').build('index').field('index', geq(0));
}, {"__filename":"mozilla.js","__dirname":"node_modules/ast-types/def"}], 
'ast-types/def/e4x': [function(exports, require, module, __filename, __dirname) { 
    require('ast-types/def/core');
    var types = require('ast-types/lib/types');
    var def = types.Type.def;
    var or = types.Type.or;
    var builtin = types.builtInTypes;
    var isString = builtin.string;
    var isBoolean = builtin.boolean;
    def('XMLDefaultDeclaration').bases('Declaration').field('namespace', def('Expression'));
    def('XMLAnyName').bases('Expression');
    def('XMLQualifiedIdentifier').bases('Expression').field('left', or(def('Identifier'), def('XMLAnyName'))).field('right', or(def('Identifier'), def('Expression'))).field('computed', isBoolean);
    def('XMLFunctionQualifiedIdentifier').bases('Expression').field('right', or(def('Identifier'), def('Expression'))).field('computed', isBoolean);
    def('XMLAttributeSelector').bases('Expression').field('attribute', def('Expression'));
    def('XMLFilterExpression').bases('Expression').field('left', def('Expression')).field('right', def('Expression'));
    def('XMLElement').bases('XML', 'Expression').field('contents', [def('XML')]);
    def('XMLList').bases('XML', 'Expression').field('contents', [def('XML')]);
    def('XML').bases('Node');
    def('XMLEscape').bases('XML').field('expression', def('Expression'));
    def('XMLText').bases('XML').field('text', isString);
    def('XMLStartTag').bases('XML').field('contents', [def('XML')]);
    def('XMLEndTag').bases('XML').field('contents', [def('XML')]);
    def('XMLPointTag').bases('XML').field('contents', [def('XML')]);
    def('XMLName').bases('XML').field('contents', or(isString, [def('XML')]));
    def('XMLAttribute').bases('XML').field('value', isString);
    def('XMLCdata').bases('XML').field('contents', isString);
    def('XMLComment').bases('XML').field('contents', isString);
    def('XMLProcessingInstruction').bases('XML').field('target', isString).field('contents', or(isString, null));
}, {"__filename":"e4x.js","__dirname":"node_modules/ast-types/def"}], 
'ast-types/def/fb-harmony': [function(exports, require, module, __filename, __dirname) { 
    require('ast-types/def/core');
    var types = require('ast-types/lib/types');
    var def = types.Type.def;
    var or = types.Type.or;
    var builtin = types.builtInTypes;
    var isString = builtin.string;
    var isBoolean = builtin.boolean;
    var defaults = require('ast-types/lib/shared').defaults;
    def('XJSAttribute').bases('Node').build('name', 'value').field('name', or(def('XJSIdentifier'), def('XJSNamespacedName'))).field('value', or(def('Literal'), def('XJSExpressionContainer'), null), defaults['null']);
    def('XJSIdentifier').bases('Node').build('name').field('name', isString);
    def('XJSNamespacedName').bases('Node').build('namespace', 'name').field('namespace', def('XJSIdentifier')).field('name', def('XJSIdentifier'));
    def('XJSMemberExpression').bases('MemberExpression').build('object', 'property').field('object', or(def('XJSIdentifier'), def('XJSMemberExpression'))).field('property', def('XJSIdentifier')).field('computed', isBoolean, defaults.false);
    var XJSElementName = or(def('XJSIdentifier'), def('XJSNamespacedName'), def('XJSMemberExpression'));
    def('XJSSpreadAttribute').bases('Node').build('argument').field('argument', def('Expression'));
    var XJSAttributes = [or(def('XJSAttribute'), def('XJSSpreadAttribute'))];
    def('XJSExpressionContainer').bases('Expression').build('expression').field('expression', def('Expression'));
    def('XJSElement').bases('Expression').build('openingElement', 'closingElement', 'children').field('openingElement', def('XJSOpeningElement')).field('closingElement', or(def('XJSClosingElement'), null), defaults['null']).field('children', [or(def('XJSElement'), def('XJSExpressionContainer'), def('XJSText'), def('Literal'))], defaults.emptyArray).field('name', XJSElementName, function () {
      return this.openingElement.name;
    }).field('selfClosing', isBoolean, function () {
      return this.openingElement.selfClosing;
    }).field('attributes', XJSAttributes, function () {
      return this.openingElement.attributes;
    });
    def('XJSOpeningElement').bases('Node').build('name', 'attributes', 'selfClosing').field('name', XJSElementName).field('attributes', XJSAttributes, defaults.emptyArray).field('selfClosing', isBoolean, defaults['false']);
    def('XJSClosingElement').bases('Node').build('name').field('name', XJSElementName);
    def('XJSText').bases('Literal').build('value').field('value', isString);
    def('XJSEmptyExpression').bases('Expression').build();
    def('TypeAnnotatedIdentifier').bases('Pattern').build('annotation', 'identifier').field('annotation', def('TypeAnnotation')).field('identifier', def('Identifier'));
    def('TypeAnnotation').bases('Pattern').build('annotatedType', 'templateTypes', 'paramTypes', 'returnType', 'unionType', 'nullable').field('annotatedType', def('Identifier')).field('templateTypes', or([def('TypeAnnotation')], null)).field('paramTypes', or([def('TypeAnnotation')], null)).field('returnType', or(def('TypeAnnotation'), null)).field('unionType', or(def('TypeAnnotation'), null)).field('nullable', isBoolean);
}, {"__filename":"fb-harmony.js","__dirname":"node_modules/ast-types/def"}], 
'ast-types/lib/path': [function(exports, require, module, __filename, __dirname) { 
    var assert = require('assert');
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var toString = Op.toString;
    var arrayToString = toString.call([]);
    var Ap = Array.prototype;
    var slice = Ap.slice;
    var map = Ap.map;
    function Path(value, parentPath, name) {
      assert.ok(this instanceof Path);
      if (parentPath) {
        assert.ok(parentPath instanceof Path);
      } else {
        parentPath = null;
        name = null;
      }
      this.value = value;
      this.parentPath = parentPath;
      this.name = name;
      this.__childCache = {};
    }
    var Pp = Path.prototype;
    function getChildPath(path, name) {
      var cache = path.__childCache;
      var actualChildValue = path.getValueProperty(name);
      var childPath = cache[name];
      if (!hasOwn.call(cache, name) || childPath.value !== actualChildValue) {
        childPath = cache[name] = new path.constructor(actualChildValue, path, name);
      }
      return childPath;
    }
    Pp.getValueProperty = function (name) {
      return this.value[name];
    };
    Pp.get = function (name) {
      var path = this;
      var names = arguments;
      var count = names.length;
      for (var i = 0; i < count; ++i) {
        path = getChildPath(path, names[i]);
      }
      return path;
    };
    Pp.each = function (callback, context) {
      var childPaths = [];
      var len = this.value.length;
      var i = 0;
      for (var i = 0; i < len; ++i) {
        if (hasOwn.call(this.value, i)) {
          childPaths[i] = this.get(i);
        }
      }
      context = context || this;
      for (i = 0; i < len; ++i) {
        if (hasOwn.call(childPaths, i)) {
          callback.call(context, childPaths[i]);
        }
      }
    };
    Pp.map = function (callback, context) {
      var result = [];
      this.each(function (childPath) {
        result.push(callback.call(this, childPath));
      }, context);
      return result;
    };
    Pp.filter = function (callback, context) {
      var result = [];
      this.each(function (childPath) {
        if (callback.call(this, childPath)) {
          result.push(childPath);
        }
      }, context);
      return result;
    };
    Pp.replace = function (replacement) {
      var count = arguments.length;
      assert.ok(this.parentPath instanceof Path, 'Instead of replacing the root of the tree, create a new tree.');
      var name = this.name;
      var parentValue = this.parentPath.value;
      var parentCache = this.parentPath.__childCache;
      var results = [];
      if (toString.call(parentValue) === arrayToString) {
        var i;
        var newIndex;
        if (this.value !== parentCache[name].value) {
          for (i = 0; i < parentValue.length; ++i) {
            if (parentValue[i] === this.value) {
              this.name = name = i;
              break;
            }
          }
          assert.ok(this.value === parentCache[name].value, 'Cannot replace already replaced node: ' + this.value.type);
        }
        delete parentCache.length;
        delete parentCache[name];
        var moved = {};
        for (i = name + 1; i < parentValue.length; ++i) {
          var child = parentCache[i];
          if (child) {
            newIndex = i - 1 + count;
            moved[newIndex] = child;
            Object.defineProperty(child, 'name', { value: newIndex });
            delete parentCache[i];
          }
        }
        var args = slice.call(arguments);
        args.unshift(name, 1);
        parentValue.splice.apply(parentValue, args);
        for (newIndex in moved) {
          if (hasOwn.call(moved, newIndex)) {
            parentCache[newIndex] = moved[newIndex];
          }
        }
        for (i = name; i < name + count; ++i) {
          results.push(this.parentPath.get(i));
        }
      } else if (count === 1) {
        delete parentCache[name];
        parentValue[name] = replacement;
        results.push(this.parentPath.get(name));
      } else if (count === 0) {
        delete parentCache[name];
        delete parentValue[name];
      } else {
        assert.ok(false, 'Could not replace Path.');
      }
      return results;
    };
    module.exports = Path;
}, {"__filename":"path.js","__dirname":"node_modules/ast-types/lib"}], 
'ast-types/lib/scope': [function(exports, require, module, __filename, __dirname) { 
    var assert = require('assert');
    var types = require('ast-types/lib/types');
    var Type = types.Type;
    var namedTypes = types.namedTypes;
    var builders = types.builders;
    var Node = namedTypes.Node;
    var isArray = types.builtInTypes.array;
    var hasOwn = Object.prototype.hasOwnProperty;
    function Scope(path, parentScope) {
      assert.ok(this instanceof Scope);
      assert.ok(path instanceof require('ast-types/lib/node-path'));
      ScopeType.assert(path.value);
      var depth;
      if (parentScope) {
        assert.ok(parentScope instanceof Scope);
        depth = parentScope.depth + 1;
      } else {
        parentScope = null;
        depth = 0;
      }
      Object.defineProperties(this, {
        path: { value: path },
        node: { value: path.value },
        isGlobal: {
          value: !parentScope,
          enumerable: true
        },
        depth: { value: depth },
        parent: { value: parentScope },
        bindings: { value: {} }
      });
    }
    var scopeTypes = [
        namedTypes.Program,
        namedTypes.Function,
        namedTypes.CatchClause
      ];
    var ScopeType = Type.or.apply(Type, scopeTypes);
    Scope.isEstablishedBy = function (node) {
      return ScopeType.check(node);
    };
    var Sp = Scope.prototype;
    Sp.didScan = false;
    Sp.declares = function (name) {
      this.scan();
      return hasOwn.call(this.bindings, name);
    };
    Sp.declareTemporary = function (prefix) {
      assert.ok(/^[a-z$_]/i.test(prefix), prefix);
      this.scan();
      var index = 0;
      while (this.declares(prefix + index)) {
        ++index;
      }
      var id = builders.identifier(prefix + index);
      this.bindings[prefix + index] = id;
      return id;
    };
    Sp.scan = function (force) {
      if (force || !this.didScan) {
        for (var name in this.bindings) {
          delete this.bindings[name];
        }
        scanScope(this.path, this.bindings);
        this.didScan = true;
      }
    };
    Sp.getBindings = function () {
      this.scan();
      return this.bindings;
    };
    function scanScope(path, bindings) {
      var node = path.value;
      ScopeType.assert(node);
      if (namedTypes.CatchClause.check(node)) {
        addPattern(path.get('param'), bindings);
      } else {
        recursiveScanScope(path, bindings);
      }
    }
    function recursiveScanScope(path, bindings) {
      var node = path.value;
      if (path.parent && namedTypes.FunctionExpression.check(path.parent.node) && path.parent.node.id) {
        addPattern(path.parent.get('id'), bindings);
      } else if (isArray.check(node)) {
        path.each(function (childPath) {
          recursiveScanChild(childPath, bindings);
        });
      } else if (namedTypes.Function.check(node)) {
        path.get('params').each(function (paramPath) {
          addPattern(paramPath, bindings);
        });
        recursiveScanChild(path.get('body'), bindings);
      } else if (namedTypes.VariableDeclarator.check(node)) {
        addPattern(path.get('id'), bindings);
        recursiveScanChild(path.get('init'), bindings);
      } else if (namedTypes.ImportSpecifier && namedTypes.ImportSpecifier.check(node)) {
        addPattern(node.name ? path.get('name') : path.get('id'), bindings);
      } else if (namedTypes.ModuleDeclaration && namedTypes.ModuleDeclaration.check(node)) {
        addPattern(path.get('id'), bindings);
      } else if (Node.check(node)) {
        types.eachField(node, function (name, child) {
          var childPath = path.get(name);
          assert.strictEqual(childPath.value, child);
          recursiveScanChild(childPath, bindings);
        });
      }
    }
    function recursiveScanChild(path, bindings) {
      var node = path.value;
      if (namedTypes.FunctionDeclaration.check(node)) {
        addPattern(path.get('id'), bindings);
      } else if (namedTypes.ClassDeclaration && namedTypes.ClassDeclaration.check(node)) {
        addPattern(path.get('id'), bindings);
      } else if (Scope.isEstablishedBy(node)) {
        if (namedTypes.CatchClause.check(node)) {
          var catchParamName = node.param.name;
          var hadBinding = hasOwn.call(bindings, catchParamName);
          recursiveScanScope(path.get('body'), bindings);
          if (!hadBinding) {
            delete bindings[catchParamName];
          }
        }
      } else {
        recursiveScanScope(path, bindings);
      }
    }
    function addPattern(patternPath, bindings) {
      var pattern = patternPath.value;
      namedTypes.Pattern.assert(pattern);
      if (namedTypes.Identifier.check(pattern)) {
        if (hasOwn.call(bindings, pattern.name)) {
          bindings[pattern.name].push(patternPath);
        } else {
          bindings[pattern.name] = [patternPath];
        }
      } else if (namedTypes.SpreadElement && namedTypes.SpreadElement.check(pattern)) {
        addPattern(patternPath.get('argument'), bindings);
      }
    }
    Sp.lookup = function (name) {
      for (var scope = this; scope; scope = scope.parent)
        if (scope.declares(name))
          break;
      return scope;
    };
    Sp.getGlobalScope = function () {
      var scope = this;
      while (!scope.isGlobal)
        scope = scope.parent;
      return scope;
    };
    module.exports = Scope;
}, {"__filename":"scope.js","__dirname":"node_modules/ast-types/lib"}], 
'ast-types/lib/node-path': [function(exports, require, module, __filename, __dirname) { 
    var assert = require('assert');
    var types = require('ast-types/lib/types');
    var n = types.namedTypes;
    var isNumber = types.builtInTypes.number;
    var isArray = types.builtInTypes.array;
    var Path = require('ast-types/lib/path');
    var Scope = require('ast-types/lib/scope');
    function NodePath(value, parentPath, name) {
      assert.ok(this instanceof NodePath);
      Path.call(this, value, parentPath, name);
    }
    require('util').inherits(NodePath, Path);
    var NPp = NodePath.prototype;
    Object.defineProperties(NPp, {
      node: {
        get: function () {
          Object.defineProperty(this, 'node', { value: this._computeNode() });
          return this.node;
        }
      },
      parent: {
        get: function () {
          Object.defineProperty(this, 'parent', { value: this._computeParent() });
          return this.parent;
        }
      },
      scope: {
        get: function () {
          Object.defineProperty(this, 'scope', { value: this._computeScope() });
          return this.scope;
        }
      }
    });
    NPp._computeNode = function () {
      var value = this.value;
      if (n.Node.check(value)) {
        return value;
      }
      var pp = this.parentPath;
      return pp && pp.node || null;
    };
    NPp._computeParent = function () {
      var value = this.value;
      var pp = this.parentPath;
      if (!n.Node.check(value)) {
        while (pp && !n.Node.check(pp.value)) {
          pp = pp.parentPath;
        }
        if (pp) {
          pp = pp.parentPath;
        }
      }
      while (pp && !n.Node.check(pp.value)) {
        pp = pp.parentPath;
      }
      return pp || null;
    };
    NPp._computeScope = function () {
      var value = this.value;
      var pp = this.parentPath;
      var scope = pp && pp.scope;
      if (n.Node.check(value) && Scope.isEstablishedBy(value)) {
        scope = new Scope(this, scope);
      }
      return scope || null;
    };
    NPp.getValueProperty = function (name) {
      return types.getFieldValue(this.value, name);
    };
    NPp.needsParens = function (assumeExpressionContext) {
      if (!this.parent)
        return false;
      var node = this.node;
      if (node !== this.value)
        return false;
      var parent = this.parent.node;
      assert.notStrictEqual(node, parent);
      if (!n.Expression.check(node))
        return false;
      if (isUnaryLike(node))
        return n.MemberExpression.check(parent) && this.name === 'object' && parent.object === node;
      if (isBinary(node)) {
        if (n.CallExpression.check(parent) && this.name === 'callee') {
          assert.strictEqual(parent.callee, node);
          return true;
        }
        if (isUnaryLike(parent))
          return true;
        if (n.MemberExpression.check(parent) && this.name === 'object') {
          assert.strictEqual(parent.object, node);
          return true;
        }
        if (isBinary(parent)) {
          var po = parent.operator;
          var pp = PRECEDENCE[po];
          var no = node.operator;
          var np = PRECEDENCE[no];
          if (pp > np) {
            return true;
          }
          if (pp === np && this.name === 'right') {
            assert.strictEqual(parent.right, node);
            return true;
          }
        }
      }
      if (n.SequenceExpression.check(node)) {
        if (n.ForStatement.check(parent)) {
          return false;
        }
        if (n.ExpressionStatement.check(parent) && this.name === 'expression') {
          return false;
        }
        return true;
      }
      if (n.YieldExpression.check(node))
        return isBinary(parent) || n.CallExpression.check(parent) || n.MemberExpression.check(parent) || n.NewExpression.check(parent) || n.ConditionalExpression.check(parent) || isUnaryLike(parent) || n.YieldExpression.check(parent);
      if (n.NewExpression.check(parent) && this.name === 'callee') {
        assert.strictEqual(parent.callee, node);
        return containsCallExpression(node);
      }
      if (n.Literal.check(node) && isNumber.check(node.value) && n.MemberExpression.check(parent) && this.name === 'object') {
        assert.strictEqual(parent.object, node);
        return true;
      }
      if (n.AssignmentExpression.check(node) || n.ConditionalExpression.check(node)) {
        if (isUnaryLike(parent))
          return true;
        if (isBinary(parent))
          return true;
        if (n.CallExpression.check(parent) && this.name === 'callee') {
          assert.strictEqual(parent.callee, node);
          return true;
        }
        if (n.ConditionalExpression.check(parent) && this.name === 'test') {
          assert.strictEqual(parent.test, node);
          return true;
        }
        if (n.MemberExpression.check(parent) && this.name === 'object') {
          assert.strictEqual(parent.object, node);
          return true;
        }
      }
      if (assumeExpressionContext !== true && !this.canBeFirstInStatement() && this.firstInStatement())
        return true;
      return false;
    };
    function isBinary(node) {
      return n.BinaryExpression.check(node) || n.LogicalExpression.check(node);
    }
    function isUnaryLike(node) {
      return n.UnaryExpression.check(node) || n.SpreadElement && n.SpreadElement.check(node) || n.SpreadProperty && n.SpreadProperty.check(node);
    }
    var PRECEDENCE = {};
    [
      ['||'],
      ['&&'],
      ['|'],
      ['^'],
      ['&'],
      [
        '==',
        '===',
        '!=',
        '!=='
      ],
      [
        '<',
        '>',
        '<=',
        '>=',
        'in',
        'instanceof'
      ],
      [
        '>>',
        '<<',
        '>>>'
      ],
      [
        '+',
        '-'
      ],
      [
        '*',
        '/',
        '%'
      ]
    ].forEach(function (tier, i) {
      tier.forEach(function (op) {
        PRECEDENCE[op] = i;
      });
    });
    function containsCallExpression(node) {
      if (n.CallExpression.check(node)) {
        return true;
      }
      if (isArray.check(node)) {
        return node.some(containsCallExpression);
      }
      if (n.Node.check(node)) {
        return types.someField(node, function (name, child) {
          return containsCallExpression(child);
        });
      }
      return false;
    }
    NPp.canBeFirstInStatement = function () {
      var node = this.node;
      return !n.FunctionExpression.check(node) && !n.ObjectExpression.check(node);
    };
    NPp.firstInStatement = function () {
      return firstInStatement(this);
    };
    function firstInStatement(path) {
      for (var node, parent; path.parent; path = path.parent) {
        node = path.node;
        parent = path.parent.node;
        if (n.BlockStatement.check(parent) && path.parent.name === 'body' && path.name === 0) {
          assert.strictEqual(parent.body[0], node);
          return true;
        }
        if (n.ExpressionStatement.check(parent) && path.name === 'expression') {
          assert.strictEqual(parent.expression, node);
          return true;
        }
        if (n.SequenceExpression.check(parent) && path.parent.name === 'expressions' && path.name === 0) {
          assert.strictEqual(parent.expressions[0], node);
          continue;
        }
        if (n.CallExpression.check(parent) && path.name === 'callee') {
          assert.strictEqual(parent.callee, node);
          continue;
        }
        if (n.MemberExpression.check(parent) && path.name === 'object') {
          assert.strictEqual(parent.object, node);
          continue;
        }
        if (n.ConditionalExpression.check(parent) && path.name === 'test') {
          assert.strictEqual(parent.test, node);
          continue;
        }
        if (isBinary(parent) && path.name === 'left') {
          assert.strictEqual(parent.left, node);
          continue;
        }
        if (n.UnaryExpression.check(parent) && !parent.prefix && path.name === 'argument') {
          assert.strictEqual(parent.argument, node);
          continue;
        }
        return false;
      }
      return true;
    }
    module.exports = NodePath;
}, {"__filename":"node-path.js","__dirname":"node_modules/ast-types/lib"}], 
'ast-types/lib/traverse': [function(exports, require, module, __filename, __dirname) { 
    var assert = require('assert');
    var types = require('ast-types/lib/types');
    var Node = types.namedTypes.Node;
    var isObject = types.builtInTypes.object;
    var isArray = types.builtInTypes.array;
    var NodePath = require('ast-types/lib/node-path');
    var funToStr = Function.prototype.toString;
    var thisPattern = /\bthis\b/;
    function traverseWithFullPathInfo(node, callback) {
      if (!thisPattern.test(funToStr.call(callback))) {
        return traverseWithNoPathInfo(node instanceof NodePath ? node.value : node, callback);
      }
      function traverse(path) {
        assert.ok(path instanceof NodePath);
        var value = path.value;
        if (isArray.check(value)) {
          path.each(traverse);
          return;
        }
        if (Node.check(value)) {
          if (callback.call(path, value, traverse) === false) {
            return;
          }
        } else if (!isObject.check(value)) {
          return;
        }
        types.eachField(value, function (name, child) {
          var childPath = path.get(name);
          if (childPath.value !== child) {
            childPath.replace(child);
          }
          traverse(childPath);
        });
      }
      if (node instanceof NodePath) {
        traverse(node);
        return node.value;
      }
      var rootPath = new NodePath({ root: node });
      traverse(rootPath.get('root'));
      return rootPath.value.root;
    }
    function traverseWithNoPathInfo(node, callback, context) {
      Node.assert(node);
      context = context || null;
      function traverse(node) {
        if (isArray.check(node)) {
          node.forEach(traverse);
          return;
        }
        if (Node.check(node)) {
          if (callback.call(context, node, traverse) === false) {
            return;
          }
        } else if (!isObject.check(node)) {
          return;
        }
        types.eachField(node, function (name, child) {
          traverse(child);
        });
      }
      traverse(node);
      return node;
    }
    traverseWithFullPathInfo.fast = traverseWithNoPathInfo;
    module.exports = traverseWithFullPathInfo;
}, {"__filename":"traverse.js","__dirname":"node_modules/ast-types/lib"}], 
'ast-types': [function(exports, require, module, __filename, __dirname) { 
    var types = require('ast-types/lib/types');
    require('ast-types/def/core');
    require('ast-types/def/es6');
    require('ast-types/def/es7');
    require('ast-types/def/mozilla');
    require('ast-types/def/e4x');
    require('ast-types/def/fb-harmony');
    types.finalize();
    exports.Type = types.Type;
    exports.builtInTypes = types.builtInTypes;
    exports.namedTypes = types.namedTypes;
    exports.builders = types.builders;
    exports.defineMethod = types.defineMethod;
    exports.getFieldNames = types.getFieldNames;
    exports.getFieldValue = types.getFieldValue;
    exports.eachField = types.eachField;
    exports.someField = types.someField;
    exports.traverse = require('ast-types/lib/traverse');
    exports.finalize = types.finalize;
    exports.NodePath = require('ast-types/lib/node-path');
    exports.computeSupertypeLookupTable = types.computeSupertypeLookupTable;
}, {"__filename":"main.js","__dirname":"node_modules/ast-types"}], 
'transform/amd-to-': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), through = require('through2'), walk = require('acorn/util/walk'), types = require('ast-types'), b = types.builders, n = types.namedTypes;
    module.exports = function (config) {
      return through.obj(function (file, enc, next) {
        if (!file.isAST()) {
          this.push(file);
          next();
          return;
        }
        var program = file.contents, programBody = program.body;
        if (programBody && programBody.length !== 1) {
          this.push(file);
          next();
          return;
        }
        var toExclude = config.excludeAMDModules, type, args, fun, deps;
        walk.ancestor(program, {
          FunctionExpression: function (node, parents) {
            parent = parents[parents.length - 2];
            args = parent.arguments;
            type = parent.callee && parent.callee.name;
          },
          ObjectExpression: function (node, parents) {
            parent = parents[parents.length - 2];
            args = parent.arguments;
            type = parent.callee && parent.callee.name;
          }
        });
        if (!(type === 'require') && !(type === 'define')) {
          this.push(file);
          next();
          return;
        }
        if (type === 'define') {
          if (args.length === 1)
            fun = args[0];
          if (args.length === 3)
            deps = args[1].elements;
          file.type = 'define';
        }
        if (type === 'require') {
          if (args.length === 1)
            fun = args[0];
          file.type = 'require';
        }
        if (args.length === 2) {
          fun = args[1];
          deps = args[0].elements;
        }
        var block = n.FunctionExpression.check(fun) && fun.body, body = n.BlockStatement.check(block) && block.body;
        if (n.ObjectExpression.check(fun)) {
          var a = b.expressionStatement(b.assignmentExpression('=', b.memberExpression(b.identifier('module'), b.identifier('exports'), false), fun));
          file.contents = b.program([a]);
          this.push(file);
          next();
          return;
        }
        if (!_.isEmpty(deps)) {
          deps = _(deps).map(function (e, i) {
            var param = fun.params[i];
            return {
              param: param ? param.name : null,
              require: e.value
            };
          }).filter(function (d) {
            return !_.some(toExclude, function (p) {
              return new RegExp(p).test(d.require);
            });
          }).filter(function (e) {
            return !!e.require;
          }).value();
          _.each(deps.reverse(), function (d, i) {
            var req = b.callExpression(b.identifier('require'), [b.literal(d.require)]);
            if (!!d.require && !!d.param)
              req = b.variableDeclaration('var', [b.variableDeclarator(b.identifier(d.param), req)]);
            else if (!!d.require)
              req = b.expressionStatement(req);
            body.unshift(req);
          });
        }
        file.contents = b.program(body);
        this.push(file);
        next();
      });
    };
}, {"__filename":"amd-to-cjs.js","__dirname":"lib/transform"}], 
'transform/escape-raw': [function(exports, require, module, __filename, __dirname) { 
    var acorn = require('acorn'), through = require('through2');
    module.exports = function (config) {
      return through.obj(function (file, enc, next) {
        if (!file.isNull()) {
          var f = file.contents.toString(), c;
          if (file.ext == '.html') {
            c = f.replace(/\r?\n|\r/g, '').replace(/["']/g, '\\"');
            c = 'module.exports = "' + c + '"';
          } else if (file.ext == '.json')
            c = 'module.exports = ' + f;
          if (!!c) {
            file.contents = new Buffer(c);
            file.stopProcessing = true;
          }
        }
        this.push(file);
        next();
      });
    };
}, {"__filename":"escape-raw.js","__dirname":"lib/transform"}], 
'transform/amd-plugin': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), through = require('through2'), walk = require('acorn/util/walk'), debug = require('debug')('re-define:transform:amd-plugin');
    module.exports = function (config) {
      return through.obj(function (file, enc, next) {
        if (!file.isAST()) {
          this.push(file);
          next();
          return;
        }
        walk.simple(file.contents, {
          CallExpression: function (node) {
            var callee = node.callee;
            if (callee && callee.name === 'require') {
              var args = node.arguments;
              if (!args)
                return;
              if (args.length === 1 && args[0].type === 'Literal') {
                var req = args[0].value, plugin = _.find(config.plugins, function (d) {
                    return new RegExp(d).test(req) && d;
                  });
                if (plugin)
                  args[0].value = req.replace(new RegExp(plugin), '');
              }
            }
          }
        });
        this.push(file);
        next();
      });
    };
}, {"__filename":"amd-plugin.js","__dirname":"lib/transform"}], 
'transform/convert-ast': [function(exports, require, module, __filename, __dirname) { 
    var through = require('through2'), generate = require('escodegen').generate, _ = require('lodash');
    module.exports = function (config) {
      return through.obj(function (files, enc, next) {
        _.each(files, function (file) {
          if (file.isAST())
            file.contents = new Buffer(generate(file.contents, { format: config.format }));
        });
        this.push(files);
        next();
      });
    };
}, {"__filename":"convert-ast.js","__dirname":"lib/transform"}], 
'lru-cache': [function(exports, require, module, __filename, __dirname) { 
    ;
    (function () {
      if (typeof module === 'object' && module.exports) {
        module.exports = LRUCache;
      } else {
        this.LRUCache = LRUCache;
      }
      function hOP(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }
      function naiveLength() {
        return 1;
      }
      function LRUCache(options) {
        if (!(this instanceof LRUCache))
          return new LRUCache(options);
        if (typeof options === 'number')
          options = { max: options };
        if (!options)
          options = {};
        this._max = options.max;
        if (!this._max || !(typeof this._max === 'number') || this._max <= 0)
          this._max = Infinity;
        this._lengthCalculator = options.length || naiveLength;
        if (typeof this._lengthCalculator !== 'function')
          this._lengthCalculator = naiveLength;
        this._allowStale = options.stale || false;
        this._maxAge = options.maxAge || null;
        this._dispose = options.dispose;
        this.reset();
      }
      Object.defineProperty(LRUCache.prototype, 'max', {
        set: function (mL) {
          if (!mL || !(typeof mL === 'number') || mL <= 0)
            mL = Infinity;
          this._max = mL;
          if (this._length > this._max)
            trim(this);
        },
        get: function () {
          return this._max;
        },
        enumerable: true
      });
      Object.defineProperty(LRUCache.prototype, 'lengthCalculator', {
        set: function (lC) {
          if (typeof lC !== 'function') {
            this._lengthCalculator = naiveLength;
            this._length = this._itemCount;
            for (var key in this._cache) {
              this._cache[key].length = 1;
            }
          } else {
            this._lengthCalculator = lC;
            this._length = 0;
            for (var key in this._cache) {
              this._cache[key].length = this._lengthCalculator(this._cache[key].value);
              this._length += this._cache[key].length;
            }
          }
          if (this._length > this._max)
            trim(this);
        },
        get: function () {
          return this._lengthCalculator;
        },
        enumerable: true
      });
      Object.defineProperty(LRUCache.prototype, 'length', {
        get: function () {
          return this._length;
        },
        enumerable: true
      });
      Object.defineProperty(LRUCache.prototype, 'itemCount', {
        get: function () {
          return this._itemCount;
        },
        enumerable: true
      });
      LRUCache.prototype.forEach = function (fn, thisp) {
        thisp = thisp || this;
        var i = 0;
        for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--)
          if (this._lruList[k]) {
            i++;
            var hit = this._lruList[k];
            if (this._maxAge && Date.now() - hit.now > this._maxAge) {
              del(this, hit);
              if (!this._allowStale)
                hit = undefined;
            }
            if (hit) {
              fn.call(thisp, hit.value, hit.key, this);
            }
          }
      };
      LRUCache.prototype.keys = function () {
        var keys = new Array(this._itemCount);
        var i = 0;
        for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--)
          if (this._lruList[k]) {
            var hit = this._lruList[k];
            keys[i++] = hit.key;
          }
        return keys;
      };
      LRUCache.prototype.values = function () {
        var values = new Array(this._itemCount);
        var i = 0;
        for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--)
          if (this._lruList[k]) {
            var hit = this._lruList[k];
            values[i++] = hit.value;
          }
        return values;
      };
      LRUCache.prototype.reset = function () {
        if (this._dispose && this._cache) {
          for (var k in this._cache) {
            this._dispose(k, this._cache[k].value);
          }
        }
        this._cache = Object.create(null);
        this._lruList = Object.create(null);
        this._mru = 0;
        this._lru = 0;
        this._length = 0;
        this._itemCount = 0;
      };
      LRUCache.prototype.dump = function () {
        return this._cache;
      };
      LRUCache.prototype.dumpLru = function () {
        return this._lruList;
      };
      LRUCache.prototype.set = function (key, value) {
        if (hOP(this._cache, key)) {
          if (this._dispose)
            this._dispose(key, this._cache[key].value);
          if (this._maxAge)
            this._cache[key].now = Date.now();
          this._cache[key].value = value;
          this.get(key);
          return true;
        }
        var len = this._lengthCalculator(value);
        var age = this._maxAge ? Date.now() : 0;
        var hit = new Entry(key, value, this._mru++, len, age);
        if (hit.length > this._max) {
          if (this._dispose)
            this._dispose(key, value);
          return false;
        }
        this._length += hit.length;
        this._lruList[hit.lu] = this._cache[key] = hit;
        this._itemCount++;
        if (this._length > this._max)
          trim(this);
        return true;
      };
      LRUCache.prototype.has = function (key) {
        if (!hOP(this._cache, key))
          return false;
        var hit = this._cache[key];
        if (this._maxAge && Date.now() - hit.now > this._maxAge) {
          return false;
        }
        return true;
      };
      LRUCache.prototype.get = function (key) {
        return get(this, key, true);
      };
      LRUCache.prototype.peek = function (key) {
        return get(this, key, false);
      };
      LRUCache.prototype.pop = function () {
        var hit = this._lruList[this._lru];
        del(this, hit);
        return hit || null;
      };
      LRUCache.prototype.del = function (key) {
        del(this, this._cache[key]);
      };
      function get(self, key, doUse) {
        var hit = self._cache[key];
        if (hit) {
          if (self._maxAge && Date.now() - hit.now > self._maxAge) {
            del(self, hit);
            if (!self._allowStale)
              hit = undefined;
          } else {
            if (doUse)
              use(self, hit);
          }
          if (hit)
            hit = hit.value;
        }
        return hit;
      }
      function use(self, hit) {
        shiftLU(self, hit);
        hit.lu = self._mru++;
        self._lruList[hit.lu] = hit;
      }
      function trim(self) {
        while (self._lru < self._mru && self._length > self._max)
          del(self, self._lruList[self._lru]);
      }
      function shiftLU(self, hit) {
        delete self._lruList[hit.lu];
        while (self._lru < self._mru && !self._lruList[self._lru])
          self._lru++;
      }
      function del(self, hit) {
        if (hit) {
          if (self._dispose)
            self._dispose(hit.key, hit.value);
          self._length -= hit.length;
          self._itemCount--;
          delete self._cache[hit.key];
          shiftLU(self, hit);
        }
      }
      function Entry(key, value, lu, length, now) {
        this.key = key;
        this.value = value;
        this.lu = lu;
        this.length = length;
        this.now = now;
      }
    }());
}, {"__filename":"lru-cache.js","__dirname":"node_modules/minimatch/node_modules/lru-cache/lib"}], 
'sigmund': [function(exports, require, module, __filename, __dirname) { 
    module.exports = sigmund;
    function sigmund(subject, maxSessions) {
      maxSessions = maxSessions || 10;
      var notes = [];
      var analysis = '';
      var RE = RegExp;
      function psychoAnalyze(subject, session) {
        if (session > maxSessions)
          return;
        if (typeof subject === 'function' || typeof subject === 'undefined') {
          return;
        }
        if (typeof subject !== 'object' || !subject || subject instanceof RE) {
          analysis += subject;
          return;
        }
        if (notes.indexOf(subject) !== -1 || session === maxSessions)
          return;
        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
          if (issue.charAt(0) === '_')
            return;
          var to = typeof subject[issue];
          if (to === 'function' || to === 'undefined')
            return;
          analysis += issue;
          psychoAnalyze(subject[issue], session + 1);
        });
      }
      psychoAnalyze(subject, 0);
      return analysis;
    }
}, {"__filename":"sigmund.js","__dirname":"node_modules/minimatch/node_modules/sigmund"}], 
'minimatch': [function(exports, require, module, __filename, __dirname) { 
    ;
    (function (require, exports, module, platform) {
      if (module)
        module.exports = minimatch;
      else
        exports.minimatch = minimatch;
      if (!require) {
        require = function (id) {
          switch (id) {
          case 'sigmund':
            return function sigmund(obj) {
              return JSON.stringify(obj);
            };
          case 'path':
            return {
              basename: function (f) {
                f = f.split(/[\/\\]/);
                var e = f.pop();
                if (!e)
                  e = f.pop();
                return e;
              }
            };
          case 'lru-cache':
            return function LRUCache() {
              var cache = {};
              var cnt = 0;
              this.set = function (k, v) {
                cnt++;
                if (cnt >= 100)
                  cache = {};
                cache[k] = v;
              };
              this.get = function (k) {
                return cache[k];
              };
            };
          }
        };
      }
      minimatch.Minimatch = Minimatch;
      var LRU = require('lru-cache'), cache = minimatch.cache = new LRU({ max: 100 }), GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}, sigmund = require('sigmund');
      var path = require('path'), qmark = '[^/]', star = qmark + '*?', twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?', twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?', reSpecials = charSet('().*{}+?[]^$\\!');
      function charSet(s) {
        return s.split('').reduce(function (set, c) {
          set[c] = true;
          return set;
        }, {});
      }
      var slashSplit = /\/+/;
      minimatch.filter = filter;
      function filter(pattern, options) {
        options = options || {};
        return function (p, i, list) {
          return minimatch(p, pattern, options);
        };
      }
      function ext(a, b) {
        a = a || {};
        b = b || {};
        var t = {};
        Object.keys(b).forEach(function (k) {
          t[k] = b[k];
        });
        Object.keys(a).forEach(function (k) {
          t[k] = a[k];
        });
        return t;
      }
      minimatch.defaults = function (def) {
        if (!def || !Object.keys(def).length)
          return minimatch;
        var orig = minimatch;
        var m = function minimatch(p, pattern, options) {
          return orig.minimatch(p, pattern, ext(def, options));
        };
        m.Minimatch = function Minimatch(pattern, options) {
          return new orig.Minimatch(pattern, ext(def, options));
        };
        return m;
      };
      Minimatch.defaults = function (def) {
        if (!def || !Object.keys(def).length)
          return Minimatch;
        return minimatch.defaults(def).Minimatch;
      };
      function minimatch(p, pattern, options) {
        if (typeof pattern !== 'string') {
          throw new TypeError('glob pattern string required');
        }
        if (!options)
          options = {};
        if (!options.nocomment && pattern.charAt(0) === '#') {
          return false;
        }
        if (pattern.trim() === '')
          return p === '';
        return new Minimatch(pattern, options).match(p);
      }
      function Minimatch(pattern, options) {
        if (!(this instanceof Minimatch)) {
          return new Minimatch(pattern, options, cache);
        }
        if (typeof pattern !== 'string') {
          throw new TypeError('glob pattern string required');
        }
        if (!options)
          options = {};
        pattern = pattern.trim();
        if (platform === 'win32') {
          pattern = pattern.split('\\').join('/');
        }
        var cacheKey = pattern + '\n' + sigmund(options);
        var cached = minimatch.cache.get(cacheKey);
        if (cached)
          return cached;
        minimatch.cache.set(cacheKey, this);
        this.options = options;
        this.set = [];
        this.pattern = pattern;
        this.regexp = null;
        this.negate = false;
        this.comment = false;
        this.empty = false;
        this.make();
      }
      Minimatch.prototype.debug = function () {
      };
      Minimatch.prototype.make = make;
      function make() {
        if (this._made)
          return;
        var pattern = this.pattern;
        var options = this.options;
        if (!options.nocomment && pattern.charAt(0) === '#') {
          this.comment = true;
          return;
        }
        if (!pattern) {
          this.empty = true;
          return;
        }
        this.parseNegate();
        var set = this.globSet = this.braceExpand();
        if (options.debug)
          this.debug = console.error;
        this.debug(this.pattern, set);
        set = this.globParts = set.map(function (s) {
          return s.split(slashSplit);
        });
        this.debug(this.pattern, set);
        set = set.map(function (s, si, set) {
          return s.map(this.parse, this);
        }, this);
        this.debug(this.pattern, set);
        set = set.filter(function (s) {
          return -1 === s.indexOf(false);
        });
        this.debug(this.pattern, set);
        this.set = set;
      }
      Minimatch.prototype.parseNegate = parseNegate;
      function parseNegate() {
        var pattern = this.pattern, negate = false, options = this.options, negateOffset = 0;
        if (options.nonegate)
          return;
        for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === '!'; i++) {
          negate = !negate;
          negateOffset++;
        }
        if (negateOffset)
          this.pattern = pattern.substr(negateOffset);
        this.negate = negate;
      }
      minimatch.braceExpand = function (pattern, options) {
        return new Minimatch(pattern, options).braceExpand();
      };
      Minimatch.prototype.braceExpand = braceExpand;
      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }
      function braceExpand(pattern, options) {
        options = options || this.options;
        pattern = typeof pattern === 'undefined' ? this.pattern : pattern;
        if (typeof pattern === 'undefined') {
          throw new Error('undefined pattern');
        }
        if (options.nobrace || !pattern.match(/\{.*\}/)) {
          return [pattern];
        }
        var escaping = false;
        if (pattern.charAt(0) !== '{') {
          this.debug(pattern);
          var prefix = null;
          for (var i = 0, l = pattern.length; i < l; i++) {
            var c = pattern.charAt(i);
            this.debug(i, c);
            if (c === '\\') {
              escaping = !escaping;
            } else if (c === '{' && !escaping) {
              prefix = pattern.substr(0, i);
              break;
            }
          }
          if (prefix === null) {
            this.debug('no sets');
            return [pattern];
          }
          var tail = braceExpand.call(this, pattern.substr(i), options);
          return tail.map(function (t) {
            return prefix + t;
          });
        }
        var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/);
        if (numset) {
          this.debug('numset', numset[1], numset[2]);
          var suf = braceExpand.call(this, pattern.substr(numset[0].length), options), start = +numset[1], needPadding = numset[1][0] === '0', startWidth = numset[1].length, padded, end = +numset[2], inc = start > end ? -1 : 1, set = [];
          for (var i = start; i != end + inc; i += inc) {
            padded = needPadding ? pad(i, startWidth) : i + '';
            for (var ii = 0, ll = suf.length; ii < ll; ii++) {
              set.push(padded + suf[ii]);
            }
          }
          return set;
        }
        var i = 1, depth = 1, set = [], member = '', sawEnd = false, escaping = false;
        function addMember() {
          set.push(member);
          member = '';
        }
        this.debug('Entering for');
        FOR:
          for (i = 1, l = pattern.length; i < l; i++) {
            var c = pattern.charAt(i);
            this.debug('', i, c);
            if (escaping) {
              escaping = false;
              member += '\\' + c;
            } else {
              switch (c) {
              case '\\':
                escaping = true;
                continue;
              case '{':
                depth++;
                member += '{';
                continue;
              case '}':
                depth--;
                if (depth === 0) {
                  addMember();
                  i++;
                  break FOR;
                } else {
                  member += c;
                  continue;
                }
              case ',':
                if (depth === 1) {
                  addMember();
                } else {
                  member += c;
                }
                continue;
              default:
                member += c;
                continue;
              }
            }
          }
        if (depth !== 0) {
          this.debug('didn\'t close', pattern);
          return braceExpand.call(this, '\\' + pattern, options);
        }
        this.debug('set', set);
        this.debug('suffix', pattern.substr(i));
        var suf = braceExpand.call(this, pattern.substr(i), options);
        var addBraces = set.length === 1;
        this.debug('set pre-expanded', set);
        set = set.map(function (p) {
          return braceExpand.call(this, p, options);
        }, this);
        this.debug('set expanded', set);
        set = set.reduce(function (l, r) {
          return l.concat(r);
        });
        if (addBraces) {
          set = set.map(function (s) {
            return '{' + s + '}';
          });
        }
        var ret = [];
        for (var i = 0, l = set.length; i < l; i++) {
          for (var ii = 0, ll = suf.length; ii < ll; ii++) {
            ret.push(set[i] + suf[ii]);
          }
        }
        return ret;
      }
      Minimatch.prototype.parse = parse;
      var SUBPARSE = {};
      function parse(pattern, isSub) {
        var options = this.options;
        if (!options.noglobstar && pattern === '**')
          return GLOBSTAR;
        if (pattern === '')
          return '';
        var re = '', hasMagic = !!options.nocase, escaping = false, patternListStack = [], plType, stateChar, inClass = false, reClassStart = -1, classStart = -1, patternStart = pattern.charAt(0) === '.' ? '' : options.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)', self = this;
        function clearStateChar() {
          if (stateChar) {
            switch (stateChar) {
            case '*':
              re += star;
              hasMagic = true;
              break;
            case '?':
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += '\\' + stateChar;
              break;
            }
            self.debug('clearStateChar %j %j', stateChar, re);
            stateChar = false;
          }
        }
        for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
          this.debug('%s\t%s %s %j', pattern, i, re, c);
          if (escaping && reSpecials[c]) {
            re += '\\' + c;
            escaping = false;
            continue;
          }
          SWITCH:
            switch (c) {
            case '/':
              return false;
            case '\\':
              clearStateChar();
              escaping = true;
              continue;
            case '?':
            case '*':
            case '+':
            case '@':
            case '!':
              this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);
              if (inClass) {
                this.debug('  in class');
                if (c === '!' && i === classStart + 1)
                  c = '^';
                re += c;
                continue;
              }
              self.debug('call clearStateChar %j', stateChar);
              clearStateChar();
              stateChar = c;
              if (options.noext)
                clearStateChar();
              continue;
            case '(':
              if (inClass) {
                re += '(';
                continue;
              }
              if (!stateChar) {
                re += '\\(';
                continue;
              }
              plType = stateChar;
              patternListStack.push({
                type: plType,
                start: i - 1,
                reStart: re.length
              });
              re += stateChar === '!' ? '(?:(?!' : '(?:';
              this.debug('plType %j %j', stateChar, re);
              stateChar = false;
              continue;
            case ')':
              if (inClass || !patternListStack.length) {
                re += '\\)';
                continue;
              }
              clearStateChar();
              hasMagic = true;
              re += ')';
              plType = patternListStack.pop().type;
              switch (plType) {
              case '!':
                re += '[^/]*?)';
                break;
              case '?':
              case '+':
              case '*':
                re += plType;
              case '@':
                break;
              }
              continue;
            case '|':
              if (inClass || !patternListStack.length || escaping) {
                re += '\\|';
                escaping = false;
                continue;
              }
              clearStateChar();
              re += '|';
              continue;
            case '[':
              clearStateChar();
              if (inClass) {
                re += '\\' + c;
                continue;
              }
              inClass = true;
              classStart = i;
              reClassStart = re.length;
              re += c;
              continue;
            case ']':
              if (i === classStart + 1 || !inClass) {
                re += '\\' + c;
                escaping = false;
                continue;
              }
              hasMagic = true;
              inClass = false;
              re += c;
              continue;
            default:
              clearStateChar();
              if (escaping) {
                escaping = false;
              } else if (reSpecials[c] && !(c === '^' && inClass)) {
                re += '\\';
              }
              re += c;
            }
        }
        if (inClass) {
          var cs = pattern.substr(classStart + 1), sp = this.parse(cs, SUBPARSE);
          re = re.substr(0, reClassStart) + '\\[' + sp[0];
          hasMagic = hasMagic || sp[1];
        }
        var pl;
        while (pl = patternListStack.pop()) {
          var tail = re.slice(pl.reStart + 3);
          tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
            if (!$2) {
              $2 = '\\';
            }
            return $1 + $1 + $2 + '|';
          });
          this.debug('tail=%j\n   %s', tail, tail);
          var t = pl.type === '*' ? star : pl.type === '?' ? qmark : '\\' + pl.type;
          hasMagic = true;
          re = re.slice(0, pl.reStart) + t + '\\(' + tail;
        }
        clearStateChar();
        if (escaping) {
          re += '\\\\';
        }
        var addPatternStart = false;
        switch (re.charAt(0)) {
        case '.':
        case '[':
        case '(':
          addPatternStart = true;
        }
        if (re !== '' && hasMagic)
          re = '(?=.)' + re;
        if (addPatternStart)
          re = patternStart + re;
        if (isSub === SUBPARSE) {
          return [
            re,
            hasMagic
          ];
        }
        if (!hasMagic) {
          return globUnescape(pattern);
        }
        var flags = options.nocase ? 'i' : '', regExp = new RegExp('^' + re + '$', flags);
        regExp._glob = pattern;
        regExp._src = re;
        return regExp;
      }
      minimatch.makeRe = function (pattern, options) {
        return new Minimatch(pattern, options || {}).makeRe();
      };
      Minimatch.prototype.makeRe = makeRe;
      function makeRe() {
        if (this.regexp || this.regexp === false)
          return this.regexp;
        var set = this.set;
        if (!set.length)
          return this.regexp = false;
        var options = this.options;
        var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot, flags = options.nocase ? 'i' : '';
        var re = set.map(function (pattern) {
            return pattern.map(function (p) {
              return p === GLOBSTAR ? twoStar : typeof p === 'string' ? regExpEscape(p) : p._src;
            }).join('\\/');
          }).join('|');
        re = '^(?:' + re + ')$';
        if (this.negate)
          re = '^(?!' + re + ').*$';
        try {
          return this.regexp = new RegExp(re, flags);
        } catch (ex) {
          return this.regexp = false;
        }
      }
      minimatch.match = function (list, pattern, options) {
        options = options || {};
        var mm = new Minimatch(pattern, options);
        list = list.filter(function (f) {
          return mm.match(f);
        });
        if (mm.options.nonull && !list.length) {
          list.push(pattern);
        }
        return list;
      };
      Minimatch.prototype.match = match;
      function match(f, partial) {
        this.debug('match', f, this.pattern);
        if (this.comment)
          return false;
        if (this.empty)
          return f === '';
        if (f === '/' && partial)
          return true;
        var options = this.options;
        if (platform === 'win32') {
          f = f.split('\\').join('/');
        }
        f = f.split(slashSplit);
        this.debug(this.pattern, 'split', f);
        var set = this.set;
        this.debug(this.pattern, 'set', set);
        var filename;
        for (var i = f.length - 1; i >= 0; i--) {
          filename = f[i];
          if (filename)
            break;
        }
        for (var i = 0, l = set.length; i < l; i++) {
          var pattern = set[i], file = f;
          if (options.matchBase && pattern.length === 1) {
            file = [filename];
          }
          var hit = this.matchOne(file, pattern, partial);
          if (hit) {
            if (options.flipNegate)
              return true;
            return !this.negate;
          }
        }
        if (options.flipNegate)
          return false;
        return this.negate;
      }
      Minimatch.prototype.matchOne = function (file, pattern, partial) {
        var options = this.options;
        this.debug('matchOne', {
          'this': this,
          file: file,
          pattern: pattern
        });
        this.debug('matchOne', file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
          this.debug('matchOne loop');
          var p = pattern[pi], f = file[fi];
          this.debug(pattern, p, f);
          if (p === false)
            return false;
          if (p === GLOBSTAR) {
            this.debug('GLOBSTAR', [
              pattern,
              p,
              f
            ]);
            var fr = fi, pr = pi + 1;
            if (pr === pl) {
              this.debug('** at the end');
              for (; fi < fl; fi++) {
                if (file[fi] === '.' || file[fi] === '..' || !options.dot && file[fi].charAt(0) === '.')
                  return false;
              }
              return true;
            }
            WHILE:
              while (fr < fl) {
                var swallowee = file[fr];
                this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
                if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                  this.debug('globstar found match!', fr, fl, swallowee);
                  return true;
                } else {
                  if (swallowee === '.' || swallowee === '..' || !options.dot && swallowee.charAt(0) === '.') {
                    this.debug('dot detected!', file, fr, pattern, pr);
                    break WHILE;
                  }
                  this.debug('globstar swallow a segment, and continue');
                  fr++;
                }
              }
            if (partial) {
              this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
              if (fr === fl)
                return true;
            }
            return false;
          }
          var hit;
          if (typeof p === 'string') {
            if (options.nocase) {
              hit = f.toLowerCase() === p.toLowerCase();
            } else {
              hit = f === p;
            }
            this.debug('string match', p, f, hit);
          } else {
            hit = f.match(p);
            this.debug('pattern match', p, f, hit);
          }
          if (!hit)
            return false;
        }
        if (fi === fl && pi === pl) {
          return true;
        } else if (fi === fl) {
          return partial;
        } else if (pi === pl) {
          var emptyFileEnd = fi === fl - 1 && file[fi] === '';
          return emptyFileEnd;
        }
        throw new Error('wtf?');
      };
      function globUnescape(s) {
        return s.replace(/\\(.)/g, '$1');
      }
      function regExpEscape(s) {
        return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      }
    }(typeof require === 'function' ? require : null, this, typeof module === 'object' ? module : null, typeof process === 'object' ? process.platform : 'win32'));
}, {"__filename":"minimatch.js","__dirname":"node_modules/minimatch"}], 
'transform/wrap-modules': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), through = require('through2'), path = require('path'), debug = require('debug')('re-define:transform:wrap-modules'), File = require('vinyl'), minimatch = require('minimatch');
    module.exports = function (config) {
      return through.obj(function (files, enc, next) {
        var cuttingPoints = config.slice, chunks = {}, map = {}, self = this;
        var internal = _.filter(files, function (d) {
            return !d.isNull();
          }), external = _(files).pluck('name').uniq().difference(_.pluck(internal, 'name')).value();
        _.each(internal, function (dep) {
          var match = _.find(cuttingPoints, function (file, pattern) {
              return minimatch(dep.path, path.join(config.cwd && path.resolve(config.cwd) || process.cwd(), pattern));
            });
          if (match) {
            chunks[match] = chunks[match] || [];
            chunks[match].push(dep);
            map[dep.path] = match;
          }
        });
        debug('Wrapping: %o', files);
        _.each(chunks, function (files, output) {
          var bundle = {
              internal: files,
              external: getBundleExternals(files, external)
            }, file = new File({
              cwd: process.cwd(),
              base: path.resolve(process.cwd(), config.base),
              path: output
            });
          file.contents = new Buffer(config.wrappers[config.wrapper](bundle, config));
          self.push(file);
        });
        function getBundleExternals(files, external) {
          var deps = _(files).pluck('dependencies').flatten().map('name').value();
          return _.intersection(deps, external);
        }
        next();
      });
    };
}, {"__filename":"wrap-modules.js","__dirname":"lib/transform"}], 
'transform/rewrite-require': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), through = require('through2'), debug = require('debug')('re-define:transform:rewrite-require'), path = require('path');
    module.exports = function (config) {
      return through.obj(function (files, enc, next) {
        var cwd = config.cwd && path.resolve(config.cwd) || process.cwd(), internalBase = path.join(cwd, config.base), folders = _(files).filter(function (d) {
            return !d.isNull();
          }).each(function (d) {
            if (d.base.indexOf(cwd) === -1)
              d.base = path.resolve(d.base);
            d.external = internalBase !== d.base;
          }).filter(function (d) {
            return !d.isNull();
          }).each(function (f) {
            var idx, folders = config.alignToFolder;
            _.each(folders, function (d) {
              if ((idx = f.path.lastIndexOf(d)) > -1) {
                f.name = f.path.slice(idx, f.path.length).replace(d + '/', '');
              }
            });
            if (!f.external) {
              f.name = config.project ? f.name.indexOf('index') === -1 ? config.project + '/' + f.name : function () {
                if (path.dirname(f.path) === internalBase)
                  return config.project;
                else
                  return config.project + '/' + path.relative(cwd, path.dirname(f.path));
              }() : path.relative(cwd, f.path);
              f.name = f.name.replace('/index', '');
            }
            if (path.basename(path.dirname(f.path)) === f.requiredAs)
              f.name = f.requiredAs;
            if (f.path.indexOf('index.') > -1 && f.external)
              f.name = f.requiredAs;
            if (f.pkgName)
              f.name = f.pkgName;
          });
        _.each(files, function (f) {
          if (f.isNull()) {
            f.revert && f.revert();
            _.each(f.references, function (r) {
              r.revert && r.revert();
            });
          } else {
            updateReference(f, f.name);
            _.each(f.references, function (r) {
              updateReference(r, f.name);
            });
          }
        });
        function updateReference(dep, name) {
          dep.update && dep.update(name);
        }
        this.push(files);
        next();
      });
    };
}, {"__filename":"rewrite-require.js","__dirname":"lib/transform"}], 
'transform/sort-modules': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), through = require('through2'), debug = require('debug')('re-define:transform:sort-modules');
    module.exports = function (config) {
      return through.obj(function (files, enc, next) {
        var deps = sort(), order, internal, external;
        internal = _(files).filter(function (d) {
          return !d.isNull();
        }).each(function (m) {
          deps.register(m.name, _.pluck(m.dependencies, 'name'));
        }).tap(function () {
          order = deps.resolve();
        }).compact().sortBy(function (a) {
          return order.indexOf(a.name);
        }).value();
        external = _(files).uniq(function (m) {
          return m.requiredAs;
        }).difference(internal).value();
        debug('Files order ', _.pluck(files, 'name'));
        this.push((external || []).concat(internal || []));
        next();
      });
      function sort() {
        var nodes = {};
        return {
          register: register,
          resolve: resolve
        };
        function register(name, deps) {
          nodes[name] = deps;
        }
        function resolve() {
          var processing = [];
          return _.reduce(nodes, resolveNode, []);
          function resolveNode(result, num, node) {
            processing = processing || {};
            processing[node] = true;
            _.each(nodes[node], function (dep, i) {
              if (result.indexOf(dep) !== -1)
                return;
              if (processing[dep]) {
                JSON.parse(config.showWarnings) && console.log('//warning: circular dependency found in %s referenced by %s.', dep, _(nodes).keys().first());
                return;
              }
              resolveNode(result, i, dep);
            });
            if (result.indexOf(node) === -1) {
              processing[node] = false;
              result.push(node);
            }
            return result;
          }
        }
      }
    };
}, {"__filename":"sort-modules.js","__dirname":"lib/transform"}], 
'index': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash'), combiner = require('stream-combiner'), through = require('through2'), Module = require('re-define-module'), debug = require('debug')('re-define:index'), path = require('path');
    module.exports = {
      bundle: bundle,
      config: require('config'),
      template: require('wrapper/external-template')
    };
    function bundle(config, transform) {
      var loadFile = require('file/load'), getDeps = require('transform/get-deps'), getAST = require('transform/get-ast'), processAMD = require('transform/amd-to-cjs'), escapeRAW = require('transform/escape-raw'), amdPlugin = require('transform/amd-plugin'), convertAST = require('transform/convert-ast'), wrap = require('transform/wrap-modules'), rewrite = require('transform/rewrite-require'), sort = require('transform/sort-modules');
      var converter, options = { objectMode: true }, stream, files = [], paths = [], pending = 0, cwd = process.cwd();
      stream = through(options, function (file, enc, next) {
        if (!file.path) {
          throw new Error('Missing path for file!');
          return;
        }
        if (file.path.indexOf(cwd) === -1)
          file.path = path.resolve(file.path);
        file = Module(file);
        if (paths.indexOf(file.path) === -1) {
          if (files.indexOf(file) === -1)
            files.push(file);
          converter.write(file);
          paths.push(file.path);
        } else {
          var processing = _.find(files, function (p) {
              return _.find(p.paths, function (d) {
                if (d.indexOf(process.cwd()) > -1 && d === file.path)
                  return p;
              });
            });
          if (processing) {
            processing.references = file;
            _.merge(processing, {
              name: file.name,
              cwd: file.cwd,
              base: file.base,
              requiredAs: file.requiredAs
            });
          }
        }
        next();
      }, function (end) {
        this.push(files);
        end();
      });
      converter = through(options, function (file, enc, next) {
        pending++;
        this.push(file);
        next();
      });
      converter.pipe(loadFile(config).on('alreadyLoaded', function (f) {
        var ref = _.find(files, function (d) {
            if (d != f && d.path === f.path)
              return d;
          });
        if (ref)
          ref.references = f;
        _.remove(files, f);
      })).pipe(defaultTransform(transform, stream)).pipe(through(options, function (file, enc, next) {
        pending--;
        checkIfEnd();
        next();
      }));
      return combiner([
        stream,
        rewrite(config),
        sort(config),
        convertAST(config),
        wrap(config)
      ]);
      function checkIfEnd() {
        if (pending === 0) {
          converter.end();
          stream.end();
        }
      }
      function defaultTransform(transform, writer) {
        var custom = _.map(transform, function (t) {
            if (typeof t === 'function')
              return t;
            if (typeof t === 'object')
              return _.partial(t);
            return require(t);
          });
        return prepareStreams(config, writer, (custom || []).concat([
          getAST,
          escapeRAW,
          processAMD,
          amdPlugin,
          getDeps
        ]));
      }
    }
    function prepareStreams(config, writer, streams) {
      config = config || require('config')();
      return _.compose(combine, applyConfig)(streams);
      function combine(streams) {
        return combiner.apply(null, streams);
      }
      function applyConfig(streams) {
        return _.map(streams, function (s) {
          return s(config, writer);
        });
      }
    }
}, {"__filename":"index.js","__dirname":"lib"}]
}
, {} 
, []
)
