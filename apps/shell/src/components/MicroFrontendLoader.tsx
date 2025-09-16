import { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 2rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
  background: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
`

const MicroFrontendContainer = styled.div`
  width: 100%;
  height: 100%;
`

interface MicroFrontendLoaderProps {
  moduleName: string
}

export function MicroFrontendLoader({ moduleName }: MicroFrontendLoaderProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [MicroFrontend, setMicroFrontend] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    loadMicroFrontend()
  }, [moduleName])

  const loadMicroFrontend = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load micro-frontend modules based on the module name
      let module
      switch (moduleName) {
        case 'dashboard':
          module = await import('../micro-frontends/dashboard')
          break
        case 'users':
          module = await import('../micro-frontends/users')
          break
        case 'settings':
          module = await import('../micro-frontends/settings')
          break
        default:
          throw new Error(`Unknown module: ${moduleName}`)
      }
      
      setMicroFrontend(() => module.default)
    } catch (err) {
      console.error(`Failed to load micro-frontend ${moduleName}:`, err)
      setError(`Failed to load ${moduleName} module`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h3>Error Loading Module</h3>
          <p>{error}</p>
          <button onClick={loadMicroFrontend}>Retry</button>
        </ErrorMessage>
      </Container>
    )
  }

  if (!MicroFrontend) {
    return (
      <Container>
        <ErrorMessage>
          <h3>Module Not Found</h3>
          <p>Micro-frontend module "{moduleName}" could not be loaded.</p>
        </ErrorMessage>
      </Container>
    )
  }

  return (
    <MicroFrontendContainer>
      <MicroFrontend />
    </MicroFrontendContainer>
  )
}
