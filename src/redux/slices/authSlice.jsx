import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.jsx";

/* =========================
   REGISTER
========================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =========================
   LOGIN
========================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login/", { email, password });

      // 🔐 MFA STATE (not an error)
      if (res.data?.mfa_required) {
        return rejectWithValue({
          mfa_required: true,
          mfa_setup_required: res.data.mfa_setup_required,
          credentials: { email, password },
        });
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =========================
   GOOGLE LOGIN
========================= */
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/google/", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =========================
   MFA VERIFY
========================= */
export const verifyMFA = createAsyncThunk(
  "auth/mfaVerify",
  async ({ email, password, token }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/mfa/verify-setup/", {
        email,
        password,
        token,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =========================
   LOAD CURRENT USER
========================= */
export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/user/");
      return res.data;
    } catch {
      return rejectWithValue();
    }
  }
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  user: null,
  loading: false,
  error: null,

  isAuthenticated: false,

  // MFA
  mfaRequired: false,
  mfaSetupRequired: false,
  tempCredentials: null,
};

/* =========================
   SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      Object.assign(state, initialState);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    clearAuthError(state) {
      state.error = null;
    },

    resetMfaState(state) {
      state.mfaRequired = false;
      state.mfaSetupRequired = false;
      state.tempCredentials = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- REGISTER ---------- */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- LOGIN ---------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        if (action.payload?.mfa_required) {
          state.mfaRequired = true;
          state.mfaSetupRequired = action.payload.mfa_setup_required;
          state.tempCredentials = action.payload.credentials;
        } else {
          state.error = action.payload;
        }
      })

      /* ---------- MFA VERIFY ---------- */
      .addCase(verifyMFA.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyMFA.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);

        state.mfaRequired = false;
        state.mfaSetupRequired = false;
        state.tempCredentials = null;
      })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Invalid MFA code";
      })

      /* ---------- CURRENT USER ---------- */
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  logout,
  clearAuthError,
  resetMfaState,
} = authSlice.actions;

export default authSlice.reducer;
