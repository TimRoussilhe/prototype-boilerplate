# Prototype boilerplate

Ready to go single page boilerplate 
  - Html / CSS / JS managed via webpack
  - Dev server : HMR 
  - Build script
  - Deploy static site via now

### Commands

Run dev environment 
```
npm run start
```

Build
```
npm run build-webpacl
```

Build and deploy
```
npm run build
```

### Stuff to know
This is a pretty simple setup, here are some interesting stuffs tho : 
##### Globalstore.js
Singleton that can be used as a global state manager, perfect to deal with resizxing or global RAQ 

##### DOMComponent.js
es6 classes abstarct DOM components
- States
- All Promises
- Events objetc declaration
- Unique ID
- Lyfecycle : init > initComponent > render > onRender > initDOM / setupDOM / delegateEvents > onDOMInit > bindEvents / bindGlobalStoreEvents / onInit > init.resolve() 
- Animation Lifecycle : show > showComponent > onShown

