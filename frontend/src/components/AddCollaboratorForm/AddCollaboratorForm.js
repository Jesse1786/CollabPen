import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import { addCollaborator } from "@/services/api";

export default function AddCollaboratorForm({
  user,
  projectId,
  open,
  setOpen,
}) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setEmail("");
      setMessage("");
      setSuccess(false);
    }
  }, [open]);

  const handleAddCollaborator = async () => {
    if (!email) {
      setMessage("Collaborator email is required");
      return;
    }

    try {
      const response = await addCollaborator(user.id, projectId, email);
      if (response.ok) {
        setMessage("Collaborator added successfully");
        setSuccess(true);
        setEmail("");
      } else {
        const data = await response.json();
        setMessage(data.message);
        setSuccess(false);
      }
    } catch {
      setMessage("Something went wrong");
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add Collaborator</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Collaborator Email"
          type="text"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
        />
        {message && (
          <Typography
            color={success ? "success" : "error"}
            variant="body2"
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, pr: 3 }}>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAddCollaborator}
          color="addButton"
          variant="contained"
        >
          Add Collaborator
        </Button>
      </DialogActions>
    </Dialog>
  );
}
