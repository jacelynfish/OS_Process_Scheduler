webpackJsonp([0],[
/* 0 */
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
/* 1 */
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
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(25)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(17),
  /* template */
  __webpack_require__(35),
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
  * vue-router v2.4.0
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (false) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (h, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      if (matched.instances[name] !== vm) {
        matched.instances[name] = val;
      }
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (false) {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    'production' !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: {
      type: String,
      default: 'router-link-active'
    },
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var activeClass = globalActiveClass == null
      ? this.activeClass
      : globalActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[activeClass] = this.exact
      ? isSameRoute(current, compareTarget)
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed) { return }
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this.$root._route }
  });

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

/*  */

function createRouteMap (
  routes,
  oldPathMap,
  oldNameMap
) {
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathMap, nameMap, route);
  });

  return {
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (false) {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var record = {
    path: normalizePath(path, parent),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (false) {
      if (route.name && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(pathMap, nameMap, aliasRoute, parent, record.path);
      });
    } else {
      var aliasRoute = {
        path: route.alias,
        children: route.children
      };
      addRouteRecord(pathMap, nameMap, aliasRoute, parent, record.path);
    }
  }

  if (!pathMap[record.path]) {
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (false) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var isarray = index$1;

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCache = Object.create(null);

function getRouteRegex (path) {
  var hit = regexpCache[path];
  var keys, regexp;

  if (hit) {
    keys = hit.keys;
    regexp = hit.regexp;
  } else {
    keys = [];
    regexp = index(path, keys);
    regexpCache[path] = { keys: keys, regexp: regexp };
  }

  return { keys: keys, regexp: regexp }
}

var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (false) {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (false) {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : (current && current.path) || '/';

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (false) {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      var paramNames = getRouteRegex(record.path).keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var path in pathMap) {
        if (matchRoute(path, location.params, location.path)) {
          return _createRoute(pathMap[path], location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (false) {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (false) {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (false) {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  path,
  params,
  pathname
) {
  var ref = getRouteRegex(path);
  var regexp = ref.regexp;
  var keys = ref.keys;
  var m = pathname.match(regexp);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) { params[key.name] = val; }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (false) {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        position = getElementPosition(el);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (err instanceof Error) {
      this$1.errorCbs.forEach(function (cb) { cb(err); });
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || to instanceof Error) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (typeof to === 'string' || typeof to === 'object') {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    // wait until async components are resolved before
    // extracting in-component enter guards
    runQueue(enterGuards, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  return function boundRouteGuard () {
    return guard.apply(instance, arguments)
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function resolveAsyncComponents (matched) {
  var _next;
  var pending = 0;
  var error = null;

  flatMapComponents(matched, function (def, _, match, key) {
    // if it's a function and doesn't have cid attached,
    // assume it's an async component resolve function.
    // we are not using Vue's default async resolving mechanism because
    // we want to halt the navigation until the incoming component has been
    // resolved.
    if (typeof def === 'function' && def.cid === undefined) {
      pending++;

      var resolve = once(function (resolvedDef) {
        // save resolved on async factory in case it's used elsewhere
        def.resolved = typeof resolvedDef === 'function'
          ? resolvedDef
          : _Vue.extend(resolvedDef);
        match.components[key] = resolvedDef;
        pending--;
        if (pending <= 0 && _next) {
          _next();
        }
      });

      var reject = once(function (reason) {
        var msg = "Failed to resolve async component " + key + ": " + reason;
        'production' !== 'production' && warn(false, msg);
        if (!error) {
          error = reason instanceof Error
            ? reason
            : new Error(msg);
          if (_next) { _next(error); }
        }
      });

      var res;
      try {
        res = def(resolve, reject);
      } catch (e) {
        reject(e);
      }
      if (res) {
        if (typeof res.then === 'function') {
          res.then(resolve, reject);
        } else {
          // new syntax in Vue 2.3
          var comp = res.component;
          if (comp && typeof comp.then === 'function') {
            comp.then(resolve, reject);
          }
        }
      }
    }
  });

  return function (to, from, next) {
    if (error) {
      next(error);
    } else if (pending <= 0) {
      next();
    } else {
      _next = next;
    }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    if (called) { return }
    called = true;
    return fn.apply(this, arguments)
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, this$1.current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path;
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#');
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  );
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (false) {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  'production' !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  this.beforeHooks.push(fn);
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  this.afterHooks.push(fn);
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.4.0';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = request;
function request(options = {method: 'get', url:'/', payload: null}){

    var xhr = new XMLHttpRequest();
    var req = new Promise(function(resolve, rejected){
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200 || xhr.status == 304){
                    resolve("ok");
                }else{
                    rejected(xhr.responseText);
                }
            }
        }

        xhr.open(options.method, options.url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(options.payload));
    })
    return req;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vueRouter = __webpack_require__(4);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _login = __webpack_require__(27);

var _login2 = _interopRequireDefault(_login);

var _mainFunction = __webpack_require__(3);

var _mainFunction2 = _interopRequireDefault(_mainFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _vueRouter2.default({
    routes: [{

        path: '/main_scheduler',
        name: 'mainscheduler',
        // props: true,
        // props:(route) => {
        //     if(typeof route.params.uname == 'string' && route.params.uname.length){
        //         return {
        //             uname: route.params.uname
        //         }
        //     }else{
        //         return {
        //             uname: 'global'
        //         }
        //     }
        // },
        component: _mainFunction2.default,
        beforeEnter: function beforeEnter(to, from, next) {
            if (valifySession()) {
                next();
            } else {

                next({
                    name: 'login',
                    query: {
                        redirect: 'login'
                    }
                });
            }
        }
    }, {
        path: '/login',
        name: 'login',
        component: _login2.default,
        beforeEnter: function beforeEnter(to, from, next) {
            var check = valifySession();
            if (check) {
                console.log(check);
                next({
                    name: 'mainscheduler',
                    query: {
                        redirect: 'main_scheduer'
                    }
                });
            } else {
                next();
            }
        }
    }, {
        path: '',
        component: _login2.default,
        beforeEnter: function beforeEnter(to, from, next) {
            var check = valifySession();
            if (check) {
                next({
                    name: 'mainscheduler',
                    query: {
                        redirect: 'main_scheduer'
                    }
                });
            } else {
                next({
                    name: 'login',
                    query: {
                        redirect: 'login'
                    }
                });
            }
        }
    }]
}); /**
     * Created by jacelynfish on 2017/4/10.
     */

function valifySession() {
    var cookies = document.cookie;
    if (cookies && cookies.length != 0) {
        var tempCookie = {};
        var cookie = cookies.split(';');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = cookie[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var c = _step.value;

                var temp = c.split("=");
                tempCookie[temp[0]] = temp[1];
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

        if ('nsession' in tempCookie && tempCookie.nsession) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.default = router;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vuex = __webpack_require__(1);

var _vuex2 = _interopRequireDefault(_vuex);

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({

    state: {
        currentTasks: [],
        startOn: true,
        pauseOn: false,
        stepDebugOn: true,
        taskQueue: [],
        timeElapse: 0
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
        },
        getTaskQueue: function getTaskQueue(state) {
            return state.taskQueue;
        },
        getTimeElapse: function getTimeElapse(state) {
            return state.timeElapse;
        }
    },
    mutations: {
        addTasks: function addTasks(state, newTask) {
            var _state$currentTasks;

            (_state$currentTasks = state.currentTasks).push.apply(_state$currentTasks, _toConsumableArray(newTask));
        },
        clearTasks: function clearTasks(state) {
            state.currentTasks.length = 0;
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
        },
        clearTaskQueue: function clearTaskQueue(state, mode) {
            state.taskQueue = [];
        },
        updateTimeElapse: function updateTimeElapse(state, time) {
            state.timeElapse = time;
        }
    }
});

exports.default = store;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(22)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(14),
  /* template */
  __webpack_require__(32),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/jacelynfish/Documents/MUST/1702/CO003_Operating_Systems/bonus_proj/src/components/container.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] container.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2c54fc72", Component.options)
  } else {
    hotAPI.reload("data-v-2c54fc72", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reset = __webpack_require__(8);

var _reset2 = _interopRequireDefault(_reset);

var _global = __webpack_require__(9);

var _global2 = _interopRequireDefault(_global);

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(1);

var _vuex2 = _interopRequireDefault(_vuex);

var _vueRouter = __webpack_require__(4);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _container = __webpack_require__(10);

var _container2 = _interopRequireDefault(_container);

var _mainFunction = __webpack_require__(3);

var _mainFunction2 = _interopRequireDefault(_mainFunction);

var _store = __webpack_require__(7);

var _store2 = _interopRequireDefault(_store);

var _router = __webpack_require__(6);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.config.devtools = true;
//import bootstrap from './src/style/bootstrap/css/bootstrap.min.css';

/**
 * Created by jacelynfish on 2017/4/2.
 */

_vue2.default.use(_vuex2.default);
_vue2.default.use(_vueRouter2.default);

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
    template: '\n        <container></container>\n    ',
    components: {
        container: _container2.default,
        mainFunction: _mainFunction2.default
    },
    store: _store2.default,
    router: _router2.default

});

// <main-function></main-function>

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _PubSub = __webpack_require__(12);

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
        sortMethod = options.sortedMethod || 'remainTime',
        currentTask = {},
        self = this,
        elapseTimer = null,
        record = new Map();
    var isFirst = true,
        isSame,
        stepDebugNext,
        stepDebugNextTask,
        isNewTask;

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

        if (!~currentTask.endTime) {
            currentTask.endTime = options.timeElapse;
            options.isCompleted = false;
        } else {
            options.isCompleted = true;
        }
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
        if (!~currentTask.endTime) {
            currentTask.endTime = options.timeElapse;
            options.isCompleted = false;
        } else {
            options.isCompleted = true;
        }

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
                    // if(isFirst && !isNewTask){
                    //     console.log('no new task');
                    //     addTime();
                    //
                    // }else{
                    elapseTimer = setInterval(function () {
                        addTime();
                    }, 1000);
                    // }
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
                runningQueue.push(currentTask);
                //console.log(currentTask.tag);

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
            isNewTask = true;
            newTaskHandler(records);
        } else {
            isNewTask = false;
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {};
    }

};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
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


exports.default = {
    data: function data() {
        return {};
    },
    methods: {
        logout: function logout() {
            var self = this;
            var xhr = new XMLHttpRequest();

            var req = new Promise(function (resolve, rejected) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200 || xhr.status == 304) {
                            resolve();
                        }
                    }
                };

                xhr.open('get', '/logout');
                xhr.send(null);
            });

            req.then(function () {
                self.$router.push({
                    name: 'login',
                    query: {
                        from: 'logout'
                    }
                });
                //                    console.log('hey');
            });
        }
    }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _request = __webpack_require__(5);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//    function request(options = {method: 'get', url:'/', payload: null}){
//
//        var xhr = new XMLHttpRequest();
//        var req = new Promise(function(resolve, rejected){
//            xhr.onreadystatechange = function(){
//                if(xhr.readyState == 4){
//                    if(xhr.status == 200 || xhr.status == 304){
//                        resolve("ok");
//                    }else{
//                        rejected(xhr.responseText);
//                    }
//                }
//            }
//
//            xhr.open(options.method, options.url);
//            xhr.setRequestHeader('Content-Type', 'application/json');
//            xhr.send(JSON.stringify(options.payload));
//        })
//        return req;
//    }
exports.default = {
    data: function data() {
        return {
            isRegPanel: true,
            unameMes: '',
            statusMes: '',
            isUnameOK: false,
            isROK: false,
            registerInput: {
                uname: '',
                upw: ''
            },
            loginInput: {
                uname: '',
                upw: ''
            }

        };
    },
    methods: {
        togglePanel: function togglePanel(e, option) {
            if (option) {

                this.isRegPanel = false;
            } else {
                this.isRegPanel = true;
            }
        },
        checkRPW: function checkRPW(e) {
            var target = e.target.value.trim();
            if (target != this.registerInput.upw) {
                this.statusMes = 'Please enter the same password twice!';
                this.isROK = false;
            } else {
                this.statusMes = '';
                this.isROK = true;
            }
        },
        validateInput: function validateInput(option) {
            //option 1 for login and 0 for register
            var validateOp = {};
            if (option) {
                validateOp = this.loginInput;
            } else {
                validateOp = this.registerInput;
            }
            var result = false;
            var name = encodeURIComponent(validateOp.uname);
            var password = encodeURIComponent(validateOp.upw);

            var pattern = /[^0-9a-zA-Z]/ig;

            if (!name || pattern.test(name)) {
                result = false;
                this.unameMes = 'Incorrect username!';
            } else {
                //this.unameMes = '';
                result = true;
            }

            if (!option) {
                if (!password) {
                    result = false;
                    this.statusMes = 'Password cannot be empty!';
                }
            }

            return result;
        },
        checkUname: function checkUname(option) {
            //option 1 for login and 0 for register
            var validateOp = {};
            if (option) {
                validateOp = this.loginInput;
            } else {
                validateOp = this.registerInput;
            }

            var self = this;
            var opts = {
                method: 'post',
                url: '/checkUser',
                payload: {
                    uname: validateOp.uname
                }
            };

            //this.validateInput(option);

            var req = (0, _request2.default)(opts);

            req.then(function (mes) {
                if (option) {
                    self.unameMes = '';
                    self.isUnameOK = true;
                } else {
                    self.isUnameOK = false;
                    self.unameMes = 'Username exists. Please try another name.';
                }
            }).catch(function (err) {
                console.log('i');
                if (option) {
                    self.isUnameOK = false;
                    self.unameMes = 'Incorrect username!';
                } else {
                    self.unameMes = '';
                    self.isUnameOK = true;
                }
            });
        },
        submitLogin: function submitLogin() {
            var self = this;
            if (this.validateInput(1) && this.isUnameOK) {

                var opts = {
                    method: 'post',
                    url: '/login',
                    payload: self.loginInput
                };
                var xhr = new XMLHttpRequest();

                var req = (0, _request2.default)(opts);

                req.then(function () {
                    console.log('hello');
                    self.$router.push({
                        name: 'mainscheduler'
                    });
                    return Promise.resolve();
                }).catch(function (mes) {
                    console.log('hello');
                    self.statusMes = mes;
                });
            }
        },
        submitRegister: function submitRegister() {
            var self = this;
            console.log(this.isUnameOK, this.isROK);
            if (this.validateInput(0) && this.isUnameOK && this.isROK) {

                var opts = {
                    method: 'post',
                    url: '/register',
                    payload: self.registerInput
                };
                var xhr = new XMLHttpRequest();

                var req = (0, _request2.default)(opts);

                req.then(function () {
                    self.$router.push({
                        name: 'mainscheduler'
                    });
                    return Promise.resolve();
                }).catch(function (mes) {
                    self.statusMes = mes;
                });
            }
        }
    }

}; //
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

/***/ }),
/* 17 */
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

var _vuex = __webpack_require__(1);

var _scheduler = __webpack_require__(28);

var _scheduler2 = _interopRequireDefault(_scheduler);

var _taskInput = __webpack_require__(29);

var _taskInput2 = _interopRequireDefault(_taskInput);

var _header = __webpack_require__(26);

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    //        props:['uname'],
    components: {
        scheduler: _scheduler2.default,
        taskInput: _taskInput2.default,
        mainHeader: _header2.default
    },
    created: function created(to, from, next) {
        this.addCurrentTask(this.defaultTasks);
        this.currentTasks = this.getCurrentTasks;
    },
    beforeRouteLeave: function beforeRouteLeave(to, from, next) {
        this.clearTasks();
        next();
    },

    computed: _extends({}, (0, _vuex.mapGetters)(['getCurrentTasks', 'getTaskQueue', 'startOn', 'stepDebugOn'])),
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
        delTask: 'delTask',
        clearTasks: 'clearTasks'
    }), {
        deleteTask: function deleteTask(idx) {
            console.log(idx);
            this.delTask(idx);
        }
    })
};

/***/ }),
/* 18 */
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
//
//
//

var _Scheduler = __webpack_require__(13);

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _request = __webpack_require__(5);

var _request2 = _interopRequireDefault(_request);

var _vuex = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    computed: _extends({}, (0, _vuex.mapGetters)({
        tasks: 'getCurrentTasks',
        startOn: 'startOn',
        pauseOn: 'pauseOn',
        stepDebugOn: 'stepDebugOn',
        taskQueue: 'getTaskQueue'

    })),
    created: function created() {

        this.eventHub.$on('addNewTask', this.addTask);
    },

    watch: {},
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
                isCompleted: false,
                runningQueue: []
            },
            scheduler: {},
            currentStat: {
                type: 'rr',
                sortedMethod: 'remainTime',
                start: new Date(),
                end: undefined,
                duration: undefined

            }
        };
    },
    methods: _extends({}, (0, _vuex.mapMutations)(['addTasks', 'toggleStartOn', 'togglePauseOn', 'toggleDebugOn', 'clearTaskQueue', 'updateTimeElapse']), {
        changeSchedulerMode: function changeSchedulerMode() {
            if (this.options.type == 'preemptive' || this.options.type == "nonpreemptive") this.isSecondChoose = true;else this.isSecondChoose = false;
        },
        toggleDebug: function toggleDebug() {
            var self = this;
            if (this.stepDebugOn == true) {
                this.toggleDebugOn(false);
                this.debugSwitchMes = 'stop stepping over';
                this.aWaitingTimeStr = '';

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var t = _step.value;

                        t.tag = Math.floor(Math.random() * 16 + 1);
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

                this.options.taskQueue = this.taskQueue;
                this.options.queue = this.tasks;
                this.options.isStepDebug = true;
                this.scheduler = new _Scheduler2.default(this.options);

                this.currentStat.type = this.options.type;
                this.currentStat.sortedMethod = this.options.sortedMethod;
                this.currentStat.start = new Date();
            } else {
                this.toggleDebugOn(true);
                this.debugSwitchMes = 'start stepping over';

                this.currentStat.end = new Date();
                this.currentStat.duration = Number((this.currentStat.end - this.currentStat.start) / 1000).toFixed(2);

                var query = '/rcrd?';
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Object.keys(this.currentStat)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var k = _step2.value;

                        query += k + '=' + this.currentStat[k] + '&';
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

                (0, _request2.default)({
                    method: 'get',
                    url: query,
                    payload: null
                }).then(function () {
                    self.currentStat = {};
                    self.scheduler.stopStepScheduler();
                    self.scheduler = {};
                    self.clearTaskQueue();
                    self.options.runningQueue = [];

                    self.calATime();
                });
            }
        },
        debugNextStep: function debugNextStep() {
            this.scheduler.runStepScheduler();
        },

        run: function run() {
            this.toggleStartOn(false);
            this.togglePauseOn(true);
            this.aWaitingTimeStr = '';

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var t = _step3.value;

                    t.tag = Math.floor(Math.random() * 16 + 1);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.options.taskQueue = this.taskQueue;
            this.options.queue = this.tasks;
            this.options.isStepDebug = false;
            this.scheduler = new _Scheduler2.default(this.options);

            this.currentStat.type = this.options.type;
            this.currentStat.sortedMethod = this.options.sortedMethod;
            this.currentStat.start = new Date();

            this.scheduler.start();
        },

        stop: function stop() {

            var self = this;
            this.toggleStartOn(true);
            this.togglePauseOn(false);

            this.currentStat.end = new Date();
            this.currentStat.duration = Number((this.currentStat.end - this.currentStat.start) / 1000).toFixed(2);

            var query = '/rcrd?';
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Object.keys(this.currentStat)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var k = _step4.value;

                    query += k + '=' + this.currentStat[k] + '&';
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            (0, _request2.default)({
                method: 'get',
                url: query,
                payload: null
            }).then(function () {
                self.currentStat = {};
                self.scheduler.stop();
                self.scheduler = {};
                self.clearTaskQueue();
                self.options.runningQueue = [];

                self.calATime();
            });
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
            task.tag = Math.floor(Math.random() * 16 + 1);
            if (!this.startOn || !this.stepDebugOn) {
                this.scheduler.add(task);
            }
        },
        calATime: function calATime() {
            var tempStr = '',
                totalTime = 0;
            if (this.options.isCompleted) {
                tempStr = '(';
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
            } else {
                tempStr = 'Tasks not completed!';
            }

            this.aWaitingTimeStr = tempStr;
        }
    })

};

/***/ }),
/* 19 */
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

var _vuex = __webpack_require__(1);

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
            },
            isDraggingOver: false
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
        dragoverHandler: function dragoverHandler() {
            if (!this.isDraggingOver) {
                this.isDraggingOver = true;
                var dragPanel = document.getElementById('file-drop');
                dragPanel.classList.add('activeDrag');
            }
        },
        dragLeaveHandler: function dragLeaveHandler() {
            this.isDraggingOver = false;
            var dragPanel = document.getElementById('file-drop');
            dragPanel.classList.remove('activeDrag');
        },
        dropHandler: function dropHandler(e) {
            this.dragLeaveHandler();
            if (!this.startOn || !this.stepDebugOn) {
                return false;
            } else {
                var self = this;
                var reader = new FileReader();

                var file = e.dataTransfer.files[0];

                if (/plain/.test(file.type)) {
                    var result;
                    reader.readAsText(file);

                    reader.addEventListener('load', function () {
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

                        self.addCurrentTask(records);
                    });
                } else {
                    alert('please upload utf-8 txt file!');
                }
            }
        }
    })
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 25 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(20)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(15),
  /* template */
  __webpack_require__(30),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/jacelynfish/Documents/MUST/1702/CO003_Operating_Systems/bonus_proj/src/components/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] header.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b1d4b92", Component.options)
  } else {
    hotAPI.reload("data-v-0b1d4b92", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(21)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(16),
  /* template */
  __webpack_require__(31),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/jacelynfish/Documents/MUST/1702/CO003_Operating_Systems/bonus_proj/src/components/login.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] login.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a1f37af", Component.options)
  } else {
    hotAPI.reload("data-v-2a1f37af", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(23)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(18),
  /* template */
  __webpack_require__(33),
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(24)

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(19),
  /* template */
  __webpack_require__(34),
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "header"
    }
  }, [_c('h1', {
    attrs: {
      "id": "header-title"
    }
  }, [_vm._v("Process Scheduler Simulator")]), _vm._v(" "), _c('span', {
    attrs: {
      "id": "header-welcome"
    }
  }, [_vm._v("\n        Welcome,\n        "), _vm._t("headerUser"), _vm._v(" "), _c('button', {
    staticClass: "btn-sm",
    attrs: {
      "id": "header-logout"
    },
    on: {
      "click": _vm.logout
    }
  }, [_vm._v("logout")])], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0b1d4b92", module.exports)
  }
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "account-util"
    }
  }, [_c('div', {
    attrs: {
      "id": "account-panel"
    }
  }, [_c('ul', {
    attrs: {
      "id": "account-tag-panel"
    }
  }, [_c('li', {
    class: ['tag-item', {
      'tagItemActive': _vm.isRegPanel
    }],
    on: {
      "click": function($event) {
        _vm.togglePanel($event, 0)
      }
    }
  }, [_vm._v("Register")]), _vm._v(" "), _c('li', {
    class: ['tag-item', {
      'tagItemActive': !_vm.isRegPanel
    }],
    on: {
      "click": function($event) {
        _vm.togglePanel($event, 1)
      }
    }
  }, [_vm._v("Login")])]), _vm._v(" "), (_vm.isRegPanel) ? _c('div', {
    staticClass: "account-panel-item",
    attrs: {
      "id": "register"
    }
  }, [_c('div', {
    staticClass: "register-item"
  }, [_c('div', {
    staticClass: "register-group"
  }, [_c('label', {
    attrs: {
      "for": "register-name"
    }
  }, [_vm._v("user id")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.registerInput.uname),
      expression: "registerInput.uname"
    }],
    attrs: {
      "type": "text",
      "id": "register-name"
    },
    domProps: {
      "value": (_vm.registerInput.uname)
    },
    on: {
      "change": function($event) {
        _vm.checkUname(0)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.registerInput.uname = $event.target.value
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "register-mes"
  }, [_vm._v(_vm._s(_vm.unameMes))])]), _vm._v(" "), _c('div', {
    staticClass: "register-group"
  }, [_c('label', {
    attrs: {
      "for": "register-pw"
    }
  }, [_vm._v("password")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.registerInput.upw),
      expression: "registerInput.upw"
    }],
    attrs: {
      "type": "password",
      "id": "register-pw"
    },
    domProps: {
      "value": (_vm.registerInput.upw)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.registerInput.upw = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "register-group"
  }, [_c('label', {
    attrs: {
      "for": "register-rpw"
    }
  }, [_vm._v("repeat password")]), _vm._v(" "), _c('input', {
    attrs: {
      "type": "password",
      "id": "register-rpw"
    },
    on: {
      "change": function($event) {
        _vm.checkRPW($event)
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "register-item"
  }, [_c('span', {
    staticClass: "register-mes"
  }, [_vm._v(_vm._s(_vm.statusMes))]), _vm._v(" "), _c('button', {
    on: {
      "click": _vm.submitRegister
    }
  }, [_vm._v("register")])])]) : _vm._e(), _vm._v(" "), (!_vm.isRegPanel) ? _c('div', {
    staticClass: "account-panel-item",
    attrs: {
      "id": "login"
    }
  }, [_c('div', {
    staticClass: "login-item"
  }, [_c('div', {
    staticClass: "login-group"
  }, [_c('label', {
    attrs: {
      "for": "login-name"
    }
  }, [_vm._v("user id")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.loginInput.uname),
      expression: "loginInput.uname"
    }],
    attrs: {
      "type": "text",
      "id": "login-name"
    },
    domProps: {
      "value": (_vm.loginInput.uname)
    },
    on: {
      "change": function($event) {
        _vm.checkUname(1)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.loginInput.uname = $event.target.value
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "login-mes"
  }, [_vm._v(_vm._s(_vm.unameMes))])]), _vm._v(" "), _c('div', {
    staticClass: "login-group"
  }, [_c('label', {
    attrs: {
      "for": "login-pw"
    }
  }, [_vm._v("password")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.loginInput.upw),
      expression: "loginInput.upw"
    }],
    attrs: {
      "type": "password",
      "id": "login-pw"
    },
    domProps: {
      "value": (_vm.loginInput.upw)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.loginInput.upw = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "login-item"
  }, [_c('span', {
    staticClass: "login-mes"
  }, [_vm._v(_vm._s(_vm.statusMes))]), _vm._v(" "), _c('button', {
    on: {
      "click": _vm.submitLogin
    }
  }, [_vm._v("login")])])]) : _vm._e()])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2a1f37af", module.exports)
  }
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "container"
    }
  }, [_c('router-view')], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2c54fc72", module.exports)
  }
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    attrs: {
      "id": "scheduler-util"
    }
  }, [_c('div', {
    staticClass: "scheduler-item"
  }, [_c('label', [_vm._v("Please select a preferred scheduler type: ")]), _vm._v(" "), _c('select', {
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
      value: (_vm.options.sortedMethod),
      expression: "options.sortedMethod"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.options.sortedMethod = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
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
  }, [_vm._v("Priority")])]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "scheduler-item"
  }, [_c('button', {
    class: [{
      'btn-disabled': !_vm.stepDebugOn || !_vm.startOn
    }, 'btn-md'],
    attrs: {
      "disabled": !_vm.stepDebugOn || !_vm.startOn
    },
    on: {
      "click": _vm.run
    }
  }, [_vm._v("start")]), _vm._v(" "), _c('button', {
    class: [{
      'btn-disabled': !_vm.stepDebugOn || _vm.startOn
    }, 'btn-md'],
    attrs: {
      "disabled": !_vm.stepDebugOn || _vm.startOn
    },
    on: {
      "click": _vm.stop
    }
  }, [_vm._v("stop")]), _vm._v(" "), _c('button', {
    class: [{
      'btn-disabled': !_vm.stepDebugOn || (_vm.startOn || !_vm.pauseOn)
    }, 'btn-md'],
    attrs: {
      "disabled": !_vm.stepDebugOn || (_vm.startOn || !_vm.pauseOn)
    },
    on: {
      "click": _vm.pause
    }
  }, [_vm._v("pause")]), _vm._v(" "), _c('button', {
    class: [{
      'btn-disabled': !_vm.stepDebugOn || (_vm.startOn || _vm.pauseOn)
    }, 'btn-md'],
    attrs: {
      "disabled": !_vm.stepDebugOn || (_vm.startOn || _vm.pauseOn)
    },
    on: {
      "click": _vm.con
    }
  }, [_vm._v("continue")]), _vm._v(" "), _c('button', {
    class: [{
      'btn-disabled': !_vm.startOn
    }, 'btn-md'],
    attrs: {
      "disabled": !_vm.startOn
    },
    on: {
      "click": _vm.toggleDebug
    }
  }, [_vm._v(_vm._s(_vm.debugSwitchMes))]), _vm._v(" "), _c('button', {
    class: [{
      'btn-disabled': !_vm.startOn || _vm.stepDebugOn
    }, 'btn-md'],
    attrs: {
      "disabled": !_vm.startOn || _vm.stepDebugOn
    },
    on: {
      "click": _vm.debugNextStep
    }
  }, [_vm._v("next step")])])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "scheduler-info"
    }
  }, [_c('p', [_vm._v("Average waiting time: " + _vm._s(_vm.aWaitingTimeStr))])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "running-queue-container"
    }
  }, [_c('h2', [_vm._v("Running Timeline")]), _vm._v(" "), _c('ul', {
    attrs: {
      "id": "running-queue"
    }
  }, _vm._l((_vm.options.runningQueue), function(task) {
    return _c('li', {
      class: ['running-queue-item', ("cclass_tag" + (task.tag))]
    }, [_vm._v(_vm._s(task.pid))])
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
/* 34 */
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
      },
      "dragleave": _vm.dragLeaveHandler
    }
  }, [_vm._v("\n        Please drop your file here to upload.\n    ")]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "task-input-gp"
    }
  }, [_c('label', [_c('span', [_vm._v("pid")]), _c('input', {
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
  })]), _vm._v(" "), _c('label', [_c('span', [_vm._v("arrive time")]), _c('input', {
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
  })]), _vm._v(" "), _c('label', [_c('span', [_vm._v("cpu time")]), _c('input', {
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
  })]), _vm._v(" "), _c('label', [_c('span', [_vm._v("priority")]), _c('input', {
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
  })]), _vm._v(" "), _c('button', {
    staticClass: "btn-md",
    on: {
      "click": _vm.addTask
    }
  }, [_vm._v("add")])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4ce6108b", module.exports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "main-function"
    }
  }, [_c('main-header', [_c('span', {
    slot: "headerUser"
  }, [_vm._v("hello")])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "task-util"
    }
  }, [_c('fieldset', {
    staticClass: "task-util-item",
    attrs: {
      "id": "task-input"
    }
  }, [_c('legend', [_vm._v("Input task")]), _vm._v(" "), _c('task-input'), _vm._v(" "), _c('div', {
    attrs: {
      "id": "task-input-queue"
    }
  }, [_c('h2', [_vm._v("Ready Queue")]), _vm._v(" "), _c('ul', {
    attrs: {
      "id": "task-queue"
    }
  }, _vm._l((_vm.getTaskQueue), function(task) {
    return _c('li', {
      class: ['task-queue-item', ("cclass_tag" + (task.tag))]
    }, [_vm._v(_vm._s(task.pid))])
  }))])], 1), _vm._v(" "), _c('fieldset', {
    staticClass: "task-util-item",
    attrs: {
      "id": "task-panel"
    }
  }, [_c('legend', [_vm._v("Task panel")]), _vm._v(" "), _c('table', [_vm._m(0), _vm._v(" "), _c('tbody', _vm._l((_vm.getCurrentTasks), function(task, key) {
    return _c('tr', [_c('td', [_vm._v(_vm._s(task.pid))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.arriveTime))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.cpuTime))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.priority))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.endTime >= 0 ? task.endTime : NaN))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.endTime >= 0 ? task.endTime - task.arriveTime : NaN))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(task.endTime >= 0 ? task.endTime - task.arriveTime - task.cpuTime : NaN))]), _vm._v(" "), _c('td', [_c('button', {
      class: [{
        'btn-disabled': !_vm.startOn || !_vm.stepDebugOn
      }, 'btn-sm'],
      attrs: {
        "disabled": !_vm.startOn || !_vm.stepDebugOn
      },
      on: {
        "click": function($event) {
          _vm.deleteTask(key)
        }
      }
    }, [_vm._v("delete")])])])
  }))])])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "task-scheduler"
    }
  }, [_c('scheduler')], 1), _vm._v(" "), _vm._m(1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', [_c('th', [_vm._v("pid")]), _vm._v(" "), _c('th', [_vm._v("arrive time")]), _vm._v(" "), _c('th', [_vm._v("cpu time")]), _vm._v(" "), _c('th', [_vm._v("priority")]), _vm._v(" "), _c('th', [_vm._v("end time")]), _vm._v(" "), _c('th', [_vm._v("turnaround time")]), _vm._v(" "), _c('th', [_vm._v("waiting time")]), _vm._v(" "), _c('th', [_vm._v("delete")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('footer', [_c('p', [_vm._v("Designed by "), _c('a', {
    attrs: {
      "href": "https://github.com/jacelynfish",
      "target": "_blank"
    }
  }, [_vm._v("JacelynFish")]), _vm._v(" for the course CO003 Operating Systems. Powered by Vue.js 2.0, Webpack, Node.js and Mongodb")]), _vm._v(" "), _c('p', [_vm._v("Star this open-source project on "), _c('a', {
    attrs: {
      "href": "https://github.com/jacelynfish/OS_Process_Scheduler",
      "target": "_blank"
    }
  }, [_vm._v("GitHub")]), _vm._v("!")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-612e64db", module.exports)
  }
}

/***/ })
],[11]);