import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { client } from '../shared/apollo'
import { GET_USERS } from '../shared/graphql/queries'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
`

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => 
    props.$status === 'active' ? '#d4edda' : 
    props.$status === 'inactive' ? '#f8d7da' : '#fff3cd'
  };
  color: ${props => 
    props.$status === 'active' ? '#155724' : 
    props.$status === 'inactive' ? '#721c24' : '#856404'
  };
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`

export default function Users() {
  const { data, loading, error } = useQuery(GET_USERS, { client })

  if (loading) return <LoadingMessage>Loading users...</LoadingMessage>
  if (error) return <LoadingMessage>Error loading users</LoadingMessage>

  const users = data?.users || []

  return (
    <Container>
      <Title>Users</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Created</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusBadge $status={user.status.toLowerCase()}>
                  {user.status}
                </StatusBadge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
