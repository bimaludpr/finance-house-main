import axios from "axios";
import { updateRedux } from "src/redux/commonSlice";
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
      const res = await axios.post(`${API_BASE_URL}authCheck`, data);
      dispatch(updateRedux({ key: "login_loading", value: false }));
      if (res.data.status ) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("csrfToken", res.data.csrfToken	);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        }
        callback?.(res.data.status);
      }
    } catch (err) {
      dispatch(updateRedux({ key: "login_loading", value: false }));
      console.error(err);
    }
  };
