import { useEffect, useState } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import api from "../https/index";

export const useTableModes = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  // Bàn nguồn và bàn đích trong merge hoặc transfer
  const [sourceTableId, setSourceTableId] = useState(null);
  const [targetTableId, setTargetTableId] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]); // nhiều bàn nguồn


  const toggleEditMode = () => {
    if (!isEditMode) resetMergeTransfer();
    setIsEditMode(!isEditMode);
  };

  const toggleMergeMode = () => {
    if (!isMergeMode) resetEditTransfer();
    else resetMerge();
    setIsMergeMode(!isMergeMode);
  };

  const toggleTransferMode = () => {
    if (!isTransferMode) resetEditMerge();
    else resetTransfer();
    setIsTransferMode(!isTransferMode);
  };

  const resetEditMerge = () => {
    setIsEditMode(false);
    setIsMergeMode(false);
    resetMerge();
  };

  const resetEditTransfer = () => {
    setIsEditMode(false);
    setIsTransferMode(false);
    resetTransfer();
  };

  const resetMergeTransfer = () => {
    setIsMergeMode(false);
    setIsTransferMode(false);
    resetMerge();
    resetTransfer();
  };

  const resetMerge = () => {
    setSourceTableId(null);
    setTargetTableId(null);
    setSelectedTables([]);
  };

  const resetTransfer = () => {
    setSourceTableId(null);
    setTargetTableId(null);
  };

  return {
    selectedTables,
    setSelectedTables,
    sourceTableId,
    setSourceTableId,
    targetTableId,
    setTargetTableId,
    showMobileMenu,
    setShowMobileMenu,
    isEditMode,
    isMergeMode,
    isTransferMode,
    showMenuOptions,
    setShowMenuOptions,
    toggleEditMode,
    toggleMergeMode,
    toggleTransferMode,
    resetMerge,
    resetTransfer,
  };
};

export const useTableFilters = (resData) => {
  const [areaFilter, setAreaFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const handleShowAll = () => {
    setAreaFilter(null);
    setStatusFilter(null);
  };

  const handleAreaClick = (areaId) => {
    setAreaFilter(areaId);
    setStatusFilter(null);
  };

  const handleStatusClick = (status) => {
    setStatusFilter(status);
    setAreaFilter(null);
  };

  const filteredTables = resData?.data?.filter((table) => {
    if (areaFilter) return table.area._id === areaFilter;
    if (statusFilter) return table.status === statusFilter;
    return true;
  });

  const uniqueAreas = [
    ...new Map(resData?.data?.map((item) => [item.area._id, item.area])).values(),
  ];

  return {
    areaFilter,
    statusFilter,
    handleShowAll,
    handleAreaClick,
    handleStatusClick,
    filteredTables,
    uniqueAreas,
  };
};

export const useTableData = () => {
  const queryClient = useQueryClient();
  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: () => api.getTables(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  return {
    resData,
    queryClient,
  };
};
