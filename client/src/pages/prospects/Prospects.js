import React, { useState, useEffect } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ProspectsContent from "./ProspectsContent";
import axios from "axios";
import { DEFAULT_NUM_ROWS_PER_PAGE } from "../../constants/table";
import { Block, GpsFixed } from "@material-ui/icons";

const Prospects = () => {
  const [prospectsData, setProspectsData] = useState([]);
  const [campaignsData, setCampaignsData] = useState([]);
  const [addToCampaignSelection, setAddToCampaignSelection] = useState({});
  const [addToCampaignVisible, setAddToCampaignVisible] = useState(false)
  const [alertMessage, setAlert] = useState({ severity: 'success', message: '', open: false });
  const [selected, selectNew] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_NUM_ROWS_PER_PAGE);
  const [count, setCount] = useState(0);

  const countSelected = () => selected.filter(Boolean).length;

  const handleActionButton = async () => {
    await getCampaigns();
    if (countSelected() > 0) {
      setAddToCampaignVisible(true)
    } else {
      console.error('No prospects selected')
    }
  }

  const handleDialogClose = (message = '', error) => {
    if (error === undefined) {
      setAddToCampaignVisible(false);
      if (message !== '') {
        setAlert({ severity: 'success', message: message, open: true });
      }
    } else {
      setAlert({ severity: 'error', message: error, open: true });
      console.error(error);
    }
  }

  const handleDialogSubmit = async () => {
    const prospect_ids = [];
    selected.forEach((value, index) => {
      if (value === true) {
        prospect_ids.push(index + 1);
      }
    });
    try {
      const resp = await axios.post(
        `/api/campaigns/${addToCampaignSelection.id}/prospects`, { prospect_ids }
      );
      if (resp.data.error) throw new Error(resp.data.error);
      //We should probably do something to show how many were added, perhaps.
      //setProspectsData(resp.data.prospects);
      const message = `${resp.data.prospect_ids.length} prospects added to campaign ${addToCampaignSelection.id}`;
      selectNew([]);
      handleDialogClose(message);
    } catch (error) {
      handleDialogClose(error, error);
    } finally {

    }
  }

  const handleChangeRowsPerPage = (event, _) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (_, index) => {
    setCurrentPage(index);
  };

  useEffect(() => {
    const fetchProspects = async () => {
      setIsDataLoading(true);

      try {
        const resp = await axios.get(
          `/api/prospects?page=${currentPage}&page_size=${rowsPerPage}`,
        );
        if (resp.data.error) throw new Error(resp.data.error);
        setProspectsData(resp.data.prospects);
        setCount(resp.data.total);
      } catch (error) {
        setAlert({severity:'error', message: error.message, open: true})
        console.error(error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProspects();
  }, [rowsPerPage, currentPage]);

  const getCampaigns = async () => {
    try {
      const resp = await axios.get(
        `/api/campaigns`,
      );
      setCampaignsData(resp.data.campaigns);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Drawer
        RightDrawerComponent={
          <>
            <Snackbar
              open={alertMessage.open}
              autoHideDuration={6000}
              onClose={()=> {
                let newAlert = {...alertMessage}
                newAlert.open = false;
                setAlert(newAlert);
              }}
              vertical="bottom"
              horizontal="center"
            >
              <Alert
                severity={alertMessage.severity}
                variant="filled"
              >
                {alertMessage.message}
              </Alert>
            </Snackbar>

            <Dialog open={addToCampaignVisible}>
              <DialogTitle>Select a Campaign to Add {selected.filter(Boolean).length} Prospects</DialogTitle>
              <DialogContent>
                <Autocomplete
                  id="combo-box-demo"
                  options={campaignsData}
                  getOptionLabel={option => option.name}
                  onChange={(e, value) => {
                    setAddToCampaignSelection(value);
                  }}
                  renderInput={(params) => <TextField {...params} label="Select a campaign" />}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleDialogClose()}>Cancel</Button>
                <Button
                  disabled={addToCampaignSelection?.id == undefined}
                  onClick={handleDialogSubmit}
                >
                  Add to Campaign
            </Button>
              </DialogActions>
            </Dialog>
            <ProspectsContent
              isDataLoading={isDataLoading}
              paginatedData={prospectsData}
              count={count}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleActionButton={handleActionButton}
              selectedState={[selected, selectNew]}
            />
          </>

        }
      />
    </>
  );
};

export default withAuth(Prospects);
