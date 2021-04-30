/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/constant.ts":
/*!*************************!*\
  !*** ./src/constant.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TEXT_ELEMENT = void 0;
exports.TEXT_ELEMENT = 'TEXT';


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.React = exports.createTextElement = void 0;
const constant_1 = __webpack_require__(/*! ./constant */ "./src/constant.ts");
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;
function isProperty(key) {
    return key !== 'children' && !isEvent(key);
}
function isEvent(key) {
    return key.startsWith('on');
}
function createTextElement(text) {
    return {
        type: constant_1.TEXT_ELEMENT,
        props: {
            children: [],
            nodeValue: text,
        },
    };
}
exports.createTextElement = createTextElement;
function createElement(type, props, ...children) {
    const getChildren = () => {
        return children.map(child => {
            if (typeof child === 'object') {
                return child;
            }
            else {
                return createTextElement(child);
            }
        });
    };
    return {
        type: type,
        props: {
            ...props,
            children: getChildren(),
        },
    };
}
function updateDOM(dom, prevProps, nextProps) {
    Object
        .keys(prevProps)
        .filter(isEvent)
        .filter(key => (!(key in nextProps) || (prevProps[key] !== nextProps[key])))
        .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });
    Object
        .keys(prevProps)
        .filter(isProperty)
        .filter((val) => !(val in nextProps))
        .forEach(name => {
        dom[name] = '';
    });
    Object.keys(nextProps)
        .filter(isProperty)
        .filter((val) => prevProps[val] !== nextProps[val])
        .forEach(name => {
        dom[name] = nextProps[name];
    });
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(key => prevProps[key] !== nextProps[key])
        .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}
function commitWork(fiber) {
    if (!fiber) {
        return;
    }
    const domParent = fiber.parent.dom;
    if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
        domParent.appendChild(fiber.dom);
    }
    else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
        updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
    }
    else if (fiber.effectTag === 'DELETION') {
        domParent.removeChild(fiber.dom);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}
function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
}
function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [
                element,
            ],
        },
        child: null,
        parent: null,
        sibling: null,
        type: '',
        effectTag: undefined,
        alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
}
function createDOM(fiber) {
    let DOMElement = fiber.type === constant_1.TEXT_ELEMENT
        ? document.createTextNode('')
        : document.createElement(fiber.type);
    const props = fiber.props;
    Object
        .keys(props)
        .filter(key => isProperty(key))
        .forEach(k => {
        DOMElement[k] = props[k];
    });
    return DOMElement;
}
function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber);
    }
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);
    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}
function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling = null;
    while (index < elements.length || oldFiber !== null) {
        const currentElement = elements[index];
        let newFiber = null;
        const sameType = oldFiber && currentElement && currentElement.type === oldFiber.type;
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                alternate: oldFiber,
                dom: oldFiber.dom,
                parent: wipFiber,
                props: currentElement.props,
                effectTag: 'UPDATE',
                sibling: null,
                child: null,
            };
        }
        if (currentElement && !sameType) {
            newFiber = {
                type: currentElement.type,
                alternate: null,
                dom: null,
                parent: wipFiber,
                props: currentElement.props,
                effectTag: 'PLACEMENT',
                sibling: null,
                child: null,
            };
        }
        if (oldFiber && !sameType) {
            oldFiber.effectTag = 'DELETION';
        }
        if (index === 0) {
            wipFiber.child = newFiber;
        }
        else {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index += 1;
    }
}
function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    window.requestIdleCallback(workLoop);
}
window.requestIdleCallback(workLoop);
exports.React = {
    createElement,
    render,
};

})();

/******/ })()
;