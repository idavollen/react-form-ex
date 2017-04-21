require('./form.less')
import React from 'react'
import ReactDOM from 'react-dom'

// app specific imports
import ContactApp from './components/ContactApp.jsx'

ReactDOM.render(
  <ContactApp />, document.getElementById('root')
)
