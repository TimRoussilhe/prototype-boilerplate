// import App from './app/app';
import 'app.scss';

class Main {
	onReady() {
		// const app = new App();
		// app.init();
        console.log('Hello World');
    }
}

const main = module.exports = new Main();

document.addEventListener("DOMContentLoaded", () => {
	// Handler when the DOM is fully loaded
	main.onReady(main);
});