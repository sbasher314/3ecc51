import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";

const CampaignDialog = ({
  addToCampaignVisible,
  setAddToCampaignVisible,
  setAlert,
  selectedProspects,
  setSelectedProspects,
}) => {

  const [campaignsData, setCampaignsData] = useState([]);
  const [addToCampaignSelection, setAddToCampaignSelection] = useState({});

  const getCampaigns = (query = '') => {
    query = query.trim();
    const url = (query === undefined || query === '') ?
      `/api/campaigns` :
      `/api/campaigns/search`;

    axios.get(url, {params: {query}})
      .then(resp => {
        const campaigns = resp.data?.campaigns || resp.data || [];
        setCampaignsData(campaigns)
      })
      .catch(error => {
        setAlert({
          severity: 'error',
          message:`Campaigns could not be retrieved, ${error.response.statusText}
          - Status code: ${error.response.status}`,
          open: true })
      });
  };

  const handleDialogClose = (message = '', error) => {
    if (error === undefined) {
      setAddToCampaignVisible(false);
      if (message !== '') {
        setAlert({ severity: 'success', message: message, open: true });
      }
    } else {
      setAlert({ severity: 'error', message: error, open: true });
    }
  }

  const handleDialogSubmit = async () => {
    axios.post(
      `/api/campaigns/${addToCampaignSelection.id}/prospects`,
      { prospect_ids: [...selectedProspects] }
    ).then(resp => {
      const message = `${resp.data.prospect_ids.length} prospects added to campaign ${addToCampaignSelection.id}`;
      setSelectedProspects(new Set());
      handleDialogClose(message)
    }).catch(error => {
      handleDialogClose(error, error);
    });

  }

  useEffect(() => {
    if (addToCampaignVisible) {
      getCampaigns();
    }
  }, [addToCampaignVisible])

  return (
    <Dialog open={addToCampaignVisible && selectedProspects.size > 0}>
      <DialogTitle>Select a Campaign to Add {selectedProspects.size} Prospects</DialogTitle>
      <DialogContent>
        <Autocomplete
          id="CampaignsDialog-autocomplete"
          options={campaignsData || []}
          getOptionLabel={option => option.name}
          onInputChange={(e, value) => {
            getCampaigns(value)
          }}
          getOptionSelected={(option, value) => option.value === value.value}
          onChange={(e, value) => {
            setAddToCampaignSelection(value);
          }}
          renderInput={(params) => <TextField {...params} label="Select a campaign" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDialogClose()}>Cancel</Button>
        <Button
          disabled={addToCampaignSelection?.id === undefined || selectedProspects.size < 1}
          onClick={handleDialogSubmit}
        >
          Add to Campaign
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CampaignDialog;