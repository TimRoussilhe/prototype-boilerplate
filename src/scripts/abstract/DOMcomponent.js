import _ from 'underscore';

/**
 * Component: Defines a component with basic methods
 * @constructor
 */
class Component {

    /**
     * Object as associative array of all the <handlers> objects
     * @type {Object}
     */
    handlers = {};

    /**
     * Object as associative array of all the <DOM.events> objects
     * @type {Object}
     */
    _events = {};
    
        set events(events) {
            for (const event in events) { // eslint-disable-line guard-for-in
                this._events[event] = events[event];
            }
            this.delegateEvents();
        }
    
        get events() {
            return this._events;
        }

    /**
     * Object as associative array of all the <promises> objects
     * @type {Object}
     */
    _promises = {
        init: {
            resolve: null,
            reject: null
        },
        show: {
            resolve: null,
            reject: null
        },
        hidden: {
            resolve: null,
            reject: null
        }
    };

    set promises(promises) {
        for (const promise in promises) { 
            this.promises[promise] = promises[promise];
        }
    }

    get promises() {
        return this._promises;
    }

    /**
     * Object as associative array of all the states
     * @type {Object}
     */
    _states = {}

    set states(states) {
        for (const state in states) { // eslint-disable-line guard-for-in
            this._states[state] = states[state];
        }
    }

    get states() {
        return this._states;
    }

	/**
     * uniqueId
     * @type {String}
     */
    cid = null;

    constructor(props) {
        super();

        this.props = props;        
        this.states = {
            canUpdate: false,
            isInit: false,
            isAnimating: false,
            isShown: false
        };

        this.cid = _.uniqueId('component');

        this.selector = props.selector ? props.selector : this.selector;
        this.el = props.el ? props.el : this.el;
    }

	/**
	 * Init
	 * @return A Promise the component is init
	 */
    init() {
        return new Promise((resolve, reject) => {
            this.promises.init.resolve = resolve;
            this.promises.init.reject = reject;

            const {isInit} = this.states;

            if (isInit) {
                this.promises.init.reject();
                return;
            }

            this.initComponent();
        });
    }

	/**
	 * Init the component.
	 * Override and trigger onInit when we have to wait for computer procesing, like canvas initialization for instance.
	 */
    initComponent() {
        this.render();        
    }

    onRender() {
        this.initDOM();
        this.setupDOM();
        this.delegateEvents();
        setTimeout(::this.onDOMInit, 0);
    }

    /**
     * Init all your DOM elements here
     */
    initDOM() {}
    
    /**
     * Setup your DOM elements here ( for example defaut style before animation )
     */
    setupDOM() {}

    onDOMInit() {
        this.bindEvents();
        this.bindGlobalStoreEvents();
        this.onInit();
    }

	/**
	 * Once the component is init
	 */
    onInit() {
        this.setState({isInit: true, canUpdate: true});
        this.promises.init.resolve();
    }

	/**
	 * Bind your events here
	 */
    bindEvents() {}

    /**
	 * Bind your store events here
	 */
    bindGlobalStoreEvents() {}

	/**
	 * Unbind yout events here
	 */
    unbindEvents() {}

    /**
     * Set callbacks, where `this.events` is a hash of
     *
     * *{"event selector": "callback"}*
     * 
     *  {
     *      'mousedown .title':  'edit',
     *      'click .button':     'save',
     *      'click .open':       function(e) { ... }
     *   }
     * @param  {Object} Events Objcets
     */
    delegateEvents (events) {
        events || (events = _.result(this, 'events'));
        if (!events) return this;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!_.isFunction(method)) method = this[method];
          if (!method) continue;
          var match = key.match(delegateEventSplitter);
          this.delegate(match[1], match[2], _.bind(method, this));
        }
        return this;
    }

    /**
     * Add a single event listener to the view's element (or a child element
     * using `selector`). This only works for delegate-able events: not `focus`,
     * `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
     */
    delegate(eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    }

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents() {
        if (this.$el) this.$el.off('.delegateEvents' + this.cid);
        return this;
    }

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate(eventName, selector, listener) {
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    }
  
    setState(partialState = {}, callback, needRender = false) {
        if (typeof partialState !== 'object' &&
            typeof partialState !== 'function' &&
            partialState !== null
        ) {
            console.error('setState(...): takes an object of state variables to update or a ' +
            'function which returns an object of state variables.');
            return;
        }

        for (const key in partialState) {  // eslint-disable-line guard-for-in
            this.states[key] = partialState[key];
        }

        if (callback) callback();
        if (needRender) this.render();
    }

    /**
	 * Render your component
	 * This is where we scope the main elements
	 */
    setElement() {
        if (this.el === null && this.selector === null && this.template === null) {
            console.error('You must provide a template or an el or a selector to scope a component. Creating an empty div instead', this);
            this.el = document.createElement('div');
        }

        if (this.el !== null) {
            this.el = this.el;            
            return;
        }

        if (this.selector !== null) {
            this.el = this.selector;
        }

        if (this.template !== null) {
            this.renderTemplate();
            return;
        }
    }

    /**
	 * Render your template
     * ( not sure we are going to need it for prototypes but can be useful )
	 */
    renderTemplate() {
        this.el = this.template();
    }

	/**
	 * Update
     * 
	 */
    update() {
        if (this.states.canUpdate) this.onUpdate();        
    }

	/**
	 * Called on scroll
	 */
    onScroll() {}

	/**
	 * Called on update
	 */
    onUpdate() {}

	/**
	 * Called on resize
     * In our scenario this will listen to the GlobalStore Events
	 */
    onResize() {}

	/**
	 * Call render function if you wanna change the component
	 * based on states/data
	 */
    render() {
        // Default components just need to scope a piece of DOM from constructor
        this.setElement();
        setTimeout(::this.onRender, 0);        
    }

	/**
	 * Show the component
	 */
    show() {
        return new Promise((resolve, reject) => {
            this.promises.show.resolve = resolve;
            this.promises.show.reject = reject;
            this.setState({isAnimating: true, canUpdate: true});
            this.showComponent();
        });
    }

    showComponent() {
        this.onShown();
    }

	/**
	 * The component is shown
	 */
    onShown() {
        this.setState({isShown: true, isAnimating: false});
        this.promises.show.resolve();
    }

	/**
	 * Hide the component
	 */
    hide() {
        return new Promise((resolve, reject) => {
            this.promises.hidden.resolve = resolve;
            this.promises.hidden.reject = reject;
            this.setState({isAnimating: true});
            this.hideComponent();
        });
    }

    hideComponent() {
        this.onHidden();
    }

	/**
	 * The component is shown
	 */
    onHidden() {
        this.setState({isAnimating: false, isShown: false, canUpdate: false});
        this.promises.hidden.resolve();
    }

	/**
	 * Dispose the component
	 */
    dispose() {
        this.setState({isInit: false, isShown: false, canUpdate: false});
        this.unbindEvents();
        this.handlers = {};
        this.promises = {};
        super.dispose();
    }
}

export default Component;
