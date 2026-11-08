import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileSpreadsheet,
  Download,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import {
  downloadActivityExport,
  getActivities,
  getReconciliation,
} from "../services/api";

// ======================================================
// FINAL LIST PAGE
// ======================================================

function FinalListPage() {

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState("");

  const [
    finalData,
    setFinalData,
  ] = useState(null);

  const [
    activeTab,
    setActiveTab,
  ] = useState("CONFIRMED");

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    loadingActivities,
    setLoadingActivities,
  ] = useState(true);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    exportingType,
    setExportingType,
  ] = useState("");

  // ====================================================
  // LOAD ACTIVITIES
  // ====================================================

  useEffect(() => {

    loadActivities();

  }, []);

  async function loadActivities() {

    try {

      setLoadingActivities(
        true
      );

      setError("");

      const result =
        await getActivities();

      const rows =
        Array.isArray(result)
          ? result
          : Array.isArray(
              result?.data
            )
            ? result.data
            : Array.isArray(
                result?.data?.items
              )
              ? result.data.items
              : [];

      const usable =
        rows.filter(
          (activity) => {

            const status =
              String(
                activity
                  ?.publication_status ||
                activity?.status ||
                ""
              ).toUpperCase();

            return (
              status !== "CANCELLED" &&
              status !== "CANCELED"
            );

          }
        );

      usable.sort(
        (a, b) => {

          // Hoạt động đã khóa danh sách cuối
          // đưa lên trước.

          const lockedA =
            a.final_list_locked
              ? 1
              : 0;

          const lockedB =
            b.final_list_locked
              ? 1
              : 0;

          if (
            lockedA !== lockedB
          ) {

            return (
              lockedB -
              lockedA
            );

          }

          return (
            new Date(
              b.start_time || 0
            ).getTime()
            -
            new Date(
              a.start_time || 0
            ).getTime()
          );

        }
      );

      setActivities(
        usable
      );

      if (
        usable.length > 0
      ) {

        const firstLocked =
          usable.find(
            (activity) =>
              activity
                .final_list_locked
          );

        setSelectedActivityId(
          (current) =>
            current ||
            (
              firstLocked ||
              usable[0]
            ).activity_id
        );

      }

    } catch (err) {

      console.error(
        "Load activities error:",
        err
      );

      setError(
        err.message ||
        "Không thể tải danh sách hoạt động."
      );

    } finally {

      setLoadingActivities(
        false
      );

    }

  }

  // ====================================================
  // ACTIVITY CHANGE
  // ====================================================

  useEffect(() => {

    setSearchText("");

    setActiveTab(
      "CONFIRMED"
    );

    setError("");

    setFinalData(
      null
    );

    if (
      selectedActivityId
    ) {

      loadFinalList(
        selectedActivityId
      );

    }

  }, [selectedActivityId]);

  // ====================================================
  // LOAD FINAL LIST
  // ====================================================

  async function loadFinalList(
    activityId =
      selectedActivityId
  ) {

    if (!activityId) {

      return;

    }

    try {

      setLoading(
        true
      );

      setError("");

      const result =
        await getReconciliation(
          activityId
        );

      const data =
        result?.data ||
        {};

      setFinalData({

        ...data,

        items:
          Array.isArray(
            data?.items
          )
            ? data.items
            : [],

      });

    } catch (err) {

      console.error(
        "Load final list error:",
        err
      );

      setFinalData(
        null
      );

      setError(
        err.message ||
        "Không thể tải danh sách cuối."
      );

    } finally {

      setLoading(
        false
      );

    }

  }

  // ====================================================
  // EXPORT
  // ====================================================

  async function handleExport(exportType) {
    if (!selectedActivityId) {
      setError("Vui lòng chọn hoạt động trước khi xuất file.");
      return;
    }

    if (!finalListLocked && ["final", "all"].includes(exportType)) {
      setError("Phải khóa danh sách cuối trước khi xuất danh sách chính thức.");
      return;
    }

    try {
      setExportingType(exportType);
      setError("");
      await downloadActivityExport(selectedActivityId, exportType);
    } catch (err) {
      console.error("Export activity error:", err);
      setError(err?.message || "Không thể xuất file Excel.");
    } finally {
      setExportingType("");
    }
  }

  // ====================================================
  // SELECTED ACTIVITY
  // ====================================================

  const selectedActivity =
    useMemo(
      () =>
        activities.find(
          (activity) =>
            activity.activity_id ===
            selectedActivityId
        ) || null,
      [
        activities,
        selectedActivityId,
      ]
    );

  // ====================================================
  // DATA
  // ====================================================

  const rows =
    finalData?.items ||
    [];

  const finalListLocked =
    Boolean(
      finalData
        ?.final_list_locked
      ??
      selectedActivity
        ?.final_list_locked
    );

  const confirmedRows =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            getFinalStatus(
              row
            ) === "CONFIRMED"
        ),
      [rows]
    );

  const rejectedRows =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            getFinalStatus(
              row
            ) === "REJECTED"
        ),
      [rows]
    );

  const pendingRows =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            getFinalStatus(
              row
            ) === "PENDING"
        ),
      [rows]
    );

  // ====================================================
  // CURRENT TAB
  // ====================================================

  const currentRows =
    activeTab === "CONFIRMED"
      ? confirmedRows
      : rejectedRows;

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredRows =
    useMemo(
      () => {

        const keyword =
          searchText
            .trim()
            .toLowerCase();

        if (!keyword) {

          return currentRows;

        }

        return currentRows.filter(
          (row) => {

            const text = [

              row.mssv,

              getFullName(
                row
              ),

              row.note,

              row.confirmed_by,

              row.decision_source,

            ]
              .join(" ")
              .toLowerCase();

            return text.includes(
              keyword
            );

          }
        );

      },
      [
        currentRows,
        searchText,
      ]
    );

  // ====================================================
  // UI
  // ====================================================

  return (

    <div style={styles.page}>

      {/* ================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>

          <span style={styles.eyebrow}>
            KẾT QUẢ CUỐI CÙNG
          </span>

          <h2 style={styles.title}>
            Danh sách tham gia hoạt động
          </h2>

          <p style={styles.description}>
            Danh sách sau khi hoàn tất đối soát,
            xử lý ngoại lệ và khóa kết quả cuối.
          </p>

        </div>

        <button
          type="button"
          style={styles.refreshButton}
          disabled={
            loading
          }
          onClick={() =>
            loadFinalList()
          }
        >

          <RefreshCw
            size={16}
          />

          Làm mới

        </button>

      </div>

      {/* ================================================
          ERROR
      ================================================= */}

      {error && (

        <div style={styles.errorBox}>

          <AlertCircle
            size={19}
          />

          {error}

        </div>

      )}

      {/* ================================================
          ACTIVITY
      ================================================= */}

      <section style={styles.card}>

        <div style={styles.sectionTitle}>

          <strong>
            Chọn hoạt động
          </strong>

          <span>
            Hoạt động đã khóa danh sách cuối
            sẽ được ưu tiên hiển thị ở phía trên.
          </span>

        </div>

        {loadingActivities ? (

          <div style={styles.loadingBox}>

            <RefreshCw
              size={18}
            />

            Đang tải hoạt động...

          </div>

        ) : (

          <select
            value={
              selectedActivityId
            }
            onChange={
              (event) =>
                setSelectedActivityId(
                  event.target.value
                )
            }
            style={styles.select}
          >

            <option value="">
              -- Chọn hoạt động --
            </option>

            {activities.map(
              (activity) => (

                <option
                  key={
                    activity
                      .activity_id
                  }
                  value={
                    activity
                      .activity_id
                  }
                >

                  {activity
                    .final_list_locked
                    ? "🔒 "
                    : ""}

                  {activity
                    .activity_name}

                  {" — "}

                  {formatDate(
                    activity
                      .start_time
                  )}

                </option>

              )
            )}

          </select>

        )}

        {selectedActivity && (

          <div style={styles.activityInfo}>

            <ClipboardCheck
              size={19}
            />

            <div style={styles.activityCopy}>

              <strong>
                {selectedActivity
                  .activity_name}
              </strong>

              <span>

                {selectedActivity
                  .activity_id}

                {" · "}

                {formatDate(
                  selectedActivity
                    .start_time
                )}

                {" · "}

                {selectedActivity
                  .location ||
                  "Chưa cập nhật địa điểm"}

              </span>

            </div>

            {finalListLocked ? (

              <span style={styles.lockBadge}>

                <LockKeyhole
                  size={14}
                />

                Đã khóa

              </span>

            ) : (

              <span style={styles.openBadge}>

                <Clock3
                  size={14}
                />

                Chưa khóa

              </span>

            )}

          </div>

        )}

      </section>

      {/* ================================================
          LOADING
      ================================================= */}

      {loading ? (

        <section style={styles.loadingCard}>

          <RefreshCw
            size={25}
          />

          Đang tải danh sách cuối...

        </section>

      ) : !selectedActivityId ? (

        <section style={styles.emptyCard}>

          <FileCheck2
            size={38}
          />

          <strong>
            Chưa chọn hoạt động
          </strong>

        </section>

      ) : rows.length === 0 ? (

        <section style={styles.emptyCard}>

          <FileCheck2
            size={38}
          />

          <strong>
            Chưa có dữ liệu đối soát
          </strong>

          <span>
            Hãy chạy Đối soát trước khi
            xem danh sách cuối.
          </span>

        </section>

      ) : !finalListLocked ? (

        /* ==============================================
           NOT LOCKED
        =============================================== */

        <>

          <div style={styles.warningBox}>

            <AlertCircle
              size={20}
            />

            <div>

              <strong>
                Danh sách này chưa phải
                danh sách cuối chính thức.
              </strong>

              <span>
                Hãy xử lý hết các trường hợp
                Cần kiểm tra tại màn Đối soát,
                sau đó bấm “Khóa danh sách cuối”.
              </span>

            </div>

          </div>

          <section style={styles.summaryGrid}>

            <SummaryCard
              icon={Users}
              label="Tổng đối soát"
              value={
                rows.length
              }
            />

            <SummaryCard
              icon={UserCheck}
              label="Đã xác nhận"
              value={
                confirmedRows.length
              }
              type="success"
            />

            <SummaryCard
              icon={UserX}
              label="Không xác nhận"
              value={
                rejectedRows.length
              }
              type="danger"
            />

            <SummaryCard
              icon={Clock3}
              label="Chờ BTC xử lý"
              value={
                pendingRows.length
              }
              type="warning"
            />

          </section>

        </>

      ) : (

        /* ==============================================
           FINAL LIST LOCKED
        =============================================== */

        <>

          <div style={styles.lockedBox}>

            <ShieldCheck
              size={21}
            />

            <div>

              <strong>
                Danh sách cuối đã được xác nhận
              </strong>

              <span>
                Kết quả đã khóa và không còn
                được thay đổi từ màn Đối soát.
              </span>

            </div>

          </div>

          {/* ============================================
              EXPORT
          ============================================= */}

          <section style={styles.exportCard}>
            <div style={styles.exportHeader}>
              <div>
                <span style={styles.exportEyebrow}>XUẤT EXCEL</span>
                <h3 style={styles.exportTitle}>Xuất danh sách hoạt động</h3>
                <p style={styles.exportDescription}>
                  Tải từng danh sách riêng hoặc toàn bộ dữ liệu trong một file Excel.
                </p>
              </div>
              <FileSpreadsheet size={24} />
            </div>

            <div style={styles.exportGrid}>
              {[
                ["final", "Danh sách tham gia cuối"],
                ["checkin", "Danh sách Check-in"],
                ["checkout", "Danh sách Check-out"],
                ["absent", "Đăng ký nhưng vắng"],
                ["all", "Tất cả danh sách"],
              ].map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  style={type === "all" ? styles.exportAllButton : styles.exportButton}
                  disabled={Boolean(exportingType)}
                  onClick={() => handleExport(type)}
                >
                  <Download size={16} />
                  {exportingType === type ? "Đang xuất..." : label}
                </button>
              ))}
            </div>
          </section>

          {/* ============================================
              SUMMARY
          ============================================= */}

          <section style={styles.summaryGrid}>

            <SummaryCard
              icon={Users}
              label="Tổng đăng ký"
              value={
                rows.length
              }
            />

            <SummaryCard
              icon={UserCheck}
              label="Tham gia"
              value={
                confirmedRows.length
              }
              type="success"
            />

            <SummaryCard
              icon={UserX}
              label="Không tham gia"
              value={
                rejectedRows.length
              }
              type="danger"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Đã xử lý"
              value={
                rows.length -
                pendingRows.length
              }
            />

          </section>

          {/* ============================================
              TABS
          ============================================= */}

          <section style={styles.card}>

            <div style={styles.tabs}>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "CONFIRMED"
                  )
                }
                style={{
                  ...styles.tabButton,

                  ...(activeTab ===
                  "CONFIRMED"
                    ? styles
                        .tabConfirmedActive
                    : {}),
                }}
              >

                <UserCheck
                  size={17}
                />

                Danh sách tham gia

                <strong>
                  {confirmedRows.length}
                </strong>

              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "REJECTED"
                  )
                }
                style={{
                  ...styles.tabButton,

                  ...(activeTab ===
                  "REJECTED"
                    ? styles
                        .tabRejectedActive
                    : {}),
                }}
              >

                <UserX
                  size={17}
                />

                Không tham gia

                <strong>
                  {rejectedRows.length}
                </strong>

              </button>

            </div>

            {/* SEARCH */}

            <div style={styles.toolbar}>

              <div style={styles.searchBox}>

                <Search
                  size={17}
                />

                <input
                  value={
                    searchText
                  }
                  onChange={
                    (event) =>
                      setSearchText(
                        event.target.value
                      )
                  }
                  placeholder="Tìm MSSV, họ tên, ghi chú..."
                  style={styles.searchInput}
                />

              </div>

              <div style={styles.resultCount}>

                Hiển thị
                {" "}
                <strong>
                  {filteredRows.length}
                </strong>
                {" / "}
                {currentRows.length}
                {" "}
                sinh viên

              </div>

            </div>

            {/* TABLE */}

            {filteredRows.length === 0 ? (

              <div style={styles.noResults}>

                Không tìm thấy sinh viên phù hợp.

              </div>

            ) : (

              <div style={styles.tableWrapper}>

                <table style={styles.table}>

                  <thead>

                    <tr>

                      <th style={styles.th}>
                        STT
                      </th>

                      <th style={styles.th}>
                        MSSV
                      </th>

                      <th style={styles.th}>
                        Họ và tên
                      </th>

                      <th style={styles.thCenter}>
                        Check-in
                      </th>

                      <th style={styles.thCenter}>
                        Check-out
                      </th>

                      <th style={styles.thCenter}>
                        Evidence
                      </th>

                      <th style={styles.th}>
                        Kết quả
                      </th>

                      <th style={styles.th}>
                        Nguồn quyết định
                      </th>

                      <th style={styles.th}>
                        Ghi chú
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredRows.map(
                      (
                        row,
                        index
                      ) => (

                        <tr
                          key={
                            row.mssv ||
                            index
                          }
                        >

                          <td style={styles.td}>
                            {index + 1}
                          </td>

                          <td style={styles.td}>

                            <strong>
                              {row.mssv ||
                                "—"}
                            </strong>

                          </td>

                          <td style={styles.td}>
                            {getFullName(
                              row
                            )}
                          </td>

                          <td style={styles.tdCenter}>

                            <BooleanBadge
                              value={
                                row.check_in ??
                                row.checked_in
                              }
                            />

                          </td>

                          <td style={styles.tdCenter}>

                            <BooleanBadge
                              value={
                                row.check_out ??
                                row.checked_out
                              }
                            />

                          </td>

                          <td style={styles.tdCenter}>

                            <BooleanBadge
                              value={
                                row.evidence ??
                                row.has_evidence
                              }
                            />

                          </td>

                          <td style={styles.td}>

                            <FinalBadge
                              status={
                                getFinalStatus(
                                  row
                                )
                              }
                            />

                          </td>

                          <td style={styles.td}>

                            <DecisionSource
                              source={
                                row
                                  .decision_source
                              }
                            />

                          </td>

                          <td style={styles.td}>

                            <span style={styles.noteText}>

                              {row.note ||
                                "—"}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </>

      )}

    </div>

  );

}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  icon: Icon,
  label,
  value,
  type = "default",
}) {

  return (

    <div
      style={{
        ...styles.summaryCard,

        ...(type === "success"
          ? styles.summarySuccess
          : {}),

        ...(type === "warning"
          ? styles.summaryWarning
          : {}),

        ...(type === "danger"
          ? styles.summaryDanger
          : {}),
      }}
    >

      <div style={styles.summaryIcon}>

        <Icon
          size={21}
        />

      </div>

      <div style={styles.summaryCopy}>

        <span style={styles.summaryLabel}>
          {label}
        </span>

        <strong style={styles.summaryValue}>
          {value}
        </strong>

      </div>

    </div>

  );

}

// ======================================================
// BOOLEAN BADGE
// ======================================================

function BooleanBadge({
  value,
}) {

  const yes =
    isTrueValue(
      value
    );

  return (

    <span
      style={
        yes
          ? styles.yesBadge
          : styles.noBadge
      }
    >

      {yes
        ? "Có"
        : "Không"}

    </span>

  );

}

// ======================================================
// FINAL BADGE
// ======================================================

function FinalBadge({
  status,
}) {

  if (
    status === "CONFIRMED"
  ) {

    return (

      <span style={styles.confirmedBadge}>

        <CheckCircle2
          size={13}
        />

        Tham gia

      </span>

    );

  }

  return (

    <span style={styles.rejectedBadge}>

      <UserX
        size={13}
      />

      Không tham gia

    </span>

  );

}

// ======================================================
// DECISION SOURCE
// ======================================================

function DecisionSource({
  source,
}) {

  const value =
    String(
      source || ""
    ).toUpperCase();

  if (
    value === "MANUAL"
  ) {

    return (

      <span style={styles.manualBadge}>
        BTC xử lý
      </span>

    );

  }

  if (
    value === "SYSTEM"
  ) {

    return (

      <span style={styles.systemBadge}>
        Hệ thống
      </span>

    );

  }

  return "—";

}

// ======================================================
// HELPERS
// ======================================================

function getFinalStatus(
  row
) {

  const value =
    String(
      row?.final_status ||
      "PENDING"
    ).toUpperCase();

  if (
    value === "CONFIRMED"
  ) {

    return "CONFIRMED";

  }

  if (
    value === "REJECTED"
  ) {

    return "REJECTED";

  }

  return "PENDING";

}

function getFullName(
  row
) {

  return (
    row.full_name ||
    row.student_name ||
    row.name ||
    "—"
  );

}

function isTrueValue(
  value
) {

  return (
    value === true ||
    value === 1 ||
    [
      "YES",
      "TRUE",
      "1",
      "Y",
    ].includes(
      String(
        value ?? ""
      )
        .trim()
        .toUpperCase()
    )
  );

}

function formatDate(
  value
) {

  if (!value) {

    return "—";

  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(value);

  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",

      timeZone:
        "Asia/Ho_Chi_Minh",
    }
  ).format(date);

}

// ======================================================
// STYLES
// ======================================================

const styles = {

  page: {
    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "20px",
  },

  header: {
    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "flex-end",

    gap:
      "16px",

    flexWrap:
      "wrap",
  },

  eyebrow: {
    fontSize:
      "11px",

    fontWeight:
      800,

    letterSpacing:
      "1px",

    color:
      "#2563eb",
  },

  title: {
    margin:
      "5px 0 0",

    color:
      "#0f172a",

    fontSize:
      "30px",
  },

  description: {
    margin:
      "7px 0 0",

    color:
      "#64748b",

    fontSize:
      "13px",
  },

  refreshButton: {
    minHeight:
      "42px",

    padding:
      "0 14px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "7px",

    border:
      "1px solid #dbeafe",

    borderRadius:
      "10px",

    background:
      "#eff6ff",

    color:
      "#2563eb",

    fontWeight:
      700,

    cursor:
      "pointer",
  },

  exportCard: {
    padding: "18px",
    border: "1px solid #dbeafe",
    borderRadius: "14px",
    background: "#ffffff",
  },

  exportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    color: "#2563eb",
  },

  exportEyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1px",
    color: "#2563eb",
  },

  exportTitle: {
    margin: "4px 0 0",
    fontSize: "18px",
    color: "#0f172a",
  },

  exportDescription: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  exportGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },

  exportButton: {
    minHeight: "40px",
    padding: "0 13px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
  },

  exportAllButton: {
    minHeight: "40px",
    padding: "0 14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },

  errorBox: {
    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "9px",

    borderRadius:
      "11px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },

  warningBox: {
    padding:
      "15px",

    display:
      "flex",

    gap:
      "11px",

    alignItems:
      "flex-start",

    border:
      "1px solid #fde68a",

    borderRadius:
      "13px",

    background:
      "#fffbeb",

    color:
      "#b45309",
  },

  lockedBox: {
    padding:
      "15px",

    display:
      "flex",

    gap:
      "11px",

    alignItems:
      "flex-start",

    border:
      "1px solid #a7f3d0",

    borderRadius:
      "13px",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },

  card: {
    padding:
      "20px",

    border:
      "1px solid #dbe5f1",

    borderRadius:
      "18px",

    background:
      "#ffffff",
  },

  sectionTitle: {
    marginBottom:
      "13px",

    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "4px",

    color:
      "#0f172a",
  },

  select: {
    width:
      "100%",

    minHeight:
      "44px",

    padding:
      "0 12px",

    border:
      "1px solid #cbd5e1",

    borderRadius:
      "10px",

    background:
      "#ffffff",
  },

  activityInfo: {
    marginTop:
      "12px",

    padding:
      "12px 14px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "10px",

    borderRadius:
      "11px",

    background:
      "#f8fafc",

    color:
      "#475569",
  },

  activityCopy: {
    flex:
      1,

    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "3px",
  },

  lockBadge: {
    padding:
      "6px 9px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "5px",

    borderRadius:
      "999px",

    background:
      "#dcfce7",

    color:
      "#15803d",

    fontSize:
      "11px",

    fontWeight:
      700,
  },

  openBadge: {
    padding:
      "6px 9px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "5px",

    borderRadius:
      "999px",

    background:
      "#fef3c7",

    color:
      "#b45309",

    fontSize:
      "11px",

    fontWeight:
      700,
  },

  loadingBox: {
    minHeight:
      "70px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    gap:
      "8px",

    color:
      "#64748b",
  },

  loadingCard: {
    minHeight:
      "180px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    gap:
      "9px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "18px",

    background:
      "#ffffff",

    color:
      "#64748b",
  },

  emptyCard: {
    minHeight:
      "220px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "center",

    justifyContent:
      "center",

    gap:
      "8px",

    textAlign:
      "center",

    border:
      "1px dashed #cbd5e1",

    borderRadius:
      "18px",

    background:
      "#ffffff",

    color:
      "#94a3b8",
  },

  summaryGrid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",

    gap:
      "12px",
  },

  summaryCard: {
    minHeight:
      "92px",

    padding:
      "16px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "12px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "14px",

    background:
      "#ffffff",

    color:
      "#475569",
  },

  summarySuccess: {
    borderColor:
      "#a7f3d0",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },

  summaryWarning: {
    borderColor:
      "#fde68a",

    background:
      "#fffbeb",

    color:
      "#b45309",
  },

  summaryDanger: {
    borderColor:
      "#fecaca",

    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },

  summaryIcon: {
    width:
      "40px",

    height:
      "40px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    flexShrink:
      0,

    borderRadius:
      "10px",

    background:
      "rgba(255,255,255,0.65)",
  },

  summaryCopy: {
    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "6px",
  },

  summaryLabel: {
    display:
      "block",

    fontSize:
      "13px",

    fontWeight:
      500,
  },

  summaryValue: {
    display:
      "block",

    fontSize:
      "24px",

    lineHeight:
      1,

    fontWeight:
      800,
  },

  tabs: {
    display:
      "flex",

    gap:
      "8px",

    flexWrap:
      "wrap",

    marginBottom:
      "16px",
  },

  tabButton: {
    minHeight:
      "42px",

    padding:
      "0 13px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "7px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "10px",

    background:
      "#f8fafc",

    color:
      "#64748b",

    fontWeight:
      700,

    cursor:
      "pointer",
  },

  tabConfirmedActive: {
    borderColor:
      "#86efac",

    background:
      "#dcfce7",

    color:
      "#15803d",
  },

  tabRejectedActive: {
    borderColor:
      "#fca5a5",

    background:
      "#fee2e2",

    color:
      "#b91c1c",
  },

  toolbar: {
    marginBottom:
      "12px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "space-between",

    gap:
      "12px",

    flexWrap:
      "wrap",
  },

  searchBox: {
    flex:
      1,

    minWidth:
      "250px",

    height:
      "41px",

    padding:
      "0 11px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",

    border:
      "1px solid #cbd5e1",

    borderRadius:
      "10px",
  },

  searchInput: {
    width:
      "100%",

    border:
      "none",

    outline:
      "none",

    background:
      "transparent",
  },

  resultCount: {
    color:
      "#64748b",

    fontSize:
      "11px",
  },

  tableWrapper: {
    width:
      "100%",

    overflowX:
      "auto",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "12px",
  },

  table: {
    width:
      "100%",

    minWidth:
      "1150px",

    borderCollapse:
      "collapse",

    fontSize:
      "11px",
  },

  th: {
    padding:
      "11px",

    textAlign:
      "left",

    background:
      "#f8fafc",

    color:
      "#475569",

    borderBottom:
      "1px solid #e2e8f0",
  },

  thCenter: {
    padding:
      "11px",

    textAlign:
      "center",

    background:
      "#f8fafc",

    color:
      "#475569",

    borderBottom:
      "1px solid #e2e8f0",
  },

  td: {
    padding:
      "11px",

    color:
      "#475569",

    borderBottom:
      "1px solid #f1f5f9",

    verticalAlign:
      "middle",
  },

  tdCenter: {
    padding:
      "11px",

    textAlign:
      "center",

    color:
      "#475569",

    borderBottom:
      "1px solid #f1f5f9",
  },

  yesBadge: {
    display:
      "inline-block",

    minWidth:
      "48px",

    padding:
      "4px 7px",

    borderRadius:
      "999px",

    background:
      "#ecfdf5",

    color:
      "#047857",

    fontWeight:
      700,
  },

  noBadge: {
    display:
      "inline-block",

    minWidth:
      "48px",

    padding:
      "4px 7px",

    borderRadius:
      "999px",

    background:
      "#f1f5f9",

    color:
      "#64748b",

    fontWeight:
      700,
  },

  confirmedBadge: {
    padding:
      "5px 8px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "4px",

    borderRadius:
      "999px",

    background:
      "#dcfce7",

    color:
      "#15803d",

    fontWeight:
      700,
  },

  rejectedBadge: {
    padding:
      "5px 8px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "4px",

    borderRadius:
      "999px",

    background:
      "#fee2e2",

    color:
      "#b91c1c",

    fontWeight:
      700,
  },

  systemBadge: {
    padding:
      "4px 7px",

    borderRadius:
      "999px",

    background:
      "#eff6ff",

    color:
      "#2563eb",

    fontWeight:
      700,
  },

  manualBadge: {
    padding:
      "4px 7px",

    borderRadius:
      "999px",

    background:
      "#f5f3ff",

    color:
      "#7c3aed",

    fontWeight:
      700,
  },

  noteText: {
    display:
      "block",

    maxWidth:
      "260px",

    lineHeight:
      1.5,
  },

  noResults: {
    padding:
      "35px",

    textAlign:
      "center",

    color:
      "#94a3b8",

    border:
      "1px dashed #cbd5e1",

    borderRadius:
      "12px",
  },

};

export default FinalListPage;