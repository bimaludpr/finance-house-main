import axios from "axios";
import { updateRedux } from "src/redux/popupSlice";
import { AppDispatch } from "src/redux/store";
import { API_BASE_URL } from "src/utils/constants/configuration";

interface LoginData {
  email: string;
  password: string;
}

export const login =
  (data: LoginData, callback?: (status: number) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(updateRedux({ key: "login_loading", value: true }));
      const res = await axios.post(`${API_BASE_URL}auth/login`, data);
      dispatch(updateRedux({ key: "login_loading", value: false }));
      if (res.data.status === 200) {
        const result = res.data.data;
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("user", JSON.stringify(result.user));
        callback?.(res.data.status);
      } else {
        callback?.(res.data.status);
      }
    } catch (err) {
      dispatch(updateRedux({ key: "login_loading", value: false }));
      console.error(err);
    }
  };
