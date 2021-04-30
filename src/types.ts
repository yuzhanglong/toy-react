export type ReactProps = {
  [key: string]: any
} & {
  children?: ReactNode[]
}

export interface ReactNode {
  type: string
  props: ReactProps
}

export interface ReactFiber {
  // 对应 DOM
  dom: HTMLElement
  // 类型
  type: string
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
}
