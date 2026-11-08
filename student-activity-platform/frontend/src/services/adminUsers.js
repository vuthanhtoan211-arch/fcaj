import {
  API_BASE_URL,
  clearLocalSession,
  getAccessToken,
} from "./auth";


async function adminRequest(
  path,
  options = {}
) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        ...(options.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),
        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Không có JSON.
  }

  if (!response.ok) {
    const detail = data?.detail;
    const message =
      (typeof detail === "string"
        ? detail
        : detail?.message)
      || data?.message
      || `HTTP ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.code = detail?.code || null;
    error.data = data;

    if (response.status === 401) {
      clearLocalSession();
    }

    throw error;
  }

  return data;
}


export function getStudentAccounts({
  search = "",
  status = "ALL",
  passwordState = "ALL",
} = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  params.set("status", status);
  params.set(
    "password_state",
    passwordState
  );

  return adminRequest(
    `/admin/students?${params.toString()}`
  );
}


export function setStudentAccountStatus(
  username,
  isActive
) {
  return adminRequest(
    `/admin/students/${encodeURIComponent(username)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        is_active: Boolean(isActive),
      }),
    }
  );
}


export function resetStudentTemporaryPassword(
  username,
  temporaryPassword
) {
  return adminRequest(
    `/admin/students/${encodeURIComponent(username)}/reset-password`,
    {
      method: "POST",
      body: JSON.stringify({
        temporary_password:
          temporaryPassword,
      }),
    }
  );
}


export function syncStudentAccounts() {
  return adminRequest(
    "/admin/students/sync/from-student-store",
    {
      method: "POST",
    }
  );
}
