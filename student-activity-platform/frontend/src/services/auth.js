const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000")
    .trim()
    .replace(/\/+$/, "");

const TOKEN_KEY =
  "sap_access_token";

const USER_KEY =
  "sap_current_user";

const AUTH_EVENT =
  "sap-auth-change";


// =========================================
// LOCAL SESSION
// =========================================

export function getAccessToken() {
  try {
    return (
      window.localStorage.getItem(
        TOKEN_KEY
      ) || ""
    );
  } catch {
    return "";
  }
}


export function getCurrentUser() {
  try {
    const raw =
      window.localStorage.getItem(
        USER_KEY
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}


export function setLocalSession(
  token,
  user
) {
  try {
    if (token) {
      window.localStorage.setItem(
        TOKEN_KEY,
        token
      );
    }

    if (user) {
      window.localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
    }
  } catch {
    // Browser có thể chặn localStorage.
  }

  notifyAuthChange(user || null);
}


export function setStoredUser(user) {
  try {
    if (user) {
      window.localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
    } else {
      window.localStorage.removeItem(
        USER_KEY
      );
    }
  } catch {
    // Ignore storage errors.
  }

  notifyAuthChange(user || null);
}


export function clearLocalSession() {
  try {
    window.localStorage.removeItem(
      TOKEN_KEY
    );

    window.localStorage.removeItem(
      USER_KEY
    );
  } catch {
    // Ignore storage errors.
  }

  notifyAuthChange(null);
}


function notifyAuthChange(user) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      AUTH_EVENT,
      {
        detail: user,
      }
    )
  );
}


export function subscribeAuthChange(
  callback
) {
  if (
    typeof window ===
      "undefined"
    ||
    typeof callback !==
      "function"
  ) {
    return () => {};
  }

  const handler = (event) => {
    callback(
      event?.detail || null
    );
  };

  window.addEventListener(
    AUTH_EVENT,
    handler
  );

  return () => {
    window.removeEventListener(
      AUTH_EVENT,
      handler
    );
  };
}


// =========================================
// AUTH FETCH
// =========================================

async function authRequest(
  path,
  options = {}
) {
  const token =
    getAccessToken();

  const isFormData =
    typeof FormData !==
      "undefined"
    &&
    options.body instanceof FormData;

  const response =
    await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          ...(
            options.body
            && !isFormData
              ? {
                  "Content-Type":
                    "application/json",
                }
              : {}
          ),
          ...(
            token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}
          ),
          ...(options.headers || {}),
        },
      }
    );

  let data = null;

  try {
    data =
      await response.json();
  } catch {
    // Response không có JSON.
  }

  if (!response.ok) {
    const detail =
      data?.detail;

    const message =
      (
        typeof detail ===
          "string"
          ? detail
          : detail?.message
      )
      || data?.message
      || `HTTP ${response.status}`;

    const error =
      new Error(message);

    error.status =
      response.status;

    error.code =
      detail?.code
      || data?.code
      || null;

    error.data = data;

    throw error;
  }

  return data;
}


// =========================================
// LOGIN
// =========================================

export async function login(
  username,
  password
) {
  const result =
    await authRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

  setLocalSession(
    result.access_token,
    result.user
  );

  return result;
}


// =========================================
// RESTORE SESSION
// =========================================

export async function restoreSession() {
  const token =
    getAccessToken();

  if (!token) {
    clearLocalSession();
    return null;
  }

  try {
    const result =
      await authRequest(
        "/auth/me"
      );

    const user =
      result?.user || null;

    setStoredUser(user);

    return user;
  } catch {
    clearLocalSession();
    return null;
  }
}


// =========================================
// LOGOUT
// =========================================

export async function logout() {
  try {
    if (getAccessToken()) {
      await authRequest(
        "/auth/logout",
        {
          method: "POST",
        }
      );
    }
  } catch {
    // Dù backend lỗi vẫn phải xóa session local.
  } finally {
    clearLocalSession();
  }
}


// =========================================
// CHANGE PASSWORD
// =========================================

export async function changePassword(
  currentPassword,
  newPassword
) {
  const result =
    await authRequest(
      "/auth/change-password",
      {
        method: "POST",
        body: JSON.stringify({
          current_password:
            currentPassword,
          new_password:
            newPassword,
        }),
      }
    );

  const user =
    await restoreSession();

  return {
    ...result,
    user,
  };
}


// =========================================
// PROFILE
// =========================================

export async function updateProfile(
  payload
) {
  const result =
    await authRequest(
      "/auth/profile",
      {
        method: "PATCH",
        body: JSON.stringify(
          payload
        ),
      }
    );

  if (result?.user) {
    setStoredUser(
      result.user
    );
  }

  return result;
}


export async function uploadAvatar(
  file
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const result =
    await authRequest(
      "/auth/avatar",
      {
        method: "POST",
        body: formData,
      }
    );

  if (result?.user) {
    setStoredUser(
      result.user
    );
  }

  return result;
}


export function resolveBackendUrl(
  value
) {
  const text =
    String(value || "").trim();

  if (!text) {
    return "";
  }

  if (
    text.startsWith("http://")
    ||
    text.startsWith("https://")
  ) {
    return text;
  }

  return `${API_BASE_URL}${text}`;
}


export {
  API_BASE_URL,
};
