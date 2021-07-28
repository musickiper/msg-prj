import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Sidebar } from "./index";
import { searchUsers } from "../../store/utils/thunkCreators";
import { clearSearchedUsers } from "../../store/conversations";

const SidebarContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  const handleChange = useCallback(
    async (event) => {
      if (event.target.value === "") {
        // clear searched convos from redux store
        dispatch(clearSearchedUsers());
        setSearchTerm("");
        return;
      }
      if (searchTerm.includes(event.target.value)) {
        // if new value is included in search term, we don't need to make another API call, just need to set the search term value so the conversations can be filtered in the rendering
        setSearchTerm(event.target.value);
        return;
      }
      dispatch(searchUsers(event.target.value));
      setSearchTerm(event.target.value);
    },
    [dispatch, searchTerm]
  );

  return <Sidebar handleChange={handleChange} searchTerm={searchTerm} />;
};

export default SidebarContainer;
