import React from "react";
import moment from "moment";

import { Grid, CircularProgress } from "@material-ui/core";

import PageTitle from "pages/mainlayout/PageTitle";
import PaginatedTable from "common/PaginatedTable";

const Content = ({
  paginatedData,
  isDataLoading,
  count,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleActionButton,
  selectedState
}) => {
  const rowData = paginatedData.map((row) => [
    row.email,
    row.first_name,
    row.last_name,
    moment(row.created_at).format("MMM d"),
    moment(row.updated_at).format("MMM d"),
  ]);
  return (
    <>
      <PageTitle>Prospects</PageTitle>
      {isDataLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <PaginatedTable
          paginatedData={paginatedData}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          headerColumns={[
            "Email",
            "First Name",
            "Last Name",
            "Created",
            "Updated",
          ]}
          rowData={rowData}
          selectable={true}
          actionButtonText={"Add to campaign"}
          handleActionButton={handleActionButton}
          selectedState={selectedState}
        />
      )}
    </>
  );
};

export default Content;
