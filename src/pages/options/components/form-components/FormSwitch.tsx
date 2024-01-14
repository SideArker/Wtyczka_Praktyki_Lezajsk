import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { FormInputProps } from "./FormInputProps";

export const FormSwitch = ({ name, control, label, variant, type }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
      )}
    />
  );
};