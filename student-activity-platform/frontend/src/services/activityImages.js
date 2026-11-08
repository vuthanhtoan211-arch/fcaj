
/**
 * Activity Images Service
 *
 * Student Activity Management &
 * Engagement Analytics Platform
 *
 * Hỗ trợ:
 * - Upload poster hoạt động
 * - Poster lưu local hoặc Amazon S3
 * - Lấy URL xem ảnh từ S3 private
 *
 * Sử dụng chung API service để tránh
 * trùng lặp xử lý Authorization,
 * FormData và lỗi HTTP.
 */

import {
  uploadActivityPoster,
  getActivityPosterUrl as fetchActivityPosterUrl,
} from "./api";


// =========================================
// UPLOAD ACTIVITY IMAGE
// =========================================

/**
 * Upload poster hoạt động.
 *
 * @param {string} activityId
 * @param {File} file
 *
 * @returns {Promise<object>}
 *
 * Backend:
 * POST /activities/{activity_id}/image
 *
 * Hỗ trợ:
 * - JPG
 * - PNG
 * - WebP
 *
 * Giới hạn dung lượng: 5 MB.
 *
 * Nơi lưu phụ thuộc cấu hình backend:
 * SAP_POSTER_STORAGE=local
 * SAP_POSTER_STORAGE=s3
 */

export async function uploadActivityImage(
  activityId,
  file
) {
  if (!activityId) {
    throw new Error(
      "Không tìm thấy mã hoạt động."
    );
  }

  if (!file) {
    throw new Error(
      "Vui lòng chọn ảnh poster."
    );
  }

  return uploadActivityPoster(
    activityId,
    file
  );
}


// =========================================
// GET ACTIVITY POSTER URL
// =========================================

/**
 * Lấy thông tin URL hiển thị poster.
 *
 * Backend:
 * GET /activities/{activity_id}/poster-url
 *
 * Với ảnh local:
 * - Sử dụng URL của backend.
 *
 * Với ảnh S3 private:
 * - Backend tạo URL ký sẵn.
 * - URL có thời hạn sử dụng.
 *
 * Không lưu URL ký sẵn vào database
 * hoặc localStorage.
 */

export async function getActivityPosterUrl(
  activityId
) {
  if (!activityId) {
    throw new Error(
      "Không tìm thấy mã hoạt động."
    );
  }

  return fetchActivityPosterUrl(
    activityId
  );
}
