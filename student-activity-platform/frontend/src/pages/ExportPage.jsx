import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileCheck2,
  FileSpreadsheet,
  LogIn,
  LogOut,
  PackageCheck,
  RefreshCw,
  UserX,
  Users,
} from "lucide-react";

import {
  downloadActivityExport,
  getActivities,
  getAttendance,
  getReconciliation,
  getRegistrations,
} from "../services/api";


// ======================================================
// EXPORT PAGE
// ======================================================

function ExportPage() {

  const [
    activities,
    setActivities,
  ] = useState([]);


  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState("");


  const [
    summary,
    setSummary,
  ] = useState({
    registered: null,
    checkIn: null,
    checkOut: null,
    final: null,
    absent: null,
    locked: false,
  });


  const [
    loadingActivities,
    setLoadingActivities,
  ] = useState(true);


  const [
    loadingSummary,
    setLoadingSummary,
  ] = useState(false);


  const [
    exportingType,
    setExportingType,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
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

        const locked =
          usable.find(
            (activity) =>
              activity
                .final_list_locked
          );


        setSelectedActivityId(
          (current) =>
            current ||
            (
              locked ||
              usable[0]
            ).activity_id
        );

      }

    } catch (err) {

      setError(
        err.message ||
        "Không thể tải hoạt động."
      );

    } finally {

      setLoadingActivities(
        false
      );

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
  // LOAD SUMMARY
  // ====================================================

  useEffect(() => {

    setError("");

    setSuccess("");


    if (
      selectedActivityId
    ) {

      loadSummary(
        selectedActivityId
      );

    }

  }, [selectedActivityId]);


  async function loadSummary(
    activityId =
      selectedActivityId
  ) {

    if (!activityId) {

      return;

    }


    try {

      setLoadingSummary(
        true
      );


      const [
        attendanceResult,
        reconciliationResult,
        registrationResult,
      ] = await Promise.allSettled([

        getAttendance(
          activityId
        ),

        getReconciliation(
          activityId
        ),

        getRegistrations(
          activityId
        ),

      ]);


      // ==================================
      // ATTENDANCE
      // ==================================

      const attendanceData =
        attendanceResult.status ===
          "fulfilled"
          ? (
              attendanceResult
                .value?.data
              ??
              attendanceResult
                .value
              ??
              {}
            )
          : {};


      // ==================================
      // REGISTRATION
      // ==================================

      const registrationData =
        registrationResult.status ===
          "fulfilled"
          ? (
              registrationResult
                .value?.data
              ??
              {}
            )
          : {};


      // ==================================
      // RECONCILIATION
      // ==================================

      const reconciliationData =
        reconciliationResult.status ===
          "fulfilled"
          ? (
              reconciliationResult
                .value?.data
              ??
              {}
            )
          : {};


      const rows =
        Array.isArray(
          reconciliationData
        )
          ? reconciliationData
          : Array.isArray(
              reconciliationData?.items
            )
            ? reconciliationData.items
            : [];


      const registered =
        registrationData?.total
        ??
        attendanceData
          ?.total_registered
        ??
        rows.length
        ??
        null;


      const checkIn =
        attendanceData
          ?.total_checked_in
        ??
        (
          rows.length
            ? rows.filter(
                (row) =>
                  isTrueValue(
                    row.check_in ??
                    row.checked_in
                  )
              ).length
            : null
        );


      const checkOut =
        attendanceData
          ?.total_checked_out
        ??
        (
          rows.length
            ? rows.filter(
                (row) =>
                  isTrueValue(
                    row.check_out ??
                    row.checked_out
                  )
              ).length
            : null
        );


      const finalCount =
        rows.length
          ? rows.filter(
              (row) =>
                String(
                  row.final_status ||
                  ""
                ).toUpperCase()
                === "CONFIRMED"
            ).length
          : null;


      const absentCount =
        rows.length
          ? rows.filter(
              (row) =>
                !isTrueValue(
                  row.check_in ??
                  row.checked_in
                )
                &&
                !isTrueValue(
                  row.check_out ??
                  row.checked_out
                )
            ).length
          : null;


      const locked =
        Boolean(
          reconciliationData
            ?.final_list_locked
          ??
          selectedActivity
            ?.final_list_locked
        );


      setSummary({
        registered,
        checkIn,
        checkOut,
        final:
          finalCount,
        absent:
          absentCount,
        locked,
      });

    } finally {

      setLoadingSummary(
        false
      );

    }

  }


  // ====================================================
  // EXPORT
  // ====================================================

  async function handleExport(
    type
  ) {

    if (
      !selectedActivityId
    ) {

      setError(
        "Vui lòng chọn hoạt động."
      );

      return;

    }


    if (
      (
        type === "final" ||
        type === "all"
      )
      &&
      !summary.locked
    ) {

      setError(
        (
          "Phải khóa danh sách cuối "
          +
          "trước khi xuất dữ liệu này."
        )
      );

      return;

    }


    try {

      setExportingType(
        type
      );

      setError("");

      setSuccess("");


      const result =
        await downloadActivityExport(
          selectedActivityId,
          type
        );


      setSuccess(
        (
          "Đã tạo file Excel: "
          +
          result.fileName
        )
      );

    } catch (err) {

      setError(
        err.message ||
        "Không thể xuất dữ liệu."
      );

    } finally {

      setExportingType(
        ""
      );

    }

  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <span style={styles.eyebrow}>
            XUẤT DỮ LIỆU
          </span>


          <h2 style={styles.title}>
            Xuất danh sách hoạt động
          </h2>


          <p style={styles.description}>
            Tạo file Excel phục vụ lưu trữ,
            kiểm tra và gửi danh sách sau
            hoạt động.
          </p>

        </div>


        <button
          type="button"
          style={styles.refreshButton}
          onClick={() =>
            loadSummary()
          }
          disabled={
            loadingSummary
          }
        >

          <RefreshCw
            size={16}
          />

          Làm mới

        </button>

      </div>


      {/* SUCCESS */}

      {success && (

        <div style={styles.successBox}>

          <CheckCircle2
            size={19}
          />

          {success}

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div style={styles.errorBox}>

          <AlertCircle
            size={19}
          />

          {error}

        </div>

      )}


      {/* ACTIVITY */}

      <section style={styles.card}>

        <div style={styles.sectionTitle}>

          <strong>
            Chọn hoạt động
          </strong>


          <span>
            Chọn hoạt động cần tạo
            file Excel.
          </span>

        </div>


        {loadingActivities ? (

          <div style={styles.loadingBox}>
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
                    activity.activity_id
                  }
                  value={
                    activity.activity_id
                  }
                >

                  {activity
                    .final_list_locked
                    ? "🔒 "
                    : ""}

                  {activity.activity_name}

                  {" — "}

                  {formatDate(
                    activity.start_time
                  )}

                </option>

              )
            )}

          </select>

        )}


        {selectedActivity && (

          <div style={styles.activityInfo}>

            <FileSpreadsheet
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

                {selectedActivity
                  .location ||
                  "Chưa cập nhật địa điểm"}

              </span>

            </div>


            <span
              style={
                summary.locked
                  ? styles.lockedBadge
                  : styles.unlockedBadge
              }
            >

              {summary.locked
                ? "Danh sách đã khóa"
                : "Danh sách chưa khóa"}

            </span>

          </div>

        )}

      </section>


      {/* SUMMARY */}

      <section style={styles.summaryGrid}>

        <SummaryCard
          icon={Users}
          label="Đăng ký"
          value={
            loadingSummary
              ? "..."
              : summary.registered
          }
        />


        <SummaryCard
          icon={LogIn}
          label="Check-in"
          value={
            loadingSummary
              ? "..."
              : summary.checkIn
          }
          type="blue"
        />


        <SummaryCard
          icon={LogOut}
          label="Check-out"
          value={
            loadingSummary
              ? "..."
              : summary.checkOut
          }
          type="purple"
        />


        <SummaryCard
          icon={FileCheck2}
          label="Tham gia cuối"
          value={
            loadingSummary
              ? "..."
              : summary.final
          }
          type="green"
        />

      </section>


      {/* EXPORT CARDS */}

      <section style={styles.exportGrid}>

        <ExportCard
          icon={FileCheck2}
          title="Danh sách tham gia cuối cùng"
          description={
            "Sinh viên đã được xác nhận "
            +
            "tham gia sau khi hoàn tất đối soát."
          }
          count={
            summary.final
          }
          buttonText={
            "Xuất danh sách tham gia"
          }
          disabled={
            !summary.locked
          }
          disabledText={
            "Cần khóa danh sách cuối"
          }
          loading={
            exportingType ===
            "final"
          }
          onExport={() =>
            handleExport(
              "final"
            )
          }
        />


        <ExportCard
          icon={LogIn}
          title="Danh sách Check-in"
          description={
            "Danh sách sinh viên đã "
            +
            "Check-in bằng QR Scanner."
          }
          count={
            summary.checkIn
          }
          buttonText={
            "Xuất Check-in"
          }
          loading={
            exportingType ===
            "checkin"
          }
          onExport={() =>
            handleExport(
              "checkin"
            )
          }
        />


        <ExportCard
          icon={LogOut}
          title="Danh sách Check-out"
          description={
            "Danh sách sinh viên đã "
            +
            "Check-out khỏi hoạt động."
          }
          count={
            summary.checkOut
          }
          buttonText={
            "Xuất Check-out"
          }
          loading={
            exportingType ===
            "checkout"
          }
          onExport={() =>
            handleExport(
              "checkout"
            )
          }
        />


        <ExportCard
          icon={UserX}
          title="Đăng ký nhưng không tham gia"
          description={
            "Sinh viên đã đăng ký nhưng "
            +
            "không có cả Check-in và Check-out."
          }
          count={
            summary.absent
          }
          buttonText={
            "Xuất không tham gia"
          }
          loading={
            exportingType ===
            "absent"
          }
          onExport={() =>
            handleExport(
              "absent"
            )
          }
        />

      </section>


      {/* EXPORT ALL */}

      <section style={styles.packageCard}>

        <div style={styles.packageIcon}>

          <PackageCheck
            size={27}
          />

        </div>


        <div style={styles.packageCopy}>

          <strong>
            Xuất toàn bộ dữ liệu
          </strong>


          <span>
            Tạo một file Excel gồm
            4 sheet: Danh sách tham gia,
            Check-in, Check-out và
            Không tham gia.
          </span>

        </div>


        <button
          type="button"
          style={{
            ...styles.packageButton,

            ...(
              !summary.locked
                ? styles.disabledButton
                : {}
            ),
          }}
          disabled={
            !summary.locked ||
            exportingType === "all"
          }
          onClick={() =>
            handleExport(
              "all"
            )
          }
        >

          <Download
            size={17}
          />

          {exportingType === "all"
            ? "Đang tạo file..."
            : "Xuất tất cả"}

        </button>

      </section>


      {!summary.locked && (

        <div style={styles.noticeBox}>

          <AlertCircle
            size={18}
          />


          <span>
            Bạn vẫn có thể xuất Check-in,
            Check-out và danh sách đăng ký
            nhưng không tham gia. Danh sách
            tham gia cuối cùng chỉ được xuất
            sau khi khóa kết quả tại màn
            Đối soát.
          </span>

        </div>

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

        ...(type === "blue"
          ? styles.summaryBlue
          : {}),

        ...(type === "purple"
          ? styles.summaryPurple
          : {}),

        ...(type === "green"
          ? styles.summaryGreen
          : {}),
      }}
    >

      <div style={styles.summaryIcon}>

        <Icon
          size={20}
        />

      </div>


      <div style={styles.summaryCopy}>

        <span>
          {label}
        </span>


        <strong>
          {value ?? "—"}
        </strong>

      </div>

    </div>

  );

}


// ======================================================
// EXPORT CARD
// ======================================================

function ExportCard({
  icon: Icon,
  title,
  description,
  count,
  buttonText,
  disabled = false,
  disabledText = "",
  loading = false,
  onExport,
}) {

  return (

    <article style={styles.exportCard}>

      <div style={styles.exportIcon}>

        <Icon
          size={23}
        />

      </div>


      <div style={styles.exportContent}>

        <strong>
          {title}
        </strong>


        <p>
          {description}
        </p>


        <span style={styles.exportCount}>

          Số lượng:
          {" "}

          <strong>
            {count ?? "—"}
          </strong>

        </span>

      </div>


      <button
        type="button"
        style={{
          ...styles.exportButton,

          ...(disabled
            ? styles.disabledButton
            : {}),
        }}
        disabled={
          disabled ||
          loading
        }
        onClick={
          onExport
        }
      >

        <Download
          size={16}
        />

        {loading
          ? "Đang tạo file..."
          : disabled
            ? disabledText
            : buttonText}

      </button>

    </article>

  );

}


// ======================================================
// BOOLEAN
// ======================================================

function isTrueValue(
  value
) {

  return (
    value === true ||
    value === 1 ||
    [
      "YES",
      "TRUE",
      "Y",
      "1",
    ].includes(
      String(
        value ?? ""
      )
        .trim()
        .toUpperCase()
    )
  );

}


// ======================================================
// DATE
// ======================================================

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
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    flexWrap: "wrap",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1px",
    color: "#2563eb",
  },

  title: {
    margin: "5px 0 0",
    fontSize: "30px",
    color: "#0f172a",
  },

  description: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  refreshButton: {
    minHeight: "42px",
    padding: "0 14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: 700,
    cursor: "pointer",
  },

  successBox: {
    padding: "13px 15px",
    display: "flex",
    gap: "9px",
    alignItems: "center",
    borderRadius: "11px",
    background: "#ecfdf5",
    color: "#047857",
  },

  errorBox: {
    padding: "13px 15px",
    display: "flex",
    gap: "9px",
    alignItems: "center",
    borderRadius: "11px",
    background: "#fef2f2",
    color: "#b91c1c",
  },

  card: {
    padding: "20px",
    border: "1px solid #dbe5f1",
    borderRadius: "18px",
    background: "#ffffff",
  },

  sectionTitle: {
    marginBottom: "13px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  select: {
    width: "100%",
    minHeight: "44px",
    padding: "0 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
  },

  activityInfo: {
    marginTop: "12px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#475569",
  },

  activityCopy: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  lockedBadge: {
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "11px",
    fontWeight: 700,
  },

  unlockedBadge: {
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#b45309",
    fontSize: "11px",
    fontWeight: 700,
  },

  loadingBox: {
    minHeight: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "12px",
  },

  summaryCard: {
    minHeight: "88px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#475569",
  },

  summaryBlue: {
    borderColor: "#bfdbfe",
    background: "#eff6ff",
    color: "#2563eb",
  },

  summaryPurple: {
    borderColor: "#ddd6fe",
    background: "#f5f3ff",
    color: "#7c3aed",
  },

  summaryGreen: {
    borderColor: "#a7f3d0",
    background: "#ecfdf5",
    color: "#047857",
  },

  summaryIcon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.65)",
  },

  summaryCopy: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  exportGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "14px",
  },

  exportCard: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "13px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#ffffff",
  },

  exportIcon: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    background: "#eff6ff",
    color: "#2563eb",
  },

  exportContent: {
    flex: 1,
  },

  exportCount: {
    color: "#64748b",
    fontSize: "12px",
  },

  exportButton: {
    minHeight: "40px",
    padding: "0 13px",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },

  packageCard: {
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    border: "1px solid #bfdbfe",
    borderRadius: "16px",
    background: "#eff6ff",
  },

  packageIcon: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    background: "#dbeafe",
    color: "#2563eb",
  },

  packageCopy: {
    flex: 1,
    minWidth: "230px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "#475569",
  },

  packageButton: {
    minHeight: "42px",
    padding: "0 15px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  noticeBox: {
    padding: "13px 15px",
    display: "flex",
    gap: "9px",
    alignItems: "flex-start",
    borderRadius: "11px",
    background: "#fffbeb",
    color: "#b45309",
  },

};


export default ExportPage;