const TEXT_ELEMENT = 'TEXT';

type ReactProps = {
  [key: string]: any
} & {
  children?: ReactNode[]
}

interface ReactNode {
  type: string
  props: ReactProps
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

/**
 * 给定一个 react 节点 和容纳的 HTML Element, 渲染相应的 react 元素
 *
 * @param element React 节点对象
 * @param container 容器
 */
function render(element: ReactNode, container: HTMLElement | Text) {
  const isDomProps = (key) => {
    return key !== 'children';
  };

  let DOMElement = element.type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(element.type);

  // 挂载必要的属性到 DOM 上
  const props = element.props;
  Object
    .keys(props)
    .filter(key => isDomProps(key))
    .forEach(k => {
      DOMElement[k] = props[k];
    });

  // 递归子节点
  element.props.children.map(res => {
    render(res, DOMElement);
  });

  container.appendChild(DOMElement);
}

export const React = {
  createElement,
  render,
};
