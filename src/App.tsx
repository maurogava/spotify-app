import { FC, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from 'components/Loading'
import Layout from 'components/Layout'
import { AuthContextProvider } from 'hooks/useAuth'

const SpotifyLogin = lazy(() => import('pages/SpotifyLogin'))
const SpotifyAuthRedirect = lazy(() => import('pages/SpotifyAuthRedirect'))
const Home = lazy(() => import('pages/Home'))
const Logout = lazy(() => import('pages/Logout'))

const App: FC = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Layout>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={SpotifyLogin} />
              <Route path="/logout" component={Logout} />
              <Route path="/auth" component={SpotifyAuthRedirect} />
            </Switch>
          </Suspense>
        </Layout>
      </Router>
    </AuthContextProvider>
  )
}

export default App
