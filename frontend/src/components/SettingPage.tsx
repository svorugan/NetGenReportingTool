import React, { useState } from 'react';
import Header from './Header';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ApiKey {
  id: string;
  service: string;
  key: string;
  isActive?: boolean;
}
interface LlmModel {
  id: string;
  name: string;
  provider: string;
  isActive?: boolean;
  apiKeys: ApiKey[];
}
interface SettingPageProps {
  /** Optional handler to navigate back to dashboard/home */
  onBackToHome?: () => void;
  dataSources: any[];
  setDataSources: (ds: any[]) => void;
  llmModels: LlmModel[];
  setLlmModels: (models: LlmModel[]) => void;
  apiKeys: any[];
  setApiKeys: (keys: any[]) => void;
  handleDeleteDataSource: (id: string) => void;
  handleDeleteLlmModel: (id: string) => void;
  handleDeleteApiKey?: (llmId: string, apiKeyId: string) => void;
  handleToggleLlmModel: (id: string) => void;
  handleToggleApiKey?: (llmId: string, apiKeyId: string) => void;
  dataSourceDialogOpen: boolean;
  setDataSourceDialogOpen: (open: boolean) => void;
  llmModelDialogOpen: boolean;
  setLlmModelDialogOpen: (open: boolean) => void;
  apiKeyDialogOpen: boolean;
  setApiKeyDialogOpen: (open: boolean) => void;
  newDataSource: any;
  setNewDataSource: (ds: any) => void;
  newLlmModel: any;
  setNewLlmModel: (model: any) => void;
  newApiKey: any;
  setNewApiKey: (key: any) => void;
  handleAddDataSource: (newDataSource: any) => void;
  handleAddLlmModel: (newLlmModel: any) => void;
  handleAddApiKey?: (llmId: string, newApiKey: ApiKey) => void;
  onClose: () => void;
  /** Optional logout handler for header bar */
  onLogout?: () => void;
}

const SettingPage: React.FC<SettingPageProps> = (props) => {
  // State for edit mode and selected item
  const [editMode, setEditMode] = useState<'none' | 'dataSource' | 'llmModel' | 'apiKey'>('none');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Local state for Data Source dialog fields
  const [dsName, setDsName] = useState('');
  const [dsType, setDsType] = useState('');
  const [dsConnectionString, setDsConnectionString] = useState('');

  // LLM Model dialog state
  const [llmName, setLlmName] = useState('');
  const [llmProvider, setLlmProvider] = useState('');

  // API Key dialog state (now contextual to parent LLM Model)
  const [apiService, setApiService] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyEditingItem, setApiKeyEditingItem] = useState<ApiKey | null>(null);
  const [apiKeyParentModel, setApiKeyParentModel] = useState<LlmModel | null>(null);

  // Handlers for opening edit dialogs
  const handleEditDataSource = (ds: any) => {
    setEditingItem(ds);
    setEditMode('dataSource');
    props.setDataSourceDialogOpen(true);
    setDsName(ds.name);
    setDsType(ds.type);
    setDsConnectionString(ds.connectionString);
    props.setNewDataSource(ds);
  };
  const handleEditLlmModel = (model: any) => {
    setEditingItem(model);
    setEditMode('llmModel');
    props.setLlmModelDialogOpen(true);
    setLlmName(model.name);
    setLlmProvider(model.provider);
    props.setNewLlmModel(model);
  };
  const handleEditApiKey = (parentModel: LlmModel, apiKey: ApiKey) => {
    setApiKeyEditingItem(apiKey);
    setApiKeyParentModel(parentModel);
    setApiKeyDialogOpen(true);
    setApiService(apiKey.service);
    setApiKeyValue(apiKey.key);
  };

  // Handler for opening Add Data Source dialog
  const handleAddDataSourceDialog = () => {
    setEditingItem(null);
    setEditMode('dataSource');
    props.setDataSourceDialogOpen(true);
    setDsName('');
    setDsType('');
    setDsConnectionString('');
    props.setNewDataSource({});
  };
  // Handler for opening Add LLM Model dialog
  const handleAddLlmModelDialog = () => {
    setEditingItem(null);
    setEditMode('llmModel');
    props.setLlmModelDialogOpen(true);
    setLlmName('');
    setLlmProvider('');
    props.setNewLlmModel({});
  };
  // Handler for opening Add API Key dialog (contextual)
  const handleAddApiKeyDialog = (parentModel: LlmModel) => {
    setApiKeyEditingItem(null);
    setApiKeyParentModel(parentModel);
    setApiKeyDialogOpen(true);
    setApiService('');
    setApiKeyValue('');
  };

  // Handler for dialog submit for LLM Model
  const handleLlmModelDialogSubmit = () => {
    if (editingItem) {
      handleSaveEdit('llmModel', {
        ...editingItem,
        name: llmName,
        provider: llmProvider
      });
    } else {
      props.handleAddLlmModel({
        name: llmName,
        provider: llmProvider
      });
      props.setLlmModelDialogOpen(false);
    }
    setLlmName('');
    setLlmProvider('');
  };
  // Handler for dialog submit for API Key (contextual)
  const handleApiKeyDialogSubmit = () => {
    if (!apiKeyParentModel) return;
    if (apiKeyEditingItem) {
      // Edit mode: update API Key in parent model
      const updatedApiKeys = apiKeyParentModel.apiKeys.map(k =>
        k.id === apiKeyEditingItem.id ? { ...apiKeyEditingItem, service: apiService, key: apiKeyValue } : k
      );
      const updatedModels = props.llmModels.map(m =>
        m.id === apiKeyParentModel.id ? { ...m, apiKeys: updatedApiKeys } : m
      );
      props.setLlmModels(updatedModels);
    } else {
      // Add mode: add new API Key to parent model
      const newApiKey: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        service: apiService,
        key: apiKeyValue,
      };
      const updatedModels = props.llmModels.map(m =>
        m.id === apiKeyParentModel.id ? { ...m, apiKeys: [...m.apiKeys, newApiKey] } : m
      );
      props.setLlmModels(updatedModels);
    }
    setApiKeyDialogOpen(false);
    setApiKeyEditingItem(null);
    setApiKeyParentModel(null);
    setApiService('');
    setApiKeyValue('');
  };


  // Handler for saving edits (should call backend update API and update state)
  const handleSaveEdit = (itemType: 'dataSource' | 'llmModel' | 'apiKey', updatedItem: any) => {
    if (itemType === 'dataSource') {
      props.setDataSources(props.dataSources.map(ds => ds.id === updatedItem.id ? updatedItem : ds));
      // TODO: Call backend update API
    } else if (itemType === 'llmModel') {
      props.setLlmModels(props.llmModels.map(model => model.id === updatedItem.id ? updatedItem : model));
      // TODO: Call backend update API
    } else if (itemType === 'apiKey') {
      // Update the apiKeys array inside the correct parent LLM Model
      if (apiKeyParentModel) {
        const updatedModels = props.llmModels.map(model =>
          model.id === apiKeyParentModel.id
            ? {
                ...model,
                apiKeys: model.apiKeys.map(key => key.id === updatedItem.id ? updatedItem : key)
              }
            : model
        );
        props.setLlmModels(updatedModels);
      }
      // TODO: Call backend update API
    }
    setEditMode('none');
    setEditingItem(null);
    props.setDataSourceDialogOpen(false);
  };

  // Handler for closing dialogs
  const handleDialogClose = () => {
    setEditMode('none');
    setEditingItem(null);
    props.setDataSourceDialogOpen(false);
    props.setLlmModelDialogOpen(false);
    setApiKeyDialogOpen(false);
    setApiKeyEditingItem(null);
    setApiKeyParentModel(null);
  };

  // Handler for dialog submit
  const handleDataSourceDialogSubmit = () => {
    if (editingItem) {
      // Edit mode
      handleSaveEdit('dataSource', {
        ...editingItem,
        name: dsName,
        type: dsType,
        connectionString: dsConnectionString
      });
    } else {
      // Add mode
      props.handleAddDataSource({
        name: dsName,
        type: dsType,
        connectionString: dsConnectionString
      });
      props.setDataSourceDialogOpen(false);
    }
    setDsName('');
    setDsType('');
    setDsConnectionString('');
  };

  // When dialog opens, prefill fields if editing
  React.useEffect(() => {
    if (props.dataSourceDialogOpen && editMode === 'dataSource') {
      if (editingItem) {
        setDsName(editingItem.name || '');
        setDsType(editingItem.type || '');
        setDsConnectionString(editingItem.connectionString || '');
      } else {
        setDsName('');
        setDsType('');
        setDsConnectionString('');
      }
    }
    if (props.llmModelDialogOpen && editMode === 'llmModel') {
      if (editingItem) {
        setLlmName(editingItem.name || '');
        setLlmProvider(editingItem.provider || '');
      } else {
        setLlmName('');
        setLlmProvider('');
      }
    }
    if (apiKeyDialogOpen) {
      if (apiKeyEditingItem !== null) {
        setApiService((apiKeyEditingItem as ApiKey).service || '');
        setApiKeyValue((apiKeyEditingItem as ApiKey).key || '');
      } else {
        setApiService('');
        setApiKeyValue('');
      }
    }
  }, [props.dataSourceDialogOpen, props.llmModelDialogOpen, apiKeyDialogOpen, editingItem, apiKeyEditingItem, editMode]);

  // Handler for deleting an API Key from a specific LLM Model
  const handleDeleteApiKey = (llmId: string, apiKeyId: string) => {
    const updatedModels = props.llmModels.map(model =>
      model.id === llmId
        ? { ...model, apiKeys: model.apiKeys.filter(key => key.id !== apiKeyId) }
        : model
    );
    props.setLlmModels(updatedModels);
  };

  return (
    <>
      <Header onLogout={props.onLogout ?? (() => {})}>
        <Button 
         color="inherit" 
         onClick={props.onBackToHome}
         startIcon={<ArrowBackIcon />}
         sx={{ mr: 2 }}
       >
         Back to Dashboard
       </Button>
       </Header>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Data Sources Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h3">
                <StorageIcon sx={{ mr: 1, fontSize: '1rem', verticalAlign: 'middle' }} />
                Data Sources
              </Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={handleAddDataSourceDialog}>
                Add
              </Button>
            </Box>
            <List dense>
              {props.dataSources.map((ds) => (
                <ListItem key={ds.id} secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" size="small" onClick={() => handleEditDataSource(ds)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" size="small" onClick={() => props.handleDeleteDataSource(ds.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <StorageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={ds.name} secondary={`${ds.type} - ${ds.connectionString}`} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* LLM Models Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h3">
                LLM Models
              </Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={handleAddLlmModelDialog}>
                Add
              </Button>
            </Box>
            <List dense>
              {props.llmModels.map((model) => (
                <React.Fragment key={model.id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton edge="end" aria-label="edit" size="small" onClick={() => handleEditLlmModel(model)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" size="small" onClick={() => props.handleDeleteLlmModel(model.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <IconButton
                        size="small"
                        color={model.isActive ? "primary" : "default"}
                        onClick={() => props.handleToggleLlmModel(model.id)}
                      >
                        <SmartToyIcon fontSize="small" />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText primary={model.name} secondary={model.provider} />
                    {model.isActive && (
                      <Chip size="small" label="Active" color="primary" sx={{ mr: 1 }} />
                    )}
                  </ListItem>
                  {/* Nested API Keys for this LLM Model */}
                  <Box sx={{ pl: 6, pb: 2 }}>
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <KeyIcon sx={{ mr: 1, fontSize: '1rem', verticalAlign: 'middle' }} />
                      API Keys
                      <Button size="small" startIcon={<AddIcon />} sx={{ ml: 2 }} onClick={() => handleAddApiKeyDialog(model)}>
                        Add API Key
                      </Button>
                    </Typography>
                    <List dense>
                      {model.apiKeys && model.apiKeys.length > 0 ? (
                        model.apiKeys.map((apiKey: ApiKey) => (
                          <ListItem
                            key={apiKey.id}
                            secondaryAction={
                              <>
                                <IconButton edge="end" aria-label="edit" size="small" onClick={() => handleEditApiKey(model, apiKey)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" size="small" onClick={() => handleDeleteApiKey(model.id, apiKey.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            }
                          >
                            <ListItemText primary={apiKey.service} secondary={apiKey.key} />
                            {apiKey.isActive && (
                              <Chip size="small" label="Active" color="primary" sx={{ mr: 1 }} />
                            )}
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No API Keys" />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Container>

      {/* Data Source Add/Edit Dialog */}
      <Dialog open={props.dataSourceDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingItem && editMode === 'dataSource' ? 'Edit Data Source' : 'Add Data Source'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={dsName} onChange={(e) => setDsName(e.target.value)} />
          <TextField margin="dense" label="Type" type="text" fullWidth value={dsType} onChange={(e) => setDsType(e.target.value)} />
          <TextField margin="dense" label="Connection String" type="text" fullWidth value={dsConnectionString} onChange={(e) => setDsConnectionString(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDataSourceDialogSubmit} variant="contained">
            {editingItem && editMode === 'dataSource' ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* LLM Model Add/Edit Dialog */}
      <Dialog open={props.llmModelDialogOpen} onClose={() => props.setLlmModelDialogOpen(false)}>
        <DialogTitle>{editingItem && editMode === 'llmModel' ? 'Edit LLM Model' : 'Add LLM Model'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={llmName} onChange={(e) => setLlmName(e.target.value)} />
          <TextField margin="dense" label="Provider" type="text" fullWidth value={llmProvider} onChange={(e) => setLlmProvider(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleLlmModelDialogSubmit} variant="contained">
            {editingItem && editMode === 'llmModel' ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Key Add/Edit Dialog */}
      <Dialog open={apiKeyDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{apiKeyEditingItem ? 'Edit API Key' : 'Add API Key'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Service" type="text" fullWidth value={apiService} onChange={(e) => setApiService(e.target.value)} />
          <TextField margin="dense" label="Key" type="text" fullWidth value={apiKeyValue} onChange={(e) => setApiKeyValue(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleApiKeyDialogSubmit} variant="contained">
            {apiKeyEditingItem ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>);
  }
  
export default SettingPage;
