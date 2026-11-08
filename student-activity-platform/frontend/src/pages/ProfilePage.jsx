import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeCheck,
  Camera,
  KeyRound,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  getCurrentUser,
  resolveBackendUrl,
  subscribeAuthChange,
  updateProfile,
  uploadAvatar,
} from "../services/auth";

import {
  roleLabel,
} from "../config/permissions";


function ProfilePage({
  onRequestPasswordChange,
}) {
  const [user, setUser] =
    useState(() =>
      getCurrentUser()
    );

  const [email, setEmail] =
    useState(
      user?.email || ""
    );

  const [phone, setPhone] =
    useState(
      user?.phone || ""
    );

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState(null);


  useEffect(() => {
    return subscribeAuthChange(
      (nextUser) => {
        setUser(nextUser);
        setEmail(
          nextUser?.email || ""
        );
        setPhone(
          nextUser?.phone || ""
        );
      }
    );
  }, []);


  const avatarUrl =
    useMemo(
      () =>
        resolveBackendUrl(
          user?.avatar_url
        ),
      [user?.avatar_url]
    );


  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage(null);

      const result =
        await updateProfile({
          email,
          phone,
        });

      setMessage({
        type: "success",
        text:
          result?.message
          || "Đã cập nhật hồ sơ.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.message
          || "Không thể cập nhật hồ sơ.",
      });
    } finally {
      setSaving(false);
    }
  }


  async function handleAvatarChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      const result =
        await uploadAvatar(file);

      setMessage({
        type: "success",
        text:
          result?.message
          || "Đã cập nhật ảnh đại diện.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.message
          || "Không thể tải ảnh đại diện.",
      });
    } finally {
      setUploading(false);
    }
  }


  if (!user) {
    return null;
  }


  return (
    <div style={styles.page}>
      <section style={styles.heroCard}>
        <div style={styles.avatarWrap}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.full_name}
              style={styles.avatarImage}
            />
          ) : (
            <div style={styles.avatarFallback}>
              {getInitials(
                user.full_name,
                user.role
              )}
            </div>
          )}

          <label style={styles.cameraButton}>
            <Camera size={15} />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div style={styles.heroCopy}>
          <span style={styles.overline}>
            HỒ SƠ CÁ NHÂN
          </span>

          <h2 style={styles.title}>
            {user.full_name || user.username}
          </h2>

          <div style={styles.badges}>
            <span style={styles.roleBadge}>
              <ShieldCheck size={14} />
              {roleLabel(user.role)}
            </span>

            {user.mssv && (
              <span style={styles.idBadge}>
                MSSV: {user.mssv}
              </span>
            )}
          </div>

          <p style={styles.heroDescription}>
            Ảnh đại diện, email và số điện thoại
            có thể cập nhật tại đây. MSSV, họ tên,
            lớp và khóa là dữ liệu định danh nên
            không chỉnh trực tiếp trên hồ sơ.
          </p>
        </div>
      </section>

      {message && (
        <div
          style={
            message.type === "success"
              ? styles.success
              : styles.error
          }
        >
          {message.text}
        </div>
      )}

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              <UserRound size={19} />
            </div>

            <div>
              <strong>
                Thông tin tài khoản
              </strong>
              <span>
                Dữ liệu định danh của người dùng
              </span>
            </div>
          </div>

          <div style={styles.infoGrid}>
            <ReadOnlyField
              label="Tên đăng nhập"
              value={user.username}
            />
            <ReadOnlyField
              label="Vai trò"
              value={roleLabel(user.role)}
            />
            <ReadOnlyField
              label="MSSV"
              value={user.mssv || "—"}
            />
            <ReadOnlyField
              label="Lớp"
              value={user.class_name || "—"}
            />
            <ReadOnlyField
              label="Khóa"
              value={user.cohort || "—"}
            />
            <ReadOnlyField
              label="Trạng thái"
              value="Đang hoạt động"
            />
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIconPurple}>
              <BadgeCheck size={19} />
            </div>

            <div>
              <strong>
                Liên hệ & bảo mật
              </strong>
              <span>
                Cập nhật thông tin cá nhân
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            style={styles.form}
          >
            <label style={styles.field}>
              <span style={styles.label}>
                Email
              </span>

              <div style={styles.inputWrap}>
                <Mail
                  size={17}
                  color="#64748b"
                />
                <input
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  type="email"
                  placeholder="Email liên hệ"
                  style={styles.input}
                />
              </div>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Số điện thoại
              </span>

              <div style={styles.inputWrap}>
                <Phone
                  size={17}
                  color="#64748b"
                />
                <input
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="Số điện thoại"
                  style={styles.input}
                />
              </div>
            </label>

            <div style={styles.actionRow}>
              <button
                type="submit"
                disabled={saving}
                style={styles.primaryButton}
              >
                <Save size={16} />
                {saving
                  ? "Đang lưu..."
                  : "Lưu thay đổi"}
              </button>

              <button
                type="button"
                onClick={onRequestPasswordChange}
                style={styles.secondaryButton}
              >
                <KeyRound size={16} />
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}


function ReadOnlyField({
  label,
  value,
}) {
  return (
    <div style={styles.readOnlyField}>
      <span>
        {label}
      </span>
      <strong>
        {value}
      </strong>
    </div>
  );
}


function getInitials(
  name,
  role
) {
  const words =
    String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (words.length >= 2) {
    return (
      words[0][0]
      + words[words.length - 1][0]
    ).toUpperCase();
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return role === "ADMIN"
    ? "AD"
    : "SV";
}


const styles = {
  page: {
    display: "grid",
    gap: 18,
  },

  heroCard: {
    padding: 24,
    display: "flex",
    alignItems: "center",
    gap: 22,
    border: "1px solid #dbe5f1",
    borderRadius: 20,
    background:
      "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
    boxShadow:
      "0 10px 28px rgba(15, 23, 42, 0.06)",
  },

  avatarWrap: {
    width: 112,
    height: 112,
    position: "relative",
    flexShrink: 0,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 28,
    border: "4px solid #ffffff",
    boxShadow:
      "0 10px 24px rgba(15, 23, 42, 0.12)",
  },

  avatarFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    border: "4px solid #ffffff",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 30,
    fontWeight: 850,
    boxShadow:
      "0 10px 24px rgba(15, 23, 42, 0.12)",
  },

  cameraButton: {
    width: 36,
    height: 36,
    position: "absolute",
    right: -4,
    bottom: -4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #ffffff",
    borderRadius: "50%",
    background: "#0f172a",
    color: "#ffffff",
    cursor: "pointer",
  },

  heroCopy: {
    minWidth: 0,
  },

  overline: {
    color: "#2563eb",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  title: {
    margin: "5px 0 8px",
    color: "#0f172a",
    fontSize: 28,
  },

  badges: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  roleBadge: {
    minHeight: 28,
    padding: "0 10px",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 10,
    fontWeight: 800,
  },

  idBadge: {
    minHeight: 28,
    padding: "0 10px",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 10,
    fontWeight: 750,
  },

  heroDescription: {
    maxWidth: 650,
    margin: "11px 0 0",
    color: "#64748b",
    fontSize: 11.5,
    lineHeight: 1.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },

  card: {
    padding: 22,
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#ffffff",
    boxShadow:
      "0 8px 22px rgba(15, 23, 42, 0.05)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    background: "#dbeafe",
    color: "#2563eb",
  },

  sectionIconPurple: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    background: "#ede9fe",
    color: "#7c3aed",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },

  readOnlyField: {
    minHeight: 66,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
    border: "1px solid #e2e8f0",
    borderRadius: 11,
    background: "#f8fafc",
    color: "#64748b",
    fontSize: 10,
  },

  form: {
    display: "grid",
    gap: 14,
  },

  field: {
    display: "grid",
    gap: 7,
  },

  label: {
    color: "#334155",
    fontSize: 10.5,
    fontWeight: 750,
  },

  inputWrap: {
    minHeight: 46,
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    background: "#f8fafc",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: 12,
  },

  actionRow: {
    marginTop: 4,
    display: "flex",
    gap: 9,
    flexWrap: "wrap",
  },

  primaryButton: {
    minHeight: 40,
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "none",
    borderRadius: 9,
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 10.5,
    fontWeight: 750,
    cursor: "pointer",
  },

  secondaryButton: {
    minHeight: 40,
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    background: "#ffffff",
    color: "#334155",
    fontSize: 10.5,
    fontWeight: 750,
    cursor: "pointer",
  },

  success: {
    padding: 12,
    border: "1px solid #a7f3d0",
    borderRadius: 10,
    background: "#ecfdf5",
    color: "#047857",
    fontSize: 11,
  },

  error: {
    padding: 12,
    border: "1px solid #fecaca",
    borderRadius: 10,
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 11,
  },
};


export default ProfilePage;
