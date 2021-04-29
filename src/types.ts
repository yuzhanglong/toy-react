export type ReactProps = {
  [key: string]: any
} & {
  children?: ReactNode[]
}

export interface ReactNode {
  type: string
  props: ReactProps
}
