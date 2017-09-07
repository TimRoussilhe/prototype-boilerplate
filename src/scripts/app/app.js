/* global  _*/

/**
 * app: Init the app
 * @constructor
 */
class App {

	constructor(){

        this.init();
        this.bindEvents();
        
        this.resize();

	}

	init() {
        console.log('hello World');

        // init your components or you app here
        // scope your selectors etc...
        
    }

    bindEvents() {

        window.addEventListener('resize', ::this.resize);
        
    }

    resize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
    }

}

export default App;