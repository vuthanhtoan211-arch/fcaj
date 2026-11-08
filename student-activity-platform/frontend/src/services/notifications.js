import {
  API_BASE_URL,
  clearLocalSession,
  getAccessToken,
} from "./auth";


async function notificationRequest(
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
    // response không có JSON
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


export function getNotifications(
  limit = 30
) {
  return notificationRequest(
    `/notifications?limit=${encodeURIComponent(limit)}`
  );
}


export function getUnreadNotificationCount() {
  return notificationRequest(
    "/notifications/unread-count"
  );
}


export function markNotificationRead(
  notificationId
) {
  return notificationRequest(
    `/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: "POST",
    }
  );
}


export function markAllNotificationsRead() {
  return notificationRequest(
    "/notifications/read-all",
    {
      method: "POST",
    }
  );
}
