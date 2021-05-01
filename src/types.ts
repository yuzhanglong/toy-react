export type ReactProps = {
  [key: string]: any
} & {
  children?: ReactNode[]
}

export type FunctionComponent = (props: ReactProps) => ReactNode

export interface ReactNode {
  type: string
  props: ReactProps
}

export interface ReactHook {
  // 初始状态
  baseState?: any
  // 状态队列
  queue?: any[]
  // 依赖，用于 useEffect
  deps?: any[]
}

export interface ReactFiber {
  // 对应 DOM
  dom: HTMLElement
  // 类型
  type: string | FunctionComponent
  // props
  props: ReactProps
  // 父节点
  parent: ReactFiber
  // 子节点
  child: ReactFiber
  // 兄弟节点
  sibling: ReactFiber
  // 旧 fiber 的引用
  alternate: ReactFiber
  // 修改标记
  effectTag: 'UPDATE' | 'PLACEMENT' | 'DELETION'
  // hooks
  hooks?: ReactHook[]
}
