// authService.js
import axios from "axios";

axios.defaults.withCredentials = true;

const checkSession = async () => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${process.env.REACT_APP_MONGO_BASE_URL}/session`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true; // Session is valid
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      return false; // Session is not valid
    }
    return false; // Session is not valid
  }
};

export default checkSession;
