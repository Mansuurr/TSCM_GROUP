import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { queryClient } from './lib/query-client'

const Home = () => (
  <div className="flex min-h-screen flex-col items-center justify-center px-6">
    <h1 className="text-center text-5xl font-light tracking-tight text-white sm:text-7xl">
      TSCM Group
    </h1>
    <p className="mt-6 text-center text-lg text-[var(--color-text-muted)]">
      Минимализм. Технологии. Будущее.
    </p>
    <div className="mt-10 h-px w-16 bg-[var(--color-border)]" />
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App