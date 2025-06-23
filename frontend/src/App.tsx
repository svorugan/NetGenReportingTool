import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MainPage from './components/MainPage';
import HomePage from './components/HomePage';
import SettingPage from './components/SettingPage';
import Login from './components/Login';
import { authService } from './services/api';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

import { useNavigate } from 'react-router-dom';

function AppRoutes(props: any) {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated,
    dataSources, setDataSources,
    llmModels, setLlmModels,
    apiKeys, setApiKeys,
    dataSourceDialogOpen, setDataSourceDialogOpen,
    llmModelDialogOpen, setLlmModelDialogOpen,
    apiKeyDialogOpen, setApiKeyDialogOpen,
    newDataSource, setNewDataSource,
    newLlmModel, setNewLlmModel,
    newApiKey, setNewApiKey,
    handleAddDataSource, handleAddLlmModel, handleAddApiKey,
    handleDeleteDataSource, handleDeleteLlmModel, handleDeleteApiKey,
    handleToggleLlmModel, handleToggleApiKey
  } = props;

  return (
    isAuthenticated ? (
      <Routes>
        <Route path="/" element={
          <HomePage
            onLogout={() => { authService.logout(); setIsAuthenticated(false); }}
            onCreateNewReport={() => navigate('/report') }
            dataSources={dataSources}
            setDataSources={setDataSources}
            llmModels={llmModels}
            setLlmModels={setLlmModels}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            handleDeleteDataSource={handleDeleteDataSource}
            handleDeleteLlmModel={handleDeleteLlmModel}
            handleDeleteApiKey={handleDeleteApiKey}
            handleToggleLlmModel={handleToggleLlmModel}
            handleToggleApiKey={handleToggleApiKey}
            dataSourceDialogOpen={dataSourceDialogOpen}
            setDataSourceDialogOpen={setDataSourceDialogOpen}
            llmModelDialogOpen={llmModelDialogOpen}
            setLlmModelDialogOpen={setLlmModelDialogOpen}
            apiKeyDialogOpen={apiKeyDialogOpen}
            setApiKeyDialogOpen={setApiKeyDialogOpen}
            newDataSource={newDataSource}
            setNewDataSource={setNewDataSource}
            newLlmModel={newLlmModel}
            setNewLlmModel={setNewLlmModel}
            newApiKey={newApiKey}
            setNewApiKey={setNewApiKey}
            handleAddDataSource={handleAddDataSource}
            handleAddLlmModel={handleAddLlmModel}
            handleAddApiKey={handleAddApiKey}
          />
        } />
        <Route path="/report" element={<MainPage onLogout={() => { authService.logout(); setIsAuthenticated(false); }} onBackToHome={() => navigate('/')} />} />
        <Route path="/settings" element={
          <SettingPage
            dataSources={dataSources}
            setDataSources={setDataSources}
            llmModels={llmModels}
            setLlmModels={setLlmModels}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            handleDeleteDataSource={handleDeleteDataSource}
            handleDeleteLlmModel={handleDeleteLlmModel}
            handleDeleteApiKey={handleDeleteApiKey}
            handleToggleLlmModel={handleToggleLlmModel}
            handleToggleApiKey={handleToggleApiKey}
            dataSourceDialogOpen={dataSourceDialogOpen}
            setDataSourceDialogOpen={setDataSourceDialogOpen}
            llmModelDialogOpen={llmModelDialogOpen}
            setLlmModelDialogOpen={setLlmModelDialogOpen}
            apiKeyDialogOpen={apiKeyDialogOpen}
            setApiKeyDialogOpen={setApiKeyDialogOpen}
            newDataSource={newDataSource}
            setNewDataSource={setNewDataSource}
            newLlmModel={newLlmModel}
            setNewLlmModel={setNewLlmModel}
            newApiKey={newApiKey}
            setNewApiKey={setNewApiKey}
            handleAddDataSource={handleAddDataSource}
            handleAddLlmModel={handleAddLlmModel}
            handleAddApiKey={handleAddApiKey}
            onClose={() => window.history.back()}
          />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    ) : (
      <Login onLoginSuccess={() => setIsAuthenticated(true)} />
    )
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Settings state (moved from HomePage)
  const [dataSources, setDataSources] = useState<any[]>([
  {
    id: 'oracle-1',
    name: 'HR Oracle DB',
    type: 'Oracle',
    connectionString: 'oracle://hr_user:****@oracle-host:1521/HRDB'
  },
  {
    id: 'snowflake-1',
    name: 'Finance Snowflake',
    type: 'Snowflake',
    connectionString: 'snowflake://finance_user:****@xyz123.snowflakecomputing.com/FINANCE_DB'
  }
]);
  const [dataSourceDialogOpen, setDataSourceDialogOpen] = useState(false);
  const [newDataSource, setNewDataSource] = useState<any>({ name: '', type: 'Oracle', connectionString: '' });
  const [llmModels, setLlmModels] = useState([
    { id: '1', name: 'GPT-4', provider: 'OpenAI', isActive: true },
    { id: '2', name: 'Claude 3', provider: 'Anthropic', isActive: false }
  ]);
  const [llmModelDialogOpen, setLlmModelDialogOpen] = useState(false);
  const [newLlmModel, setNewLlmModel] = useState<any>({ name: '', provider: 'OpenAI', isActive: false });
  const [apiKeys, setApiKeys] = useState([
    { id: '1', service: 'OpenAI', key: '••••••••••••••••••••••••', isActive: true },
    { id: '2', service: 'Anthropic', key: '••••••••••••••••••••••••', isActive: false }
  ]);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<any>({ service: '', key: '', isActive: false });

  // Handlers for settings
  const handleAddDataSource = () => {
    setDataSources([
      ...dataSources,
      { id: (Date.now() + Math.random()).toString(), name: newDataSource.name, type: newDataSource.type, connectionString: newDataSource.connectionString }
    ]);
    setNewDataSource({ name: '', type: 'Oracle', connectionString: '' });
    setDataSourceDialogOpen(false);
  };
  const handleAddLlmModel = () => {
    setLlmModels([
      ...llmModels,
      { id: (Date.now() + Math.random()).toString(), name: newLlmModel.name, provider: newLlmModel.provider, isActive: newLlmModel.isActive }
    ]);
    setNewLlmModel({ name: '', provider: 'OpenAI', isActive: false });
    setLlmModelDialogOpen(false);
  };
  const handleAddApiKey = () => {
    setApiKeys([
      ...apiKeys,
      { id: (Date.now() + Math.random()).toString(), service: newApiKey.service, key: newApiKey.key, isActive: newApiKey.isActive }
    ]);
    setNewApiKey({ service: '', key: '', isActive: false });
    setApiKeyDialogOpen(false);
  };
  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter(ds => ds.id !== id));
  };
  const handleDeleteLlmModel = (id: string) => {
    setLlmModels(llmModels.filter(model => model.id !== id));
  };
  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };
  const handleToggleLlmModel = (id: string) => {
    setLlmModels(llmModels.map(model => {
      if (model.id === id) {
        return { ...model, isActive: !model.isActive };
      }
      return model;
    }));
  };
  const handleToggleApiKey = (id: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return { ...key, isActive: !key.isActive };
      }
      return key;
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          dataSources={dataSources}
          setDataSources={setDataSources}
          llmModels={llmModels}
          setLlmModels={setLlmModels}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          dataSourceDialogOpen={dataSourceDialogOpen}
          setDataSourceDialogOpen={setDataSourceDialogOpen}
          llmModelDialogOpen={llmModelDialogOpen}
          setLlmModelDialogOpen={setLlmModelDialogOpen}
          apiKeyDialogOpen={apiKeyDialogOpen}
          setApiKeyDialogOpen={setApiKeyDialogOpen}
          newDataSource={newDataSource}
          setNewDataSource={setNewDataSource}
          newLlmModel={newLlmModel}
          setNewLlmModel={setNewLlmModel}
          newApiKey={newApiKey}
          setNewApiKey={setNewApiKey}
          handleAddDataSource={handleAddDataSource}
          handleAddLlmModel={handleAddLlmModel}
          handleAddApiKey={handleAddApiKey}
          handleDeleteDataSource={handleDeleteDataSource}
          handleDeleteLlmModel={handleDeleteLlmModel}
          handleDeleteApiKey={handleDeleteApiKey}
          handleToggleLlmModel={handleToggleLlmModel}
          handleToggleApiKey={handleToggleApiKey}
        />
      </Router>
    </ThemeProvider>
  );
}


export default App;
