import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { knouxLogger } from '../middleware/knouxLogger';
import { persistenceMiddleware } from '../middleware/persistence';
import playbackReducer from '../slices/playbackSlice';
import playlistReducer from '../slices/playlistSlice';
import settingsReducer from '../slices/settingsSlice';
import themeReducer from '../slices/themeSlice';
import localizationReducer from '../slices/localizationSlice';
import networkReducer from '../slices/networkSlice';
import updateReducer from '../slices/updateSlice';

const appInitialState = {
  currentView: 'player',
  isInitialized: false,
  isLoading: false,
  error: null,
};

const appReducer = (state = appInitialState, action: any) => {
  switch (action.type) {
    case 'app/setCurrentView':
      return { ...state, currentView: action.payload };
    case 'app/setInitialized':
      return { ...state, isInitialized: action.payload };
    case 'app/setLoading':
      return { ...state, isLoading: action.payload };
    case 'app/setError':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
  playback: playbackReducer,
  playlist: playlistReducer,
  settings: settingsReducer,
  theme: themeReducer,
  localization: localizationReducer,
  network: networkReducer,
  update: updateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: {
        extraArgument: {},
      },
    }).concat(knouxLogger, persistenceMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
