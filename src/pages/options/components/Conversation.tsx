import {
  Button,
  Container,
  TextField,
  Grid,
  FormControl,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import {ChatMessage, UserMessage} from "./Message";

export default function Conversation() {
  const userColor = '#0288d1';
  const chatColor = '#aaff00';
  return (
    <Paper sx={{
      minHeight: '100vh',
      p: 1,
      // width: '50%'
    }}>

      <FormControl fullWidth sx={{
        
      }}>
        <Grid container sx={{m:2}}>
          <Grid item sx={{ width: '90%' }}>
            <TextField fullWidth variant="outlined"></TextField>
          </Grid>
          <Grid item alignItems="stretch" style={{ display: "flex" }}>
            <Button variant="outlined" sx={{ mx: 2 }}>
              Refresh
            </Button>
          </Grid>
        </Grid>
        <UserMessage text="Testowa wiadomość użytkownika"/>
        <ChatMessage text="Testowa odpowiedź AI"/>
      </FormControl>
    </Paper>
  );
}