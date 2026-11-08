import {
  API_BASE_URL,
  clearLocalSession,
  getAccessToken,
} from "./auth";


async function analyticsRequest(
  path,
  options = {}
) {
  const token =
    getAccessToken();

  const response =
    await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
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
        typeof detail === "string"
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

    if (
      response.status === 401
      && token
    ) {
      clearLocalSession();
    }

    throw error;
  }

  return data;
}


export function getMyAnalytics() {
  return analyticsRequest(
    "/me/analytics"
  );
}
