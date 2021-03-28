import { createContext, useContext, useReducer } from "react";
import request from "../services/request";

export const getUserData = () => JSON.parse(localStorage.getItem("user"));

const INIT_STATE = {
  userData: null,
  isSignIn: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "signin": {
      const { userData } = action.payload;

      localStorage.setItem("user", JSON.stringify(userData));
      return {
        userData,
        isSignIn: true,
      };
    }
    case "signout": {
      localStorage.removeItem("user");
      return INIT_STATE;
    }
    default:
      return state;
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INIT_STATE);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthenActions = () => {
  const [state, dispatch] = useContext(AuthContext);
  const signIn = ({ url, email, password }) => {
    return new Promise((resolve) => {
      request
        .post(url, {
          email,
          password,
        })
        .then((res) => {
          resolve(
            dispatch({
              type: "signin",
              payload: {
                userData: res,
              },
            })
          );
        });
    });
  };
  const signOut = () => {
    dispatch({ type: "signout" });
  };

  return {
    signIn,
    signOut,
    userData: state?.userData,
    isSignIn: state?.isSignIn,
  };
};
