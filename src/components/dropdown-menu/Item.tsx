import { FC, ReactNode } from 'react'

export interface IItem {
  children: ReactNode
}

const Item: FC<IItem> = ({ children }) => <>{children}</>

export default Item
