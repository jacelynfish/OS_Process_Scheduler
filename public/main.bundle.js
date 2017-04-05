webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/**
 * vuex v2.2.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
};

var prototypeAccessors$1 = { state: {},namespaced: {} };

prototypeAccessors$1.state.get = function () {
  return this._rawModule.state || {}
};

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  var this$1 = this;

  // register root module (Vuex.Store options)
  this.root = new Module(rawRootModule, false);

  // register all nested modules
  if (rawRootModule.modules) {
    forEachValue(rawRootModule.modules, function (rawModule, key) {
      this$1.register([key], rawModule, false);
    });
  }
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update(this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  var parent = this.get(path.slice(0, -1));
  var newModule = new Module(rawModule, runtime);
  parent.addChild(path[path.length - 1], newModule);

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (targetModule, newModule) {
  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        );
        return
      }
      update(targetModule.getChild(key), newModule.modules[key]);
    }
  }
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); });
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.");
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    console.error(("[vuex] unknown mutation type: " + type));
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (options && options.silent) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var entry = this._actions[type];
  if (!entry) {
    console.error(("[vuex] unknown action type: " + type));
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers;
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  assert(typeof getter === 'function', "store.watch only accepts a function.");
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule) {
  if (typeof path === 'string') { path = [path]; }
  assert(Array.isArray(path), "module path must be a string or an Array.");
  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path));
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }
  assert(Array.isArray(path), "module path must be a string or an Array.");
  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (namespace) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var namespacedType = namespace + key;
    registerAction(store, namespacedType, action, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler(local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    console.error(("[vuex] duplicate getter key: " + type));
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    );
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapMutations', namespace)) {
        return
      }
      return this.$store.commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapActions', namespace)) {
        return
      }
      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (!module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.2.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
};

/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vuex = __webpack_require__(0);

var _vuex2 = _interopRequireDefault(_vuex);

var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({

    state: {
        currentTasks: [],
        startOn: true,
        pauseOn: false,
        stepDebugOn: true
    },
    getters: {
        getCurrentTasks: function getCurrentTasks(state) {

            return state.currentTasks;
        },
        isNewAdded: function isNewAdded(state) {
            return state.isNewAdded;
        },
        startOn: function startOn(state) {
            return state.startOn;
        },
        pauseOn: function pauseOn(state) {
            return state.pauseOn;
        },
        stepDebugOn: function stepDebugOn(state) {
            return state.stepDebugOn;
        }
    },
    mutations: {
        addTasks: function addTasks(state, newTask) {
            var _state$currentTasks;

            (_state$currentTasks = state.currentTasks).push.apply(_state$currentTasks, _toConsumableArray(newTask));
        },
        delTask: function delTask(state, idx) {
            state.currentTasks.splice(idx, 1);
        },
        toggleStartOn: function toggleStartOn(state, mode) {
            state.startOn = mode;
        },
        toggleDebugOn: function toggleDebugOn(state, mode) {
            state.stepDebugOn = mode;
        },
        togglePauseOn: function togglePauseOn(state, mode) {
            state.pauseOn = mode;
        }
    }
});

exports.default = store;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(13)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(8),
  /* template */
  __webpack_require__(18),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/jacelynfish/Documents/MUST/1702/CO003_Operating_Systems/bonus_proj/src/components/mainFunction.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mainFunction.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-612e64db", Component.options)
  } else {
    hotAPI.reload("data-v-612e64db", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(1);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(0);

var _vuex2 = _interopRequireDefault(_vuex);

var _mainFunction = __webpack_require__(4);

var _mainFunction2 = _interopRequireDefault(_mainFunction);

var _store = __webpack_require__(3);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by jacelynfish on 2017/4/2.
 */
_vue2.default.config.devtools = true;
_vue2.default.use(_vuex2.default);

var eventHub = new _vue2.default();

_vue2.default.mixin({
    data: function data() {
        return {
            eventHub: eventHub
        };
    }
});
new _vue2.default({
    el: '#app',
    template: '\n        <main-function></main-function>\n    ',
    components: {
        mainFunction: _mainFunction2.default
    },
    store: _store2.default

});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function PubSub() {

    this.topics = {};
    this.subRecords = new Map();
}

PubSub.prototype.publish = function (topic) {
    if (!this.topics[topic]) {
        this.topics[topic] = [];
    }

    var subscribers = this.topics[topic],
        len = subscribers.length;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    while (len--) {
        var _subscribers$len;

        (_subscribers$len = subscribers[len]).cb.apply(_subscribers$len, args);
    }
};

PubSub.prototype.subscribe = function (topic, cb) {
    if (!this.topics[topic]) {
        this.topics[topic] = [];
    }
    var token = new Date().valueOf();

    this.topics[topic].push({
        token: token,
        cb: cb
    });
    this.subRecords.set(token, topic);
    return token;
};

PubSub.prototype.unsubscribe = function (token) {
    if (this.subRecords.has(token)) {
        var topic = this.subRecords.get(token);
        this.topics[topic] = undefined;
        delete this.topics[topic];

        return true;
    }
    return false;
};

exports.default = PubSub;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _PubSub = __webpack_require__(6);

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Created by jacelynfish on 2017/4/2.
                                                                                                                                                                                                     */

function PreScheduler(options) {

    _PubSub2.default.call(this);
    var enterQueue = options.queue,
        taskQueue = options.taskQueue,
        runningQueue = options.runningQueue,
        isStepDebug = options.isStepDebug,
        timer = false,
        timeSlot = options.timeSlot || 4,
        sortMethod = options.sortMethod || 'remainTime',
        currentTask = {},
        self = this,
        elapseTimer = null,
        record = new Map();
    var isFirst = true,
        isSame,
        stepDebugNext,
        stepDebugNextTask;

    options.timeElapse = 0;

    function timeSort() {
        var tasksArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var method = arguments[1];


        if (!tasksArr.length) return [];
        return tasksArr.sort(function (a, b) {

            if (a[method] == b[method]) {
                return a.arriveTime - b.arriveTime;
            } else {
                return a[method] - b[method];
            }
        });
    }

    function init() {

        self.subscribe('newTask', newTaskHandler);
        self.subscribe('nextTask', function () {
            runScheduler(true);
        });

        enterQueue = timeSort(enterQueue, 'arriveTime');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = enterQueue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var task = _step.value;

                task.endTime = -1;
                task.isOn = false;
                task.remainTime = task.cpuTime;
                task.timeSlot = timeSlot;
                if (!record.has(task.arriveTime)) {
                    record.set(task.arriveTime, [task]);
                } else {
                    var list = record.get(task.arriveTime);
                    list.push(task);
                    record.set(task.arriveTime, list);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    function start() {
        isFirst = true;
        isSame = true;
        stepDebugNext = false;
        enterQueue = options.queue;
        init();
        runScheduler(true);
    }
    function stop() {
        timer = false;
        clearInterval(elapseTimer);
        enterQueue = [];
        taskQueue = [];
        currentTask = {};
        record = new Map();
        options.timeElapse = 0;
    }
    function pause() {
        clearInterval(elapseTimer);
        timer = false;
        //console.log('pause');
    }
    function goon() {
        timer = true;
        taskProcess();
    }

    function runStepScheduler() {
        if (isFirst) {
            isSame = true;
            stepDebugNext = true;
            enterQueue = options.queue;
            record = new Map();

            init();
        }
        runScheduler(isFirst ? true : stepDebugNextTask);
    }

    function stopStepScheduler() {
        isFirst = true;
        isSame = true;
        stepDebugNext = true;
        enterQueue = options.queue;
        record = new Map();
    }
    function runScheduler(isNextTask) {
        if (isStepDebug || !timer) {
            //mutex
            clearInterval(elapseTimer);

            if (!taskQueue.length && isNextTask) {
                if (!isStepDebug) {
                    if (isFirst) {
                        addTime();
                    } else {
                        elapseTimer = setInterval(function () {
                            addTime();
                        }, 1000);
                    }
                } else {
                    addTime();
                }
            } else {
                if (options.type == 'preemptive') {

                    if (isStepDebug) {
                        if (stepDebugNext || stepDebugNextTask) {
                            taskQueue = timeSort(taskQueue, sortMethod);

                            currentTask = taskQueue.shift();
                        }
                        stepDebugNext = false;
                    } else {
                        taskQueue = timeSort(taskQueue, sortMethod);
                        currentTask = taskQueue.shift();
                    }
                }

                if (options.type == 'nonpreemptive') {
                    if (isNextTask) //0------------
                        taskQueue = timeSort(taskQueue, sortMethod);
                }
                if (options.type == 'rr' || options.type == 'fcfs' || options.type == 'nonpreemptive') {
                    if (isFirst || isNextTask) {
                        currentTask = taskQueue.shift();
                    }
                }

                if (!currentTask.isOn) {
                    currentTask.isOn = true;
                }
                timer = true;

                if (isStepDebug) {
                    if (isFirst) {
                        isFirst = false;
                    }
                    taskProcess();
                } else {
                    if (isFirst || isNextTask) {
                        setTimeout(taskProcess, 0);
                        isFirst = false;
                    } else {
                        setTimeout(taskProcess, 1000);
                    }
                }
            }
        }
    }

    function taskProcess() {

        if (isStepDebug || timer) {
            //mutex

            if (currentTask.remainTime == 0 || currentTask.timeSlot == 0) {

                timer = false;

                if (currentTask.remainTime == 0) {
                    currentTask.endTime = options.timeElapse - 1;
                }
                if (currentTask.timeSlot == 0 && currentTask.remainTime != 0) {
                    currentTask.timeSlot = timeSlot;
                    taskQueue.push(currentTask);
                }

                if (isStepDebug) {
                    stepDebugNextTask = true;
                    runStepScheduler(true);
                } else {
                    self.publish('nextTask');
                }
            } else {
                if (isStepDebug) {
                    stepDebugNextTask = false;
                }
                currentTask.remainTime--;
                if (options.type == 'rr') {
                    currentTask.timeSlot--;
                }
                runningQueue.push(currentTask.pid);

                addTime();

                if (!isStepDebug && isSame) {
                    setTimeout(taskProcess, 1000);
                }
            }
        }
    }

    function addTime() {

        if (record.has(options.timeElapse)) {
            isSame = false;
            clearInterval(elapseTimer);
            var records = record.get(options.timeElapse);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = records[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var r = _step2.value;

                    //console.log(options.timeElapse, `Job ${r.pid} came into queue`);
                    r.remainTime = r.cpuTime;
                    r.isOn = false;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            timer = false;

            newTaskHandler(records);
        } else {
            isSame = true;
        }

        options.timeElapse++;
    }
    function newTaskHandler(tasks) {
        var _taskQueue;

        //ensure the currentTask is not an empty object
        if (options.type == 'preemptive') {
            if (Object.keys(currentTask).length) {
                taskQueue.push(currentTask);
            }
        }
        (_taskQueue = taskQueue).push.apply(_taskQueue, _toConsumableArray(tasks));
        if (isStepDebug) {
            stepDebugNext = true;
            stepDebugNextTask = false;
        } else {
            runScheduler(false);
        }
    }

    function add(newTask) {
        var temp;
        newTask.arriveTime = options.timeElapse;
        newTask.timeSlot = timeSlot;
        if (record.has(newTask.arriveTime)) {
            temp = record.get(newTask.arriveTime);
        } else {
            temp = [];
        }
        temp.push(newTask);
        record.set(newTask.arriveTime, temp);

        if (isStepDebug) {
            addTime();
        }
    }
    return {
        start: start,
        stop: stop,
        pause: pause,
        continue: goon,
        add: add,
        runStepScheduler: runStepScheduler,
        stopStepScheduler: stopStepScheduler

    };
}
PreScheduler.prototype = Object.create(_PubSub2.default.prototype);

exports.default = PreScheduler;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _vuex = __webpack_require__(0);

var _scheduler = __webpack_require__(14);

var _scheduler2 = _interopRequireDefault(_scheduler);

var _taskInput = __webpack_require__(15);

var _taskInput2 = _interopRequireDefault(_taskInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    components: {
        scheduler: _scheduler2.default,
        taskInput: _taskInput2.default
    },
    created: function created() {
        this.addCurrentTask(this.defaultTasks);
        this.currentTasks = this.getCurrentTasks;
    },


    computed: _extends({}, (0, _vuex.mapGetters)(['getCurrentTasks', 'startOn', 'stepDebugOn'])),
    data: function data() {
        return {
            currentTasks: this.getCurrentTasks,
            defaultTasks: [{
                pid: 1,
                arriveTime: 0,
                cpuTime: 12,
                startTime: -1,
                endTime: -1,
                priority: 1

            }, {
                pid: 4,
                arriveTime: 8,
                cpuTime: 10,
                startTime: -1,
                endTime: -1,
                priority: 3

            }, {
                pid: 2,
                arriveTime: 2,
                cpuTime: 4,
                startTime: -1,
                endTime: -1,
                priority: 3

            }, {
                pid: 5,
                arriveTime: 10,
                cpuTime: 6,
                startTime: -1,
                endTime: -1,
                priority: 2

            }, {
                pid: 3,
                arriveTime: 5,
                cpuTime: 2,
                startTime: -1,
                endTime: -1,
                priority: 1

            }],
            isAdd: false
        };
    },
    methods: _extends({}, (0, _vuex.mapMutations)({
        addCurrentTask: 'addTasks',
        delTask: 'delTask'
    }), {
        deleteTask: function deleteTask(idx) {
            console.log(idx);
            this.delTask(idx);
        }
    })
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _Scheduler = __webpack_require__(7);

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _vuex = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    computed: _extends({}, (0, _vuex.mapGetters)({
        tasks: 'getCurrentTasks',
        startOn: 'startOn',
        pauseOn: 'pauseOn',
        stepDebugOn: 'stepDebugOn'

    })),
    created: function created() {
        //            this.tasks = this.getCurrentTasks;
        this.eventHub.$on('addNewTask', this.addTask);
    },


    data: function data() {
        return {
            debugSwitchMes: 'start stepping over',
            aWaitingTimeStr: '',
            isSecondChoose: false,
            isStepFirstTime: true,
            schedulerType: {

                rr: 'Round Robin',
                fcfs: 'First come first served',
                preemptive: 'Preemptive',
                nonpreemptive: 'Non-preemptive'
            },

            options: {
                timeElapse: 0,
                queue: [],
                sortedMethod: 'remainTime',
                type: 'rr',
                taskQueue: [],
                runningQueue: []
            },
            scheduler: {}
        };
    },
    methods: _extends({}, (0, _vuex.mapMutations)(['addTasks', 'toggleStartOn', 'togglePauseOn', 'toggleDebugOn']), {
        changeSchedulerMode: function changeSchedulerMode() {
            if (this.options.type == 'preemptive' || this.options.type == "nonpreemptive") this.isSecondChoose = true;else this.isSecondChoose = false;
        },
        toggleDebug: function toggleDebug() {
            if (this.stepDebugOn == true) {
                this.toggleDebugOn(false);
                this.debugSwitchMes = 'stop stepping over';
                this.aWaitingTimeStr = '';

                this.options.queue = this.tasks;
                this.options.isStepDebug = true;
                this.scheduler = new _Scheduler2.default(this.options);
            } else {
                this.toggleDebugOn(true);
                this.debugSwitchMes = 'start stepping over';

                this.scheduler.stopStepScheduler();
                this.scheduler = {};
                this.options.taskQueue = [];
                this.options.runningQueue = [];

                this.calATime();
            }
        },
        debugNextStep: function debugNextStep() {
            this.scheduler.runStepScheduler();
        },

        run: function run() {
            this.toggleStartOn(false);
            this.togglePauseOn(true);
            this.aWaitingTimeStr = '';

            this.options.queue = this.tasks;
            this.options.isStepDebug = false;
            this.scheduler = new _Scheduler2.default(this.options);

            this.scheduler.start();
        },

        stop: function stop() {

            this.toggleStartOn(true);
            this.togglePauseOn(false);

            this.scheduler.stop();
            this.scheduler = {};
            this.options.taskQueue = [];
            this.options.runningQueue = [];

            this.calATime();
        },
        con: function con() {
            this.togglePauseOn(true);
            this.scheduler.continue();
        },
        pause: function pause() {
            this.togglePauseOn(false);
            this.scheduler.pause();
        },
        addTask: function addTask(task) {
            if (!this.startOn || !this.stepDebugOn) {
                this.scheduler.add(task);
            }
        },
        calATime: function calATime() {
            var tempStr = '(',
                totalTime = 0;
            for (var i = 0; i < this.tasks.length; i++) {
                var task = this.tasks[i];
                var waitingTime = task.endTime - task.arriveTime - task.cpuTime;
                tempStr += waitingTime;
                if (i != this.tasks.length - 1) {
                    tempStr += ' + ';
                } else {
                    tempStr += ')/' + this.tasks.length + ' = ';
                }

                totalTime += waitingTime;
            }
            tempStr += Number(totalTime / this.tasks.length).toFixed(2);

            this.aWaitingTimeStr = tempStr;
        }
    })

};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _vuex = __webpack_require__(0);

exports.default = {
    created: function created() {},

    computed: _extends({}, (0, _vuex.mapGetters)(['startOn', 'stepDebugOn', 'getCurrentTasks'])),
    data: function data() {
        return {
            fileDropClass: {
                'enable-file': this.startOn || this.stepDebugOn,
                'disable-file': !this.startOn && !this.stepDebugOn
            },
            newTask: {
                cpuTime: 0,
                pid: -1,
                priority: 0,
                arriveTime: 0
            }
        };
    },
    methods: _extends({}, (0, _vuex.mapMutations)({
        addCurrentTask: 'addTasks'
    }), {
        addTask: function addTask() {
            var temp = Object.assign({}, this.newTask);
            temp.arriveTime = Number(temp.arriveTime);
            temp.priority = Number(temp.priority);
            this.addCurrentTask([temp]);
            this.eventHub.$emit('addNewTask', temp);
        },
        dragoverHandler: function dragoverHandler() {},
        dropHandler: function dropHandler(e) {
            if (!this.startOn || !this.stepDebugOn) {
                return false;
            } else {
                var self = this;
                var reader = new FileReader();

                var file = e.dataTransfer.files[0];
                var result;
                reader.readAsText(file);

                reader.addEventListener('load', function () {
                    var _console;

                    result = reader.result;
                    var records = [];
                    var resultLines = result.split('\n');
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = resultLines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var r = _step.value;

                            if (r == "") {
                                continue;
                            }

                            var record = r.split('\t');
                            var temp = {};
                            temp.pid = record[0];
                            temp.arriveTime = Number(record[1]);
                            temp.cpuTime = Number(record[2]);
                            temp.priority = Number(record[3]);

                            records.push(temp);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    (_console = console).log.apply(_console, records);
                    self.addCurrentTask(records);
                });
            }
        }
    })
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 13 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(11)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(9),
  /* template */
  __webpack_require__(16),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/jacelynfish/Documents/MUST/1702/CO003_Operating_Systems/bonus_proj/src/components/scheduler.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] scheduler.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4cd16dfe", Component.options)
  } else {
    hotAPI.reload("data-v-4cd16dfe", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(12)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(10),
  /* template */
  __webpack_require__(17),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/jacelynfish/Documents/MUST/1702/CO003_Operating_Systems/bonus_proj/src/components/taskInput.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] taskInput.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ce6108b", Component.options)
  } else {
    hotAPI.reload("data-v-4ce6108b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.options.type),
      expression: "options.type"
    }],
    on: {
      "change": [function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.options.type = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }, _vm.changeSchedulerMode]
    }
  }, _vm._l((_vm.schedulerType), function(type, key) {
    return _c('option', {
      domProps: {
        "value": key
      }
    }, [_vm._v(_vm._s(type))])
  })), _vm._v(" "), (_vm.isSecondChoose) ? _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.options.sortMethod),
      expression: "options.sortMethod"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.options.sortMethod = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "remainTime"
    }
  }, [_vm._v("Shortest Job first")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "priority"
    }
  }, [_vm._v("Priority")])]) : _vm._e(), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.stepDebugOn || !_vm.startOn
    },
    on: {
      "click": _vm.run
    }
  }, [_vm._v("start")]), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.stepDebugOn || _vm.startOn
    },
    on: {
      "click": _vm.stop
    }
  }, [_vm._v("stop")]), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.stepDebugOn || (_vm.startOn || !_vm.pauseOn)
    },
    on: {
      "click": _vm.pause
    }
  }, [_vm._v("pause")]), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.stepDebugOn || (_vm.startOn || _vm.pauseOn)
    },
    on: {
      "click": _vm.con
    }
  }, [_vm._v("continue")]), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.startOn
    },
    on: {
      "click": _vm.toggleDebug
    }
  }, [_vm._v(_vm._s(_vm.debugSwitchMes))]), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.startOn || _vm.stepDebugOn
    },
    on: {
      "click": _vm.debugNextStep
    }
  }, [_vm._v("next step")]), _vm._v(" "), _c('div', [_c('p', [_vm._v("Average waiting time: " + _vm._s(_vm.aWaitingTimeStr))])]), _vm._v(" "), _c('div', [_vm._v("\n        Ready Queue\n        "), _c('ul', {
    attrs: {
      "id": "task-queue"
    }
  }, _vm._l((_vm.options.taskQueue), function(task) {
    return _c('li', {
      staticClass: "task-queue-item"
    }, [_vm._v(_vm._s(task.pid))])
  }))]), _vm._v(" "), _c('div', [_vm._v("\n        Running Timeline\n        "), _c('ul', {
    attrs: {
      "id": "running-queue"
    }
  }, _vm._l((_vm.options.runningQueue), function(task) {
    return _c('li', {
      staticClass: "running-queue-item"
    }, [_vm._v(_vm._s(task))])
  }))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4cd16dfe", module.exports)
  }
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    class: [{
      disableFile: (!_vm.startOn || !_vm.stepDebugOn)
    }],
    attrs: {
      "id": "file-drop"
    },
    on: {
      "dragover": function($event) {
        $event.preventDefault();
        _vm.dragoverHandler($event)
      },
      "drop": function($event) {
        $event.preventDefault();
        _vm.dropHandler($event)
      }
    }
  }, [_vm._v("\n        Please drap your file here to upload.\n    ")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newTask.cpuTime),
      expression: "newTask.cpuTime"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.newTask.cpuTime)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newTask.cpuTime = $event.target.value
      }
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newTask.pid),
      expression: "newTask.pid"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.newTask.pid)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newTask.pid = $event.target.value
      }
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newTask.priority),
      expression: "newTask.priority"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.newTask.priority)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newTask.priority = $event.target.value
      }
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newTask.arriveTime),
      expression: "newTask.arriveTime"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.newTask.arriveTime)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newTask.arriveTime = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    on: {
      "click": _vm.addTask
    }
  }, [_vm._v("add")])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4ce6108b", module.exports)
  }
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('table', {
    attrs: {
      "id": "current-task-panel"
    }
  }, [_vm._m(0), _vm._v(" "), _c('tbody', _vm._l((_vm.getCurrentTasks), function(task, key) {
    return _c('tr', [_c('td', [_vm._v(_vm._s(task.pid))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.arriveTime))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.cpuTime))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.priority))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.endTime >= 0 ? task.endTime : NaN))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.endTime >= 0 ? task.endTime - task.arriveTime : NaN))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.endTime >= 0 ? task.endTime - task.arriveTime - task.cpuTime : NaN))]), _vm._v(" "), _c('td', [_c('button', {
      attrs: {
        "disabled": !_vm.startOn || !_vm.stepDebugOn
      },
      on: {
        "click": function($event) {
          _vm.deleteTask(key)
        }
      }
    }, [_vm._v("delete")])])])
  }))]), _vm._v(" "), _c('task-input'), _vm._v(" "), _c('scheduler')], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', [_c('th', [_vm._v("pid")]), _vm._v(" "), _c('th', [_vm._v("arrive time")]), _vm._v(" "), _c('th', [_vm._v("cpu time")]), _vm._v(" "), _c('th', [_vm._v("priority")]), _vm._v(" "), _c('th', [_vm._v("end time")]), _vm._v(" "), _c('th', [_vm._v("turnaround time")]), _vm._v(" "), _c('th', [_vm._v("waiting time")]), _vm._v(" "), _c('th', [_vm._v("delete")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-612e64db", module.exports)
  }
}

/***/ })
],[5]);