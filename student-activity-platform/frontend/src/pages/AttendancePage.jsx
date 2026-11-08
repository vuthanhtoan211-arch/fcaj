import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  LogIn,
  LogOut,
  RefreshCw,
  Users,
  AlertCircle,
  ScanLine,
  LockKeyhole,
  Radio,
  CalendarDays,
} from "lucide-react";

import {
  getAttendance,
  getActivities,
  checkIn,
  checkOut,
  openCheckOut,
  closeCheckOut,
} from "../services/api";


function AttendancePage({
  activity,
  onBack,
}) {

  const [
    mode,
    setMode,
  ] = useState(
    "checkin"
  );

  const [
    mssv,
    setMssv,
  ] = useState("");

  const [
    attendance,
    setAttendance,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    changingCheckoutState,
    setChangingCheckoutState,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(null);

  const inputRef = useRef(null);

  // Danh sách hoạt động dùng cho bộ chọn riêng trên trang điểm danh.
  const [activityOptions, setActivityOptions] = useState(
    activity ? [activity] : []
  );
  const [selectedActivityId, setSelectedActivityId] = useState(
    activity?.activity_id || ""
  );
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityLoadError, setActivityLoadError] = useState("");
  const activeActivityIdRef = useRef(activity?.activity_id || "");
  const attendanceRequestRef = useRef(0);

  const currentActivity =
    activityOptions.find(
      (item) => item.activity_id === selectedActivityId
    ) || (
      activity?.activity_id === selectedActivityId ? activity : null
    );

  const activityId = currentActivity?.activity_id;

  async function loadActivityOptions() {
    try {
      setLoadingActivities(true);
      setActivityLoadError("");
      const result = await getActivities();
      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.data?.items)
            ? result.data.items
            : [];

      const validRows = rows.filter((item) => item?.activity_id);
      const initialActivity = activity?.activity_id &&
        !validRows.some((item) => item.activity_id === activity.activity_id)
        ? [activity]
        : [];
      const nextOptions = [...initialActivity, ...validRows];
      setActivityOptions(nextOptions);

      if (!activeActivityIdRef.current && nextOptions.length) {
        const firstId = nextOptions[0].activity_id;
        activeActivityIdRef.current = firstId;
        setSelectedActivityId(firstId);
      }
    } catch (error) {
      console.error("Load activities error:", error);
      setActivityLoadError(
        "Không tải được danh sách hoạt động. Có thể thử làm mới danh sách."
      );
    } finally {
      setLoadingActivities(false);
    }
  }

  useEffect(() => {
    loadActivityOptions();
  }, []);

  // Khi người dùng chuyển hoạt động, vô hiệu hóa các phản hồi cũ
  // và xóa MSSV đang nhập để tránh quét nhầm sang hoạt động khác.
  function handleActivityChange(nextId) {
    if (submitting || changingCheckoutState || nextId === selectedActivityId) {
      return;
    }
    activeActivityIdRef.current = nextId;
    attendanceRequestRef.current += 1;
    setSelectedActivityId(nextId);
    setAttendance(null);
    setMssv("");
    setMessage(null);
    setLoading(true);
  }


  const checkoutOpen =
    Boolean(
      attendance
        ?.check_out_open
    );


  const finalListLocked =
    Boolean(
      currentActivity
        ?.final_list_locked
    );


  const scannerDisabled =
    !activityId
    || loading
    || submitting
    ||
    finalListLocked
    ||
    (
      mode ===
        "checkout"
      &&
      !checkoutOpen
    );


  // =====================================================
  // LOAD + POLLING REALTIME
  // =====================================================

  useEffect(() => {

    if (!activityId) {

      return;

    }


    loadAttendance();


    const timer =
      window.setInterval(
        () => {

          loadAttendance(
            false
          );

        },
        2000
      );


    return () => {

      window.clearInterval(
        timer
      );

    };

  }, [activityId]);


  // =====================================================
  // AUTO FOCUS SCANNER
  // =====================================================

  useEffect(() => {

    if (
      !scannerDisabled
    ) {

      window.setTimeout(
        () => {

          inputRef
            .current
            ?.focus();

        },
        50
      );

    }

  }, [
    mode,
    activityId,
    checkoutOpen,
    finalListLocked,
  ]);


  // =====================================================
  // LOAD ATTENDANCE
  // =====================================================

  async function loadAttendance(showLoading = true) {
    if (!activityId) {
      return;
    }

    const requestedActivityId = activityId;
    const requestId = ++attendanceRequestRef.current;

    try {
      if (showLoading) setLoading(true);

      const result = await getAttendance(requestedActivityId);
      const data = result?.data ?? result ?? {};

      // Không để kết quả polling của hoạt động cũ ghi đè giao diện mới.
      if (
        activeActivityIdRef.current !== requestedActivityId ||
        attendanceRequestRef.current !== requestId
      ) {
        return;
      }
      setAttendance(data);
    } catch (error) {
      if (
        activeActivityIdRef.current === requestedActivityId &&
        attendanceRequestRef.current === requestId
      ) {
        console.error("Attendance error:", error);
        setMessage({
          type: "error",
          text: getApiErrorMessage(error) || "Không thể tải dữ liệu điểm danh.",
        });
      }
    } finally {
      if (
        activeActivityIdRef.current === requestedActivityId &&
        attendanceRequestRef.current === requestId
      ) {
        setLoading(false);
      }
    }
  }


  // =====================================================
  // OPEN / CLOSE CHECK-OUT
  // =====================================================

  async function handleCheckoutStateChange() {

    if (!activityId) {

      return;

    }


    if (finalListLocked) {

      setMessage({
        type:
          "error",

        text:
          (
            "Danh sách cuối đã khóa. "
            +
            "Không thể thay đổi Check-out."
          ),
      });

      return;

    }


    const action =
      checkoutOpen
        ? "đóng"
        : "mở";


    const confirmed =
      window.confirm(
        checkoutOpen
          ? (
              "ĐÓNG CHECK-OUT?\n\n"
              +
              "Sau khi đóng, scanner Check-out "
              +
              "sẽ tạm ngừng ghi nhận.\n\n"
              +
              "BTC vẫn có thể mở lại nếu cần."
            )
          : (
              "MỞ CHECK-OUT?\n\n"
              +
              "Sau khi mở, BTC có thể quét "
              +
              "thẻ sinh viên để ghi nhận "
              +
              "Check-out realtime."
            )
      );


    if (!confirmed) {

      return;

    }


    try {

      setChangingCheckoutState(
        true
      );

      setMessage(
        null
      );


      const result =
        checkoutOpen

          ? await closeCheckOut(
              activityId
            )

          : await openCheckOut(
              activityId
            );


      setMessage({

        type:
          "success",

        text:
          (
            result?.message
            ||
            `Đã ${action} Check-out.`
          ),

      });


      setMssv("");


      await loadAttendance(
        false
      );


    } catch (error) {

      console.error(
        "Checkout state error:",
        error
      );


      setMessage({

        type:
          "error",

        text:
          (
            getApiErrorMessage(
              error
            )
            ||
            `Không thể ${action} Check-out.`
          ),

      });

    } finally {

      setChangingCheckoutState(
        false
      );


      window.setTimeout(
        () => {

          if (
            !checkoutOpen
          ) {

            inputRef
              .current
              ?.focus();

          }

        },
        80
      );

    }

  }


  // =====================================================
  // SUBMIT SCAN
  // =====================================================

  async function handleSubmit(
    event
  ) {

    event?.preventDefault();


    if (
      finalListLocked
    ) {

      setMessage({

        type:
          "error",

        text:
          (
            "Danh sách cuối đã khóa. "
            +
            "Không thể tiếp tục điểm danh."
          ),

      });

      return;

    }


    if (
      mode === "checkout"
      &&
      !checkoutOpen
    ) {

      setMessage({

        type:
          "error",

        text:
          (
            "BTC chưa mở Check-out. "
            +
            "Hãy mở Check-out trước khi quét."
          ),

      });

      return;

    }


    const studentId =
      mssv
        .trim()
        .toUpperCase();


    if (!studentId) {

      setMessage({

        type:
          "error",

        text:
          "Vui lòng quét hoặc nhập MSSV.",

      });


      inputRef
        .current
        ?.focus();


      return;

    }


    if (!activityId) {

      return;

    }


    try {

      setSubmitting(
        true
      );

      setMessage(
        null
      );


      let result;


      if (
        mode === "checkin"
      ) {

        result =
          await checkIn(
            activityId,
            studentId
          );

      } else {

        result =
          await checkOut(
            activityId,
            studentId
          );

      }


      let responseMessage;


      if (
        typeof result ===
        "string"
      ) {

        responseMessage =
          result;

      } else {

        responseMessage =
          result?.message
          ||
          result?.detail
          ||
          (
            mode === "checkin"
              ? "Check-in thành công."
              : "Check-out thành công."
          );

      }


      setMessage({

        type:
          "success",

        text:
          `${studentId} — ${responseMessage}`,

      });


      setMssv("");


      await loadAttendance(
        false
      );


      window.setTimeout(
        () => {

          inputRef
            .current
            ?.focus();

        },
        50
      );


    } catch (error) {

      console.error(
        error
      );


      let errorMessage =
        getApiErrorMessage(
          error
        )
        ||
        "Không thể ghi nhận điểm danh.";


      if (
        error?.status === 409
      ) {

        errorMessage =
          mode === "checkin"

            ? (
                "Sinh viên này đã "
                +
                "Check-in trước đó."
              )

            : (
                "Sinh viên này đã "
                +
                "Check-out trước đó."
              );

      }


      setMessage({

        type:
          "error",

        text:
          `${studentId} — ${errorMessage}`,

      });


      setMssv("");


      window.setTimeout(
        () => {

          if (
            !scannerDisabled
          ) {

            inputRef
              .current
              ?.focus();

          }

        },
        50
      );


    } finally {

      setSubmitting(
        false
      );

    }

  }


  // =====================================================
  // NO ACTIVITY
  // =====================================================

  if (!currentActivity) {

    return (

      <div style={styles.emptyState}>

        <ScanLine
          size={42}
          color="#2563eb"
        />


        <h2>
          Chưa chọn hoạt động
        </h2>


        <p>
          Hãy chọn một hoạt động trước
          khi bắt đầu Check-in hoặc
          Check-out.
        </p>


        <button
          type="button"
          style={styles.primaryButton}
          onClick={onBack}
        >

          <ArrowLeft
            size={17}
          />

          Chọn hoạt động

        </button>

      </div>

    );

  }


  // =====================================================
  // COUNTERS
  // =====================================================

  const registered =
    attendance
      ?.total_registered
    ??
    0;


  const checkedIn =
    attendance
      ?.total_checked_in
    ??
    0;


  const checkedOut =
    attendance
      ?.total_checked_out
    ??
    0;


  // =====================================================
  // UI
  // =====================================================

  return (

    <div style={styles.page}>

      <section style={styles.activitySelectorCard}>
        <div style={styles.activitySelectorHeader}>
          <div style={styles.activitySelectorTitle}>
            <CalendarDays size={19} color="#2563eb" />
            <div>
              <strong>Chọn hoạt động điểm danh</strong>
              <p style={styles.activitySelectorDescription}>
                Chọn đúng hoạt động trước khi quét QR hoặc nhập MSSV.
              </p>
            </div>
          </div>
          <button
            type="button"
            style={styles.refreshButton}
            onClick={loadActivityOptions}
            disabled={loadingActivities || submitting || changingCheckoutState}
          >
            <RefreshCw size={15} />
            {loadingActivities ? "Đang tải..." : "Tải danh sách"}
          </button>
        </div>
        <select
          aria-label="Chọn hoạt động điểm danh"
          value={selectedActivityId}
          onChange={(event) => handleActivityChange(event.target.value)}
          disabled={loadingActivities || submitting || changingCheckoutState}
          style={styles.activitySelectorSelect}
        >
          {activityOptions.map((item) => (
            <option key={item.activity_id} value={item.activity_id}>
              {item.activity_name || item.name || "Hoạt động"} — {item.activity_id}
            </option>
          ))}
        </select>
        {activityLoadError && (
          <p style={styles.activitySelectorError}>{activityLoadError}</p>
        )}
      </section>

      {/* ================================================
          HEADER
      ================================================= */}

      <div style={styles.pageHeader}>

        <div>

          <button
            type="button"
            style={styles.backButton}
            onClick={onBack}
          >

            <ArrowLeft
              size={16}
            />

            Hoạt động

          </button>


          <span style={styles.eyebrow}>
            ĐIỂM DANH REALTIME
          </span>


          <h2 style={styles.title}>

            {
              currentActivity.activity_name
              ||
              currentActivity.name
              ||
              "Hoạt động"
            }

          </h2>


          <p style={styles.activityId}>
            {currentActivity.activity_id}
          </p>

        </div>


        <button
          type="button"
          style={styles.refreshButton}
          onClick={() =>
            loadAttendance()
          }
          disabled={loading}
        >

          <RefreshCw
            size={16}
          />

          {loading
            ? "Đang tải..."
            : "Làm mới"}

        </button>

      </div>


      {/* ================================================
          LOCKED
      ================================================= */}

      {finalListLocked && (

        <div style={styles.lockedNotice}>

          <LockKeyhole
            size={19}
          />

          <div>

            <strong>
              Danh sách cuối đã khóa
            </strong>

            <span>
              Không thể tiếp tục
              Check-in hoặc Check-out.
            </span>

          </div>

        </div>

      )}


      {/* ================================================
          COUNTERS
      ================================================= */}

      <div style={styles.statsGrid}>

        <CounterCard
          icon={Users}
          label="Đăng ký"
          value={registered}
          color="#2563eb"
          background="#dbeafe"
        />


        <CounterCard
          icon={LogIn}
          label="Check-in"
          value={checkedIn}
          color="#059669"
          background="#d1fae5"
        />


        <CounterCard
          icon={LogOut}
          label="Check-out"
          value={checkedOut}
          color="#7c3aed"
          background="#ede9fe"
        />

      </div>


      {/* ================================================
          SCANNER
      ================================================= */}

      <section style={styles.scannerCard}>

        <div style={styles.scannerHeader}>

          <div>

            <span style={styles.eyebrow}>
              GHI NHẬN THAM GIA
            </span>


            <h3 style={styles.scannerTitle}>
              Quét thẻ sinh viên
            </h3>


            <p style={styles.scannerDescription}>

              {mode === "checkin"
                ? (
                    "Quét QR trên thẻ sinh viên "
                    +
                    "để ghi nhận Check-in. "
                    +
                    "Check-in chỉ yêu cầu sinh viên "
                    +
                    "có trong danh sách đăng ký."
                  )
                : (
                    "Quét QR trên thẻ sinh viên "
                    +
                    "để ghi nhận Check-out. "
                    +
                    "Scanner chỉ hoạt động khi "
                    +
                    "BTC đã mở Check-out."
                  )}

            </p>

          </div>


          <div style={styles.modeSwitch}>

            <button
              type="button"
              style={
                mode === "checkin"
                  ? {
                      ...styles.modeButton,
                      ...styles.checkInActive,
                    }
                  : styles.modeButton
              }
              onClick={() => {

                setMode(
                  "checkin"
                );

                setMssv("");

                setMessage(
                  null
                );

              }}
            >

              <LogIn
                size={17}
              />

              Check-in

            </button>


            <button
              type="button"
              style={
                mode === "checkout"
                  ? {
                      ...styles.modeButton,
                      ...styles.checkOutActive,
                    }
                  : styles.modeButton
              }
              onClick={() => {

                setMode(
                  "checkout"
                );

                setMssv("");

                setMessage(
                  null
                );

              }}
            >

              <LogOut
                size={17}
              />

              Check-out

            </button>

          </div>

        </div>


        {/* ================================================
            CHECK-OUT CONTROL
        ================================================= */}

        {mode === "checkout" && (

          <div
            style={
              checkoutOpen
                ? styles.checkoutOpenBox
                : styles.checkoutClosedBox
            }
          >

            <div style={styles.checkoutStateLeft}>

              <div
                style={
                  checkoutOpen
                    ? styles.checkoutOpenIcon
                    : styles.checkoutClosedIcon
                }
              >

                {checkoutOpen ? (

                  <Radio
                    size={21}
                  />

                ) : (

                  <LockKeyhole
                    size={20}
                  />

                )}

              </div>


              <div style={styles.checkoutStateCopy}>

                <strong>

                  {checkoutOpen
                    ? "Check-out đang mở"
                    : "Chờ Ban Tổ chức mở Check-out"}

                </strong>


                <span>

                  {checkoutOpen
                    ? (
                        "Scanner đã sẵn sàng. "
                        +
                        "Sinh viên có thể được "
                        +
                        "ghi nhận Check-out realtime."
                      )
                    : (
                        "Scanner Check-out đang khóa. "
                        +
                        "BTC cần mở Check-out "
                        +
                        "trước khi quét."
                      )}

                </span>

              </div>

            </div>


            <button
              type="button"
              disabled={
                changingCheckoutState
                ||
                finalListLocked
              }
              onClick={
                handleCheckoutStateChange
              }
              style={{
                ...(
                  checkoutOpen
                    ? styles.closeCheckoutButton
                    : styles.openCheckoutButton
                ),

                ...(
                  changingCheckoutState
                  ||
                  finalListLocked
                    ? styles.disabledButton
                    : {}
                ),
              }}
            >

              {changingCheckoutState
                ? "Đang xử lý..."
                : checkoutOpen
                  ? "Đóng Check-out"
                  : "Mở Check-out"}

            </button>

          </div>

        )}


        {/* ================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          <label style={styles.label}>
            MSSV
          </label>


          <div style={styles.inputRow}>

            <div
              style={{
                ...styles.inputWrap,

                ...(
                  scannerDisabled
                    ? styles.inputWrapDisabled
                    : {}
                ),
              }}
            >

              <ScanLine
                size={22}
                color={
                  scannerDisabled
                    ? "#cbd5e1"
                    : "#64748b"
                }
              />


              <input
                ref={inputRef}
                value={mssv}
                onChange={
                  (event) =>
                    setMssv(
                      event
                        .target
                        .value
                    )
                }
                placeholder={
                  mode === "checkout"
                  &&
                  !checkoutOpen

                    ? "Chờ BTC mở Check-out..."

                    : "Quét QR hoặc nhập MSSV..."
                }
                autoComplete="off"
                disabled={
                  scannerDisabled
                }
                style={{
                  ...styles.input,

                  ...(
                    scannerDisabled
                      ? styles.inputDisabled
                      : {}
                  ),
                }}
              />

            </div>


            <button
              type="submit"
              disabled={
                scannerDisabled
              }
              style={{
                ...(
                  mode === "checkin"
                    ? styles.submitCheckIn
                    : styles.submitCheckOut
                ),

                ...(
                  scannerDisabled
                    ? styles.disabledButton
                    : {}
                ),
              }}
            >

              {submitting
                ? "Đang ghi nhận..."
                : mode === "checkin"
                  ? "Ghi nhận Check-in"
                  : checkoutOpen
                    ? "Ghi nhận Check-out"
                    : "Check-out chưa mở"}

            </button>

          </div>

        </form>


        {/* ================================================
            RESULT
        ================================================= */}

        {message && (

          <div
            style={
              message.type ===
                "success"
                ? styles.successMessage
                : styles.errorMessage
            }
          >

            {message.type ===
              "success" ? (

              <CheckCircle2
                size={20}
              />

            ) : (

              <AlertCircle
                size={20}
              />

            )}


            <span>
              {message.text}
            </span>

          </div>

        )}


        {/* ================================================
            REALTIME
        ================================================= */}

        <div style={styles.realtimeInfo}>

          <span style={styles.liveDot} />

          Dữ liệu tự đồng bộ mỗi 2 giây

          {mode === "checkout" && (

            <>

              {" · "}

              <strong
                style={
                  checkoutOpen
                    ? styles.realtimeOpen
                    : styles.realtimeClosed
                }
              >

                {checkoutOpen
                  ? "Check-out đang mở"
                  : "Check-out đang đóng"}

              </strong>

            </>

          )}

        </div>

      </section>


      {/* ================================================
          ACTIVITY INFORMATION
      ================================================= */}

      <section style={styles.infoCard}>

        <div style={styles.infoItem}>

          <span>
            Trạng thái
          </span>

          <strong>
            {
              currentActivity.status
              ||
              "ACTIVE"
            }
          </strong>

        </div>


        <div style={styles.infoItem}>

          <span>
            Địa điểm
          </span>

          <strong>
            {
              currentActivity.location
              ||
              "Chưa cập nhật"
            }
          </strong>

        </div>


        <div style={styles.infoItem}>

          <span>
            Quy mô
          </span>

          <strong>

            {
              currentActivity.capacity
              ??
              "—"
            }

            {" "}
            sinh viên

          </strong>

        </div>


        <div style={styles.infoItem}>

          <span>
            Check-out
          </span>

          <strong
            style={
              checkoutOpen
                ? styles.checkoutInfoOpen
                : styles.checkoutInfoClosed
            }
          >

            {checkoutOpen
              ? "Đang mở"
              : "Đang đóng"}

          </strong>

        </div>

      </section>

    </div>

  );

}


// =====================================================
// COUNTER
// =====================================================

function CounterCard({
  icon: Icon,
  label,
  value,
  color,
  background,
}) {

  return (

    <article style={styles.counterCard}>

      <div
        style={{
          ...styles.counterIcon,
          color,
          background,
        }}
      >

        <Icon
          size={23}
        />

      </div>


      <div style={styles.counterCopy}>

        <span style={styles.counterLabel}>
          {label}
        </span>

        <strong style={styles.counterValue}>
          {value}
        </strong>

      </div>

    </article>

  );

}


// =====================================================
// ERROR MESSAGE
// =====================================================

function getApiErrorMessage(
  error
) {

  const detail =
    error?.detail;

  if (
    typeof detail ===
    "string"
  ) {

    return detail;

  }


  if (
    detail
    &&
    typeof detail ===
      "object"
  ) {

    return (
      detail.message
      ||
      detail.detail
      ||
      ""
    );

  }


  return (
    error?.message
    ||
    ""
  );

}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },


  activitySelectorCard: {
    padding: "18px 20px",
    border: "1px solid #bfdbfe",
    borderRadius: "17px",
    background: "#ffffff",
    boxShadow: "0 7px 20px rgba(15, 23, 42, 0.04)",
  },

  activitySelectorHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },

  activitySelectorTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#0f172a",
    fontSize: "14px",
  },

  activitySelectorDescription: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 400,
  },

  activitySelectorSelect: {
    width: "100%",
    minHeight: "45px",
    padding: "0 13px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    color: "#0f172a",
    background: "#f8fafc",
    fontSize: "13px",
    fontWeight: 650,
    cursor: "pointer",
  },

  activitySelectorError: {
    margin: "10px 0 0",
    color: "#b91c1c",
    fontSize: "12px",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    flexWrap: "wrap",
  },


  backButton: {
    marginBottom: "15px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },


  eyebrow: {
    display: "block",
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1px",
  },


  title: {
    margin: "6px 0 3px",
    color: "#0f172a",
    fontSize: "29px",
  },


  activityId: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },


  refreshButton: {
    height: "41px",
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: 700,
    cursor: "pointer",
  },


  lockedNotice: {
    padding: "13px 15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#475569",
  },


  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },


  counterCard: {
    padding: "19px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    background: "#ffffff",
    boxShadow:
      "0 7px 20px rgba(15, 23, 42, 0.05)",
  },


  counterIcon: {
    width: "49px",
    height: "49px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
  },


  counterCopy: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },


  counterLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 700,
  },


  counterValue: {
    color: "#0f172a",
    fontSize: "26px",
    lineHeight: 1,
  },


  scannerCard: {
    padding: "25px",
    border: "1px solid #dbe5f1",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow:
      "0 10px 28px rgba(15, 23, 42, 0.06)",
  },


  scannerHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },


  scannerTitle: {
    margin: "6px 0",
    color: "#0f172a",
    fontSize: "21px",
  },


  scannerDescription: {
    maxWidth: "610px",
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.6,
  },


  modeSwitch: {
    padding: "4px",
    display: "flex",
    gap: "4px",
    borderRadius: "12px",
    background: "#f1f5f9",
  },


  modeButton: {
    minHeight: "39px",
    padding: "0 13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    borderRadius: "9px",
    background: "transparent",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },


  checkInActive: {
    background: "#ecfdf5",
    color: "#047857",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.06)",
  },


  checkOutActive: {
    background: "#f5f3ff",
    color: "#7c3aed",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.06)",
  },


  // ========================================
  // CHECK-OUT STATE
  // ========================================

  checkoutOpenBox: {
    marginTop: "20px",
    padding: "15px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    border: "1px solid #a7f3d0",
    borderRadius: "14px",
    background: "#ecfdf5",
  },


  checkoutClosedBox: {
    marginTop: "20px",
    padding: "15px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    border: "1px solid #fed7aa",
    borderRadius: "14px",
    background: "#fff7ed",
  },


  checkoutStateLeft: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },


  checkoutOpenIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "11px",
    background: "#d1fae5",
    color: "#047857",
  },


  checkoutClosedIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "11px",
    background: "#ffedd5",
    color: "#c2410c",
  },


  checkoutStateCopy: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    color: "#475569",
    fontSize: "11px",
  },


  openCheckoutButton: {
    minHeight: "40px",
    padding: "0 15px",
    border: "none",
    borderRadius: "10px",
    background: "#7c3aed",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },


  closeCheckoutButton: {
    minHeight: "40px",
    padding: "0 15px",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },


  form: {
    marginTop: "24px",
  },


  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "11px",
    fontWeight: 700,
  },


  inputRow: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) auto",
    gap: "10px",
  },


  inputWrap: {
    minHeight: "52px",
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "2px solid #dbe5f1",
    borderRadius: "13px",
    background: "#f8fafc",
  },


  inputWrapDisabled: {
    borderColor: "#e2e8f0",
    background: "#f8fafc",
    opacity: 0.72,
  },


  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },


  inputDisabled: {
    color: "#94a3b8",
    cursor: "not-allowed",
  },


  submitCheckIn: {
    minWidth: "175px",
    padding: "0 17px",
    border: "none",
    borderRadius: "12px",
    background: "#059669",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },


  submitCheckOut: {
    minWidth: "175px",
    padding: "0 17px",
    border: "none",
    borderRadius: "12px",
    background: "#7c3aed",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },


  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },


  successMessage: {
    marginTop: "16px",
    padding: "13px 15px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    border: "1px solid #a7f3d0",
    borderRadius: "11px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "12px",
    fontWeight: 650,
  },


  errorMessage: {
    marginTop: "16px",
    padding: "13px 15px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    border: "1px solid #fecaca",
    borderRadius: "11px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: 650,
  },


  realtimeInfo: {
    marginTop: "17px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#64748b",
    fontSize: "10px",
  },


  liveDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#10b981",
    boxShadow:
      "0 0 0 4px rgba(16,185,129,0.12)",
  },


  realtimeOpen: {
    color: "#047857",
  },


  realtimeClosed: {
    color: "#c2410c",
  },


  infoCard: {
    padding: "18px 20px",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    background: "#ffffff",
  },


  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    color: "#64748b",
    fontSize: "10px",
  },


  checkoutInfoOpen: {
    color: "#047857",
  },


  checkoutInfoClosed: {
    color: "#c2410c",
  },


  emptyState: {
    minHeight: "420px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    border: "1px dashed #bfdbfe",
    borderRadius: "20px",
    background: "#ffffff",
  },


  primaryButton: {
    marginTop: "12px",
    height: "41px",
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },

};


export default AttendancePage;