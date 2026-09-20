import React, { useEffect, useState, useRef } from "react";
import FilterModal from "./FilterModal";

///dynamic//////////
import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/Property-slice";
import { getAllProperties } from "../../store/Property/Property-action";

const Filter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const isFirstRender = useRef(true);

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    dispatch(propertyAction.updateSearchParams({ ...selectedFilters, page: 1 }));
    dispatch(getAllProperties());
  }, [selectedFilters, dispatch]);

  


  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <>
      <span
        className="material-symbols-outlined filter"
        onClick={handleShowAllPhotos}
      >
        tune
      </span>
      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;
