/** Globalstore: A singleton that manage state of your app. 
 You can add state element and subscribe to their change everywhere in your app) 
 Example for classic callback handler : GlobalStore.on('change:scrollY', this.handlers.scroll);
 Example for to subscribe to RAQ callback : GlobalStore.get('rafCallStack').push(this.handlers.update);
 Example for to update RAQ callback : 
 // update run through the RAF call stack:
	for (var c = 0; c < GlobalStore.get('rafCallStack').length; c++) {
	    GlobalStore.get('rafCallStack')[c]();
	}
 */
/* global  window  */

// import is from 'is_js';

class GlobalStore {
	constructor() {
		this._type = 'CommonModel';
		this._eventTypes = [];
		this._callbackFunctions = [];
		this._dataObj = {
			createdAt: new Date(),
			rafCallStack: [],
			scrollY: 0,

			viewport: {
				width: window.innerWidth,
				height: window.innerHeight
			},

			// keydown : evt.keyCode || evt.which
			onKeyDown: null,

			// is there any animation happening
			isAnimating: false,
			isContactAnimating: false,

			// Pages
			oldPage: null,
			currentPage: null,
			currentSlug: null,
			firstTime: true,

			// Components
			contactDisplayed: false,
			menuDisplayed: true,

			// top distance : Used for IndexToCase transition
			topDistanceTitle: 0,
			topDistanceCasetoCase: 0,

			// case scrolling
			canScrollNextCase: false,
			currentCaseSlug: -1,

			isMobile: is.mobile(),
			isTablet: is.tablet()
		};

		// // Objects that are not going ot be modified neither need callback
		this.transitionValue = null;
	}

	on(eventType, callback) {
		if (this._eventTypes.findIndex(x => x === eventType) === -1) {
			this._eventTypes.push(eventType);
		}

		if (this._callbackFunctions[eventType]) {
			this._callbackFunctions[eventType].push(callback);
		} else {
			this._callbackFunctions[eventType] = [];
			this._callbackFunctions[eventType].push(callback);
		}
	}

	off(eventType, callback) {
		for (let i = 0; i < this._callbackFunctions[eventType].length; i++) {
			console.log('this._callbackFunctions[eventType][i]', this._callbackFunctions[eventType][i]);
			if (callback === this._callbackFunctions[eventType][i]) {
				console.log('MATCH', this._callbackFunctions[eventType][i]);
				this._callbackFunctions[eventType].splice(i, 1);
			}
		}
	}

	offRAF(callback) {
		console.log('callback', callback);

		for (let i = 0; i < this.get('rafCallStack').length; i++) {
			let current = this.get('rafCallStack')[i];
			console.log('current', current);
			if (current === callback) {
				if (i > -1) {
					this.get('rafCallStack').splice(i, 1);
				}
			}
			console.log('current', this.get('rafCallStack'));
		}
	}

	set(attr, val, silent) {
		if (silent) {
			this._dataObj[attr] = val;
		} else {
			if (this._dataObj[attr] !== val) {
				const previous = this._dataObj[attr];
				this._dataObj[attr] = val;
				this._eventTypes.forEach((eventType, index) => {
					this._callbackFunctions[eventType].forEach((callback, index) => {
						if (eventType.indexOf('change:') > -1) {
							if (eventType === 'change:' + attr) {
								callback.call(this, val, previous);
							}
						} else {
							callback.call(this, val, previous);
						}
					});
				});
			}
		}
	}

	get(attr) {
		return this._dataObj[attr];
	}
}
// findIndex Polyfill
if (!Array.prototype.findIndex) {
	Object.defineProperty(Array.prototype, 'findIndex', {
		value: function(predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			var thisArg = arguments[1];

			// 5. Let k be 0.
			var k = 0;

			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return k.
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return k;
				}
				// e. Increase k by 1.
				k++;
			}

			// 7. Return -1.
			return -1;
		}
	});
}

export default new GlobalStore();