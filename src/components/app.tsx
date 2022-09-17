import { h } from 'preact'
import { Provider } from 'react-redux'
import { store } from '../store'
import { Main } from './main'

const App = () => (
  <Provider store={store}>
    <Main />
  </Provider>
)

export default App
