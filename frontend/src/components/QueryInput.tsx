import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface QueryInputProps {
  onGenerateSQL: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onGenerateSQL, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await onGenerateSQL(prompt);
    }
  };

  const exampleQueries = [
    'Show me all active employees',
    'List employees hired in 2023',
    'Show me all employees with paid assignments',
    'Count employees by department'
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Natural Language Query
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter your question in plain English and we'll convert it to SQL
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="e.g., Show me all active employees with paid assignments"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Example queries:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
              {exampleQueries.map((query, index) => (
                <Button 
                  key={index} 
                  size="small" 
                  variant="outlined" 
                  onClick={() => setPrompt(query)}
                  disabled={isLoading}
                >
                  {query}
                </Button>
              ))}
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={isLoading || !prompt.trim()}
          >
            Generate SQL
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default QueryInput;
