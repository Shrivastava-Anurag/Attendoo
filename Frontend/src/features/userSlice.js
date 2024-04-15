import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        deviceId: null,
        token: null,
        user: null,
        teams: [],
    },
    reducers: {
        setLogin: (state, action) => {
            state.deviceId = action.payload.deviceId;
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        setLogout: (state) => {
            state.deviceId = null;
            state.token = null;
            state.user = null;
        },
        setTeamNames: (state, action) => {
            state.teams = action.payload;
        }
    }
})

export const { setLogin, setLogout, setTeamNames } = userSlice.actions;
export default userSlice.reducer;