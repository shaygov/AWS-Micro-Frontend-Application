import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { GET_DASHBOARD_STATS } from '../graphql/queries'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const StatTitle = styled.h3`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const StatDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`

export function Dashboard() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS)

  if (loading) return <LoadingMessage>Loading dashboard...</LoadingMessage>
  if (error) return <LoadingMessage>Error loading dashboard data</LoadingMessage>

  const stats = data?.dashboardStats || {
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0
  }

  return (
    <Container>
      <Title>Dashboard</Title>
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatDescription>Registered users</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>Active Users</StatTitle>
          <StatValue>{stats.activeUsers}</StatValue>
          <StatDescription>Online now</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>Total Orders</StatTitle>
          <StatValue>{stats.totalOrders}</StatValue>
          <StatDescription>All time orders</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>Revenue</StatTitle>
          <StatValue>${stats.revenue}</StatValue>
          <StatDescription>This month</StatDescription>
        </StatCard>
      </StatsGrid>
    </Container>
  )
}
