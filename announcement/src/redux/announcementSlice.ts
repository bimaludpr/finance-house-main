import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { AnnouncementItem } from "src/components/Announcements/AnnouncementList";

// Define the shape of your state
interface AnnouncementState {
  value: any;
  announcement_loading?: boolean;
  announcement_data?: AnnouncementItem[];
  announcement_page_details?: any;
  announcement_path?: string;
  update_announcement_loading?: boolean;
  fileUploadLoader?: boolean;
  announcement_details?: any;
}

// Initial state
const initialState: AnnouncementState = {
  value: true,
  announcement_loading: false,
  announcement_data: [],
  announcement_page_details: null,
  announcement_path: "",
  update_announcement_loading: false,
  fileUploadLoader: false,
  announcement_details: {},
};

// Slice definition
export const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    updateRedux: (state: any, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { updateRedux } = announcementSlice.actions;

export const value = (state: any) => state.announcement?.value;
export const announcement_loading = (state: any) =>
  state.announcement?.announcement_loading;
export const announcement_data = (state: any) =>
  state.announcement?.announcement_data;
export const announcement_page_details = (state: any) =>
  state.announcement?.announcement_page_details;
export const announcement_path = (state: any) =>
  state.announcement?.announcement_path;
export const announcement_details = (state: any) =>
  state.announcement?.announcement_details;

export default announcementSlice.reducer;
