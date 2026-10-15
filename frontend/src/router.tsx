import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { ButtonLink } from './components/Button'
import { StateView } from './components/StateView'
import { LoginForm } from './features/auth/LoginForm'
import { RegisterForm } from './features/auth/RegisterForm'
import { ValidationPanel } from './features/ai-validation/ValidationPanel'
import { OVAList } from './features/ova-catalog/OVAList'
import { OVAEditor } from './features/ova-editor/OVAEditor'
import { ProgressTable } from './features/teacher-dashboard/ProgressTable'
import { ProtectedRoute } from './components/ProtectedRoute'
import { OVAPlayer } from './features/ova-viewer/OVAPlayer'
import { OVAViewer } from './features/ova-viewer/OVAViewer'

// Route map — spec 8.3
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <StateView
        title="Algo salió mal"
        message="Recarga la página para continuar. Tu progreso está guardado."
        action={<ButtonLink to="/" reloadDocument>Recargar</ButtonLink>}
      />
    ),
    children: [
      { index: true, element: <OVAList /> },
      { path: 'ovas/:id', element: <OVAViewer /> },
      { path: 'ovas/:id/paso/:paso', element: <OVAPlayer /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'registro', element: <RegisterForm /> },
      {
        path: 'docente/progreso',
        element: (
          <ProtectedRoute role={['docente', 'administrador']}>
            <ProgressTable />
          </ProtectedRoute>
        ),
      },
      {
        path: 'docente/ovas/nuevo',
        element: (
          <ProtectedRoute role={['docente', 'administrador']}>
            <OVAEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: 'validacion',
        element: (
          <ProtectedRoute role={['validador', 'docente', 'administrador']}>
            <ValidationPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <StateView
            title="No encontramos esta página"
            message="Revisa la dirección o vuelve a la ruta de aprendizaje."
            action={<ButtonLink to="/">Ir al inicio</ButtonLink>}
          />
        ),
      },
    ],
  },
])
