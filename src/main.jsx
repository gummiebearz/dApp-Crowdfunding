import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/antd.css'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
)
