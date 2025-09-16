import styled from 'styled-components'
import { useState } from 'react'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Settings saved:', settings)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Container>
      <Title>Settings</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="theme">Theme</Label>
          <Select
            id="theme"
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="language">Language</Label>
          <Select
            id="language"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="bg">Bulgarian</option>
            <option value="es">Spanish</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            id="timezone"
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="Europe/Sofia">Europe/Sofia</option>
            <option value="America/New_York">America/New_York</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Enable notifications
          </Label>
        </FormGroup>

        <Button type="submit">Save Settings</Button>
      </Form>
    </Container>
  )
}






