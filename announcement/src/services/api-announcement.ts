import { updateRedux } from "src/redux/announcementSlice";
import { AppDispatch } from "src/redux/store";
import axiosInstance from "./axiosInstance";
import {
  ANNOUNCEMENT_API_BASE_URL,
  UPLOAD_API_BASE_URL,
} from "src/utils/constants/configuration";
import { toast } from "react-toastify";
import { AnnouncementData } from "src/components/Announcements/AnnouncementForm";

// Upload Response Interface
interface UploadResponse {
  status: boolean;
  message: string;
  [key: string]: any;
}

// Callback and Progress Types
type CallbackFn = (data: UploadResponse) => void;
type ProgressFn = (percent: number) => void;

// Upload File Function
export const uploadFile =
  (
    formData: FormData,
    callback?: CallbackFn,
    progress?: ProgressFn,
    customBaseURL: string = UPLOAD_API_BASE_URL
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateRedux({ key: "fileUploadLoader", value: true }));

    try {
      const response = await axiosInstance.post<UploadResponse>(
        "uploadFile",
        formData,
        {
          baseURL: customBaseURL,
          onUploadProgress: (e) => {
            if (e.total && progress) {
              progress(Math.round((e.loaded * 100) / e.total));
            }
          },
        }
      );

      dispatch(updateRedux({ key: "fileUploadLoader", value: false }));

      if (response.data.status) {
        callback?.(response.data);
      } else {
        toast.error(response.data.message || "Upload failed", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      dispatch(updateRedux({ key: "fileUploadLoader", value: false }));
      toast.error(err?.message || "Upload failed", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

// Add Announcement
export const insertAnnouncement =
  (
    data: AnnouncementData,
    callback?: (data: UploadResponse) => void,
    customBaseURL: string = ANNOUNCEMENT_API_BASE_URL
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateRedux({ key: "update_announcement_loading", value: true }));
    try {
      const res = await axiosInstance.post<UploadResponse>(
        "insertAnnouncement",
        data,
        {
          baseURL: customBaseURL,
        }
      );

      dispatch(
        updateRedux({ key: "update_announcement_loading", value: false })
      );
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "bottom-center",
          autoClose: 3000,
        });
        callback?.(res.data);
      } else {
        toast.error(res.data.message || "Failed to add announcement", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      dispatch(
        updateRedux({ key: "update_announcement_loading", value: false })
      );
      toast.error(err?.message || "Add announcement failed", {
        position: "bottom-center",
        autoClose: 3000,
      });
      console.error("Add Announcement Error:", err);
    }
  };

// Update Announcement
export const updateAnnouncement =
  (
    data: AnnouncementData,
    callback?: (data: UploadResponse) => void,
    customBaseURL: string = ANNOUNCEMENT_API_BASE_URL
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateRedux({ key: "update_announcement_loading", value: true }));
    try {
      const res = await axiosInstance.put<UploadResponse>(
        "updateAnnouncement",
        data,
        {
          baseURL: customBaseURL,
        }
      );

      dispatch(
        updateRedux({ key: "update_announcement_loading", value: false })
      );
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "bottom-center",
          autoClose: 3000,
        });
        callback?.(res.data);
      } else {
        toast.error(res.data.message || "Failed to update announcement", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      dispatch(
        updateRedux({ key: "update_announcement_loading", value: false })
      );
      toast.error(err?.message || "update announcement failed", {
        position: "bottom-center",
        autoClose: 3000,
      });
      console.error("Add Announcement Error:", err);
    }
  };

// get announcement data
export const getAnnouncementList =
  (
    data: {
      keyword: string;
      sortColumn: string;
      sortValue: number;
      page: number;
      perPage: number;
    },
    customBaseURL: string = ANNOUNCEMENT_API_BASE_URL
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateRedux({ key: "announcement_loading", value: true }));
    try {
      const res = await axiosInstance.post<UploadResponse>(
        "getAnnouncementList",
        data,
        {
          baseURL: customBaseURL,
        }
      );
      console.log(res.data, res.data.data, res.data.status);
      dispatch(updateRedux({ key: "announcement_loading", value: false }));
      if (res.data.status) {
        dispatch(
          updateRedux({ key: "announcement_data", value: res.data.data })
        );
        dispatch(
          updateRedux({
            key: "announcement_page_details",
            value: res.data.pagination,
          })
        );
      }
    } catch (err: any) {
      dispatch(updateRedux({ key: "announcement_loading", value: false }));
    }
  };

// get announcement details
interface AnnouncementDetailResponse {
  status: boolean;
  data: any; // ideally: AnnouncementItem;
  path?: string;
}

export const getAnnouncementDetail =
  (id: string, customBaseURL: string = ANNOUNCEMENT_API_BASE_URL) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateRedux({ key: "announcement_loading", value: true }));
    try {
      const res = await axiosInstance.get<AnnouncementDetailResponse>(
        `getAnnouncementDetail/${id}`,
        { baseURL: customBaseURL }
      );
      dispatch(updateRedux({ key: "announcement_loading", value: false }));
      if (res.data.status) {
        dispatch(
          updateRedux({ key: "announcement_details", value: res.data.data })
        );
        dispatch(
          updateRedux({ key: "announcement_path", value: res.data.path })
        );
      }
    } catch (error) {
      console.error("❌ Error fetching announcement detail:", error);
      dispatch(updateRedux({ key: "announcement_loading", value: false }));
    }
  };

// delete announcement
export const deleteAnnouncement =
  (
    id: string,
    callback?: () => void,
    customBaseURL: string = ANNOUNCEMENT_API_BASE_URL
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateRedux({ key: "update_announcement_loading", value: true }));
    try {
      const res = await axiosInstance.delete(`deleteAnnouncement/${id}`, {
        baseURL: customBaseURL,
      });
      dispatch(
        updateRedux({ key: "update_announcement_loading", value: false })
      );
      if (res.data.status) {
        toast.success(res.data.message, {
          position: "bottom-center",
          autoClose: 3000,
        });
        callback?.();
      } else {
        toast.error(res.data.message || "Deletion failed", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("❌ Error deleting announcement:", error);
      dispatch(
        updateRedux({ key: "update_announcement_loading", value: false })
      );
      toast.error("An unexpected error occurred", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };
