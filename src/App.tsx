import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Landing } from './components/landing/Landing';
import { EditorDashboard } from './pages/EditorDashboard';
import { HistoryList } from './components/history/HistoryList';
import { ErrorDetail } from './components/history/ErrorDetail';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPanel } from './components/settings/SettingsPanel';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/editor"
            element={
              <Layout>
                <EditorDashboard />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <HistoryList />
              </Layout>
            }
          />
          <Route
            path="/history/:id"
            element={
              <Layout>
                <ErrorDetail />
              </Layout>
            }
          />
          <Route
            path="/insights"
            element={
              <Layout>
                <InsightsPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPanel />
              </Layout>
            }
          />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
