import { Select, Input, InputLabel, FormControl, Paper, Typography, Switch, FormControlLabel, TextField, Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { FormInputDropdown } from "./form-components/FormInputDropdown";
import { useState } from "react";
import InputAdornment from '@mui/material/InputAdornment';

interface IFormInput {
  textValue: string;
  radioValue: string;
  checkboxValue: string[];
  dateValue: Date;
  dropdownValue: string;
  sliderValue: number;
}

const defaultValues = {
  textValue: "",
  radioValue: "",
  checkboxValue: [],
  dateValue: new Date(),
  dropdownValue: "",
  sliderValue: 0,
};
export const SettingsForm = () => {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch } = methods;
  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <Paper elevation={3}
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        height: "100%"
        // margin: "10px 300px",
      }}
    >
      <Typography variant="h6">Options</Typography>

      <TextField variant="standard" type="password" label="API key" />

      <Typography>API Settings</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        <TextField sx={{ width: "32%" }} variant="standard" type="password" label="Organization Id" helperText={"Organization IDs can be found on your organization settings page. completion."} />
        <TextField sx={{ width: "32%" }} variant="standard" type="number" label="Max tokens" helperText="The maximum number of tokens to generate in the chat completion." />
        <TextField sx={{ width: "32%" }} variant="standard" type="password" label="Temperature" helperText="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the outpu more random, while lower values like 0.2 will make it more focused and deterministic." />
      </Box>
      <FormInputDropdown
        name="dropdownValue"
        control={control}
        label="Dropdown Input"
      />
      <FormControlLabel control={<Switch />} label="Hit <enter> automatically send question to chatGPT" />
    </Paper>
  );
};