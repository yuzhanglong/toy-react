import { ReactFiber, ReactNode, ReactProps } from './types';
import { TEXT_ELEMENT } from './constant';

let nextUnitOfWork: ReactFiber = null;
let wipRoot: ReactFiber = null;
let currentRoot: ReactFiber = null;
let deletions: ReactFiber[] = null;

function isProperty(key: string) {
  return key !== 'children' && !isEvent(key);
}

function isEvent(key: string) {
  return key.startsWith('on');
}

/**
 * 创建一个 text 节点
 *
 * @param text 一个字符串，表示节点内容
 */
export function createTextElement(text: string): ReactNode {
  return {
    type: TEXT_ELEMENT,
    props: {
      children: [],
      nodeValue: text,
    },
  };
}

/**
 * 创建一个 react element
 *
 * @param type dom 节点的类型
 * @param props element props
 * @param children react nodes
 * @return {ReactNode} 一个 react 节点对象
 */
function createElement(type: string, props: ReactProps, ...children: (ReactNode | string)[]): ReactNode {
  const getChildren = () => {
    return children.map(child => {
      if (typeof child === 'object') {
        return child;
      } else {
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

function updateDOM(dom: HTMLElement | Text, prevProps: ReactProps, nextProps: ReactProps) {
  // 移除旧的监听器
  Object
    .keys(prevProps)
    .filter(isEvent)
    // key 不存在或者key 存在但是引用对象不同
    .filter(key => (!(key in nextProps) || (prevProps[key] !== nextProps[key])))
    .forEach(name => {
      // onClick -> onclick -> click
      const eventType = name.toLowerCase().substring(2);
      // 移除回调
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 处理旧的 props，如果旧的 props 的某一项在新的 props 中不再出现，移除之
  Object
    .keys(prevProps)
    .filter(isProperty)
    .filter((val) => !(val in nextProps))
    .forEach(name => {
      dom[name] = '';
    });

  // 处理新的 props，只处理改变的 props
  Object.keys(nextProps)
    .filter(isProperty)
    .filter((val) => prevProps[val] !== nextProps[val])
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // 添加监听器
  Object.keys(nextProps)
    .filter(isEvent)
    // 前后不一致
    .filter(key => prevProps[key] !== nextProps[key])
    .forEach(name => {
      // onClick -> onclick -> click
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitWork(fiber: ReactFiber) {
  // commit - DOM 更新
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  const fiberDOM = fiber.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiberDOM) {
    // placement 添加节点
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiberDOM) {
    // update 更新节点
    updateDOM(fiberDOM, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    // 移除节点
    domParent.removeChild(fiberDOM);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  deletions.forEach((fiberToDelete) => {
    commitWork(fiberToDelete);
  });
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function render(element: ReactNode, container: HTMLElement) {
  // 初始化 root Fiber
  wipRoot = {
    dom: container,
    props: {
      children: [
        element,
      ],
    },
    alternate: currentRoot,
    child: null,
    parent: null,
    sibling: null,
    type: '',
    effectTag: null,
  };

  deletions = [];
  // 赋值给下一个工作单元
  nextUnitOfWork = wipRoot;
}

function createDOM(fiber: ReactFiber): HTMLElement {
  // 根据节点类型来初始化节点
  let DOMElement = fiber.type === TEXT_ELEMENT
    ? document.createTextNode('')
    : document.createElement(fiber.type);

  updateDOM(DOMElement, {} as unknown, fiber.props);

  return DOMElement as HTMLElement;
}

function performUnitOfWork(fiber: ReactFiber): ReactFiber {
  // 如果不存在相应的 DOM，构建之
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }

  // 下面开始处理孩子
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 接下来，我们返回下一个需要处理的 fiber
  // 如果有孩子，返回之
  if (fiber.child) {
    return fiber.child;
  }

  // 如果没有孩子，那么我们尝试的到和他平级的兄弟
  // 如果没有兄弟，那我们返回父亲平级的兄弟，依次类推
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      nextFiber = nextFiber.parent;
    }
  }
}

function reconcileChildren(wipFiber: ReactFiber, elements: ReactNode[]) {
  let index = 0;

  let oldFiber = wipFiber.alternate?.child;
  let prevSibling: ReactFiber = null;

  while (index < elements.length || oldFiber) {
    const currentElement = elements[index];
    let newFiber: ReactFiber = null;
    // 新旧 fiber 类型是否相同
    const isSameType: boolean = oldFiber && currentElement && currentElement.type === oldFiber.type;

    // 如果新旧 fiber 存在且具有相同的类型，我们保留 DOM 节点，并尝试更新 props
    if (isSameType) {
      newFiber = {
        // 新的 fiber 类型，由于前后两者类型相同才会进入此分支，我们使用旧的就可以
        type: oldFiber.type,
        // 旧 fiber 的引用
        alternate: oldFiber,
        // 旧 fiber 的 DOM
        dom: oldFiber.dom,
        // 父亲 fiber
        parent: wipFiber,
        // 新 props
        props: currentElement.props,
        // 作用标签
        effectTag: 'UPDATE',
        sibling: null,
        child: null,
      };
    }

    // 如果类型不同，并且当前节点存在，说明有一个新元素
    if (currentElement && !isSameType) {
      newFiber = {
        type: currentElement.type,
        alternate: null,
        dom: null,
        // 父亲 fiber
        parent: wipFiber,
        // 新 props
        props: currentElement.props,
        // 作用标签
        effectTag: 'PLACEMENT',
        sibling: null,
        child: null,
      };
    }

    // 如果类型不同，并且有旧 fiber，删除旧节点
    if (oldFiber && !isSameType) {
      oldFiber.effectTag = 'DELETION';
    }


    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }


    if (index === 0) {
      // 如果是父亲的直接孩子（第一个 child）
      wipFiber.child = newFiber;
    } else {
      // 如果非第一个孩子，那么他们是前一个节点的 sibling
      // 这其实是个典型的链表数据结构
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index += 1;
  }
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  // 有任务并且时间充足，执行工作
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // commit 阶段
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);


export const React = {
  createElement,
  render,
};

const updateValue = (e: Event) => {
  rerender(((e.target) as any).value);
};


const rerender = (val: string) => {
  const element = (
    <div>
      <div>
        <input onInput={updateValue} value={val} />
        <h2>{val}</h2>
      </div>
    </div>
  );
  const el = document.getElementById('app');
  React.render(element, el);
};

rerender('world');
