import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  changePassword,
} from "../services/auth";


function ChangePasswordPage({
  user,
  onChanged,
}) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !currentPassword
      || !newPassword
      || !confirmPassword
    ) {
      setError(
        "Vui lòng nhập đầy đủ các trường mật khẩu."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Xác nhận mật khẩu mới không khớp."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await changePassword(
          currentPassword,
          newPassword
        );

      onChanged?.(
        result?.user || null
      );
    } catch (changeError) {
      setError(
        changeError?.message
        || "Không thể đổi mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div style={styles.page}>
      <main style={styles.card}>
        <div style={styles.icon}>
          <ShieldCheck size={28} />
        </div>

        <span style={styles.overline}>
          BẢO MẬT TÀI KHOẢN
        </span>

        <h1 style={styles.title}>
          Đổi mật khẩu lần đầu
        </h1>

        <p style={styles.description}>
          Tài khoản <strong>{user?.username}</strong>
          {" "}đang sử dụng mật khẩu tạm.
          Bạn cần tạo mật khẩu riêng trước khi
          truy cập hệ thống.
        </p>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <PasswordField
            label="Mật khẩu tạm hiện tại"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showPassword}
            disabled={loading}
          />

          <PasswordField
            label="Mật khẩu mới"
            value={newPassword}
            onChange={setNewPassword}
            show={showPassword}
            disabled={loading}
          />

          <PasswordField
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showPassword}
            disabled={loading}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (value) => !value
              )
            }
            style={styles.showButton}
          >
            {showPassword
              ? <EyeOff size={16} />
              : <Eye size={16} />}
            {showPassword
              ? "Ẩn mật khẩu"
              : "Hiện mật khẩu"}
          </button>

          <div style={styles.rules}>
            <strong>
              Mật khẩu mới cần có:
            </strong>
            <span>
              Tối thiểu 8 ký tự, có chữ hoa,
              chữ thường, số và ký tự đặc biệt.
            </span>
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submit,
              ...(
                loading
                  ? styles.disabled
                  : {}
              ),
            }}
          >
            <KeyRound size={17} />
            {loading
              ? "Đang cập nhật..."
              : "Đổi mật khẩu và tiếp tục"}
          </button>
        </form>
      </main>
    </div>
  );
}


function PasswordField({
  label,
  value,
  onChange,
  show,
  disabled,
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>
        {label}
      </span>

      <div style={styles.inputWrap}>
        <LockKeyhole
          size={17}
          color="#64748b"
        />

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          disabled={disabled}
          autoComplete="new-password"
          style={styles.input}
        />
      </div>
    </label>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    background:
      "linear-gradient(135deg, #eff6ff, #f8fafc, #eef2ff)",
  },

  card: {
    width: "min(540px, 100%)",
    padding: "38px 40px",
    border: "1px solid #dbe5f1",
    borderRadius: 24,
    background: "#ffffff",
    boxShadow:
      "0 24px 64px rgba(15, 23, 42, 0.12)",
  },

  icon: {
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    background: "#dbeafe",
    color: "#2563eb",
  },

  overline: {
    display: "block",
    marginTop: 18,
    color: "#2563eb",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "1.4px",
  },

  title: {
    margin: "6px 0 9px",
    color: "#0f172a",
    fontSize: 28,
  },

  description: {
    margin: 0,
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.65,
  },

  form: {
    marginTop: 26,
    display: "grid",
    gap: 15,
  },

  field: {
    display: "grid",
    gap: 7,
  },

  label: {
    color: "#334155",
    fontSize: 11,
    fontWeight: 750,
  },

  inputWrap: {
    minHeight: 48,
    padding: "0 13px",
    display: "flex",
    alignItems: "center",
    gap: 9,
    border: "1px solid #cbd5e1",
    borderRadius: 11,
    background: "#f8fafc",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
  },

  showButton: {
    width: "fit-content",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },

  rules: {
    padding: 12,
    display: "grid",
    gap: 3,
    border: "1px solid #bfdbfe",
    borderRadius: 11,
    background: "#eff6ff",
    color: "#1e40af",
    fontSize: 10.5,
    lineHeight: 1.5,
  },

  error: {
    padding: 12,
    border: "1px solid #fecaca",
    borderRadius: 11,
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 11,
  },

  submit: {
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    borderRadius: 11,
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 11.5,
    fontWeight: 800,
    cursor: "pointer",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};


export default ChangePasswordPage;
