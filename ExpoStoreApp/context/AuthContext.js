import React, { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { setAuthToken } from "../services/api";
import { apiLogin, apiRegister, apiMe } from "../services/endpoints";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const saveSession = async ({ token: t, user: u }) => {
    setToken(t);
    setUser(u);

    setAuthToken(t);

    await AsyncStorage.setItem(TOKEN_KEY, t);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const clearSession = async () => {
    setToken(null);
    setUser(null);

    setAuthToken(null);

    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  };

  const bootstrap = async () => {
    try {
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (!savedToken) return;

      setToken(savedToken);
      setAuthToken(savedToken);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // nếu không có cached user thì fetch /users/me
        const me = await apiMe();
        setUser(me.user ?? me);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(me.user ?? me));
      }
    } catch (e) {
      // token hỏng/expired -> xoá session
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const auth = useMemo(() => {
    return {
      isLoading,
      token,
      user,

      login: async ({ email, password, remember = true }) => {
        if (!email?.trim() || !password?.trim()) {
          throw new Error("Email và mật khẩu không được rỗng");
        }

        // Backend nên nhận: { identifier, password, remember }
        const res = await apiLogin({
          identifier: email.trim(),
          password: password.trim(),
          remember,
        });

        // Backend nên trả: { token, user }
        if (!res?.token) throw new Error("Thiếu token từ server");
        if (!res?.user) throw new Error("Thiếu user từ server");

        await saveSession({ token: res.token, user: res.user });
        return res;
      },

      register: async ({ email, password, confirmPassword }) => {
        if (!email?.trim() || !password?.trim()) {
          throw new Error("Email và mật khẩu không được rỗng");
        }
        if (password.length < 6) {
          throw new Error("Mật khẩu tối thiểu 6 ký tự");
        }
        if (password !== confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp");
        }

        // Backend nên nhận: { email, password }
        const res = await apiRegister({
          email: email.trim(),
          password: password.trim(),
        });

        console.log("Register response:", res);

        // Backend nên trả: { token, user } (đăng ký xong auto-login)
        if (!res?.token) throw new Error("Thiếu token từ server");
        if (!res?.user) throw new Error("Thiếu user từ server");

        await saveSession({ token: res.token, user: res.user });
        return res;
      },

      logout: async () => {
        await clearSession();
      },
    };
  }, [isLoading, token, user]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
