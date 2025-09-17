import styled from 'styled-components'
import { Navigation } from './Navigation'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
  margin-left: 250px;
`

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Container>
      <Navigation />
      <Main>{children}</Main>
    </Container>
  )
}











