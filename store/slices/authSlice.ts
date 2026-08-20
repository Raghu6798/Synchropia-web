import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of our auth state based on Better Auth
interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  organizationId?: string | null;
  role?: string | null;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date | string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
  user: null,
  session: null,
  status: 'loading', // Start in loading state until we check session
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; session: Session }>
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.status = 'authenticated';
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.status = 'unauthenticated';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? 'loading' : state.status;
    }
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;