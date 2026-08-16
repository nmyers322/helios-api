import { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'
import { isPackageLocked } from '../../modules/packageDeals'

const PackageLockContext = createContext(false)

export const PackageLockProvider = ({ children }) => {
  const orderForm = useSelector((state) => state.orderForm)
  return (
    <PackageLockContext.Provider value={isPackageLocked(orderForm)}>
      {children}
    </PackageLockContext.Provider>
  )
}

export const usePackageLock = () => useContext(PackageLockContext)
