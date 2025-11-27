import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CreditRequestForm from './modules/ApplicationLoans/page/CreditRequestForm'
import { Route, Routes } from 'react-router-dom'
import AuthTabs from './modules/Portal/Security/page/AuthTabs'
import CreditRequestsPage from './modules/Portal/LoanApplication/pages/CreditRequestsPage'
import RequireAuth from "./shared/middleware/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreditRequestForm />} />
      
      <Route path="/portal/login" element={<AuthTabs />} />
      <Route element={<RequireAuth />}>
        <Route path="/portal" element={<CreditRequestsPage />} />
      </Route>
    </Routes>
  );
}

function AppOld() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CreditRequestForm />
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
