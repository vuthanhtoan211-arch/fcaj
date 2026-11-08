
import {
  clearLocalSession,
  getAccessToken,
} from "./auth";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000")
    .trim()
    .replace(/\/+$/, "");

// =========================================
// BASE REQUEST
// =========================================

async function apiRequest(path, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        ...(options.body && !isFormData
          ? {
              "Content-Type": "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
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
    // Response không có JSON.
  }

  if (!response.ok) {
    const detail = data?.detail;

    let message = `HTTP ${response.status}`;

    if (typeof detail === "string") {
      message = detail;
    } else if (
      detail &&
      typeof detail === "object"
    ) {
      message =
        detail.message ||
        detail.detail ||
        message;
    } else if (data?.message) {
      message = data.message;
    }

    const error = new Error(message);

    error.status = response.status;

    error.code =
      (detail &&
      typeof detail === "object"
        ? detail.code
        : null) ||
      data?.code ||
      null;

    error.detail = detail;
    error.data = data;

    if (response.status === 401 && token) {
      clearLocalSession();
    }

    throw error;
  }

  return data;
}

// =========================================
// SYSTEM
// =========================================

export function getHealth() {
  return apiRequest("/health");
}

// =========================================
// ACTIVITIES
// =========================================

export function getActivities() {
  return apiRequest("/activities");
}

export function getActivity(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}`
  );
}

export function createActivity(payload) {
  return apiRequest("/activities", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateActivity(activityId, payload) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function submitActivityForApproval(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/submit-approval`,
    {
      method: "POST",
    }
  );
}

export function publishActivity(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/publish`,
    {
      method: "POST",
    }
  );
}

export function cancelActivity(
  activityId,
  reason = ""
) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/cancel`,
    {
      method: "POST",
      body: JSON.stringify({
        reason,
      }),
    }
  );
}

export function deleteActivity(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}`,
    {
      method: "DELETE",
    }
  );
}

export function setActivityFeatured(
  activityId,
  isFeatured
) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/featured`,
    {
      method: "POST",
      body: JSON.stringify({
        is_featured: Boolean(isFeatured),
      }),
    }
  );
}

// =========================================
// ACTIVITY POSTERS — LOCAL / AMAZON S3
// =========================================

// Upload ảnh poster JPG, PNG hoặc WebP.
// Backend giới hạn dung lượng tối đa 5 MB.
//
// Không tự đặt Content-Type cho FormData.
// Trình duyệt sẽ tự thêm multipart boundary.

export function uploadActivityPoster(
  activityId,
  file
) {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/image`,
    {
      method: "POST",
      body: formData,
    }
  );
}

// Tên thay thế để tương thích các component
// đang sử dụng hàm uploadActivityImage.

export const uploadActivityImage =
  uploadActivityPoster;

// Lấy URL xem poster.
//
// - Ảnh local: backend trả thông tin URL local.
// - Ảnh S3 private: backend cấp URL ký sẵn
//   với thời hạn ngắn.
//
// Không lưu URL ký sẵn vào localStorage
// hoặc cập nhật ngược vào Activity.

export function getActivityPosterUrl(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/poster-url`
  );
}

// =========================================
// MY ACCOUNT DATA
// =========================================

export function getMyResults() {
  return apiRequest("/me/results");
}

export function getMyActivities() {
  return apiRequest("/me/activities");
}

// =========================================
// REGISTRATION IMPORT
// =========================================

export function previewRegistrationImport(
  activityId,
  file
) {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/registrations/preview`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function importRegistrations(
  activityId,
  file,
  portalActivity = ""
) {
  const formData = new FormData();

  formData.append("file", file);

  if (portalActivity) {
    formData.append(
      "portal_activity",
      portalActivity
    );
  }

  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/registrations/import`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function getRegistrations(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/registrations`
  );
}

// =========================================
// EVIDENCE
// =========================================

export function previewEvidenceImport(
  activityId,
  file
) {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/evidence/preview`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function importEvidence(
  activityId,
  file
) {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/evidence/import`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function getEvidence(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/evidence`
  );
}

// =========================================
// ATTENDANCE
// =========================================

export function getAttendance(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/attendance`
  );
}

export function checkIn(
  activityId,
  mssv
) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/check-in`,
    {
      method: "POST",
      body: JSON.stringify({
        mssv,
      }),
    }
  );
}

export function checkOut(
  activityId,
  mssv
) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/check-out`,
    {
      method: "POST",
      body: JSON.stringify({
        mssv,
      }),
    }
  );
}

export function openCheckOut(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/check-out/open`,
    {
      method: "POST",
    }
  );
}

export function closeCheckOut(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/check-out/close`,
    {
      method: "POST",
    }
  );
}

// =========================================
// RECONCILIATION
// =========================================

export function runReconciliation(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/reconcile`,
    {
      method: "POST",
    }
  );
}

export function getReconciliation(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/reconciliation`
  );
}

export function submitDecision(
  activityId,
  mssv,
  payload
) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/participants/${encodeURIComponent(mssv)}/decision`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function finalizeActivity(activityId) {
  return apiRequest(
    `/activities/${encodeURIComponent(activityId)}/finalize`,
    {
      method: "POST",
    }
  );
}

// =========================================
// EXPORT
// =========================================

export async function downloadActivityExport(
  activityId,
  exportType
) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/activities/${encodeURIComponent(activityId)}/export/${encodeURIComponent(exportType)}`,
    {
      method: "GET",
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  if (!response.ok) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      // Response không có JSON.
    }

    const detail = data?.detail;

    const message =
      (typeof detail === "string"
        ? detail
        : detail?.message) ||
      data?.message ||
      `HTTP ${response.status}`;

    const error = new Error(message);

    error.status = response.status;

    error.code =
      detail?.code ||
      data?.code ||
      null;

    error.data = data;

    if (response.status === 401 && token) {
      clearLocalSession();
    }

    throw error;
  }

  const contentDisposition =
    response.headers.get("Content-Disposition") ||
    response.headers.get("content-disposition");

  let fileName =
    `${activityId}_${exportType}.xlsx`;

  if (contentDisposition) {
    const encodedMatch =
      contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i
      );

    if (encodedMatch?.[1]) {
      try {
        fileName = decodeURIComponent(
          encodedMatch[1]
        );
      } catch {
        fileName = encodedMatch[1];
      }
    } else {
      const normalMatch =
        contentDisposition.match(
          /filename="?([^";]+)"?/i
        );

      if (normalMatch?.[1]) {
        fileName = normalMatch[1];
      }
    }
  }

  const blob = await response.blob();

  const objectUrl =
    window.URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;

  document.body.appendChild(anchor);

  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 1000);

  return {
    success: true,
    fileName,
  };
}

// =========================================
// ANALYTICS
// =========================================

export function getAnalyticsSummary() {
  return apiRequest("/analytics/summary");
}

// =========================================
// EXPORT CONFIG
// =========================================

export {
  API_BASE_URL,
};
