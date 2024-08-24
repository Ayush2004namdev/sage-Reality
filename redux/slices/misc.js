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
    sage_mitra_list: [],
    showPopupDialog: false,
    logoutPopUp: false,
    intereseted_localities: []
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
      // console.log({'inters':action.payload.interested_localities[0]});
        state.corporate_list = action.payload.corporate_list;
        state.corporate_type = action.payload.corporate_type;
        state.event_type_list = action.payload.event_type_list;
        state.members = action.payload.members;
        state.sage_mitra_list = action.payload.sage_mitra_list;
        state.intereseted_localities = action.payload?.interested_localities;
            console.log({'inters':state.intereseted_localities});
        // console.log({'inters':intereseted_localities});
    },
    setShowPopupDialog: (state, action) => {
      state.showPopupDialog = action.payload;
    },
    setLogoutPopup : (state, action) => {
      state.logoutPopUp = action.payload;
    },
    setNewSageMitra : (state,action) => {
      state.sage_mitra_list = [...state.sage_mitra_list , action.payload];
    }
  },

});

export const {
  toggleAdd,
  setIsMenuOpen,
  toggleUpdate,
  setAllDropdownData,
  setShowPopupDialog,
  setLogoutPopup,
  setNewSageMitra
} = miscSlice.actions;
export default miscSlice.reducer;
