import { FC, ReactNode } from 'react'

export interface ILabel {
  children: ReactNode
}

const Label: FC<ILabel> = ({ children }) => <>{children}</>

export default Label
