import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
    active: localStorage.getItem("activeChat") ? JSON.parse(localStorage.getItem("activeChat")) : null,
  },
  reducers: {
    userLoginInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    activeChat: (state, action) => {
      state.active = action.payload;
    },
  },
})

export const { userLoginInfo, activeChat } = userSlice.actions
export default userSlice.reducer