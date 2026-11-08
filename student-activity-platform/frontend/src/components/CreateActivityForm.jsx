import { useEffect, useState } from "react";
import { AlertCircle, CalendarPlus, ImagePlus, Save, Upload, X } from "lucide-react";
import { createActivity, updateActivity } from "../services/api";
import { resolveBackendUrl } from "../services/auth";
import { uploadActivityImage, getActivityPosterUrl } from "../services/activityImages";

const MAX_POSTER_SIZE = 5 * 1024 * 1024;
const ALLOWED_POSTER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const initialForm = {
  activity_name: "", activity_type: "WORKSHOP", description: "",
  start_time: "", end_time: "", location: "", capacity: 100,
  point_value: 0, semester: "1", academic_year: "2026-2027",
};

function toVietnamISO(value) {
  const text = String(value || "").trim();
  return text ? `${text}:00+07:00` : "";
}
function toInputDateTime(value) {
  const match = String(value || "").match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  return match ? `${match[1]}T${match[2]}` : "";
}
function activityToForm(activity) {
  if (!activity) return { ...initialForm };
  return {
    activity_name: activity.activity_name || "",
    activity_type: activity.activity_type || "WORKSHOP",
    description: activity.description || "",
    start_time: toInputDateTime(activity.start_time),
    end_time: toInputDateTime(activity.end_time),
    location: activity.location || "",
    capacity: activity.capacity ?? 100,
    point_value: activity.point_value ?? 0,
    semester: activity.semester || "1",
    academic_year: activity.academic_year || "2026-2027",
  };
}
function Field({ label, required = false, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}{required && <span style={styles.required}>*</span>}</span>
      {children}
    </label>
  );
}

function CreateActivityForm({ activityToEdit, onCreated, onUpdated, onCancel }) {
  const [form, setForm] = useState(() => activityToForm(activityToEdit));
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [persistedActivity, setPersistedActivity] = useState(null);
  const [remotePosterUrl, setRemotePosterUrl] = useState("");
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterLoadError, setPosterLoadError] = useState("");

  // Giữ Activity đã tạo nếu upload poster thất bại; lần Lưu sau sẽ cập nhật.
  // Ưu tiên dữ liệu mới nhất trả về từ backend sau khi lưu/upload.
  const effectiveActivity = persistedActivity || activityToEdit;
  const isEditing = Boolean(effectiveActivity?.activity_id);
  const activityId = effectiveActivity?.activity_id || "";
  const imageKey = String(effectiveActivity?.image_key || "");
  const isS3Poster = Boolean(imageKey) && (!effectiveActivity?.image_url || imageKey.startsWith("s3://"));
  const localPosterUrl = resolveBackendUrl(effectiveActivity?.image_url);
  const existingPosterUrl = isS3Poster ? remotePosterUrl : localPosterUrl;
  const displayedPoster = posterPreview || existingPosterUrl;

  useEffect(() => {
    setForm(activityToForm(activityToEdit));
    setPosterFile(null);
    setPosterPreview("");
    setPersistedActivity(null);
    setError("");
  }, [activityToEdit]);

  useEffect(() => {
    return () => {
      if (posterPreview.startsWith("blob:")) URL.revokeObjectURL(posterPreview);
    };
  }, [posterPreview]);

  // S3 private: lấy signed URL qua backend; làm mới trước hạn 15 phút.
  // URL này chỉ nằm trong state, không lưu vào localStorage/database.
  useEffect(() => {
    let cancelled = false;
    let timer;
    setRemotePosterUrl("");
    setPosterLoadError("");
    setPosterLoading(false);
    if (!activityId || !isS3Poster) return () => { cancelled = true; };

    async function refresh() {
      try {
        if (!cancelled) setPosterLoading(true);
        const result = await getActivityPosterUrl(activityId);
        const url = result?.data?.image_url;
        if (!url) throw new Error("Backend không trả về URL poster.");
        if (!cancelled) {
          setRemotePosterUrl(url);
          setPosterLoadError("");
        }
      } catch (err) {
        if (!cancelled) {
          setRemotePosterUrl("");
          setPosterLoadError(err?.message || "Không tải được poster.");
        }
      } finally {
        if (!cancelled) {
          setPosterLoading(false);
          timer = window.setTimeout(refresh, 12 * 60 * 1000);
        }
      }
    }
    refresh();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activityId, imageKey, isS3Poster]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handlePosterChange(event) {
    const file = event.target.files?.[0] || null;
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!ALLOWED_POSTER_TYPES.has(file.type)) {
      setError("Poster chỉ hỗ trợ JPG, PNG hoặc WebP.");
      return;
    }
    if (file.size > MAX_POSTER_SIZE) {
      setError("Poster tối đa 5 MB.");
      return;
    }
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  }

  function clearSelectedPoster() {
    setPosterFile(null);
    setPosterPreview("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    const name = form.activity_name.trim();
    const location = form.location.trim();
    if (name.length < 3) return setError("Tên hoạt động phải có ít nhất 3 ký tự.");
    if (!location) return setError("Vui lòng nhập địa điểm tổ chức.");
    if (!form.start_time || !form.end_time) {
      return setError("Vui lòng nhập đầy đủ thời gian tổ chức.");
    }
    const start = new Date(toVietnamISO(form.start_time));
    const end = new Date(toVietnamISO(form.end_time));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return setError("Định dạng ngày giờ không hợp lệ.");
    }
    if (end <= start) return setError("Thời gian kết thúc phải sau thời gian bắt đầu.");
    const capacity = Number(form.capacity);
    const pointValue = Number(form.point_value);
    if (!Number.isInteger(capacity) || capacity <= 0) {
      return setError("Số lượng sinh viên phải là số nguyên lớn hơn 0.");
    }
    if (!Number.isInteger(pointValue) || pointValue < 0) {
      return setError("Điểm hoạt động phải là số nguyên không âm.");
    }
    const payload = {
      activity_name: name,
      activity_type: form.activity_type,
      description: form.description.trim(),
      start_time: toVietnamISO(form.start_time),
      end_time: toVietnamISO(form.end_time),
      location,
      capacity,
      point_value: pointValue,
      semester: form.semester.trim(),
      academic_year: form.academic_year.trim(),
    };

    try {
      setSubmitting(true);
      let savedActivity = effectiveActivity;
      if (isEditing) {
        const result = await updateActivity(effectiveActivity.activity_id, payload);
        savedActivity = result?.data || savedActivity;
      } else {
        const result = await createActivity(payload);
        savedActivity = result?.data;
        if (!savedActivity?.activity_id) {
          throw new Error("Backend không trả về mã hoạt động vừa tạo.");
        }
      }
      setPersistedActivity(savedActivity);

      if (posterFile) {
        try {
          const posterResult = await uploadActivityImage(savedActivity.activity_id, posterFile);
          savedActivity = posterResult?.data || savedActivity;
          setPersistedActivity(savedActivity);
          setPosterFile(null);
          setPosterPreview("");
        } catch (posterError) {
          setPersistedActivity(savedActivity);
          throw new Error(
            "Thông tin hoạt động đã được lưu, nhưng poster chưa tải lên được: " +
            (posterError?.message || "Lỗi không xác định") +
            ". Bạn có thể bấm Lưu lại để thử upload poster lần nữa."
          );
        }
      }

      if (activityToEdit) onUpdated?.(savedActivity);
      else onCreated?.(savedActivity);
    } catch (submitError) {
      console.error(submitError);
      setError(submitError?.message || "Không thể lưu hoạt động.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputProps = (name) => ({
    name, value: form[name], onChange: handleChange,
    style: styles.input, disabled: submitting,
  });

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerIcon}><CalendarPlus size={22} /></div>
        <div style={{ flex: 1 }}>
          <span style={styles.eyebrow}>
            {isEditing ? "CHỈNH SỬA HOẠT ĐỘNG" : "TẠO HOẠT ĐỘNG"}
          </span>
          <h2 style={styles.title}>
            {isEditing ? "Cập nhật thông tin hoạt động" : "Tạo hoạt động mới"}
          </h2>
          <p style={styles.description}>
            Chọn poster JPG, PNG hoặc WebP. Ảnh sẽ được sử dụng trực tiếp
            trên trang hoạt động và trang chủ.
          </p>
        </div>
        <button type="button" onClick={onCancel} style={styles.closeButton}
          aria-label="Đóng" disabled={submitting}>
          <X size={19} />
        </button>
      </div>

      {error && (
        <div role="alert" style={styles.errorBox}>
          <AlertCircle size={19} /><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.posterSection}>
          <div style={styles.posterPreviewWrap}>
            {displayedPoster ? (
              <img src={displayedPoster} alt="Xem trước poster hoạt động"
                style={styles.posterImage} />
            ) : (
              <div style={styles.posterEmpty}>
                <ImagePlus size={34} />
                <strong>
                  {posterLoading ? "Đang tải poster..." :
                    posterLoadError ? "Chưa tải được poster" : "Chưa có poster"}
                </strong>
                <span>{posterLoadError || "JPG, PNG hoặc WebP · tối đa 5 MB"}</span>
              </div>
            )}
          </div>
          <div style={styles.posterActions}>
            <div>
              <strong style={styles.posterTitle}>Poster hoạt động</strong>
              <p style={styles.posterHelp}>
                Poster được xem trước trước khi lưu. Ảnh S3 private sử dụng
                URL có thời hạn, được tự động làm mới khi cần.
              </p>
            </div>
            <div style={styles.posterButtons}>
              <label style={styles.uploadButton}>
                <Upload size={16} />
                {posterFile ? "Đổi ảnh đã chọn" :
                  (imageKey || existingPosterUrl) ? "Thay poster" : "Chọn poster"}
                <input type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  onChange={handlePosterChange}
                  style={{ display: "none" }} disabled={submitting} />
              </label>
              {posterFile && (
                <button type="button" onClick={clearSelectedPoster}
                  style={styles.secondaryButton} disabled={submitting}>
                  Bỏ ảnh vừa chọn
                </button>
              )}
            </div>
            {posterFile && <small style={styles.fileName}>Đã chọn: {posterFile.name}</small>}
          </div>
        </div>

        <div style={styles.grid}>
          <Field label="Tên hoạt động" required>
            <input {...inputProps("activity_name")} placeholder="Ví dụ: ITDAY 2026" />
          </Field>
          <Field label="Loại hoạt động" required>
            <select {...inputProps("activity_type")}>
              <option value="WORKSHOP">Workshop</option>
              <option value="SEMINAR">Seminar</option>
              <option value="POLITICAL">Sinh hoạt chính trị</option>
              <option value="COMPETITION">Cuộc thi</option>
              <option value="ANNUAL">Chương trình thường niên</option>
              <option value="RECREATIONAL">Hoạt động phong trào</option>
            </select>
          </Field>
          <Field label="Bắt đầu" required>
            <input {...inputProps("start_time")} type="datetime-local" />
          </Field>
          <Field label="Kết thúc" required>
            <input {...inputProps("end_time")} type="datetime-local" />
          </Field>
          <Field label="Địa điểm" required>
            <input {...inputProps("location")} placeholder="Ví dụ: Hội trường lầu 6" />
          </Field>
          <Field label="Số lượng sinh viên" required>
            <input {...inputProps("capacity")} type="number" min="1" step="1" />
          </Field>
          <Field label="Điểm hoạt động">
            <input {...inputProps("point_value")} type="number" min="0" step="1" />
          </Field>
          <Field label="Học kỳ">
            <input {...inputProps("semester")} />
          </Field>
          <Field label="Năm học">
            <input {...inputProps("academic_year")} placeholder="2026-2027" />
          </Field>
          <div style={styles.fullWidth}>
            <Field label="Mô tả hoạt động">
              <textarea name="description" value={form.description}
                onChange={handleChange} disabled={submitting}
                style={{ ...styles.input, minHeight: 110, resize: "vertical", lineHeight: 1.6 }}
                placeholder="Nhập nội dung mô tả..." />
            </Field>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onCancel} style={styles.cancelButton}
            disabled={submitting}>Hủy</button>
          <button type="submit"
            style={{ ...styles.saveButton, ...(submitting ? styles.disabledButton : {}) }}
            disabled={submitting}>
            <Save size={17} />
            {submitting ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo bản nháp"}
          </button>
        </div>
      </form>
    </section>
  );
}

const styles = {
  card: {
    marginBottom:
      24,
    padding:
      24,
    border:
      "1px solid #dce8f6",
    borderRadius:
      18,
    background:
      "#ffffff",
    boxShadow:
      "0 12px 32px rgba(35,72,123,0.08)",
  },

  header: {
    display:
      "flex",
    alignItems:
      "flex-start",
    gap:
      14,
    marginBottom:
      20,
  },

  headerIcon: {
    width:
      44,
    height:
      44,
    flex:
      "0 0 44px",
    display:
      "grid",
    placeItems:
      "center",
    borderRadius:
      13,
    background:
      "#e7f1ff",
    color:
      "#2268bf",
  },

  eyebrow: {
    color:
      "#2268bf",
    fontSize:
      10,
    fontWeight:
      800,
    letterSpacing:
      "0.12em",
  },

  title: {
    margin:
      "5px 0 5px",
    color:
      "#172b46",
    fontSize:
      24,
  },

  description: {
    margin:
      0,
    maxWidth:
      760,
    color:
      "#6b7d93",
    fontSize:
      12,
    lineHeight:
      1.65,
  },

  closeButton: {
    width:
      38,
    height:
      38,
    display:
      "grid",
    placeItems:
      "center",
    border:
      "1px solid #dce5ef",
    borderRadius:
      10,
    background:
      "#ffffff",
    color:
      "#53677f",
    cursor:
      "pointer",
  },

  errorBox: {
    marginBottom:
      18,
    padding:
      "12px 14px",
    display:
      "flex",
    alignItems:
      "flex-start",
    gap:
      10,
    border:
      "1px solid #fecaca",
    borderRadius:
      12,
    background:
      "#fef2f2",
    color:
      "#b91c1c",
    fontSize:
      12,
    lineHeight:
      1.55,
  },

  form: {
    display:
      "grid",
    gap:
      22,
  },

  posterSection: {
    display:
      "grid",
    gridTemplateColumns:
      "minmax(240px, 340px) minmax(0, 1fr)",
    gap:
      20,
    alignItems:
      "stretch",
    padding:
      18,
    border:
      "1px solid #dce8f6",
    borderRadius:
      15,
    background:
      "#f8fbff",
  },

  posterPreviewWrap: {
    position:
      "relative",
    width:
      "100%",
    aspectRatio:
      "16 / 9",
    overflow:
      "hidden",
    border:
      "1px solid #d7e3f0",
    borderRadius:
      12,
    background:
      "#ffffff",
  },

  posterImage: {
    width:
      "100%",
    height:
      "100%",
    objectFit:
      "contain",
    background:
      "#ffffff",
  },

  posterEmpty: {
    width:
      "100%",
    height:
      "100%",
    minHeight:
      170,
    display:
      "flex",
    flexDirection:
      "column",
    alignItems:
      "center",
    justifyContent:
      "center",
    gap:
      7,
    color:
      "#7790aa",
    textAlign:
      "center",
  },

  posterActions: {
    display:
      "flex",
    flexDirection:
      "column",
    justifyContent:
      "center",
    gap:
      13,
  },

  posterTitle: {
    color:
      "#1b3454",
    fontSize:
      14,
  },

  posterHelp: {
    margin:
      "6px 0 0",
    maxWidth:
      560,
    color:
      "#71849a",
    fontSize:
      11,
    lineHeight:
      1.65,
  },

  posterButtons: {
    display:
      "flex",
    alignItems:
      "center",
    flexWrap:
      "wrap",
    gap:
      9,
  },

  uploadButton: {
    minHeight:
      39,
    padding:
      "0 13px",
    display:
      "inline-flex",
    alignItems:
      "center",
    gap:
      8,
    border:
      "1px solid #2d6fc2",
    borderRadius:
      9,
    background:
      "#edf5ff",
    color:
      "#1d5fab",
    fontSize:
      11,
    fontWeight:
      800,
    cursor:
      "pointer",
  },

  secondaryButton: {
    minHeight:
      39,
    padding:
      "0 13px",
    border:
      "1px solid #d4dfeb",
    borderRadius:
      9,
    background:
      "#ffffff",
    color:
      "#52667e",
    fontSize:
      11,
    fontWeight:
      700,
    cursor:
      "pointer",
  },

  fileName: {
    color:
      "#52708f",
    fontSize:
      10,
  },

  grid: {
    display:
      "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap:
      16,
  },

  fullWidth: {
    gridColumn:
      "1 / -1",
  },

  field: {
    minWidth:
      0,
    display:
      "grid",
    gap:
      7,
  },

  label: {
    color:
      "#344b66",
    fontSize:
      11,
    fontWeight:
      800,
  },

  required: {
    marginLeft:
      4,
    color:
      "#dc2626",
  },

  input: {
    width:
      "100%",
    minHeight:
      43,
    padding:
      "10px 12px",
    border:
      "1px solid #ccd9e8",
    borderRadius:
      10,
    outline:
      "none",
    background:
      "#ffffff",
    color:
      "#172b46",
    fontSize:
      12,
    boxSizing:
      "border-box",
  },

  footer: {
    paddingTop:
      18,
    display:
      "flex",
    justifyContent:
      "flex-end",
    alignItems:
      "center",
    gap:
      10,
    borderTop:
      "1px solid #e7eef6",
  },

  cancelButton: {
    minHeight:
      42,
    padding:
      "0 17px",
    border:
      "1px solid #d4dfeb",
    borderRadius:
      10,
    background:
      "#ffffff",
    color:
      "#52667e",
    fontSize:
      11,
    fontWeight:
      800,
    cursor:
      "pointer",
  },

  saveButton: {
    minHeight:
      42,
    padding:
      "0 17px",
    display:
      "inline-flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    gap:
      8,
    border:
      0,
    borderRadius:
      10,
    background:
      "#2167bd",
    color:
      "#ffffff",
    fontSize:
      11,
    fontWeight:
      800,
    cursor:
      "pointer",
  },

  disabledButton: {
    opacity:
      0.6,
    cursor:
      "not-allowed",
  },
};

export default CreateActivityForm;