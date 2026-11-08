import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Ban,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserRoundCog,
  Users,
  X,
} from "lucide-react";

import {
  getStudentAccounts,
  resetStudentTemporaryPassword,
  setStudentAccountStatus,
  syncStudentAccounts,
} from "../services/adminUsers";


function formatDateTime(value) {
  if (!value) {
    return "Chưa đăng nhập";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  ).format(date);
}


function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
}) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryIcon}>
        <Icon size={20} />
      </div>

      <div>
        <span style={styles.summaryLabel}>
          {label}
        </span>

        <strong style={styles.summaryValue}>
          {value}
        </strong>

        <small style={styles.summaryHelper}>
          {helper}
        </small>
      </div>
    </div>
  );
}


function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    initial_password: 0,
    logged_in: 0,
  });

  const [searchInput, setSearchInput] =
    useState("");
  const [search, setSearch] =
    useState("");
  const [status, setStatus] =
    useState("ALL");
  const [passwordState, setPasswordState] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);
  const [busyUser, setBusyUser] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [error, setError] =
    useState("");

  const [resetTarget, setResetTarget] =
    useState(null);
  const [temporaryPassword, setTemporaryPassword] =
    useState("");


  const loadAccounts = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getStudentAccounts({
            search,
            status,
            passwordState,
          });

        setRows(
          Array.isArray(result?.data)
            ? result.data
            : []
        );

        setSummary(
          result?.summary || {
            total: 0,
            active: 0,
            inactive: 0,
            initial_password: 0,
            logged_in: 0,
          }
        );
      } catch (loadError) {
        setError(
          loadError?.message
          || "Không thể tải danh sách tài khoản."
        );
      } finally {
        setLoading(false);
      }
    },
    [search, status, passwordState]
  );


  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);


  const visibleCount = useMemo(
    () => rows.length,
    [rows]
  );


  function submitSearch(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }


  async function handleToggleStatus(user) {
    const nextActive = !user.is_active;

    const confirmed = window.confirm(
      nextActive
        ? `Mở khóa tài khoản ${user.username}?`
        : (
            `Khóa tài khoản ${user.username}? `
            + "Sinh viên sẽ bị đăng xuất khỏi các phiên hiện tại."
          )
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyUser(user.username);
      setError("");
      setMessage("");

      const result =
        await setStudentAccountStatus(
          user.username,
          nextActive
        );

      setMessage(
        result?.message
        || "Đã cập nhật trạng thái tài khoản."
      );

      await loadAccounts();
    } catch (statusError) {
      setError(
        statusError?.message
        || "Không thể cập nhật tài khoản."
      );
    } finally {
      setBusyUser("");
    }
  }


  async function handleResetPassword(event) {
    event.preventDefault();

    if (!resetTarget) {
      return;
    }

    try {
      setBusyUser(resetTarget.username);
      setError("");
      setMessage("");

      const result =
        await resetStudentTemporaryPassword(
          resetTarget.username,
          temporaryPassword
        );

      setMessage(
        result?.message
        || "Đã đặt lại mật khẩu tạm."
      );

      setResetTarget(null);
      setTemporaryPassword("");

      await loadAccounts();
    } catch (resetError) {
      setError(
        resetError?.message
        || "Không thể đặt lại mật khẩu."
      );
    } finally {
      setBusyUser("");
    }
  }


  async function handleSync() {
    const confirmed = window.confirm(
      "Đồng bộ các tài khoản sinh viên còn thiếu từ dữ liệu sinh viên hiện có?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyUser("__SYNC__");
      setError("");
      setMessage("");

      const result =
        await syncStudentAccounts();

      setMessage(
        `${result?.message || "Đồng bộ thành công."} `
        + `Tạo mới: ${result?.created ?? 0}.`
      );

      await loadAccounts();
    } catch (syncError) {
      setError(
        syncError?.message
        || "Không thể đồng bộ tài khoản."
      );
    } finally {
      setBusyUser("");
    }
  }


  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroIcon}>
          <UserRoundCog size={28} />
        </div>

        <div style={{ flex: 1 }}>
          <span style={styles.eyebrow}>
            QUẢN TRỊ HỆ THỐNG
          </span>

          <h2 style={styles.title}>
            Tài khoản sinh viên
          </h2>

          <p style={styles.description}>
            Theo dõi trạng thái tài khoản,
            khóa hoặc mở khóa và cấp lại mật khẩu tạm.
            ADMIN không xem được mật khẩu hiện tại của sinh viên.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={busyUser === "__SYNC__"}
          style={styles.syncButton}
        >
          <RefreshCw
            size={16}
            className={
              busyUser === "__SYNC__"
                ? "spin"
                : ""
            }
          />
          Đồng bộ tài khoản
        </button>
      </section>

      <section style={styles.summaryGrid}>
        <SummaryCard
          icon={Users}
          label="Tổng tài khoản"
          value={summary.total}
          helper="Sinh viên trong hệ thống"
        />

        <SummaryCard
          icon={UserCheck}
          label="Đang hoạt động"
          value={summary.active}
          helper="Có thể đăng nhập"
        />

        <SummaryCard
          icon={Ban}
          label="Đang khóa"
          value={summary.inactive}
          helper="Không thể đăng nhập"
        />

        <SummaryCard
          icon={KeyRound}
          label="Chưa đổi mật khẩu"
          value={summary.initial_password}
          helper={`Đã từng đăng nhập: ${summary.logged_in}`}
        />
      </section>

      {(message || error) && (
        <div
          style={
            error
              ? styles.errorBox
              : styles.successBox
          }
        >
          {error || message}
        </div>
      )}

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <strong style={styles.panelTitle}>
              Danh sách tài khoản
            </strong>

            <span style={styles.panelSubtitle}>
              Đang hiển thị {visibleCount} tài khoản
            </span>
          </div>

          <button
            type="button"
            onClick={loadAccounts}
            style={styles.refreshButton}
          >
            <RefreshCw size={15} />
            Làm mới
          </button>
        </div>

        <form
          onSubmit={submitSearch}
          style={styles.filters}
        >
          <div style={styles.searchWrap}>
            <Search size={17} />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Tìm theo MSSV, họ tên, lớp hoặc email..."
              style={styles.searchInput}
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>
            <option value="ACTIVE">
              Đang hoạt động
            </option>
            <option value="INACTIVE">
              Đang khóa
            </option>
          </select>

          <select
            value={passwordState}
            onChange={(event) =>
              setPasswordState(event.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              Tất cả mật khẩu
            </option>
            <option value="INITIAL">
              Chưa đổi mật khẩu lần đầu
            </option>
            <option value="CHANGED">
              Đã đổi mật khẩu
            </option>
          </select>

          <button
            type="submit"
            style={styles.searchButton}
          >
            Tìm kiếm
          </button>
        </form>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Sinh viên</th>
                <th style={styles.th}>Lớp / Khóa</th>
                <th style={styles.th}>Tài khoản</th>
                <th style={styles.th}>Đăng nhập gần nhất</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>
                    Đang tải danh sách tài khoản...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>
                    Không tìm thấy tài khoản phù hợp.
                  </td>
                </tr>
              ) : (
                rows.map((user) => (
                  <tr key={user.username}>
                    <td style={styles.td}>
                      <strong style={styles.studentName}>
                        {user.full_name || "Sinh viên"}
                      </strong>
                      <span style={styles.mutedText}>
                        {user.mssv || user.username}
                      </span>
                      {user.email && (
                        <span style={styles.smallText}>
                          {user.email}
                        </span>
                      )}
                    </td>

                    <td style={styles.td}>
                      <strong>
                        {user.class_name || "—"}
                      </strong>
                      <span style={styles.mutedText}>
                        Khóa {user.cohort || "—"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          user.is_active
                            ? styles.activeBadge
                            : styles.lockedBadge
                        }
                      >
                        {user.is_active
                          ? "Đang hoạt động"
                          : "Đang khóa"}
                      </span>

                      <span
                        style={
                          user.must_change_password
                            ? styles.initialBadge
                            : styles.changedBadge
                        }
                      >
                        {user.must_change_password
                          ? "Chưa đổi mật khẩu"
                          : "Đã đổi mật khẩu"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.dateText}>
                        {formatDateTime(user.last_login_at)}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          type="button"
                          disabled={busyUser === user.username}
                          onClick={() => {
                            setResetTarget(user);
                            setTemporaryPassword("");
                            setError("");
                            setMessage("");
                          }}
                          style={styles.resetButton}
                        >
                          <KeyRound size={14} />
                          Reset mật khẩu
                        </button>

                        <button
                          type="button"
                          disabled={busyUser === user.username}
                          onClick={() =>
                            handleToggleStatus(user)
                          }
                          style={
                            user.is_active
                              ? styles.lockButton
                              : styles.unlockButton
                          }
                        >
                          {user.is_active ? (
                            <Ban size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {user.is_active
                            ? "Khóa"
                            : "Mở khóa"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {resetTarget && (
        <div style={styles.modalBackdrop}>
          <form
            onSubmit={handleResetPassword}
            style={styles.modal}
          >
            <button
              type="button"
              onClick={() => {
                setResetTarget(null);
                setTemporaryPassword("");
              }}
              style={styles.modalClose}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div style={styles.modalIcon}>
              <ShieldCheck size={24} />
            </div>

            <span style={styles.eyebrow}>
              RESET MẬT KHẨU
            </span>

            <h3 style={styles.modalTitle}>
              {resetTarget.full_name || resetTarget.username}
            </h3>

            <p style={styles.modalDescription}>
              MSSV: <strong>{resetTarget.mssv || resetTarget.username}</strong>.
              Mật khẩu hiện tại sẽ bị thay thế, toàn bộ phiên đăng nhập cũ bị thu hồi
              và sinh viên phải đổi mật khẩu ở lần đăng nhập tiếp theo.
            </p>

            <label style={styles.field}>
              <span>Mật khẩu tạm mới</span>
              <input
                type="password"
                value={temporaryPassword}
                onChange={(event) =>
                  setTemporaryPassword(event.target.value)
                }
                placeholder="Ít nhất 8 ký tự, có hoa/thường/số/ký tự đặc biệt"
                autoComplete="new-password"
                required
                minLength={8}
                style={styles.input}
              />
            </label>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setResetTarget(null);
                  setTemporaryPassword("");
                }}
                style={styles.cancelButton}
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={busyUser === resetTarget.username}
                style={styles.confirmButton}
              >
                <KeyRound size={15} />
                {busyUser === resetTarget.username
                  ? "Đang reset..."
                  : "Xác nhận reset"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


const styles = {
  page: {
    padding: "28px 0 40px",
    display: "grid",
    gap: 20,
  },
  hero: {
    padding: 24,
    display: "flex",
    gap: 16,
    alignItems: "center",
    border: "1px solid #dce8f6",
    borderRadius: 18,
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(35,72,123,0.07)",
  },
  heroIcon: {
    width: 54,
    height: 54,
    flex: "0 0 54px",
    display: "grid",
    placeItems: "center",
    borderRadius: 15,
    background: "#e7f1ff",
    color: "#2268bf",
  },
  eyebrow: {
    color: "#2167bd",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.12em",
  },
  title: {
    margin: "5px 0",
    color: "#172b46",
    fontSize: 26,
  },
  description: {
    margin: 0,
    maxWidth: 760,
    color: "#6a7c92",
    fontSize: 12,
    lineHeight: 1.7,
  },
  syncButton: {
    minHeight: 42,
    padding: "0 15px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #2c6fbd",
    borderRadius: 10,
    background: "#eff6ff",
    color: "#1f61ac",
    fontSize: 11,
    fontWeight: 800,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },
  summaryCard: {
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 13,
    border: "1px solid #dfe9f5",
    borderRadius: 15,
    background: "#ffffff",
    boxShadow: "0 7px 20px rgba(35,72,123,0.05)",
  },
  summaryIcon: {
    width: 42,
    height: 42,
    flex: "0 0 42px",
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#e8f2ff",
    color: "#2268bf",
  },
  summaryLabel: {
    display: "block",
    color: "#6f8094",
    fontSize: 10,
    fontWeight: 700,
  },
  summaryValue: {
    display: "block",
    marginTop: 3,
    color: "#172b46",
    fontSize: 24,
  },
  summaryHelper: {
    display: "block",
    marginTop: 2,
    color: "#8b9aab",
    fontSize: 9,
  },
  successBox: {
    padding: "11px 14px",
    border: "1px solid #bfe8d2",
    borderRadius: 11,
    background: "#effaf4",
    color: "#23764d",
    fontSize: 11,
  },
  errorBox: {
    padding: "11px 14px",
    border: "1px solid #fecaca",
    borderRadius: 11,
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 11,
  },
  panel: {
    overflow: "hidden",
    border: "1px solid #dce8f6",
    borderRadius: 17,
    background: "#ffffff",
    boxShadow: "0 8px 28px rgba(35,72,123,0.06)",
  },
  panelHeader: {
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderBottom: "1px solid #e6eef7",
  },
  panelTitle: {
    display: "block",
    color: "#193451",
    fontSize: 14,
  },
  panelSubtitle: {
    display: "block",
    marginTop: 3,
    color: "#7d8da0",
    fontSize: 10,
  },
  refreshButton: {
    minHeight: 36,
    padding: "0 11px",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #d5e1ee",
    borderRadius: 9,
    background: "#ffffff",
    color: "#4f6680",
    fontSize: 10,
    fontWeight: 700,
  },
  filters: {
    padding: 16,
    display: "grid",
    gridTemplateColumns: "minmax(240px, 1fr) 190px 220px auto",
    gap: 10,
    background: "#f8fbff",
    borderBottom: "1px solid #e6eef7",
  },
  searchWrap: {
    minHeight: 40,
    padding: "0 11px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #cad8e8",
    borderRadius: 9,
    background: "#ffffff",
    color: "#7890a8",
  },
  searchInput: {
    width: "100%",
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#21364f",
    fontSize: 11,
  },
  select: {
    minHeight: 40,
    padding: "0 10px",
    border: "1px solid #cad8e8",
    borderRadius: 9,
    background: "#ffffff",
    color: "#344c68",
    fontSize: 10,
  },
  searchButton: {
    minHeight: 40,
    padding: "0 16px",
    border: 0,
    borderRadius: 9,
    background: "#2167bd",
    color: "#ffffff",
    fontSize: 10,
    fontWeight: 800,
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: 950,
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 14px",
    borderBottom: "1px solid #e8eef5",
    background: "#fbfdff",
    color: "#6c7f95",
    textAlign: "left",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  td: {
    padding: "14px",
    borderBottom: "1px solid #edf2f7",
    color: "#334b65",
    fontSize: 10,
    verticalAlign: "middle",
  },
  emptyCell: {
    padding: 36,
    color: "#8191a4",
    textAlign: "center",
    fontSize: 11,
  },
  studentName: {
    display: "block",
    color: "#1b344f",
    fontSize: 11,
  },
  mutedText: {
    display: "block",
    marginTop: 3,
    color: "#71849a",
    fontSize: 10,
  },
  smallText: {
    display: "block",
    marginTop: 2,
    color: "#98a5b4",
    fontSize: 9,
  },
  activeBadge: {
    display: "block",
    width: "max-content",
    padding: "5px 8px",
    borderRadius: 999,
    background: "#e8f8ef",
    color: "#257650",
    fontSize: 9,
    fontWeight: 800,
  },
  lockedBadge: {
    display: "block",
    width: "max-content",
    padding: "5px 8px",
    borderRadius: 999,
    background: "#fdf0f0",
    color: "#b54747",
    fontSize: 9,
    fontWeight: 800,
  },
  initialBadge: {
    display: "block",
    width: "max-content",
    marginTop: 5,
    padding: "5px 8px",
    borderRadius: 999,
    background: "#fff7e6",
    color: "#9a6a18",
    fontSize: 9,
    fontWeight: 700,
  },
  changedBadge: {
    display: "block",
    width: "max-content",
    marginTop: 5,
    padding: "5px 8px",
    borderRadius: 999,
    background: "#edf4ff",
    color: "#3469a9",
    fontSize: 9,
    fontWeight: 700,
  },
  dateText: {
    color: "#5f7288",
    fontSize: 9,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
  },
  resetButton: {
    minHeight: 33,
    padding: "0 9px",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid #c9dcf2",
    borderRadius: 8,
    background: "#f2f7ff",
    color: "#285f9f",
    fontSize: 9,
    fontWeight: 700,
  },
  lockButton: {
    minHeight: 33,
    padding: "0 9px",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid #f0caca",
    borderRadius: 8,
    background: "#fff7f7",
    color: "#b24a4a",
    fontSize: 9,
    fontWeight: 700,
  },
  unlockButton: {
    minHeight: 33,
    padding: "0 9px",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid #bfe2cf",
    borderRadius: 8,
    background: "#f0faf4",
    color: "#2c7952",
    fontSize: 9,
    fontWeight: 700,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 400,
    padding: 20,
    display: "grid",
    placeItems: "center",
    background: "rgba(18, 39, 67, 0.58)",
  },
  modal: {
    position: "relative",
    width: "min(100%, 480px)",
    padding: 25,
    borderRadius: 18,
    background: "#ffffff",
    boxShadow: "0 30px 70px rgba(0,0,0,0.2)",
  },
  modalClose: {
    position: "absolute",
    right: 13,
    top: 13,
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    border: "1px solid #dce5ef",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#566a80",
  },
  modalIcon: {
    width: 48,
    height: 48,
    marginBottom: 15,
    display: "grid",
    placeItems: "center",
    borderRadius: 14,
    background: "#e8f2ff",
    color: "#2366b5",
  },
  modalTitle: {
    margin: "6px 0 8px",
    color: "#1a334e",
    fontSize: 20,
  },
  modalDescription: {
    margin: "0 0 18px",
    color: "#66798f",
    fontSize: 11,
    lineHeight: 1.7,
  },
  field: {
    display: "grid",
    gap: 7,
    color: "#344c68",
    fontSize: 10,
    fontWeight: 800,
  },
  input: {
    width: "100%",
    minHeight: 42,
    padding: "9px 11px",
    border: "1px solid #cad8e8",
    borderRadius: 9,
    outline: 0,
    boxSizing: "border-box",
    fontSize: 11,
  },
  modalActions: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
    gap: 9,
  },
  cancelButton: {
    minHeight: 39,
    padding: "0 14px",
    border: "1px solid #d4dfeb",
    borderRadius: 9,
    background: "#ffffff",
    color: "#566a80",
    fontSize: 10,
    fontWeight: 700,
  },
  confirmButton: {
    minHeight: 39,
    padding: "0 14px",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    border: 0,
    borderRadius: 9,
    background: "#2167bd",
    color: "#ffffff",
    fontSize: 10,
    fontWeight: 800,
  },
};


export default AdminUsersPage;
