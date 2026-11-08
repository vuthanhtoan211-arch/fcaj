import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  LockKeyhole,
  RefreshCw,
  Search,
  SearchCheck,
  ThumbsDown,
  ThumbsUp,
  Users,
  XCircle,
} from "lucide-react";

import {
  finalizeActivity,
  getActivities,
  getReconciliation,
  runReconciliation,
  submitDecision,
} from "../services/api";


function ReconciliationPage() {

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState("");

  const [
    reconciliation,
    setReconciliation,
  ] = useState(null);

  const [
    loadingActivities,
    setLoadingActivities,
  ] = useState(true);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    running,
    setRunning,
  ] = useState(false);

  const [
    decisionLoading,
    setDecisionLoading,
  ] = useState("");

  const [
    finalizing,
    setFinalizing,
  ] = useState(false);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

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
        rows
          .filter(
            (activity) => {

              const status =
                String(
                  activity
                    ?.publication_status
                  ||
                  activity
                    ?.status
                  ||
                  ""
                ).toUpperCase();

              return (
                status !==
                  "CANCELLED"
                &&
                status !==
                  "CANCELED"
              );

            }
          )
          .sort(
            (a, b) =>
              new Date(
                b.start_time || 0
              ).getTime()
              -
              new Date(
                a.start_time || 0
              ).getTime()
          );

      setActivities(
        usable
      );

      if (
        usable.length > 0
      ) {

        setSelectedActivityId(
          (current) =>
            current
            ||
            usable[0]
              .activity_id
        );

      }

    } catch (err) {

      setError(
        err?.message
        ||
        "Không thể tải hoạt động."
      );

    } finally {

      setLoadingActivities(
        false
      );

    }

  }


  // ====================================================
  // CHANGE ACTIVITY
  // ====================================================

  useEffect(() => {

    setSearchText("");

    setStatusFilter(
      "ALL"
    );

    setError("");

    setSuccess("");

    setReconciliation(
      null
    );

    if (
      selectedActivityId
    ) {

      loadReconciliation(
        selectedActivityId
      );

    }

  }, [selectedActivityId]);


  // ====================================================
  // LOAD RECONCILIATION
  // ====================================================

  async function loadReconciliation(
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

      const result =
        await getReconciliation(
          activityId
        );

      setReconciliation(
        normalizeReconciliationResponse(
          result
        )
      );

    } catch (err) {

      console.error(
        "Load reconciliation error:",
        err
      );

      setReconciliation(
        null
      );

    } finally {

      setLoading(
        false
      );

    }

  }


  // ====================================================
  // RUN RECONCILIATION
  // ====================================================

  async function handleRun() {

    if (
      !selectedActivityId
    ) {

      return;

    }

    const confirmed =
      window.confirm(
        (
          "Chạy lại đối soát?\n\n"
          +
          "READY sẽ tự động xác nhận.\n"
          +
          "NO_ATTENDANCE sẽ tự động không xác nhận.\n"
          +
          "NEEDS_REVIEW sẽ chờ BTC xử lý.\n\n"
          +
          "Nếu chưa Import Evidence, "
          +
          "cột Evidence sẽ hiển thị "
          +
          "\"Chưa nhập\"."
        )
      );

    if (!confirmed) {

      return;

    }

    try {

      setRunning(
        true
      );

      setError("");

      setSuccess("");

      const result =
        await runReconciliation(
          selectedActivityId
        );

      setSuccess(
        result?.message
        ||
        "Đã chạy đối soát."
      );

      await loadReconciliation(
        selectedActivityId
      );

      await loadActivities();

    } catch (err) {

      setError(
        err?.message
        ||
        "Không thể chạy đối soát."
      );

    } finally {

      setRunning(
        false
      );

    }

  }


  // ====================================================
  // MANUAL DECISION
  // ====================================================

  async function handleDecision(
    row,
    decision
  ) {

    if (
      !evidenceDatasetImported
    ) {

      setError(
        (
          "Chưa nhập Evidence. "
          +
          "Hãy Import Evidence trước "
          +
          "khi BTC xử lý thủ công."
        )
      );

      return;

    }

    const label =
      decision === "CONFIRMED"
        ? "XÁC NHẬN THAM GIA"
        : "KHÔNG XÁC NHẬN";

    const note =
      window.prompt(
        (
          `${label}\n\n`
          +
          `${row.mssv} - `
          +
          `${getFullName(row)}\n\n`
          +
          "Nhập ghi chú xử lý "
          +
          "(có thể để trống):"
        ),
        row.note || ""
      );

    if (
      note === null
    ) {

      return;

    }

    const confirmed =
      window.confirm(
        (
          `Bạn chắc chắn muốn ${label}?\n\n`
          +
          `${row.mssv} - `
          +
          `${getFullName(row)}`
        )
      );

    if (!confirmed) {

      return;

    }

    try {

      setDecisionLoading(
        row.mssv
      );

      setError("");

      setSuccess("");

      const result =
        await submitDecision(
          selectedActivityId,
          row.mssv,
          {
            decision,
            note,
          }
        );

      setSuccess(
        result?.message
        ||
        "Đã lưu quyết định."
      );

      await loadReconciliation(
        selectedActivityId
      );

    } catch (err) {

      setError(
        err?.message
        ||
        "Không thể lưu quyết định."
      );

    } finally {

      setDecisionLoading("");

    }

  }


  // ====================================================
  // FINALIZE
  // ====================================================

  async function handleFinalize() {

    if (
      !evidenceDatasetImported
    ) {

      setError(
        (
          "Chưa nhập Evidence. "
          +
          "Không thể khóa danh sách cuối."
        )
      );

      return;

    }

    if (
      pendingCount > 0
    ) {

      setError(
        `Còn ${pendingCount} sinh viên chưa được xử lý.`
      );

      return;

    }

    const confirmed =
      window.confirm(
        (
          "KHÓA DANH SÁCH CUỐI?\n\n"
          +
          "Sau khi khóa, bạn không thể "
          +
          "chạy lại đối soát hoặc thay đổi "
          +
          "quyết định của sinh viên.\n\n"
          +
          "Bạn có chắc chắn?"
        )
      );

    if (!confirmed) {

      return;

    }

    try {

      setFinalizing(
        true
      );

      setError("");

      setSuccess("");

      const result =
        await finalizeActivity(
          selectedActivityId
        );

      setSuccess(
        result?.message
        ||
        "Đã khóa danh sách cuối."
      );

      await loadActivities();

      await loadReconciliation(
        selectedActivityId
      );

    } catch (err) {

      setError(
        err?.message
        ||
        "Không thể khóa danh sách cuối."
      );

    } finally {

      setFinalizing(
        false
      );

    }

  }


  // ====================================================
  // DATA
  // ====================================================

  const rows =
    reconciliation
      ?.items
    ||
    [];

  const selectedActivity =
    activities.find(
      (activity) =>
        activity.activity_id
        ===
        selectedActivityId
    );

  const finalListLocked =
    Boolean(
      reconciliation
        ?.final_list_locked
      ??
      selectedActivity
        ?.final_list_locked
    );

  const evidenceDatasetImported =
    Boolean(
      reconciliation
        ?.evidence_dataset_imported
    );


  // ====================================================
  // SUMMARY
  // ====================================================

  const summary =
    useMemo(
      () => {

        const result = {

          total:
            rows.length,

          ready:
            0,

          review:
            0,

          noAttendance:
            0,

          confirmed:
            0,

          rejected:
            0,

          pending:
            0,
        };

        rows.forEach(
          (row) => {

            const status =
              getReconciliationStatus(
                row
              );

            if (
              status ===
              "READY"
            ) {

              result.ready += 1;

            } else if (
              status ===
              "NO_ATTENDANCE"
            ) {

              result.noAttendance +=
                1;

            } else {

              result.review += 1;

            }

            const finalStatus =
              getFinalStatus(
                row
              );

            if (
              finalStatus ===
              "CONFIRMED"
            ) {

              result.confirmed +=
                1;

            } else if (
              finalStatus ===
              "REJECTED"
            ) {

              result.rejected +=
                1;

            } else {

              result.pending +=
                1;

            }

          }
        );

        return result;

      },
      [rows]
    );

  const pendingCount =
    summary.pending;


  // ====================================================
  // FILTER
  // ====================================================

  const filteredRows =
    useMemo(
      () => {

        const keyword =
          searchText
            .trim()
            .toLowerCase();

        return rows.filter(
          (row) => {

            const status =
              getReconciliationStatus(
                row
              );

            if (
              statusFilter !==
                "ALL"
              &&
              status !==
                statusFilter
            ) {

              return false;

            }

            if (!keyword) {

              return true;

            }

            const text = [

              row.mssv,

              getFullName(
                row
              ),

              getFinalStatus(
                row
              ),

              getEvidenceStatus(
                row,
                evidenceDatasetImported
              ),

              ...getIssues(
                row
              ),

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
        rows,
        searchText,
        statusFilter,
        evidenceDatasetImported,
      ]
    );


  // ====================================================
  // UI
  // ====================================================

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <span style={styles.eyebrow}>
            ĐỐI SOÁT DỮ LIỆU
          </span>

          <h2 style={styles.title}>
            Xác nhận tham gia hoạt động
          </h2>

          <p style={styles.description}>
            Đối chiếu Registration,
            Check-in, Check-out và
            Evidence theo MSSV.
          </p>

        </div>

        <div style={styles.headerActions}>

          <button
            type="button"
            style={{
              ...styles.runButton,

              ...(
                running
                ||
                finalListLocked
                  ? styles.disabledButton
                  : {}
              ),
            }}
            onClick={
              handleRun
            }
            disabled={
              running
              ||
              finalListLocked
            }
          >

            <SearchCheck
              size={17}
            />

            {running
              ? "Đang đối soát..."
              : "Chạy đối soát"}

          </button>

          <button
            type="button"
            style={{
              ...styles.finalizeButton,

              ...(
                pendingCount > 0
                ||
                finalListLocked
                ||
                !evidenceDatasetImported
                ||
                rows.length === 0

                  ? styles.disabledButton
                  : {}
              ),
            }}
            onClick={
              handleFinalize
            }
            disabled={
              pendingCount > 0
              ||
              finalizing
              ||
              finalListLocked
              ||
              !evidenceDatasetImported
              ||
              rows.length === 0
            }
          >

            <LockKeyhole
              size={17}
            />

            {finalListLocked
              ? "Danh sách đã khóa"
              : finalizing
                ? "Đang khóa..."
                : "Khóa danh sách cuối"}

          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div style={styles.errorBox}>

          <AlertCircle
            size={19}
          />

          {error}

        </div>

      )}


      {/* SUCCESS */}

      {success && (

        <div style={styles.successBox}>

          <CheckCircle2
            size={19}
          />

          {success}

        </div>

      )}


      {/* LOCKED */}

      {finalListLocked && (

        <div style={styles.lockedBox}>

          <LockKeyhole
            size={19}
          />

          Danh sách cuối đã được khóa.
          Dữ liệu đối soát không còn
          được chỉnh sửa.

        </div>

      )}


      {/* ACTIVITY */}

      <section style={styles.card}>

        <div style={styles.sectionTitle}>

          <strong>
            Chọn hoạt động
          </strong>

          <span>
            Chọn chương trình cần
            kiểm tra dữ liệu tham gia.
          </span>

        </div>

        {loadingActivities ? (

          <div style={styles.loadingBox}>
            Đang tải...
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

            <ClipboardCheck
              size={19}
            />

            <div style={styles.activityCopy}>

              <strong>
                {
                  selectedActivity
                    .activity_name
                }
              </strong>

              <span>

                {
                  selectedActivity
                    .activity_id
                }

                {" · "}

                {formatDate(
                  selectedActivity
                    .start_time
                )}

                {" · "}

                {
                  selectedActivity
                    .location
                  ||
                  "Chưa cập nhật"
                }

              </span>

            </div>

          </div>

        )}

      </section>


      {/* EMPTY */}

      {!reconciliation ? (

        <section style={styles.emptyCard}>

          <SearchCheck
            size={38}
          />

          <strong>

            {loading
              ? "Đang tải kết quả đối soát..."
              : "Chưa có kết quả đối soát"}

          </strong>

        </section>

      ) : (

        <>

          {/* EVIDENCE DATASET STATUS */}

          <div
            style={
              evidenceDatasetImported
                ? styles.evidenceImportedBox
                : styles.evidenceNotImportedBox
            }
          >

            {evidenceDatasetImported
              ? (
                  <CheckCircle2
                    size={19}
                  />
                )
              : (
                  <AlertCircle
                    size={19}
                  />
                )}

            <div style={styles.evidenceNoticeCopy}>

              <strong>

                {evidenceDatasetImported
                  ? "Evidence đã được nhập"
                  : "Evidence chưa được nhập"}

              </strong>

              <span>

                {evidenceDatasetImported
                  ? (
                      "Cột Evidence phân biệt "
                      +
                      "Có và Không theo file "
                      +
                      "Evidence hiện tại."
                    )
                  : (
                      "Cột Evidence sẽ hiển thị "
                      +
                      "Chưa nhập. BTC chưa thể "
                      +
                      "xử lý thủ công hoặc khóa "
                      +
                      "danh sách cuối."
                    )}

              </span>

            </div>

          </div>


          {/* SUMMARY */}

          <section style={styles.summaryGrid}>

            <SummaryCard
              icon={Users}
              label="Tổng đăng ký"
              value={
                summary.total
              }
            />

            <SummaryCard
              icon={
                CheckCircle2
              }
              label="Sẵn sàng xác nhận"
              value={
                summary.ready
              }
              type="success"
            />

            <SummaryCard
              icon={
                AlertCircle
              }
              label="Cần kiểm tra"
              value={
                summary.review
              }
              type="warning"
            />

            <SummaryCard
              icon={
                XCircle
              }
              label="Không tham gia"
              value={
                summary.noAttendance
              }
              type="danger"
            />

          </section>


          {/* FINAL STATUS */}

          <section style={styles.finalStatusBar}>

            <span style={styles.finalConfirmed}>

              Đã xác nhận

              <strong>
                {summary.confirmed}
              </strong>

            </span>

            <span style={styles.finalRejected}>

              Không xác nhận

              <strong>
                {summary.rejected}
              </strong>

            </span>

            <span style={styles.finalPending}>

              Chờ BTC xử lý

              <strong>
                {summary.pending}
              </strong>

            </span>

          </section>


          {/* TABLE */}

          <section style={styles.card}>

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
                  placeholder="Tìm MSSV, họ tên, lỗi..."
                  style={styles.searchInput}
                />

              </div>

              <select
                value={
                  statusFilter
                }
                onChange={
                  (event) =>
                    setStatusFilter(
                      event.target.value
                    )
                }
                style={styles.filterSelect}
              >

                <option value="ALL">
                  Tất cả trạng thái
                </option>

                <option value="READY">
                  Sẵn sàng
                </option>

                <option value="NEEDS_REVIEW">
                  Cần kiểm tra
                </option>

                <option value="NO_ATTENDANCE">
                  Không tham gia
                </option>

              </select>

              <button
                type="button"
                style={styles.refreshButton}
                onClick={() =>
                  loadReconciliation()
                }
              >

                <RefreshCw
                  size={16}
                />

                Làm mới

              </button>

            </div>

            <div style={styles.tableInfo}>

              Hiển thị{" "}

              <strong>
                {filteredRows.length}
              </strong>

              {" / "}

              {rows.length}

              {" "}

              sinh viên

            </div>

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
                      Đăng ký
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
                      Đối soát
                    </th>

                    <th style={styles.th}>
                      Vấn đề
                    </th>

                    <th style={styles.th}>
                      Xác nhận cuối
                    </th>

                    <th style={styles.th}>
                      Xử lý
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredRows.map(
                    (
                      row,
                      index
                    ) => {

                      const status =
                        getReconciliationStatus(
                          row
                        );

                      const finalStatus =
                        getFinalStatus(
                          row
                        );

                      const canDecide =
                        status ===
                          "NEEDS_REVIEW"
                        &&
                        !finalListLocked
                        &&
                        evidenceDatasetImported;

                      const rowLoading =
                        decisionLoading ===
                        row.mssv;

                      return (

                        <tr
                          key={
                            row.mssv
                            ||
                            index
                          }
                        >

                          <td style={styles.td}>
                            {index + 1}
                          </td>

                          <td style={styles.td}>

                            <strong>
                              {row.mssv}
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
                                row.registered
                              }
                            />

                          </td>

                          <td style={styles.tdCenter}>

                            <BooleanBadge
                              value={
                                row.check_in
                                ??
                                row.checked_in
                              }
                            />

                          </td>

                          <td style={styles.tdCenter}>

                            <BooleanBadge
                              value={
                                row.check_out
                                ??
                                row.checked_out
                              }
                            />

                          </td>


                          {/* EVIDENCE 3 STATES */}

                          <td style={styles.tdCenter}>

                            <EvidenceBadge
                              row={row}
                              datasetImported={
                                evidenceDatasetImported
                              }
                            />

                          </td>


                          <td style={styles.td}>

                            <StatusBadge
                              status={
                                status
                              }
                            />

                          </td>

                          <td style={styles.td}>

                            <IssueList
                              issues={
                                getIssues(
                                  row
                                )
                              }
                            />

                          </td>

                          <td style={styles.td}>

                            <FinalStatusBadge
                              status={
                                finalStatus
                              }
                            />

                          </td>

                          <td style={styles.td}>

                            {canDecide ? (

                              <div style={styles.decisionActions}>

                                <button
                                  type="button"
                                  style={styles.confirmButton}
                                  disabled={
                                    rowLoading
                                  }
                                  onClick={() =>
                                    handleDecision(
                                      row,
                                      "CONFIRMED"
                                    )
                                  }
                                >

                                  <ThumbsUp
                                    size={14}
                                  />

                                  Xác nhận

                                </button>

                                <button
                                  type="button"
                                  style={styles.rejectButton}
                                  disabled={
                                    rowLoading
                                  }
                                  onClick={() =>
                                    handleDecision(
                                      row,
                                      "REJECTED"
                                    )
                                  }
                                >

                                  <ThumbsDown
                                    size={14}
                                  />

                                  Không xác nhận

                                </button>

                              </div>

                            ) : (

                              <span style={styles.autoText}>

                                {
                                  !evidenceDatasetImported
                                  &&
                                  status ===
                                    "NEEDS_REVIEW"

                                    ? "Chờ Evidence"

                                    : row.decision_source ===
                                        "SYSTEM"

                                      ? "Tự động"

                                      : row.decision_source ===
                                          "MANUAL"

                                        ? "BTC đã xử lý"

                                        : "—"
                                }

                              </span>

                            )}

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </>

      )}

    </div>

  );

}


// ======================================================
// NORMALIZE RESPONSE
// ======================================================

function normalizeReconciliationResponse(
  response
) {

  const data =
    response?.data
    ??
    response;

  if (
    Array.isArray(
      data
    )
  ) {

    return {

      items:
        data,

      final_list_locked:
        false,

      evidence_dataset_imported:
        false,
    };

  }

  return {

    ...(data || {}),

    items:
      Array.isArray(
        data?.items
      )
        ? data.items
        : [],
  };

}


// ======================================================
// FULL NAME
// ======================================================

function getFullName(
  row
) {

  return (
    row?.full_name
    ||
    row?.student_name
    ||
    row?.name
    ||
    "—"
  );

}


// ======================================================
// RECONCILIATION STATUS
// ======================================================

function getReconciliationStatus(
  row
) {

  const value =
    String(
      row
        ?.reconciliation_status
      ||
      row
        ?.status
      ||
      ""
    )
      .trim()
      .toUpperCase();

  if (
    value ===
    "READY"
  ) {

    return "READY";

  }

  if (
    value ===
    "NO_ATTENDANCE"
  ) {

    return "NO_ATTENDANCE";

  }

  return "NEEDS_REVIEW";

}


// ======================================================
// FINAL STATUS
// ======================================================

function getFinalStatus(
  row
) {

  const status =
    String(
      row?.final_status
      ||
      "PENDING"
    ).toUpperCase();

  if (
    status ===
      "CONFIRMED"
    ||
    status ===
      "REJECTED"
  ) {

    return status;

  }

  return "PENDING";

}


// ======================================================
// ISSUES
// ======================================================

function getIssues(
  row
) {

  if (
    Array.isArray(
      row?.issues
    )
  ) {

    return row.issues;

  }

  if (
    !row?.issues
  ) {

    return [];

  }

  return String(
    row.issues
  )
    .split(",")
    .map(
      (value) =>
        value.trim()
    )
    .filter(
      Boolean
    );

}


// ======================================================
// BOOL
// ======================================================

function isTrueValue(
  value
) {

  return (

    value === true
    ||
    value === 1
    ||
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
// EVIDENCE STATUS
// ======================================================

function getEvidenceStatus(
  row,
  datasetImported
) {

  const explicit =
    String(
      row
        ?.evidence_status
      ||
      ""
    )
      .trim()
      .toUpperCase();

  // Backend mới trả trực tiếp trạng thái.
  if (
    explicit === "YES"
    ||
    explicit === "NO"
    ||
    explicit === "NOT_IMPORTED"
  ) {

    return explicit;

  }

  // Tương thích dữ liệu cũ.
  if (
    row
      ?.evidence_dataset_imported
      === false
    ||
    (
      row
        ?.evidence_dataset_imported
        == null
      &&
      !datasetImported
    )
  ) {

    return "NOT_IMPORTED";

  }

  const value =
    row
      ?.evidence_submitted
    ??
    row
      ?.evidence
    ??
    row
      ?.has_evidence;

  return (
    isTrueValue(
      value
    )
      ? "YES"
      : "NO"
  );

}


// ======================================================
// EVIDENCE BADGE
// ======================================================

function EvidenceBadge({
  row,
  datasetImported,
}) {

  const status =
    getEvidenceStatus(
      row,
      datasetImported
    );

  if (
    status === "YES"
  ) {

    return (

      <span style={styles.evidenceYesBadge}>
        Có
      </span>

    );

  }

  if (
    status === "NO"
  ) {

    return (

      <span style={styles.evidenceNoBadge}>
        Không
      </span>

    );

  }

  return (

    <span style={styles.evidenceNotImportedBadge}>
      Chưa nhập
    </span>

  );

}


// ======================================================
// RECONCILIATION BADGE
// ======================================================

function StatusBadge({
  status,
}) {

  const mapping = {

    READY: {

      text:
        "Sẵn sàng",

      style:
        styles.readyBadge,
    },

    NEEDS_REVIEW: {

      text:
        "Cần kiểm tra",

      style:
        styles.reviewBadge,
    },

    NO_ATTENDANCE: {

      text:
        "Không tham gia",

      style:
        styles.noAttendanceBadge,
    },

  };

  const item =
    mapping[
      status
    ]
    ||
    mapping
      .NEEDS_REVIEW;

  return (

    <span style={item.style}>
      {item.text}
    </span>

  );

}


// ======================================================
// FINAL BADGE
// ======================================================

function FinalStatusBadge({
  status,
}) {

  if (
    status ===
    "CONFIRMED"
  ) {

    return (

      <span style={styles.confirmedBadge}>
        Đã xác nhận
      </span>

    );

  }

  if (
    status ===
    "REJECTED"
  ) {

    return (

      <span style={styles.rejectedBadge}>
        Không xác nhận
      </span>

    );

  }

  return (

    <span style={styles.pendingBadge}>
      Chờ xử lý
    </span>

  );

}


// ======================================================
// ISSUES
// ======================================================

function IssueList({
  issues,
}) {

  if (
    !issues.length
  ) {

    return (

      <span style={styles.noIssue}>
        Không có
      </span>

    );

  }

  return (

    <div style={styles.issueList}>

      {issues.map(
        (issue) => (

          <span
            key={
              issue
            }
            style={
              styles.issueBadge
            }
          >

            {formatIssue(
              issue
            )}

          </span>

        )
      )}

    </div>

  );

}


function formatIssue(
  issue
) {

  const mapping = {

    MISSING_CHECK_IN:
      "Thiếu Check-in",

    MISSING_CHECK_OUT:
      "Thiếu Check-out",

    MISSING_EVIDENCE:
      "Thiếu Evidence",

    EVIDENCE_NOT_IMPORTED:
      "Chưa nhập Evidence",

    NO_ATTENDANCE:
      "Không có điểm danh",

    NOT_REGISTERED:
      "Chưa đăng ký",
  };

  const key =
    String(
      issue
      ||
      ""
    ).toUpperCase();

  return (
    mapping[
      key
    ]
    ||
    issue
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

        ...(
          type === "success"
            ? styles.summarySuccess
            : {}
        ),

        ...(
          type === "warning"
            ? styles.summaryWarning
            : {}
        ),

        ...(
          type === "danger"
            ? styles.summaryDanger
            : {}
        ),

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
// DATE
// ======================================================

function formatDate(
  value
) {

  if (!value) {

    return "—";

  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(
      value
    );

  }

  return (
    new Intl.DateTimeFormat(
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
    ).format(
      date
    )
  );

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


  headerActions: {

    display:
      "flex",

    gap:
      "8px",

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


  runButton: {

    minHeight:
      "43px",

    padding:
      "0 16px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "8px",

    border:
      "none",

    borderRadius:
      "11px",

    background:
      "#2563eb",

    color:
      "#ffffff",

    fontWeight:
      700,

    cursor:
      "pointer",
  },


  finalizeButton: {

    minHeight:
      "43px",

    padding:
      "0 16px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "8px",

    border:
      "none",

    borderRadius:
      "11px",

    background:
      "#0f172a",

    color:
      "#ffffff",

    fontWeight:
      700,

    cursor:
      "pointer",
  },


  disabledButton: {

    opacity:
      0.45,

    cursor:
      "not-allowed",
  },


  errorBox: {

    padding:
      "13px 15px",

    display:
      "flex",

    gap:
      "9px",

    alignItems:
      "center",

    borderRadius:
      "11px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },


  successBox: {

    padding:
      "13px 15px",

    display:
      "flex",

    gap:
      "9px",

    alignItems:
      "center",

    borderRadius:
      "11px",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  lockedBox: {

    padding:
      "13px 15px",

    display:
      "flex",

    gap:
      "9px",

    alignItems:
      "center",

    borderRadius:
      "11px",

    background:
      "#f1f5f9",

    color:
      "#334155",
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

    gap:
      "10px",

    alignItems:
      "center",

    borderRadius:
      "11px",

    background:
      "#f8fafc",

    color:
      "#475569",
  },


  activityCopy: {

    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "3px",
  },


  loadingBox: {

    minHeight:
      "60px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",
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

    border:
      "1px dashed #cbd5e1",

    borderRadius:
      "18px",

    background:
      "#ffffff",

    color:
      "#94a3b8",
  },


  // ========================================
  // EVIDENCE DATASET
  // ========================================

  evidenceImportedBox: {

    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "10px",

    border:
      "1px solid #a7f3d0",

    borderRadius:
      "13px",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  evidenceNotImportedBox: {

    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "10px",

    border:
      "1px solid #fde68a",

    borderRadius:
      "13px",

    background:
      "#fffbeb",

    color:
      "#b45309",
  },


  evidenceNoticeCopy: {

    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "3px",

    fontSize:
      "12px",
  },


  summaryGrid: {

    display:
      "grid",

    gridTemplateColumns:
      (
        "repeat("
        +
        "auto-fit,"
        +
        "minmax(180px,1fr)"
        +
        ")"
      ),

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

    gap:
      "12px",

    alignItems:
      "center",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "14px",

    background:
      "#ffffff",

    color:
      "#475569",
  },


  summaryIcon: {

    width:
      "40px",

    height:
      "40px",

    flexShrink:
      0,

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

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

    fontSize:
      "13px",

    fontWeight:
      500,
  },


  summaryValue: {

    fontSize:
      "24px",

    lineHeight:
      1,

    fontWeight:
      800,
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


  finalStatusBar: {

    padding:
      "12px 16px",

    display:
      "flex",

    gap:
      "10px",

    flexWrap:
      "wrap",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "14px",

    background:
      "#ffffff",
  },


  finalConfirmed: {

    padding:
      "8px 11px",

    display:
      "flex",

    gap:
      "7px",

    borderRadius:
      "9px",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  finalRejected: {

    padding:
      "8px 11px",

    display:
      "flex",

    gap:
      "7px",

    borderRadius:
      "9px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },


  finalPending: {

    padding:
      "8px 11px",

    display:
      "flex",

    gap:
      "7px",

    borderRadius:
      "9px",

    background:
      "#fffbeb",

    color:
      "#b45309",
  },


  toolbar: {

    display:
      "flex",

    gap:
      "10px",

    flexWrap:
      "wrap",
  },


  searchBox: {

    flex:
      1,

    minWidth:
      "230px",

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


  filterSelect: {

    minHeight:
      "41px",

    padding:
      "0 10px",

    border:
      "1px solid #cbd5e1",

    borderRadius:
      "10px",

    background:
      "#ffffff",
  },


  refreshButton: {

    minHeight:
      "41px",

    padding:
      "0 13px",

    display:
      "flex",

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


  tableInfo: {

    margin:
      "13px 0 9px",

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
      "1450px",

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

    borderBottom:
      "1px solid #e2e8f0",
  },


  td: {

    padding:
      "11px",

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

    borderBottom:
      "1px solid #f1f5f9",

    verticalAlign:
      "middle",
  },


  // ========================================
  // BOOLEAN
  // ========================================

  yesBadge: {

    padding:
      "4px 8px",

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

    padding:
      "4px 8px",

    borderRadius:
      "999px",

    background:
      "#f1f5f9",

    color:
      "#64748b",

    fontWeight:
      700,
  },


  // ========================================
  // EVIDENCE 3 STATES
  // ========================================

  evidenceYesBadge: {

    padding:
      "4px 9px",

    borderRadius:
      "999px",

    background:
      "#ecfdf5",

    color:
      "#047857",

    fontWeight:
      700,

    whiteSpace:
      "nowrap",
  },


  evidenceNoBadge: {

    padding:
      "4px 9px",

    borderRadius:
      "999px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",

    fontWeight:
      700,

    whiteSpace:
      "nowrap",
  },


  evidenceNotImportedBadge: {

    padding:
      "4px 9px",

    borderRadius:
      "999px",

    background:
      "#fffbeb",

    color:
      "#b45309",

    fontWeight:
      700,

    whiteSpace:
      "nowrap",
  },


  readyBadge: {

    padding:
      "5px 8px",

    borderRadius:
      "999px",

    background:
      "#ecfdf5",

    color:
      "#047857",

    fontWeight:
      700,
  },


  reviewBadge: {

    padding:
      "5px 8px",

    borderRadius:
      "999px",

    background:
      "#fffbeb",

    color:
      "#b45309",

    fontWeight:
      700,
  },


  noAttendanceBadge: {

    padding:
      "5px 8px",

    borderRadius:
      "999px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",

    fontWeight:
      700,
  },


  confirmedBadge: {

    padding:
      "5px 8px",

    borderRadius:
      "999px",

    background:
      "#dcfce7",

    color:
      "#15803d",

    fontWeight:
      700,

    whiteSpace:
      "nowrap",
  },


  rejectedBadge: {

    padding:
      "5px 8px",

    borderRadius:
      "999px",

    background:
      "#fee2e2",

    color:
      "#b91c1c",

    fontWeight:
      700,

    whiteSpace:
      "nowrap",
  },


  pendingBadge: {

    padding:
      "5px 8px",

    borderRadius:
      "999px",

    background:
      "#fef3c7",

    color:
      "#b45309",

    fontWeight:
      700,

    whiteSpace:
      "nowrap",
  },


  issueList: {

    display:
      "flex",

    gap:
      "5px",

    flexWrap:
      "wrap",
  },


  issueBadge: {

    padding:
      "4px 7px",

    borderRadius:
      "999px",

    background:
      "#fff7ed",

    color:
      "#c2410c",

    fontWeight:
      600,

    whiteSpace:
      "nowrap",
  },


  noIssue: {

    color:
      "#94a3b8",
  },


  decisionActions: {

    display:
      "flex",

    gap:
      "6px",

    flexWrap:
      "wrap",
  },


  confirmButton: {

    minHeight:
      "31px",

    padding:
      "0 9px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "5px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#dcfce7",

    color:
      "#15803d",

    fontSize:
      "11px",

    fontWeight:
      700,

    cursor:
      "pointer",
  },


  rejectButton: {

    minHeight:
      "31px",

    padding:
      "0 9px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "5px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#fee2e2",

    color:
      "#b91c1c",

    fontSize:
      "11px",

    fontWeight:
      700,

    cursor:
      "pointer",
  },


  autoText: {

    color:
      "#64748b",

    fontSize:
      "11px",

    whiteSpace:
      "nowrap",
  },

};


export default ReconciliationPage;