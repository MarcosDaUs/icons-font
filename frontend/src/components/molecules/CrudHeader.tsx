import { ReactNode } from "react";
import { Box, Typography, styled } from "@mui/material";
import AddButton from "../atoms/AddButton";

const MainBoxStyled = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const ContentBoxStyled = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
});

type CrudHeaderProps = {
  label: string;
  children: ReactNode;
  onClickItemAddMenu?: () => void;
};

const CrudHeader = ({
  label,
  children: FilterBox,
  onClickItemAddMenu,
}: CrudHeaderProps) => {
  return (
    <MainBoxStyled>
      <Typography variant="h5">{label}</Typography>
      <ContentBoxStyled>
        {FilterBox}
        <AddButton onClick={onClickItemAddMenu} />
      </ContentBoxStyled>
    </MainBoxStyled>
  );
};

export default CrudHeader;
