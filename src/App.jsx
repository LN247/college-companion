import { useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/signupForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
 

  return (
<div>
  <Router>

    <Routes>
      <Route path='/' element={<LoginForm/>}/>
      <Route path='/signup' element={<SignupForm/>}/>

    </Routes>

  </Router>
</div>
  )
}

export default App
