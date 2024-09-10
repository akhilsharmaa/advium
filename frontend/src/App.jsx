import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignInSection from './components/SignInSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <SignInSection/>
  )
}

export default App
