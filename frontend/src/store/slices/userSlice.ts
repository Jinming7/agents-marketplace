import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "ORG_ADMIN" | "PRODUCT_ADMIN" | "USER";

interface UserState {
  id: string;
  role: UserRole;
  name: string;
}

const initialState: UserState = {
  id: "mock-user-id",
  role: "USER",
  name: "Marketplace User"
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
    }
  }
});

export const { setUserRole } = userSlice.actions;
export default userSlice.reducer;
