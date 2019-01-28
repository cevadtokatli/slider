/*!
 *   Marvina image slider
 *   version: 1.0.5
 *    author: Cevad Tokatli <cevadtokatli@hotmail.com>
 *   website: http://cevadtokatli.com
 *    github: https://github.com/cevadtokatli/marvina-slider
 *   license: MIT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.MarvinaSlider = {})));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var es6Promise = createCommonjsModule(function (module, exports) {
	/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   v4.2.5+7f2b526d
	 */

	(function (global, factory) {
		module.exports = factory();
	}(commonjsGlobal, (function () {
	function objectOrFunction(x) {
	  var type = typeof x;
	  return x !== null && (type === 'object' || type === 'function');
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}



	var _isArray = void 0;
	if (Array.isArray) {
	  _isArray = Array.isArray;
	} else {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = void 0;
	var customSchedulerFn = void 0;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }

	  return useSetTimeout();
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var vertx = Function('return this')().require('vertx');
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = void 0;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;


	  if (_state) {
	    var callback = arguments[_state - 1];
	    asap(function () {
	      return invokeCallback(_state, child, callback, parent._result);
	    });
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve$1(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(2);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var TRY_CATCH_ERROR = { error: null };

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    TRY_CATCH_ERROR.error = error;
	    return TRY_CATCH_ERROR;
	  }
	}

	function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then$$1.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then$$1) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then$$1, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return resolve(promise, value);
	    }, function (reason) {
	      return reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$1) {
	  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$1 === TRY_CATCH_ERROR) {
	      reject(promise, TRY_CATCH_ERROR.error);
	      TRY_CATCH_ERROR.error = null;
	    } else if (then$$1 === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$1)) {
	      handleForeignThenable(promise, maybeThenable, then$$1);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function resolve(promise, value) {
	  if (promise === value) {
	    reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;


	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = void 0,
	      callback = void 0,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = void 0,
	      error = void 0,
	      succeeded = void 0,
	      failed = void 0;

	  if (hasCallback) {
	    value = tryCatch(callback, detail);

	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value.error = null;
	    } else {
	      succeeded = true;
	    }

	    if (promise === value) {
	      reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }

	  if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
	    resolve(promise, value);
	  } else if (failed) {
	    reject(promise, error);
	  } else if (settled === FULFILLED) {
	    fulfill(promise, value);
	  } else if (settled === REJECTED) {
	    reject(promise, value);
	  }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      resolve(promise, value);
	    }, function rejectPromise(reason) {
	      reject(promise, reason);
	    });
	  } catch (e) {
	    reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	}

	var Enumerator = function () {
	  function Enumerator(Constructor, input) {
	    this._instanceConstructor = Constructor;
	    this.promise = new Constructor(noop);

	    if (!this.promise[PROMISE_ID]) {
	      makePromise(this.promise);
	    }

	    if (isArray(input)) {
	      this.length = input.length;
	      this._remaining = input.length;

	      this._result = new Array(this.length);

	      if (this.length === 0) {
	        fulfill(this.promise, this._result);
	      } else {
	        this.length = this.length || 0;
	        this._enumerate(input);
	        if (this._remaining === 0) {
	          fulfill(this.promise, this._result);
	        }
	      }
	    } else {
	      reject(this.promise, validationError());
	    }
	  }

	  Enumerator.prototype._enumerate = function _enumerate(input) {
	    for (var i = 0; this._state === PENDING && i < input.length; i++) {
	      this._eachEntry(input[i], i);
	    }
	  };

	  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
	    var c = this._instanceConstructor;
	    var resolve$$1 = c.resolve;


	    if (resolve$$1 === resolve$1) {
	      var _then = getThen(entry);

	      if (_then === then && entry._state !== PENDING) {
	        this._settledAt(entry._state, i, entry._result);
	      } else if (typeof _then !== 'function') {
	        this._remaining--;
	        this._result[i] = entry;
	      } else if (c === Promise$1) {
	        var promise = new c(noop);
	        handleMaybeThenable(promise, entry, _then);
	        this._willSettleAt(promise, i);
	      } else {
	        this._willSettleAt(new c(function (resolve$$1) {
	          return resolve$$1(entry);
	        }), i);
	      }
	    } else {
	      this._willSettleAt(resolve$$1(entry), i);
	    }
	  };

	  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
	    var promise = this.promise;


	    if (promise._state === PENDING) {
	      this._remaining--;

	      if (state === REJECTED) {
	        reject(promise, value);
	      } else {
	        this._result[i] = value;
	      }
	    }

	    if (this._remaining === 0) {
	      fulfill(promise, this._result);
	    }
	  };

	  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
	    var enumerator = this;

	    subscribe(promise, undefined, function (value) {
	      return enumerator._settledAt(FULFILLED, i, value);
	    }, function (reason) {
	      return enumerator._settledAt(REJECTED, i, reason);
	    });
	  };

	  return Enumerator;
	}();

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject$1(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {Function} resolver
	  Useful for tooling.
	  @constructor
	*/

	var Promise$1 = function () {
	  function Promise(resolver) {
	    this[PROMISE_ID] = nextId();
	    this._result = this._state = undefined;
	    this._subscribers = [];

	    if (noop !== resolver) {
	      typeof resolver !== 'function' && needsResolver();
	      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	    }
	  }

	  /**
	  The primary way of interacting with a promise is through its `then` method,
	  which registers callbacks to receive either a promise's eventual value or the
	  reason why the promise cannot be fulfilled.
	   ```js
	  findUser().then(function(user){
	    // user is available
	  }, function(reason){
	    // user is unavailable, and you are given the reason why
	  });
	  ```
	   Chaining
	  --------
	   The return value of `then` is itself a promise.  This second, 'downstream'
	  promise is resolved with the return value of the first promise's fulfillment
	  or rejection handler, or rejected if the handler throws an exception.
	   ```js
	  findUser().then(function (user) {
	    return user.name;
	  }, function (reason) {
	    return 'default name';
	  }).then(function (userName) {
	    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	    // will be `'default name'`
	  });
	   findUser().then(function (user) {
	    throw new Error('Found user, but still unhappy');
	  }, function (reason) {
	    throw new Error('`findUser` rejected and we're unhappy');
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	  });
	  ```
	  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	   ```js
	  findUser().then(function (user) {
	    throw new PedagogicalException('Upstream error');
	  }).then(function (value) {
	    // never reached
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // The `PedgagocialException` is propagated all the way down to here
	  });
	  ```
	   Assimilation
	  ------------
	   Sometimes the value you want to propagate to a downstream promise can only be
	  retrieved asynchronously. This can be achieved by returning a promise in the
	  fulfillment or rejection handler. The downstream promise will then be pending
	  until the returned promise is settled. This is called *assimilation*.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // The user's comments are now available
	  });
	  ```
	   If the assimliated promise rejects, then the downstream promise will also reject.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // If `findCommentsByAuthor` fulfills, we'll have the value here
	  }, function (reason) {
	    // If `findCommentsByAuthor` rejects, we'll have the reason here
	  });
	  ```
	   Simple Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let result;
	   try {
	    result = findResult();
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	  findResult(function(result, err){
	    if (err) {
	      // failure
	    } else {
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findResult().then(function(result){
	    // success
	  }, function(reason){
	    // failure
	  });
	  ```
	   Advanced Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let author, books;
	   try {
	    author = findAuthor();
	    books  = findBooksByAuthor(author);
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	   function foundBooks(books) {
	   }
	   function failure(reason) {
	   }
	   findAuthor(function(author, err){
	    if (err) {
	      failure(err);
	      // failure
	    } else {
	      try {
	        findBoooksByAuthor(author, function(books, err) {
	          if (err) {
	            failure(err);
	          } else {
	            try {
	              foundBooks(books);
	            } catch(reason) {
	              failure(reason);
	            }
	          }
	        });
	      } catch(error) {
	        failure(err);
	      }
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findAuthor().
	    then(findBooksByAuthor).
	    then(function(books){
	      // found books
	  }).catch(function(reason){
	    // something went wrong
	  });
	  ```
	   @method then
	  @param {Function} onFulfilled
	  @param {Function} onRejected
	  Useful for tooling.
	  @return {Promise}
	  */

	  /**
	  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	  as the catch block of a try/catch statement.
	  ```js
	  function findAuthor(){
	  throw new Error('couldn't find that author');
	  }
	  // synchronous
	  try {
	  findAuthor();
	  } catch(reason) {
	  // something went wrong
	  }
	  // async with promises
	  findAuthor().catch(function(reason){
	  // something went wrong
	  });
	  ```
	  @method catch
	  @param {Function} onRejection
	  Useful for tooling.
	  @return {Promise}
	  */


	  Promise.prototype.catch = function _catch(onRejection) {
	    return this.then(null, onRejection);
	  };

	  /**
	    `finally` will be invoked regardless of the promise's fate just as native
	    try/catch/finally behaves
	  
	    Synchronous example:
	  
	    ```js
	    findAuthor() {
	      if (Math.random() > 0.5) {
	        throw new Error();
	      }
	      return new Author();
	    }
	  
	    try {
	      return findAuthor(); // succeed or fail
	    } catch(error) {
	      return findOtherAuther();
	    } finally {
	      // always runs
	      // doesn't affect the return value
	    }
	    ```
	  
	    Asynchronous example:
	  
	    ```js
	    findAuthor().catch(function(reason){
	      return findOtherAuther();
	    }).finally(function(){
	      // author was either found, or not
	    });
	    ```
	  
	    @method finally
	    @param {Function} callback
	    @return {Promise}
	  */


	  Promise.prototype.finally = function _finally(callback) {
	    var promise = this;
	    var constructor = promise.constructor;

	    if (isFunction(callback)) {
	      return promise.then(function (value) {
	        return constructor.resolve(callback()).then(function () {
	          return value;
	        });
	      }, function (reason) {
	        return constructor.resolve(callback()).then(function () {
	          throw reason;
	        });
	      });
	    }

	    return promise.then(callback, callback);
	  };

	  return Promise;
	}();

	Promise$1.prototype.then = then;
	Promise$1.all = all;
	Promise$1.race = race;
	Promise$1.resolve = resolve$1;
	Promise$1.reject = reject$1;
	Promise$1._setScheduler = setScheduler;
	Promise$1._setAsap = setAsap;
	Promise$1._asap = asap;

	/*global self*/
	function polyfill() {
	  var local = void 0;

	  if (typeof commonjsGlobal !== 'undefined') {
	    local = commonjsGlobal;
	  } else if (typeof self !== 'undefined') {
	    local = self;
	  } else {
	    try {
	      local = Function('return this')();
	    } catch (e) {
	      throw new Error('polyfill failed because global object is unavailable in this environment');
	    }
	  }

	  var P = local.Promise;

	  if (P) {
	    var promiseToString = null;
	    try {
	      promiseToString = Object.prototype.toString.call(P.resolve());
	    } catch (e) {
	      // silently ignored
	    }

	    if (promiseToString === '[object Promise]' && !P.cast) {
	      return;
	    }
	  }

	  local.Promise = Promise$1;
	}

	// Strange compat..
	Promise$1.polyfill = polyfill;
	Promise$1.Promise = Promise$1;

	return Promise$1;

	})));




	});

	var auto = es6Promise.polyfill();

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	var Util = /** @class */ (function () {
	    function Util() {
	    }
	    /**
	     * Returns the given element.
	     */
	    Util.getElement = function (el) {
	        if (typeof el == 'string') {
	            return document.querySelector(el);
	        }
	        return el;
	    };
	    /**
	     * Attaches the events to the element.
	     */
	    Util.addMultiEventListener = function (el, events, callback) {
	        for (var i = 0; i < events.length; i++) {
	            el.addEventListener(events[i], callback, true);
	        }
	    };
	    /**
	     * Removes the events from the element.
	     */
	    Util.removeMultiEventListener = function (el, events, callback) {
	        for (var i = 0; i < events.length; i++) {
	            el.removeEventListener(events[i], callback, true);
	        }
	    };
	    /**
	     * Attaches the events to the element for once.
	     */
	    Util.addMultiEventListenerOnce = function (el, events, callback) {
	        var _this = this;
	        var cb = function (e) {
	            _this.removeMultiEventListener(el, events, cb);
	            callback(e);
	        };
	        this.addMultiEventListener(el, events, cb);
	    };
	    /**
	     * Creates a new event and initalizes it.
	     */
	    Util.createEvent = function (name) {
	        var event = document.createEvent('HTMLEvents') || document.createEvent('event');
	        event.initEvent(name, false, true);
	        return event;
	    };
	    Util.setCSSPrefix = function (css) {
	        return "-webkit-" + css + "; -ms-" + css + "; " + css + ";";
	    };
	    Util.requestAnimationFrame = typeof window !== 'undefined'
	        ?
	            window.webkitRequestAnimationFrame ||
	                window.mozRequestAnimationFrame ||
	                window.oRequestAnimationFrame ||
	                window.msRequestAnimationFrame ||
	                window.requestAnimationFrame ||
	                (function (callback) { window.setTimeout(callback, 1000 / 60); })
	        :
	            function () { };
	    Util.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	    Util.events = {
	        mousedown: Util.isMobile ? 'touchstart' : 'mousedown',
	        mouseup: Util.isMobile ? 'touchend' : 'mouseup'
	    };
	    Util.animationEndEvents = ['webkitAnimationEnd', 'mozAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd', 'animationend'];
	    return Util;
	}());

	var events = {
	    change: Util.createEvent('change'),
	    touchStart: Util.createEvent('touchStart'),
	    touchEnd: Util.createEvent('touchEnd'),
	    play: Util.createEvent('play'),
	    stop: Util.createEvent('stop'),
	    destroy: Util.createEvent('destroy')
	};

	var TouchMove = /** @class */ (function () {
	    function TouchMove(emitter) {
	        this._emitter = emitter;
	        this._el = this._emitter.get('_el');
	        this._container = this._emitter.get('_container');
	        this.start = this.start.bind(this);
	        this.end = this.end.bind(this);
	        this._container.addEventListener(Util.events.mousedown, this.start, true);
	    }
	    /**
	     * Starts touching.
	     */
	    TouchMove.prototype.start = function (e) {
	        var processing = this._emitter.get('_processing');
	        if (!processing) {
	            this._emitter.set('_processing', true);
	            this._el.dispatchEvent(events.touchStart);
	            this._startX = e.clientX || e.pageX;
	            this._time = new Date().getTime();
	            window.addEventListener(Util.events.mouseup, this.end, true);
	        }
	        e.preventDefault();
	    };
	    /**
	     * Ends touching.
	     */
	    TouchMove.prototype.end = function (e) {
	        this.destroy();
	        this._el.dispatchEvent(events.touchEnd);
	        var endX = e.clientX || e.pageX;
	        var x = endX - this._startX;
	        var t = new Date().getTime() - this._time;
	        if (Math.abs(x) >= 25 && t <= 250) {
	            if (x <= 0) {
	                this._emitter.emit('nextIndex', [true]);
	            }
	            else {
	                this._emitter.emit('prevIndex', [true]);
	            }
	        }
	        else {
	            this._emitter.set('_processing', false);
	        }
	        e.preventDefault();
	    };
	    /**
	     * Removes the event listener.
	     */
	    TouchMove.prototype.destroy = function () {
	        window.removeEventListener(Util.events.mouseup, this.end, true);
	    };
	    return TouchMove;
	}());

	var List = /** @class */ (function () {
	    function List(emitter, list, asList) {
	        this._emitter = emitter;
	        this.setIndex = this.setIndex.bind(this);
	        if (list) {
	            this._listEl = document.createElement('ul');
	            var mainEl = this._emitter.get('_el');
	            mainEl.appendChild(this._listEl);
	            this._listEl.addEventListener(Util.events.mousedown, this.setIndex, true);
	            var total = this._emitter.get('_total');
	            for (var i = 0; i < total; i++) {
	                this.add();
	            }
	        }
	        if (asList) {
	            asList.addEventListener(Util.events.mousedown, this.setIndex, true);
	            this._asList = asList;
	        }
	        this.index = this._emitter.get('_index');
	    }
	    Object.defineProperty(List.prototype, "index", {
	        get: function () {
	            return this._index;
	        },
	        set: function (value) {
	            this._index = value;
	            this.setActive();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Sets the new index by checking elements clicked on the list.
	     */
	    List.prototype.setIndex = function (e) {
	        var target = e.target;
	        while (target != this._listEl && target != this._asList && target.parentNode != this._listEl && target.parentNode != this._asList) {
	            target = target.parentNode;
	        }
	        if (target.parentNode == this._listEl || target.parentNode == this._asList) {
	            var index = Array.prototype.slice.call(target.parentNode.children).indexOf(target);
	            this._emitter.emit('setIndex', [index]);
	        }
	    };
	    /**
	     * Sets active class by index.
	     */
	    List.prototype.setActive = function () {
	        if (this._listEl) {
	            var activeEl = this._listEl.querySelector('.ms-active');
	            if (activeEl) {
	                activeEl.classList.remove('ms-active');
	            }
	            var el = this._listEl.querySelectorAll('li')[this.index];
	            if (el) {
	                el.classList.add('ms-active');
	            }
	        }
	        if (this._asList) {
	            var activeEl = this._asList.querySelector('.ms-active');
	            if (activeEl) {
	                activeEl.classList.remove('ms-active');
	            }
	            var el = Array.prototype.slice.call(this._asList.children)[this.index];
	            if (el) {
	                el.classList.add('ms-active');
	            }
	        }
	    };
	    /**
	     * Adds a new element to the list.
	     */
	    List.prototype.add = function () {
	        if (this._listEl) {
	            var li = document.createElement('li');
	            this._listEl.appendChild(li);
	        }
	    };
	    /**
	     * Removes an element from the list.
	     */
	    List.prototype.remove = function () {
	        if (this._listEl) {
	            this._listEl.removeChild(this._listEl.lastChild);
	        }
	    };
	    /**
	     * Removes the event listener.
	     */
	    List.prototype.destroy = function () {
	        if (this._asList) {
	            this._asList.removeEventListener(Util.events.mousedown, this.setIndex, true);
	        }
	    };
	    return List;
	}());

	var Arrows = /** @class */ (function () {
	    function Arrows(emitter, arrows, asArrows) {
	        this._asArrows = {};
	        this._emitter = emitter;
	        this.prev = this.prev.bind(this);
	        this.next = this.next.bind(this);
	        if (arrows) {
	            var mainEl = this._emitter.get('_el');
	            var prevArrow = document.createElement('div');
	            prevArrow.className = 'ms-arrow ms-prev-arrow';
	            prevArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792"><path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"/></svg>';
	            mainEl.appendChild(prevArrow);
	            prevArrow.addEventListener(Util.events.mousedown, this.prev, true);
	            var nextArrow = document.createElement('div');
	            nextArrow.className = 'ms-arrow ms-next-arrow';
	            nextArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792"><path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"/></svg>';
	            mainEl.appendChild(nextArrow);
	            nextArrow.addEventListener(Util.events.mousedown, this.next, true);
	            this._arrowEls = {
	                prevArrow: prevArrow,
	                nextArrow: nextArrow
	            };
	        }
	        if (asArrows.prevArrow) {
	            asArrows.prevArrow.addEventListener(Util.events.mousedown, this.prev, true);
	            this._asArrows.prevArrow = asArrows.prevArrow;
	        }
	        if (asArrows.nextArrow) {
	            asArrows.nextArrow.addEventListener(Util.events.mousedown, this.next, true);
	            this._asArrows.nextArrow = asArrows.nextArrow;
	        }
	    }
	    /**
	     * Triggers the previous image.
	     */
	    Arrows.prototype.prev = function () {
	        this._emitter.emit('prev');
	    };
	    /**
	     * Triggers the next image.
	     */
	    Arrows.prototype.next = function () {
	        this._emitter.emit('next');
	    };
	    /**
	     * Removes the event listeners.
	     */
	    Arrows.prototype.destroy = function () {
	        if (this._asArrows.prevArrow) {
	            this._asArrows.prevArrow.removeEventListener(Util.events.mousedown, this.prev, true);
	        }
	        if (this._asArrows.nextArrow) {
	            this._asArrows.nextArrow.removeEventListener(Util.events.mousedown, this.next, true);
	        }
	    };
	    return Arrows;
	}());

	(function (SliderType) {
	    SliderType["Carousel"] = "Carousel";
	    SliderType["Flow"] = "Flow";
	    SliderType["Fade"] = "Fade";
	})(exports.SliderType || (exports.SliderType = {}));

	var defaultOptions = {
	    el: null,
	    timing: 'ease',
	    duration: 800,
	    sliderType: exports.SliderType.Carousel,
	    touchMove: true,
	    list: true,
	    arrows: true,
	    autoPlay: false,
	    autoPlaySpeed: 5000,
	    imageSettings: [],
	    init: true
	};

	var Carousel = {
	    init: function (sliderEl) { },
	    animate: function (nextEl, prevEl, status, emitter) {
	        return new Promise(function (resolve) {
	            var container = emitter.get('_container'), timing = emitter.get('_timing'), duration = emitter.get('_duration');
	            container.setAttribute('style', [Util.setCSSPrefix("animation-timing-function:" + timing), Util.setCSSPrefix("animation-duration:" + duration + "ms")].join(''));
	            container.classList.add('ms-carousel');
	            if (!status) {
	                container.classList.add('ms-carousel-reverse');
	            }
	            nextEl.wrapperEl.classList.add('ms-carousel-next');
	            nextEl.wrapperEl.classList.add('ms-active');
	            requestAnimationFrame(function () {
	                container.classList.add('ms-carousel-animation');
	                Util.addMultiEventListenerOnce(container, Util.animationEndEvents, function () {
	                    container.removeAttribute('style');
	                    container.classList.remove('ms-carousel');
	                    if (!status) {
	                        container.classList.remove('ms-carousel-reverse');
	                    }
	                    container.classList.remove('ms-carousel-animation');
	                    prevEl.wrapperEl.classList.remove('ms-active');
	                    nextEl.wrapperEl.classList.remove('ms-carousel-next');
	                    resolve();
	                });
	            });
	        });
	    }
	};

	var Flow = {
	    init: function (sliderEl) { },
	    animate: function (nextEl, prevEl, status, emitter) {
	        return new Promise(function (resolve) {
	            var container = emitter.get('_container'), timing = emitter.get('_timing'), duration = emitter.get('_duration');
	            container.classList.add('ms-flow');
	            if (!status) {
	                container.classList.add('ms-flow-reverse');
	            }
	            prevEl.wrapperEl.classList.add('ms-flow-prev');
	            nextEl.wrapperEl.setAttribute('style', [Util.setCSSPrefix("animation-timing-function:" + timing), Util.setCSSPrefix("animation-duration:" + duration + "ms")].join(''));
	            nextEl.wrapperEl.classList.add('ms-active');
	            nextEl.wrapperEl.classList.add('ms-flow-next');
	            requestAnimationFrame(function () {
	                nextEl.wrapperEl.classList.add('ms-flow-animation');
	                Util.addMultiEventListenerOnce(nextEl.wrapperEl, Util.animationEndEvents, function () {
	                    container.classList.remove('ms-flow');
	                    if (!status) {
	                        container.classList.remove('ms-flow-reverse');
	                    }
	                    prevEl.wrapperEl.classList.remove('ms-active');
	                    prevEl.wrapperEl.classList.remove('ms-flow-prev');
	                    nextEl.wrapperEl.classList.remove('ms-flow-next');
	                    nextEl.wrapperEl.classList.remove('ms-flow-animation');
	                    nextEl.wrapperEl.removeAttribute('style');
	                    resolve();
	                });
	            });
	        });
	    }
	};

	var Fade = {
	    init: function (sliderEl) { },
	    animate: function (nextEl, prevEl, status, emitter) {
	        return new Promise(function (resolve) {
	            var container = emitter.get('_container'), timing = emitter.get('_timing'), duration = emitter.get('_duration');
	            container.classList.add('ms-fade');
	            prevEl.wrapperEl.classList.add('ms-fade-prev');
	            nextEl.wrapperEl.setAttribute('style', [Util.setCSSPrefix("animation-timing-function:" + timing), Util.setCSSPrefix("animation-duration:" + duration + "ms")].join(''));
	            nextEl.wrapperEl.classList.add('ms-fade-next');
	            nextEl.wrapperEl.classList.add('ms-active');
	            requestAnimationFrame(function () {
	                nextEl.wrapperEl.classList.add('ms-fade-animation');
	                Util.addMultiEventListenerOnce(nextEl.wrapperEl, Util.animationEndEvents, function () {
	                    container.classList.remove('ms-fade');
	                    prevEl.wrapperEl.classList.remove('ms-active');
	                    prevEl.wrapperEl.classList.remove('ms-fade-prev');
	                    nextEl.wrapperEl.removeAttribute('style');
	                    nextEl.wrapperEl.classList.remove('ms-fade-next');
	                    nextEl.wrapperEl.classList.remove('ms-fade-animation');
	                    resolve();
	                });
	            });
	        });
	    }
	};



	var Slider = /*#__PURE__*/Object.freeze({
		Carousel: Carousel,
		Flow: Flow,
		Fade: Fade
	});

	var MarvinaSlider = /** @class */ (function () {
	    function MarvinaSlider(o) {
	        if (o === void 0) { o = defaultOptions; }
	        this._autoPlayStatus = true;
	        this._elements = [];
	        this._callbacks = {};
	        this._index = 0;
	        this._processing = false;
	        this._emitter = {
	            emit: this.emit.bind(this),
	            get: this.get.bind(this),
	            set: this.set.bind(this)
	        };
	        this.extractAttributes(o);
	        this._o = o;
	        if (!(this._el = Util.getElement(o.el))) {
	            throw new Error('Element could not be found');
	        }
	        if (this._init) {
	            this.initDOM();
	        }
	    }
	    /**
	     * Inits slider with creating DOM.
	     */
	    MarvinaSlider.prototype.initDOM = function () {
	        this._el.classList.add('ms');
	        // elements & slider
	        var msSliderEl = document.createElement('div');
	        msSliderEl.classList.add('ms-slider');
	        msSliderEl.innerHTML = '<div class="ms-slider-element-container"></div>';
	        var c = this._el.childNodes[0];
	        if (c) {
	            this._el.insertBefore(msSliderEl, c);
	        }
	        else {
	            this._el.appendChild(msSliderEl);
	        }
	        this._container = msSliderEl.querySelector('div');
	        var imageSettingsObj = {};
	        this._o.imageSettings.forEach(function (i) {
	            imageSettingsObj[i.id] = i;
	        });
	        var sliderNodeElements = this._el.querySelectorAll('.ms-slider-element');
	        for (var i = 0; i < sliderNodeElements.length; i++) {
	            var sliderHTMLElement = sliderNodeElements[i], id = sliderHTMLElement.getAttribute('ms-id'), wrapperEl = void 0, sliderElement = void 0;
	            if (this._init) {
	                wrapperEl = document.createElement('div');
	                wrapperEl.classList.add('ms-slider-element-wrapper');
	                wrapperEl.appendChild(sliderHTMLElement);
	            }
	            else {
	                wrapperEl = sliderHTMLElement.parentNode;
	            }
	            setSliderElement: {
	                if (id) {
	                    sliderElement = imageSettingsObj[id];
	                    if (sliderElement) {
	                        break setSliderElement;
	                    }
	                }
	                sliderElement = {};
	            }
	            sliderElement.wrapperEl = wrapperEl;
	            sliderElement.el = sliderHTMLElement;
	            if (!sliderElement.sliderType) {
	                sliderElement.sliderType = this._sliderType;
	            }
	            this._elements.push(sliderElement);
	            this._container.appendChild(wrapperEl);
	            Slider[sliderElement.sliderType].init(sliderElement);
	        }
	        this.initSettingsElements();
	    };
	    /**
	     * Inits slider without creating DOM.
	     */
	    MarvinaSlider.prototype.init = function () {
	        this._container = this._el.querySelector('.ms-slider-element-container');
	        this.initSettingsElements();
	    };
	    /**
	     * Inits settings elements.
	     */
	    MarvinaSlider.prototype.initSettingsElements = function () {
	        // index
	        this._elements[this._index].wrapperEl.classList.add('ms-active');
	        // total
	        this._total = this._elements.length;
	        // touchMove
	        if (this._o.touchMove) {
	            this._touchMove = new TouchMove(this._emitter);
	        }
	        // list / asList
	        var asList = Util.getElement(this._o.asList) || null;
	        if (this._o.list || asList) {
	            this._list = new List(this._emitter, this._o.list, asList);
	        }
	        // arrows / prevArrow / nextArrow
	        if (this._o.arrows || this._o.asPrevArrow || this._o.asNextArrow) {
	            this._arrows = new Arrows(this._emitter, this._o.arrows, { prevArrow: Util.getElement(this._o.asPrevArrow), nextArrow: Util.getElement(this._o.asNextArrow) });
	        }
	        // auto playing
	        if (this._autoPlay) {
	            this._autoPlayContainer = document.createElement('div');
	            this._autoPlayContainer.className = 'ms-autoplay-container ms-active';
	            this._autoPlayContainer.innerHTML = [
	                '<svg class="ms-play" viewBox="0 0 48 48"> \t\t\t\t\t\t<path d="M16 10v28l22-14z"></path> \t\t\t\t\t</svg>',
	                '<svg class="ms-stop" viewBox="0 0 512 512"> \t\t\t\t\t\t<rect height="320" width="60" x="153" y="96"></rect><rect height="320" width="60" x="299" y="96"></rect> \t\t\t\t\t</svg>',
	            ].join('');
	            this._autoPlayContainer.addEventListener(Util.events.mousedown, this.toggle.bind(this));
	            this.setAutoPlayInterval(false);
	            this._el.appendChild(this._autoPlayContainer);
	        }
	    };
	    /**
	     * Extracts attributes from default options.
	     */
	    MarvinaSlider.prototype.extractAttributes = function (o) {
	        var i;
	        for (i in defaultOptions) {
	            if (typeof o[i] === 'undefined') {
	                o[i] = defaultOptions[i];
	            }
	        }
	        var properties = ['timing', 'duration', 'sliderType', 'autoPlay', 'autoPlaySpeed', 'init'];
	        for (i in o) {
	            if (properties.indexOf(i) > -1) {
	                this['_' + i] = o[i];
	            }
	        }
	    };
	    /**
	     * Adds a new element to the slider.
	     */
	    MarvinaSlider.prototype.add = function (el, index, options) {
	        if (options === void 0) { options = {}; }
	        if ((el = Util.getElement(el)) && index > -1 && index <= this._total) {
	            if (this._init) {
	                var wrapperEl = document.createElement('div');
	                wrapperEl.classList.add('ms-slider-element-wrapper');
	                el.classList.add('ms-slider-element');
	                wrapperEl.appendChild(el);
	                if (index < this._total) {
	                    this._container.insertBefore(wrapperEl, this._container.childNodes[index]);
	                }
	                else {
	                    this._container.appendChild(wrapperEl);
	                }
	                options.wrapperEl = wrapperEl;
	                options.el = el;
	                if (!options.sliderType) {
	                    options.sliderType = this._sliderType;
	                }
	            }
	            Slider[options.sliderType].init(options);
	            this._elements.splice(index, 0, options);
	            this._total += 1;
	            if (this._index >= index) {
	                this._index += 1;
	            }
	            if (this._list) {
	                this._list.add();
	                this._list.index = this._index;
	            }
	        }
	    };
	    /**
	     * Adds a new element to the head of the slider.
	     */
	    MarvinaSlider.prototype.addFirst = function (el, options) {
	        if (options === void 0) { options = {}; }
	        this.add(el, 0, options);
	    };
	    /**
	     * Adds a new element to the end of the slider.
	     */
	    MarvinaSlider.prototype.addLast = function (el, options) {
	        if (options === void 0) { options = {}; }
	        this.add(el, this._total, options);
	    };
	    /**
	     * Removes the element at the specified index from the slider.
	     */
	    MarvinaSlider.prototype.remove = function (index) {
	        if (index > -1 && index < this._total && this._total > 2) {
	            if (this._init) {
	                this._container.removeChild(this._container.childNodes[index]);
	            }
	            this._elements.splice(index, 1);
	            this._total -= 1;
	            if (this._index >= index) {
	                this._index -= 1;
	            }
	            if (this._elements[this._index]) {
	                this._elements[this._index].wrapperEl.classList.add('ms-active');
	            }
	            if (this._list) {
	                this._list.remove();
	                this._list.index = this._index;
	            }
	        }
	    };
	    /**
	     * Removes the first element from the slider.
	     */
	    MarvinaSlider.prototype.removeFirst = function () {
	        this.remove(0);
	    };
	    /**
	     * Removes the last element from the slider.
	     */
	    MarvinaSlider.prototype.removeLast = function () {
	        this.remove(this._total - 1);
	    };
	    /**
	     * Triggers the previous image. Returns false if the slider is in animation.
	     */
	    MarvinaSlider.prototype.prev = function () {
	        var _this = this;
	        return new Promise(function (resolve) {
	            if (!_this._processing) {
	                _this.prevIndex()
	                    .then(function (resp) {
	                    resolve(resp);
	                });
	            }
	            else {
	                resolve(false);
	            }
	        });
	    };
	    MarvinaSlider.prototype.prevIndex = function (touchMove) {
	        var _this = this;
	        if (touchMove === void 0) { touchMove = false; }
	        return new Promise(function (resolve) {
	            if (!_this._processing || touchMove) {
	                var nIndex = (_this._index - 1 >= 0) ? _this._index - 1 : _this._total - 1;
	                var prevEl = _this._elements[_this._index];
	                var nextEl = _this._elements[nIndex];
	                _this.setSliderAnimation(prevEl, nextEl, nIndex, false)
	                    .then(function () {
	                    resolve(true);
	                });
	            }
	            else {
	                resolve(false);
	            }
	        });
	    };
	    /**
	     * Triggers the next image. Returns false if the slider is in animation.
	     */
	    MarvinaSlider.prototype.next = function () {
	        var _this = this;
	        return new Promise(function (resolve) {
	            if (!_this._processing) {
	                _this.nextIndex()
	                    .then(function (resp) {
	                    resolve(resp);
	                });
	            }
	            else {
	                resolve(false);
	            }
	        });
	    };
	    MarvinaSlider.prototype.nextIndex = function (touchMove, auto) {
	        var _this = this;
	        if (touchMove === void 0) { touchMove = false; }
	        if (auto === void 0) { auto = false; }
	        return new Promise(function (resolve) {
	            if (!_this._processing || touchMove) {
	                var nIndex = (_this._index + 1 < _this._total) ? _this._index + 1 : 0;
	                var prevEl = _this._elements[_this._index];
	                var nextEl = _this._elements[nIndex];
	                _this.setSliderAnimation(prevEl, nextEl, nIndex, true, auto)
	                    .then(function () {
	                    resolve(true);
	                });
	            }
	            else {
	                resolve(false);
	            }
	        });
	    };
	    /**
	     * Starts autoplay.
	     */
	    MarvinaSlider.prototype.play = function () {
	        if (!this._autoPlayStatus) {
	            this._autoPlayStatus = true;
	            this._autoPlayContainer.classList.add('ms-active');
	            this.setAutoPlayInterval();
	            this._el.dispatchEvent(events.play);
	        }
	    };
	    /**
	     * Stops autoplay.
	     */
	    MarvinaSlider.prototype.stop = function () {
	        if (this._autoPlayStatus) {
	            this._autoPlayStatus = false;
	            this._autoPlayContainer.classList.remove('ms-active');
	            clearInterval(this._autoPlayInterval);
	            this._el.dispatchEvent(events.stop);
	        }
	    };
	    /**
	     * Toggles autoplay.
	     */
	    MarvinaSlider.prototype.toggle = function () {
	        if (this._autoPlayStatus) {
	            this.stop();
	        }
	        else {
	            this.play();
	        }
	    };
	    /**
	     * Destroys the slider.
	     */
	    MarvinaSlider.prototype.destroy = function () {
	        if (this._touchMove) {
	            this._touchMove.destroy();
	        }
	        if (this._list) {
	            this._list.destroy();
	        }
	        if (this._arrows) {
	            this._arrows.destroy();
	        }
	        if (this._autoPlay && this._autoPlayStatus) {
	            clearInterval(this._autoPlayInterval);
	        }
	        this._el.innerHTML = '';
	        this._el.classList.remove('ms');
	        this._el.dispatchEvent(events.destroy);
	    };
	    /**
	     * @param index: new index value
	     * @param status: if the new index is greater than the current index, it's true and calls the next method.
	     */
	    MarvinaSlider.prototype.setSliderAnimation = function (prevEl, nextEl, index, status, auto) {
	        var _this = this;
	        if (auto === void 0) { auto = false; }
	        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this._processing = true;
	                        if (!this._callbacks.before) return [3 /*break*/, 2];
	                        return [4 /*yield*/, this._callbacks.before(prevEl, nextEl)];
	                    case 1:
	                        _a.sent();
	                        _a.label = 2;
	                    case 2:
	                        if (!prevEl.before) return [3 /*break*/, 4];
	                        return [4 /*yield*/, prevEl.before(prevEl, false)];
	                    case 3:
	                        _a.sent();
	                        _a.label = 4;
	                    case 4:
	                        if (!nextEl.before) return [3 /*break*/, 6];
	                        return [4 /*yield*/, nextEl.before(nextEl, true)];
	                    case 5:
	                        _a.sent();
	                        _a.label = 6;
	                    case 6:
	                        this._index = index;
	                        if (this._list) {
	                            this._list.index = index;
	                        }
	                        return [4 /*yield*/, Slider[nextEl.sliderType].animate(nextEl, prevEl, status, this._emitter)];
	                    case 7:
	                        _a.sent();
	                        if (!this._callbacks.after) return [3 /*break*/, 9];
	                        return [4 /*yield*/, this._callbacks.after(nextEl, prevEl)];
	                    case 8:
	                        _a.sent();
	                        _a.label = 9;
	                    case 9:
	                        if (!prevEl.after) return [3 /*break*/, 11];
	                        return [4 /*yield*/, prevEl.after(prevEl, false)];
	                    case 10:
	                        _a.sent();
	                        _a.label = 11;
	                    case 11:
	                        if (!nextEl.after) return [3 /*break*/, 13];
	                        return [4 /*yield*/, nextEl.after(nextEl, true)];
	                    case 12:
	                        _a.sent();
	                        _a.label = 13;
	                    case 13:
	                        this._processing = false;
	                        this._el.dispatchEvent(events.change);
	                        if (this._autoPlay && this._autoPlayStatus && !auto) {
	                            clearInterval(this._autoPlayInterval);
	                            this.setAutoPlayInterval(false);
	                        }
	                        resolve();
	                        return [2 /*return*/];
	                }
	            });
	        }); });
	    };
	    Object.defineProperty(MarvinaSlider.prototype, "el", {
	        // es6 getter & setter
	        get: function () {
	            return this._el;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MarvinaSlider.prototype, "beforeCallback", {
	        set: function (value) {
	            this._callbacks.before = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MarvinaSlider.prototype, "afterCallback", {
	        set: function (value) {
	            this._callbacks.after = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // getter & setter
	    MarvinaSlider.prototype.getIndex = function () {
	        return this._index;
	    };
	    MarvinaSlider.prototype.setIndex = function (index) {
	        var _this = this;
	        return new Promise(function (resolve) {
	            if (!_this._processing) {
	                if (index > -1 && index < _this._total && index != _this._index) {
	                    var prevEl = _this._elements[_this._index];
	                    var nextEl = _this._elements[index];
	                    var status_1 = (index > _this._index) ? true : false;
	                    _this.setSliderAnimation(prevEl, nextEl, index, status_1)
	                        .then(function () {
	                        resolve(true);
	                    });
	                }
	                else {
	                    resolve(false);
	                }
	            }
	            else {
	                resolve(false);
	            }
	        });
	    };
	    MarvinaSlider.prototype.getTotal = function () {
	        return this._total;
	    };
	    MarvinaSlider.prototype.getCurrent = function () {
	        return this._elements[this._index];
	    };
	    MarvinaSlider.prototype.getTiming = function () {
	        return this._timing;
	    };
	    MarvinaSlider.prototype.setTiming = function (timing) {
	        this._timing = timing;
	    };
	    MarvinaSlider.prototype.getDuration = function () {
	        return this._duration;
	    };
	    MarvinaSlider.prototype.setDuration = function (duration) {
	        this._duration = duration;
	    };
	    MarvinaSlider.prototype.getAutoPlaySpeed = function () {
	        return this._autoPlaySpeed;
	    };
	    MarvinaSlider.prototype.setAutoPlaySpeed = function (speed) {
	        this._autoPlaySpeed = speed;
	        if (this._autoPlay && this._autoPlayStatus) {
	            clearInterval(this._autoPlayInterval);
	            this.setAutoPlayInterval();
	        }
	    };
	    MarvinaSlider.prototype.setAutoPlayInterval = function (duration) {
	        var _this = this;
	        if (duration === void 0) { duration = true; }
	        var speed = (!duration) ? this._autoPlaySpeed : (this._autoPlaySpeed + this._duration);
	        this._autoPlayInterval = setInterval(function () { _this.nextIndex(false, true); }, speed);
	    };
	    MarvinaSlider.prototype.getElements = function () {
	        return this._elements;
	    };
	    MarvinaSlider.prototype.setElements = function (elements) {
	        this._elements = elements;
	    };
	    // emitter methods
	    MarvinaSlider.prototype.emit = function (method, args) {
	        return this[method].apply(this, args);
	    };
	    MarvinaSlider.prototype.get = function (property) {
	        return this[property];
	    };
	    MarvinaSlider.prototype.set = function (property, value) {
	        this[property] = value;
	    };
	    return MarvinaSlider;
	}());

	exports.Slider = MarvinaSlider;
	exports.defaultOptions = defaultOptions;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
