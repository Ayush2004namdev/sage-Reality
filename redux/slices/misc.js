import { createSlice } from "@reduxjs/toolkit";

const miscSlice = createSlice({
  name: "misc",
  initialState: {
    isAddOpen: false,
    isMenuOpen: false,
    update: false,
    corporate_list: [],
    corporate_type: [],
    event_type_list: [],
    members: [],
    sage_mitra_list: []
  },
  reducers: {
    toggleAdd: (state, action) => {
      state.isAddOpen = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    toggleUpdate: (state) => {
      state.update = !state.update;
    },
    setAllDropdownData:(state , action) => {
        state.corporate_list = action.payload.corporate_list;
        state.corporate_type = action.payload.corporate_type;
        state.event_type_list = action.payload.event_type_list;
        state.members = action.payload.members;
        state.sage_mitra_list = action.payload.sage_mitra_list;
    },
  },
});

export const {
  toggleAdd,
  setIsMenuOpen,
  toggleUpdate,
  setAllDropdownData,
} = miscSlice.actions;
export default miscSlice.reducer;
