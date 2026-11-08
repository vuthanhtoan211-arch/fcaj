import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  LogIn,
  LogOut,
  MapPin,
  RefreshCw,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  getMyResults,
} from "../services/api";


function MyResultsPage() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");


  useEffect(() => {
    loadResults();
  }, []);


  async function loadResults(
    silent = false
  ) {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getMyResults();

      setData(
        result?.data
        ?? result
        ?? null
      );
    } catch (err) {
      setError(
        err?.message
        || "Không thể tải kết quả tham gia."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


  const items =
    Array.isArray(data?.items)
      ? data.items
      : [];

  const summary =
    data?.summary || {};

  const student =
    data?.student || {};


  const filteredItems =
    useMemo(
      () => {
        if (filter === "ALL") {
          return items;
        }

        return items.filter(
          (item) =>
            String(
              item.final_status
              || "NOT_AVAILABLE"
            ).toUpperCase()
            === filter
        );
      },
      [items, filter]
    );


  if (loading) {
    return (
      <div style={styles.centerState}>
        <RefreshCw
          size={30}
          style={styles.spinIcon}
        />
        <strong>
          Đang tải kết quả của bạn...
        </strong>
      </div>
    );
  }


  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroIcon}>
          <UserRound size={28} />
        </div>

        <div style={styles.heroCopy}>
          <span style={styles.eyebrow}>
            KẾT QUẢ CỦA TÔI
          </span>

          <h2 style={styles.title}>
            {student.full_name
              || "Sinh viên"}
          </h2>

          <div style={styles.studentMeta}>
            <span>
              MSSV: {student.mssv || "—"}
            </span>

            {student.class_name && (
              <span>
                Lớp: {student.class_name}
              </span>
            )}

            {student.cohort && (
              <span>
                Khóa: {student.cohort}
              </span>
            )}
          </div>

          <p style={styles.description}>
            Trang này chỉ hiển thị dữ liệu gắn với
            MSSV của tài khoản đang đăng nhập. Bạn
            không thể xem kết quả của sinh viên khác.
          </p>
        </div>

        <button
          type="button"
          style={styles.refreshButton}
          onClick={() =>
            loadResults(true)
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            style={
              refreshing
                ? styles.spinIcon
                : undefined
            }
          />
          {refreshing
            ? "Đang làm mới"
            : "Làm mới"}
        </button>
      </section>


      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}


      <section style={styles.summaryGrid}>
        <SummaryCard
          icon={CalendarDays}
          label="Hoạt động"
          value={summary.total_activities ?? 0}
          note="Có dữ liệu của bạn"
        />

        <SummaryCard
          icon={LogIn}
          label="Check-in"
          value={summary.checked_in ?? 0}
          note="Đã ghi nhận"
        />

        <SummaryCard
          icon={LogOut}
          label="Check-out"
          value={summary.checked_out ?? 0}
          note="Đã ghi nhận"
        />

        <SummaryCard
          icon={BadgeCheck}
          label="Đã xác nhận"
          value={summary.confirmed ?? 0}
          note="Kết quả cuối"
        />
      </section>


      <section style={styles.contentCard}>
        <div style={styles.contentHeader}>
          <div>
            <span style={styles.eyebrow}>
              LỊCH SỬ THAM GIA
            </span>
            <h3 style={styles.sectionTitle}>
              Hoạt động của bạn
            </h3>
          </div>

          <div style={styles.filters}>
            <FilterButton
              active={filter === "ALL"}
              onClick={() => setFilter("ALL")}
            >
              Tất cả
            </FilterButton>

            <FilterButton
              active={filter === "CONFIRMED"}
              onClick={() =>
                setFilter("CONFIRMED")
              }
            >
              Đã xác nhận
            </FilterButton>

            <FilterButton
              active={filter === "PENDING"}
              onClick={() =>
                setFilter("PENDING")
              }
            >
              Đang xử lý
            </FilterButton>

            <FilterButton
              active={filter === "REJECTED"}
              onClick={() =>
                setFilter("REJECTED")
              }
            >
              Không xác nhận
            </FilterButton>
          </div>
        </div>


        {filteredItems.length === 0 ? (
          <EmptyState
            hasAny={items.length > 0}
          />
        ) : (
          <div style={styles.resultsList}>
            {filteredItems.map(
              (item) => (
                <ResultCard
                  key={item.activity_id}
                  item={item}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}


function SummaryCard({
  icon: Icon,
  label,
  value,
  note,
}) {
  return (
    <article style={styles.summaryCard}>
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
        <small style={styles.summaryNote}>
          {note}
        </small>
      </div>
    </article>
  );
}


function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.filterButton,
        ...(active
          ? styles.filterButtonActive
          : {}),
      }}
    >
      {children}
    </button>
  );
}


function ResultCard({ item }) {
  const finalStatus =
    normalizeFinalStatus(
      item.final_status
    );

  const reconciliation =
    reconciliationInfo(
      item.reconciliation_status
    );

  return (
    <article style={styles.resultCard}>
      <div style={styles.activityHeader}>
        <div style={styles.activityCopy}>
          <div style={styles.activityTypeRow}>
            <span style={styles.activityType}>
              {activityTypeLabel(
                item.activity_type
              )}
            </span>

            <FinalBadge
              status={finalStatus}
            />
          </div>

          <h3 style={styles.activityTitle}>
            {item.activity_name}
          </h3>

          <div style={styles.activityMeta}>
            <span>
              <CalendarDays size={15} />
              {formatDateTime(
                item.start_time
              )}
            </span>

            <span>
              <MapPin size={15} />
              {item.location || "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </div>


      <div style={styles.timelineGrid}>
        <StatusItem
          icon={ClipboardCheck}
          label="Đăng ký"
          state={
            item.registered
              ? "YES"
              : "NO"
          }
          value={
            item.registered
              ? "Đã có trong danh sách"
              : "Không có dữ liệu"
          }
          time={item.registered_at}
        />

        <StatusItem
          icon={LogIn}
          label="Check-in"
          state={
            item.check_in
              ? "YES"
              : "NO"
          }
          value={
            item.check_in
              ? "Đã Check-in"
              : "Chưa ghi nhận"
          }
          time={item.check_in_at}
        />

        <StatusItem
          icon={LogOut}
          label="Check-out"
          state={
            item.check_out
              ? "YES"
              : "NO"
          }
          value={
            item.check_out
              ? "Đã Check-out"
              : "Chưa ghi nhận"
          }
          time={item.check_out_at}
        />

        <StatusItem
          icon={FileCheck2}
          label="Evidence"
          state={item.evidence_status}
          value={evidenceLabel(
            item.evidence_status
          )}
          time={
            item.evidence_submitted_at
          }
        />
      </div>


      <div style={styles.resultFooter}>
        <div style={styles.reconciliationBox}>
          <span style={styles.footerLabel}>
            Đối soát
          </span>
          <strong>
            {reconciliation.label}
          </strong>
          <small>
            {reconciliation.description}
          </small>
        </div>

        <div style={styles.finalBox}>
          <span style={styles.footerLabel}>
            Kết quả cuối
          </span>
          <strong>
            {finalStatus.label}
          </strong>
          <small>
            {finalStatus.description}
          </small>
        </div>
      </div>


      {Array.isArray(item.issues)
        && item.issues.length > 0
        && (
          <div style={styles.issueBox}>
            <AlertCircle size={16} />
            <span>
              Cần kiểm tra: {item.issues
                .map(issueLabel)
                .join(", ")}
            </span>
          </div>
        )}

      {item.note && (
        <div style={styles.noteBox}>
          <strong>Ghi chú:</strong>
          <span>{item.note}</span>
        </div>
      )}
    </article>
  );
}


function StatusItem({
  icon: Icon,
  label,
  state,
  value,
  time,
}) {
  const positive =
    state === "YES";

  const pending =
    state === "NOT_IMPORTED";

  const StateIcon = positive
    ? CheckCircle2
    : pending
      ? Clock3
      : XCircle;

  return (
    <div style={styles.statusItem}>
      <div style={styles.statusIcon}>
        <Icon size={18} />
      </div>

      <div style={styles.statusCopy}>
        <span>{label}</span>
        <strong>{value}</strong>

        {time && (
          <small>
            {formatDateTime(time)}
          </small>
        )}
      </div>

      <StateIcon
        size={19}
        color={
          positive
            ? "#15803d"
            : pending
              ? "#a16207"
              : "#b91c1c"
        }
      />
    </div>
  );
}


function FinalBadge({ status }) {
  return (
    <span
      style={{
        ...styles.finalBadge,
        background:
          status.background,
        color:
          status.color,
      }}
    >
      {status.label}
    </span>
  );
}


function EmptyState({ hasAny }) {
  return (
    <div style={styles.emptyState}>
      <ClipboardCheck
        size={38}
      />
      <strong>
        {hasAny
          ? "Không có hoạt động phù hợp bộ lọc"
          : "Chưa có kết quả tham gia"}
      </strong>
      <p>
        {hasAny
          ? "Hãy chọn bộ lọc khác để xem các hoạt động của bạn."
          : "Khi ADMIN đã nhập danh sách đăng ký hoặc hệ thống có dữ liệu tham gia gắn với MSSV của bạn, kết quả sẽ xuất hiện tại đây."}
      </p>
    </div>
  );
}


function normalizeFinalStatus(value) {
  const status =
    String(value || "NOT_AVAILABLE")
      .trim()
      .toUpperCase();

  const map = {
    CONFIRMED: {
      label: "Đã xác nhận",
      description:
        "Bạn đã được xác nhận tham gia hoạt động.",
      color: "#166534",
      background: "#dcfce7",
    },
    REJECTED: {
      label: "Không xác nhận",
      description:
        "Kết quả hiện tại không được xác nhận tham gia.",
      color: "#991b1b",
      background: "#fee2e2",
    },
    PENDING: {
      label: "Đang xử lý",
      description:
        "Dữ liệu đang chờ ADMIN kiểm tra hoặc hoàn tất đối soát.",
      color: "#92400e",
      background: "#fef3c7",
    },
    NOT_AVAILABLE: {
      label: "Chưa có kết quả",
      description:
        "Hoạt động chưa có kết quả đối soát cuối.",
      color: "#475569",
      background: "#e2e8f0",
    },
  };

  return map[status]
    || map.NOT_AVAILABLE;
}


function reconciliationInfo(value) {
  const status =
    String(value || "NOT_RECONCILED")
      .trim()
      .toUpperCase();

  const map = {
    READY: {
      label: "Sẵn sàng",
      description:
        "Dữ liệu tham gia đã đầy đủ.",
    },
    NEEDS_REVIEW: {
      label: "Cần kiểm tra",
      description:
        "Có dữ liệu cần ADMIN xem lại.",
    },
    NO_ATTENDANCE: {
      label: "Không có điểm danh",
      description:
        "Chưa ghi nhận Check-in và Check-out.",
    },
    NOT_RECONCILED: {
      label: "Chưa đối soát",
      description:
        "ADMIN chưa chạy đối soát cho dữ liệu này.",
    },
  };

  return map[status]
    || {
      label: status,
      description:
        "Trạng thái đối soát hiện tại.",
    };
}


function evidenceLabel(value) {
  const status =
    String(value || "NOT_IMPORTED")
      .trim()
      .toUpperCase();

  if (status === "YES") {
    return "Có Evidence";
  }

  if (status === "NO") {
    return "Không có Evidence";
  }

  return "Chưa nhập Evidence";
}


function activityTypeLabel(value) {
  const key =
    String(value || "")
      .trim()
      .toLowerCase();

  const labels = {
    workshop: "Workshop",
    seminar: "Seminar",
    political_session:
      "Sinh hoạt chính trị",
    competition: "Cuộc thi",
    annual_program:
      "Chương trình thường niên",
    recreational:
      "Hoạt động phong trào",
  };

  return labels[key]
    || value
    || "Hoạt động";
}


function issueLabel(value) {
  const key =
    String(value || "")
      .trim()
      .toUpperCase();

  const labels = {
    MISSING_EVIDENCE:
      "thiếu Evidence",
    MISSING_CHECK_IN:
      "thiếu Check-in",
    MISSING_CHECK_OUT:
      "thiếu Check-out",
    NO_ATTENDANCE:
      "không có điểm danh",
  };

  return labels[key]
    || key.replaceAll("_", " ");
}


function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


const styles = {
  page: {
    display: "grid",
    gap: 20,
  },

  hero: {
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    padding: 24,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    boxShadow:
      "0 16px 40px rgba(15, 23, 42, 0.06)",
  },

  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "#eff6ff",
    color: "#1d4ed8",
    flexShrink: 0,
  },

  heroCopy: {
    minWidth: 0,
    flex: 1,
  },

  eyebrow: {
    display: "block",
    color: "#2563eb",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: "0.08em",
  },

  title: {
    margin: "6px 0 8px",
    color: "#0f172a",
    fontSize: 28,
  },

  description: {
    margin: "10px 0 0",
    color: "#64748b",
    lineHeight: 1.65,
    maxWidth: 760,
  },

  studentMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    color: "#475569",
    fontSize: 13,
  },

  refreshButton: {
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 15px",
    borderRadius: 14,
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 18,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "#eff6ff",
    color: "#1d4ed8",
    flexShrink: 0,
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
  },

  summaryValue: {
    display: "block",
    marginTop: 2,
    color: "#0f172a",
    fontSize: 25,
  },

  summaryNote: {
    display: "block",
    marginTop: 2,
    color: "#94a3b8",
  },

  contentCard: {
    padding: 22,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
  },

  contentHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18,
  },

  sectionTitle: {
    margin: "5px 0 0",
    color: "#0f172a",
    fontSize: 21,
  },

  filters: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  filterButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    minHeight: 36,
    padding: "0 12px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },

  filterButtonActive: {
    background: "#0f172a",
    color: "#ffffff",
    borderColor: "#0f172a",
  },

  resultsList: {
    display: "grid",
    gap: 16,
  },

  resultCard: {
    padding: 20,
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#f8fafc",
  },

  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
  },

  activityCopy: {
    minWidth: 0,
    flex: 1,
  },

  activityTypeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  activityType: {
    color: "#2563eb",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  activityTitle: {
    margin: "8px 0 8px",
    color: "#0f172a",
    fontSize: 19,
  },

  activityMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    color: "#64748b",
    fontSize: 13,
  },

  finalBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  timelineGrid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 10,
  },

  statusItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 13,
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
  },

  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    display: "grid",
    placeItems: "center",
    background: "#f1f5f9",
    color: "#334155",
    flexShrink: 0,
  },

  statusCopy: {
    minWidth: 0,
    flex: 1,
  },

  resultFooter: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 10,
    marginTop: 12,
  },

  reconciliationBox: {
    display: "grid",
    gap: 3,
    padding: 14,
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#334155",
  },

  finalBox: {
    display: "grid",
    gap: 3,
    padding: 14,
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#334155",
  },

  footerLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  issueBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    background: "#fffbeb",
    color: "#92400e",
    fontSize: 13,
  },

  noteBox: {
    display: "flex",
    gap: 6,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    color: "#475569",
    fontSize: 13,
  },

  emptyState: {
    minHeight: 250,
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    gap: 8,
    textAlign: "center",
    color: "#64748b",
    padding: 24,
  },

  centerState: {
    minHeight: 380,
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    gap: 12,
    color: "#64748b",
  },

  spinIcon: {
    animation:
      "spin 1s linear infinite",
  },
};


export default MyResultsPage;
