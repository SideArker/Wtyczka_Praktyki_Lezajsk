import {
  Input,
  InputLabel,
  FormControl,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Box,
  MenuItem,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInputDropdown } from './form-components/FormInputDropdown';
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface IFormInput {
  textValue: string;
  radioValue: string;
  checkboxValue: string[];
  dateValue: Date;
  dropdownValue: string;
  sliderValue: number;
}

interface IModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

const defaultValues = {
  textValue: '',
  radioValue: '',
  checkboxValue: [],
  dateValue: new Date(),
  dropdownValue: '',
  sliderValue: 0,
};
export const SettingsForm = () => {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch } = methods;
  const onSubmit = (data: IFormInput) => console.log(data);

  const [model, setModel] = useState('');
  const [GptModels, setGptModels] = useState([]);

  useEffect(() => {
    fetch('https://api.openai.com/v1/models')
      .then(response => response.json())
      .then(res => setGptModels(res.data));
  }, []);

  console.log(GptModels);

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
  };

  return (
    <Paper
      elevation={3}
      style={{
        display: 'grid',
        gridRowGap: '20px',
        padding: '20px',
        height: '100%',
        // margin: "10px 300px",
      }}>
      <Typography variant="h6">Options</Typography>

      <TextField variant="standard" type="password" label="API key" />

      <Typography>API Settings</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="password"
          label="Organization Id"
          helperText={'Organization IDs can be found on your organization settings page. completion.'}
        />
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="number"
          label="Max tokens"
          helperText="The maximum number of tokens to generate in the chat completion."
        />
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="password"
          label="Temperature"
          helperText="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the outpu more random, while lower values like 0.2 will make it more focused and deterministic."
        />
      </Box>
      <FormControl fullWidth>
        <InputLabel id="ModelLabel">Model</InputLabel>
        <Select labelId="ModelLabel" id="ModelLabelSelect" value={model} label="Model" onChange={handleDropdownChange}>
          {GptModels.map((model: IModel) => {
            if (model.owned_by === 'openai' || model.owned_by === 'openai-internal') {
              return (
                <MenuItem key={model.id} value={model.id}>
                  {model.id}
                </MenuItem>
              );
            }
          })}
        </Select>
      </FormControl>

      <FormControlLabel control={<Switch />} label="Hit <enter> automatically send question to chatGPT" />
    </Paper>
  );
};
