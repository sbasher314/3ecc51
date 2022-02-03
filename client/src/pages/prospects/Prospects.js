import React, { useState, useEffect } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import CampaignDialog from "./CampaignDialog"
import ProspectsAlert from "./ProspectsAlert"
import ProspectsContent from "./ProspectsContent";
import axios from "axios";
import { DEFAULT_NUM_ROWS_PER_PAGE } from "../../constants/table";
import { Block, GpsFixed } from "@material-ui/icons";

const Prospects = () => {
  const [prospectsData, setProspectsData] = useState([]);
  const [addToCampaignVisible, setAddToCampaignVisible] = useState(false);
  const [alertMessage, setAlert] = useState({ severity: 'success', message: '', open: false });
  const [selectedProspects, setSelectedProspects] = useState(new Set());
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_NUM_ROWS_PER_PAGE);
  const [count, setCount] = useState(0);

  const countSelectedProspects = () => selectedProspects.size;

  const handleActionButton = async () => {
    if (countSelectedProspects() > 0) {
      setAddToCampaignVisible(true)
    } else {
      setAlert({ severity: 'warning', message: 'No prospects selected', open: true });
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
        setAlert({ severity: 'error', message: error.message, open: true })
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProspects();
  }, [rowsPerPage, currentPage]);



  return (
    <>
      <Drawer
        RightDrawerComponent={
          <>
            {alertMessage.open && <ProspectsAlert
              alertMessage = {alertMessage}
              setAlert = {setAlert}
            />}

            <CampaignDialog
              addToCampaignVisible = {addToCampaignVisible}
              setAddToCampaignVisible = {setAddToCampaignVisible}
              setAlert = {setAlert}
              selectedProspects = {selectedProspects}
              setSelectedProspects = {setSelectedProspects}
            />

            <ProspectsContent
              isDataLoading={isDataLoading}
              paginatedData={prospectsData}
              count={count}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleActionButton={handleActionButton}
              selectedItemsState={selectedProspects}
              setSelectedItems={setSelectedProspects}
            />
          </>
        }
      />
    </>
  );
};

export default withAuth(Prospects);
