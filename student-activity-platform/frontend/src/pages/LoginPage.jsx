import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  login,
} from "../services/auth";


function LoginPage({
  onLoggedIn,
}) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedUsername =
      username.trim();

    if (
      !normalizedUsername
      || !password
    ) {
      setError(
        "Vui lòng nhập tên đăng nhập và mật khẩu."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result =
        await login(
          normalizedUsername,
          password
        );

      onLoggedIn?.(
        result?.user || null
      );
    } catch (loginError) {
      setError(
        loginError?.message
        || "Không thể đăng nhập."
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div
      className="sap-login-page"
      style={styles.page}
    >
      <style>
        {`
          @media (max-width: 860px) {
            .sap-login-card {
              grid-template-columns: 1fr !important;
              width: min(620px, 100%) !important;
            }

            .sap-login-brand-panel {
              min-height: 360px !important;
            }

            .sap-login-form-panel {
              padding: 36px 28px !important;
            }
          }

          @media (max-width: 560px) {
            .sap-login-page {
              padding: 14px !important;
            }

            .sap-login-card {
              border-radius: 22px !important;
            }

            .sap-login-brand-panel {
              min-height: auto !important;
              padding: 30px 24px !important;
            }

            .sap-login-form-panel {
              padding: 30px 22px !important;
            }
          }
        `}
      </style>

      <div style={styles.backgroundOrbOne} />
      <div style={styles.backgroundOrbTwo} />

      <main
        className="sap-login-card"
        style={styles.card}
      >
        <section
          className="sap-login-brand-panel"
          style={styles.brandPanel}
        >
          <div style={styles.logoWrap}>
            <img
              src="/images/logos/huflit-logo.png"
              alt="HUFLIT"
              style={styles.logo}
            />
          </div>

          <span style={styles.overline}>
            ĐOÀN KHOA CÔNG NGHỆ THÔNG TIN
          </span>

          <h1 style={styles.brandTitle}>
            <span style={styles.titleLine}>
              Student Activity
            </span>
            <span style={styles.titleLine}>
              Management
            </span>
            <span style={styles.titleLine}>
              Platform
            </span>
          </h1>

          <div style={styles.roleList}>
            <div style={styles.roleItem}>
              <span style={styles.roleIcon}>
                <UserRound size={18} />
              </span>

              <div style={styles.roleText}>
                <strong style={styles.roleTitle}>
                  Sinh viên
                </strong>

                <small style={styles.roleDescription}>
                  Đăng nhập bằng MSSV
                </small>
              </div>
            </div>

            <div style={styles.roleItem}>
              <span style={styles.roleIcon}>
                <ShieldCheck size={18} />
              </span>

              <div style={styles.roleText}>
                <strong style={styles.roleTitle}>
                  Quản trị viên
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="sap-login-form-panel"
          style={styles.formPanel}
        >
          <div style={styles.formHeader}>
            <div style={styles.loginIcon}>
              <LogIn size={22} />
            </div>

            <div style={styles.headerCopy}>
              <span style={styles.formOverline}>
                ĐĂNG NHẬP HỆ THỐNG
              </span>

              <h2 style={styles.formTitle}>
                Chào mừng trở lại
              </h2>

              <p style={styles.formDescription}>
                Sinh viên sử dụng MSSV làm tên đăng nhập.
                ADMIN sử dụng tài khoản quản trị do hệ thống cấp.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >
            <label style={styles.field}>
              <span style={styles.label}>
                Tên đăng nhập
              </span>

              <div style={styles.inputWrap}>
                <UserRound
                  size={18}
                  color="#64748b"
                />

                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  autoComplete="username"
                  placeholder="MSSV hoặc tài khoản ADMIN"
                  style={styles.input}
                  disabled={submitting}
                />
              </div>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Mật khẩu
              </span>

              <div style={styles.inputWrap}>
                <LockKeyhole
                  size={18}
                  color="#64748b"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  style={styles.input}
                  disabled={submitting}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  style={styles.eyeButton}
                  aria-label={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                  title={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <div
                style={styles.errorBox}
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submit,
                ...(
                  submitting
                    ? styles.submitDisabled
                    : {}
                ),
              }}
            >
              <LogIn size={18} />

              {submitting
                ? "Đang đăng nhập..."
                : "Đăng nhập"}
            </button>
          </form>

          <div style={styles.noteBox}>
            <strong style={styles.noteTitle}>
              Lần đăng nhập đầu tiên
            </strong>

            <span style={styles.noteText}>
              Tài khoản sử dụng mật khẩu tạm sẽ được yêu cầu
              đổi sang mật khẩu mới trước khi tiếp tục sử dụng hệ thống.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    background:
      "linear-gradient(135deg, #eef5ff 0%, #f8fafc 50%, #eef2ff 100%)",
  },

  backgroundOrbOne: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: "50%",
    top: -190,
    right: -120,
    background:
      "rgba(37, 99, 235, 0.11)",
    filter: "blur(10px)",
    pointerEvents: "none",
  },

  backgroundOrbTwo: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: "50%",
    bottom: -190,
    left: -110,
    background:
      "rgba(79, 70, 229, 0.09)",
    filter: "blur(12px)",
    pointerEvents: "none",
  },

  card: {
    width: "min(980px, 100%)",
    minHeight: 610,
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 0.92fr) minmax(0, 1.08fr)",
    overflow: "hidden",
    border:
      "1px solid rgba(203, 213, 225, 0.9)",
    borderRadius: 28,
    background: "#ffffff",
    boxShadow:
      "0 30px 80px rgba(15, 23, 42, 0.14)",
  },

  brandPanel: {
    padding: "44px 38px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#ffffff",
    background:
      "linear-gradient(155deg, #1647aa 0%, #2457d6 52%, #4338ca 100%)",
  },

  logoWrap: {
    width: 72,
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    background: "#ffffff",
    boxShadow:
      "0 14px 30px rgba(15, 23, 42, 0.20)",
  },

  logo: {
    width: 55,
    height: 55,
    objectFit: "contain",
  },

  overline: {
    marginTop: 26,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.9px",
    lineHeight: 1.5,
    color: "#dbeafe",
  },

  brandTitle: {
    margin: "12px 0 0",
    fontSize: 35,
    lineHeight: 1.08,
    letterSpacing: "-0.6px",
  },

  titleLine: {
    display: "block",
  },

  roleList: {
    marginTop: 46,
    display: "grid",
    gap: 12,
  },

  roleItem: {
    minHeight: 68,
    padding: "13px 15px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    border:
      "1px solid rgba(255,255,255,0.20)",
    borderRadius: 15,
    background:
      "rgba(255,255,255,0.09)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.05)",
  },

  roleIcon: {
    width: 36,
    height: 36,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    background:
      "rgba(255,255,255,0.12)",
  },

  roleText: {
    minWidth: 0,
    display: "grid",
    gap: 5,
  },

  roleTitle: {
    display: "block",
    fontSize: 15,
    lineHeight: 1.25,
    fontWeight: 800,
    color: "#ffffff",
  },

  roleDescription: {
    display: "block",
    fontSize: 12,
    lineHeight: 1.45,
    color: "#dbeafe",
  },

  formPanel: {
    padding: "46px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.98)",
  },

  formHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },

  headerCopy: {
    minWidth: 0,
  },

  loginIcon: {
    width: 44,
    height: 44,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    background: "#dbeafe",
    color: "#2563eb",
  },

  formOverline: {
    display: "block",
    fontSize: 10,
    fontWeight: 800,
    color: "#2563eb",
    letterSpacing: "1.25px",
    lineHeight: 1.4,
  },

  formTitle: {
    margin: "6px 0 7px",
    color: "#0f172a",
    fontSize: 29,
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
  },

  formDescription: {
    margin: 0,
    maxWidth: 430,
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.65,
  },

  form: {
    marginTop: 30,
    display: "grid",
    gap: 17,
  },

  field: {
    display: "grid",
    gap: 7,
  },

  label: {
    color: "#334155",
    fontSize: 11,
    fontWeight: 800,
  },

  inputWrap: {
    minHeight: 51,
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    background: "#f8fafc",
    boxShadow:
      "0 1px 2px rgba(15, 23, 42, 0.03)",
  },

  input: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "inherit",
  },

  eyeButton: {
    width: 34,
    height: 34,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "none",
    borderRadius: 9,
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
  },

  errorBox: {
    padding: "11px 13px",
    border: "1px solid #fecaca",
    borderRadius: 10,
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 11,
    lineHeight: 1.55,
  },

  submit: {
    minHeight: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    borderRadius: 12,
    background:
      "linear-gradient(135deg, #2563eb 0%, #2f67e9 100%)",
    boxShadow:
      "0 10px 24px rgba(37, 99, 235, 0.22)",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 800,
    fontFamily: "inherit",
    cursor: "pointer",
  },

  submitDisabled: {
    opacity: 0.62,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  noteBox: {
    marginTop: 21,
    padding: "13px 14px",
    display: "grid",
    gap: 5,
    border: "1px solid #fde68a",
    borderRadius: 12,
    background: "#fffbeb",
  },

  noteTitle: {
    display: "block",
    color: "#92400e",
    fontSize: 11,
    lineHeight: 1.4,
  },

  noteText: {
    display: "block",
    color: "#a16207",
    fontSize: 11,
    lineHeight: 1.55,
  },
};


export default LoginPage;
