import { useState } from 'react'
import './App.css'
import SignInSection from './components/SignInSection'
import WriteBlogPage from './components/WriteBlogPage'


function App() {
  const [count, setCount] = useState(0)

  return (
      <WriteBlogPage/>
  )
}

export default App
