import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify'
import {
  Routes,
  Route,
  useMatch
} from 'react-router-dom'

import { Navbar, Home, Footer, RegisterFund, Dashboard, Fund } from './components'
import { useEffect } from 'react'
import { handleConnectWallet, handleAccountChange } from './store/actions/handleAccount'
import { useDispatch } from 'react-redux'
import { toastSuccess, toastError } from './utils/toast'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleWallet = async () => {
      const result = await dispatch(handleConnectWallet())
      if (result.passed) toastSuccess(result.msg)
      else toastError(result.msg)
    }

    handleWallet()
  }, [])

  window.ethereum.on('accountsChanged', (accounts) => {
    dispatch(handleAccountChange(accounts))
  })

  const matchFund = useMatch('/funds/:id')
  const fundAddress = !matchFund ? null : matchFund.params.id.toString()

  return (
    <ChakraProvider>
      <Navbar />
      <Routes>
        <Route path="/about" />
        <Route path="/funds">
          <Route path=":id" element={<Fund address={fundAddress} />} />
          <Route path="topfunds" />
          <Route path="createfund" element={<RegisterFund />} />
        </Route>
        <Route path="/market" />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </ChakraProvider>
  )
}

export default App
