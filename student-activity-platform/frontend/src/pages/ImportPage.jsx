import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react";

import {
  getActivities,
  getRegistrations,
  importRegistrations,
  previewRegistrationImport,
} from "../services/api";

import EvidenceImportSection from "./EvidenceImportSection";


// ======================================================
// IMPORT PAGE
// ======================================================

function ImportPage() {

  const fileInputRef =
    useRef(null);


  const [
    activities,
    setActivities,
  ] = useState([]);


  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState("");


  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);


  const [
    preview,
    setPreview,
  ] = useState(null);


  const [
    selectedPortalActivity,
    setSelectedPortalActivity,
  ] = useState("");


  const [
    registrations,
    setRegistrations,
  ] = useState(null);


  const [
    searchText,
    setSearchText,
  ] = useState("");


  const [
    loadingActivities,
    setLoadingActivities,
  ] = useState(true);


  const [
    loadingRegistrations,
    setLoadingRegistrations,
  ] = useState(false);


  const [
    previewing,
    setPreviewing,
  ] = useState(false);


  const [
    importing,
    setImporting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


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


      const usableActivities =
        rows.filter(
          (activity) => {

            const status =
              String(
                activity
                  ?.publication_status ||
                activity
                  ?.status ||
                ""
              ).toUpperCase();


            return (
              status !==
                "CANCELLED" &&
              status !==
                "CANCELED"
            );

          }
        );


      usableActivities.sort(
        (a, b) => {

          const timeA =
            new Date(
              a.start_time || 0
            ).getTime();


          const timeB =
            new Date(
              b.start_time || 0
            ).getTime();


          return (
            timeA - timeB
          );

        }
      );


      setActivities(
        usableActivities
      );


      if (
        usableActivities.length > 0
      ) {

        setSelectedActivityId(
          (current) =>
            current ||
            usableActivities[0]
              .activity_id
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
  // LOAD CURRENT REGISTRATIONS
  // ====================================================

  useEffect(() => {

    if (
      !selectedActivityId
    ) {

      setRegistrations(
        null
      );

      return;

    }


    resetImportState();

    loadRegistrations(
      selectedActivityId
    );

  }, [selectedActivityId]);


  async function loadRegistrations(
    activityId
  ) {

    try {

      setLoadingRegistrations(
        true
      );


      const result =
        await getRegistrations(
          activityId
        );


      setRegistrations(
        result?.data ||
        null
      );

    } catch (err) {

      console.error(
        "Load registrations error:",
        err
      );


      setRegistrations(
        null
      );

    } finally {

      setLoadingRegistrations(
        false
      );

    }

  }


  // ====================================================
  // RESET FILE/PREVIEW
  // ====================================================

  function resetImportState() {

    setSelectedFile(
      null
    );

    setPreview(
      null
    );

    setSelectedPortalActivity(
      ""
    );

    setSuccessMessage(
      ""
    );

    setSearchText(
      ""
    );


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  }


  // ====================================================
  // FILE SELECT
  // ====================================================

  function handleFileChange(
    event
  ) {

    const file =
      event.target.files?.[0] ||
      null;


    setError("");

    setSuccessMessage("");

    setPreview(
      null
    );

    setSelectedPortalActivity(
      ""
    );


    if (!file) {

      setSelectedFile(
        null
      );

      return;

    }


    const fileName =
      file.name.toLowerCase();


    if (
      !fileName.endsWith(
        ".xlsx"
      ) &&
      !fileName.endsWith(
        ".csv"
      )
    ) {

      setSelectedFile(
        null
      );


      setError(
        "Chỉ hỗ trợ file .xlsx hoặc .csv."
      );


      event.target.value =
        "";

      return;

    }


    setSelectedFile(
      file
    );

  }


  // ====================================================
  // PREVIEW
  // ====================================================

  async function handlePreview() {

    if (
      !selectedActivityId
    ) {

      setError(
        "Vui lòng chọn hoạt động trên hệ thống."
      );

      return;

    }


    if (
      !selectedFile
    ) {

      setError(
        "Vui lòng chọn file Excel/CSV từ Portal."
      );

      return;

    }


    try {

      setPreviewing(
        true
      );

      setError("");

      setSuccessMessage("");


      const result =
        await previewRegistrationImport(
          selectedActivityId,
          selectedFile
        );


      const data =
        result?.data ||
        null;


      setPreview(
        data
      );


      const portalActivities =
        data?.portal_activities ||
        [];


      if (
        portalActivities.length === 1
      ) {

        setSelectedPortalActivity(
          portalActivities[0].name
        );

      } else {

        setSelectedPortalActivity(
          ""
        );

      }

    } catch (err) {

      console.error(
        "Preview import error:",
        err
      );


      setPreview(
        null
      );


      setError(
        err.message ||
        "Không thể đọc file Portal."
      );

    } finally {

      setPreviewing(
        false
      );

    }

  }


  // ====================================================
  // IMPORT
  // ====================================================

  async function handleImport() {

    if (
      !selectedActivityId ||
      !selectedFile ||
      !preview
    ) {

      setError(
        "Vui lòng xem trước file trước khi import."
      );

      return;

    }


    const portalActivities =
      preview
        ?.portal_activities ||
      [];


    if (
      portalActivities.length > 1 &&
      !selectedPortalActivity
    ) {

      setError(
        "File có nhiều hoạt động. Vui lòng chọn đúng hoạt động Portal cần import."
      );

      return;

    }


    const selectedSummary =
      portalActivities.find(
        (item) =>
          item.name ===
          selectedPortalActivity
      );


    const countText =
      selectedSummary
        ?.count != null
        ? `${selectedSummary.count} sinh viên`
        : "danh sách sinh viên trong file";


    const activityName =
      selectedActivity
        ?.activity_name ||
      selectedActivityId;


    const portalText =
      selectedPortalActivity
        ? (
            `\n\nHoạt động Portal:\n${selectedPortalActivity}`
          )
        : "";


    const confirmed =
      window.confirm(
        (
          `Xác nhận import ${countText} vào:\n`
          + `${activityName}`
          + `${portalText}`
          + "\n\n"
          + "Lưu ý: danh sách đăng ký hiện tại của hoạt động này sẽ được thay thế bằng dữ liệu Portal vừa chọn."
        )
      );


    if (!confirmed) {

      return;

    }


    try {

      setImporting(
        true
      );

      setError("");

      setSuccessMessage("");


      const result =
        await importRegistrations(
          selectedActivityId,
          selectedFile,
          selectedPortalActivity
        );


      const importedCount =
        result
          ?.data
          ?.imported_count;


      setSuccessMessage(
        result?.message ||
        (
          importedCount != null
            ? `Đã import ${importedCount} sinh viên.`
            : "Import danh sách đăng ký thành công."
        )
      );


      await loadRegistrations(
        selectedActivityId
      );

    } catch (err) {

      console.error(
        "Import registrations error:",
        err
      );


      setError(
        err.message ||
        "Không thể import danh sách đăng ký."
      );

    } finally {

      setImporting(
        false
      );

    }

  }


  // ====================================================
  // FILTER CURRENT REGISTRATIONS
  // ====================================================

  const filteredRegistrations =
    useMemo(
      () => {

        const items =
          registrations?.items ||
          [];


        const keyword =
          searchText
            .trim()
            .toLowerCase();


        if (!keyword) {

          return items;

        }


        return items.filter(
          (item) => {

            const text =
              [
                item.mssv,
                item.full_name,
                item.unit_name,
                item.portal_activity,
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
        registrations,
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
            DỮ LIỆU PORTAL
          </span>


          <h2 style={styles.title}>
            Nhập dữ liệu đăng ký
          </h2>


          <p style={styles.description}>
            Nhập danh sách sinh viên đăng ký
            được xuất từ Portal trường vào
            từng hoạt động trên hệ thống.
          </p>

        </div>


        <button
          type="button"
          style={styles.refreshButton}
          onClick={
            loadActivities
          }
          disabled={
            loadingActivities
          }
        >

          <RefreshCw
            size={16}
          />

          Làm mới

        </button>

      </div>


      {/* ================================================
          FLOW NOTICE
      ================================================= */}

      <div style={styles.flowNotice}>

        <Database
          size={20}
        />


        <div>

          <strong>
            Luồng dữ liệu đăng ký
          </strong>


          <div style={styles.flowText}>
            Portal trường
            {" → "}
            Excel / CSV
            {" → "}
            Xem trước
            {" → "}
            Chọn hoạt động Portal
            {" → "}
            Xác nhận Import
          </div>


          <div style={styles.flowSubText}>
            Check-in và Check-out không import tại đây.
            Hai dữ liệu đó vẫn được ghi nhận
            real-time bằng QR Scanner.
          </div>

        </div>

      </div>


      {/* ================================================
          SUCCESS
      ================================================= */}

      {successMessage && (

        <div style={styles.successBox}>

          <CheckCircle2
            size={20}
          />

          <span style={{ flex: 1 }}>
            {successMessage}
          </span>


          <button
            type="button"
            style={styles.iconButton}
            onClick={() =>
              setSuccessMessage("")
            }
          >

            <X size={17} />

          </button>

        </div>

      )}


      {/* ================================================
          ERROR
      ================================================= */}

      {error && (

        <div style={styles.errorBox}>

          <AlertCircle
            size={20}
          />


          <span style={{ flex: 1 }}>
            {error}
          </span>


          <button
            type="button"
            style={styles.iconButton}
            onClick={() =>
              setError("")
            }
          >

            <X size={17} />

          </button>

        </div>

      )}


      {/* ================================================
          STEP 1
      ================================================= */}

      <section style={styles.card}>

        <div style={styles.stepHeader}>

          <span style={styles.stepNumber}>
            1
          </span>


          <div>

            <h3 style={styles.cardTitle}>
              Chọn hoạt động trên hệ thống
            </h3>

            <p style={styles.cardDescription}>
              Danh sách sinh viên từ Portal
              sẽ được gắn vào hoạt động này.
            </p>

          </div>

        </div>


        {loadingActivities ? (

          <div style={styles.loadingBox}>

            <RefreshCw
              size={18}
            />

            Đang tải hoạt động...

          </div>

        ) : activities.length === 0 ? (

          <div style={styles.warningBox}>

            <AlertCircle
              size={18}
            />

            Không có hoạt động phù hợp để import.

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

            <CalendarDays
              size={18}
            />


            <div>

              <strong>
                {selectedActivity.activity_name}
              </strong>


              <span>
                {selectedActivity.activity_id}
                {" · "}
                {formatDate(
                  selectedActivity.start_time
                )}
                {" · "}
                {selectedActivity.location ||
                  "Chưa cập nhật địa điểm"}
              </span>

            </div>

          </div>

        )}

      </section>


      {/* ================================================
          STEP 2
      ================================================= */}

      <section style={styles.card}>

        <div style={styles.stepHeader}>

          <span style={styles.stepNumber}>
            2
          </span>


          <div>

            <h3 style={styles.cardTitle}>
              Chọn file từ Portal
            </h3>

            <p style={styles.cardDescription}>
              Hỗ trợ Excel .xlsx và CSV .csv.
            </p>

          </div>

        </div>


        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={
            handleFileChange
          }
          style={{
            display: "none",
          }}
        />


        <button
          type="button"
          style={styles.uploadArea}
          onClick={() =>
            fileInputRef
              .current
              ?.click()
          }
        >

          <div style={styles.uploadIcon}>

            <Upload
              size={25}
            />

          </div>


          <strong>
            {selectedFile
              ? selectedFile.name
              : "Chọn file Excel / CSV từ Portal"}
          </strong>


          <span>
            {selectedFile
              ? formatFileSize(
                  selectedFile.size
                )
              : (
                  "Ví dụ: "
                  + "DanhSachSinhVienDangKyCTXH.xlsx"
                )}
          </span>

        </button>


        {selectedFile && (

          <div style={styles.fileActions}>

            <div style={styles.fileName}>

              <FileSpreadsheet
                size={18}
              />

              <div>

                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  {formatFileSize(
                    selectedFile.size
                  )}
                </span>

              </div>

            </div>


            <button
              type="button"
              style={styles.previewButton}
              disabled={
                previewing
              }
              onClick={
                handlePreview
              }
            >

              {previewing ? (

                <>
                  <RefreshCw
                    size={16}
                  />

                  Đang đọc file...
                </>

              ) : (

                <>
                  <Search
                    size={16}
                  />

                  Xem trước dữ liệu
                </>

              )}

            </button>

          </div>

        )}

      </section>


      {/* ================================================
          PREVIEW
      ================================================= */}

      {preview && (

        <section style={styles.card}>

          <div style={styles.stepHeader}>

            <span style={styles.stepNumber}>
              3
            </span>


            <div>

              <h3 style={styles.cardTitle}>
                Kiểm tra dữ liệu Portal
              </h3>

              <p style={styles.cardDescription}>
                Kiểm tra số lượng và chọn đúng
                hoạt động trước khi import.
              </p>

            </div>

          </div>


          {/* SUMMARY */}

          <div style={styles.summaryGrid}>

            <SummaryBox
              label="Tổng dòng"
              value={
                preview.total_rows
              }
            />

            <SummaryBox
              label="Hợp lệ"
              value={
                preview.valid_rows
              }
              positive
            />

            <SummaryBox
              label="Có lỗi"
              value={
                preview.invalid_rows
              }
              negative={
                preview.invalid_rows > 0
              }
            />

            <SummaryBox
              label="Hoạt động Portal"
              value={
                preview
                  .portal_activities
                  ?.length || 0
              }
            />

          </div>


          {/* PORTAL ACTIVITY SELECTION */}

          {preview
            .portal_activities
            ?.length > 0 && (

            <div style={styles.portalSection}>

              <div style={styles.portalHeader}>

                <strong>
                  Hoạt động trong file Portal
                </strong>


                {preview
                  .portal_activities
                  .length > 1 && (

                  <span style={styles.requiredBadge}>
                    Bắt buộc chọn 1
                  </span>

                )}

              </div>


              <div style={styles.portalList}>

                {preview
                  .portal_activities
                  .map(
                    (item) => {

                      const active =
                        selectedPortalActivity ===
                        item.name;


                      return (

                        <button
                          key={
                            item.name
                          }
                          type="button"
                          style={{
                            ...styles.portalOption,

                            ...(active
                              ? styles.portalOptionActive
                              : {}),
                          }}
                          onClick={() =>
                            setSelectedPortalActivity(
                              item.name
                            )
                          }
                        >

                          <span
                            style={{
                              ...styles.radio,

                              ...(active
                                ? styles.radioActive
                                : {}),
                            }}
                          >

                            {active && (
                              <span
                                style={
                                  styles.radioDot
                                }
                              />
                            )}

                          </span>


                          <div style={{ flex: 1 }}>

                            <strong>
                              {item.name}
                            </strong>


                            <span>
                              {item.count}
                              {" "}
                              sinh viên
                            </span>

                          </div>


                          <Users
                            size={18}
                          />

                        </button>

                      );

                    }
                  )}

              </div>

            </div>

          )}


          {/* TABLE */}

          <div style={styles.tableTitle}>

            <div>

              <strong>
                Dữ liệu xem trước
              </strong>

              <span>
                Hiển thị tối đa 30 dòng đầu tiên.
              </span>

            </div>

          </div>


          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Dòng
                  </th>

                  <th style={styles.th}>
                    MSSV
                  </th>

                  <th style={styles.th}>
                    Họ và tên
                  </th>

                  <th style={styles.th}>
                    Đơn vị
                  </th>

                  <th style={styles.th}>
                    Hoạt động Portal
                  </th>

                  <th style={styles.th}>
                    Trạng thái
                  </th>

                </tr>

              </thead>


              <tbody>

                {(
                  preview.preview ||
                  []
                ).map(
                  (row) => (

                    <tr
                      key={
                        `${row.row_number}-${row.mssv}`
                      }
                    >

                      <td style={styles.td}>
                        {row.row_number}
                      </td>

                      <td style={styles.td}>
                        <strong>
                          {row.mssv || "—"}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        {row.full_name || "—"}
                      </td>

                      <td style={styles.td}>
                        {row.unit_name || "—"}
                      </td>

                      <td style={styles.td}>
                        {row.portal_activity || "—"}
                      </td>

                      <td style={styles.td}>

                        {row.valid ? (

                          <span style={styles.validBadge}>
                            Hợp lệ
                          </span>

                        ) : (

                          <span style={styles.invalidBadge}>
                            {formatErrors(
                              row.errors
                            )}
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* IMPORT */}

          <div style={styles.importFooter}>

            <div style={styles.importNotice}>

              <AlertCircle
                size={17}
              />


              <span>
                Import sẽ thay thế danh sách
                đăng ký hiện tại của hoạt động
                đã chọn.
              </span>

            </div>


            <button
              type="button"
              style={styles.importButton}
              disabled={
                importing ||
                (
                  preview
                    .portal_activities
                    ?.length > 1 &&
                  !selectedPortalActivity
                )
              }
              onClick={
                handleImport
              }
            >

              {importing ? (

                <>
                  <RefreshCw
                    size={17}
                  />

                  Đang import...
                </>

              ) : (

                <>
                  <Upload
                    size={17}
                  />

                  Xác nhận Import
                </>

              )}

            </button>

          </div>

        </section>

      )}

            {/* ================================================
          EVIDENCE / GOOGLE FORM
      ================================================= */}

      {selectedActivityId && (

        <EvidenceImportSection
          activityId={selectedActivityId}
        />

      )}


      {/* ================================================
          CURRENT REGISTRATIONS
      ================================================= */}

      <section style={styles.card}>

        <div style={styles.currentHeader}>

          <div>

            <span style={styles.eyebrow}>
              DỮ LIỆU HIỆN TẠI
            </span>


            <h3 style={styles.currentTitle}>
              Danh sách đăng ký đã lưu
            </h3>

          </div>


          <div style={styles.currentTotal}>

            <Users
              size={18}
            />

            {loadingRegistrations
              ? "..."
              : registrations?.total || 0}

            {" "}

            sinh viên

          </div>

        </div>


        {registrations
          ?.registration_import && (

          <div style={styles.importHistory}>

            <Database
              size={18}
            />


            <div>

              <strong>
                Lần import gần nhất
              </strong>


              <span>

                File:{" "}
                {registrations
                  .registration_import
                  .file_name ||
                  "—"}

              </span>


              <span>

                Hoạt động Portal:{" "}
                {registrations
                  .registration_import
                  .portal_activity ||
                  "—"}

              </span>


              <span>

                Thời gian:{" "}
                {formatDateTime(
                  registrations
                    .registration_import
                    .imported_at
                )}

              </span>

            </div>

          </div>

        )}


        {registrations
          ?.items
          ?.length > 0 && (

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
              placeholder="Tìm theo MSSV, họ tên, đơn vị..."
              style={styles.searchInput}
            />

          </div>

        )}


        {loadingRegistrations ? (

          <div style={styles.loadingBox}>

            <RefreshCw
              size={18}
            />

            Đang tải danh sách...

          </div>

        ) : !registrations
            ?.items
            ?.length ? (

          <div style={styles.emptyBox}>

            <FileSpreadsheet
              size={32}
            />


            <strong>
              Chưa có dữ liệu đăng ký
            </strong>


            <span>
              Hãy chọn file Portal ở phía trên
              và thực hiện Import.
            </span>

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

                  <th style={styles.th}>
                    Đơn vị
                  </th>

                  <th style={styles.th}>
                    Hoạt động Portal
                  </th>

                  <th style={styles.th}>
                    Ngày đăng ký
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredRegistrations
                  .slice(
                    0,
                    100
                  )
                  .map(
                    (row, index) => (

                      <tr
                        key={
                          row.mssv
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
                          {row.full_name}
                        </td>

                        <td style={styles.td}>
                          {row.unit_name || "—"}
                        </td>

                        <td style={styles.td}>
                          {row.portal_activity || "—"}
                        </td>

                        <td style={styles.td}>
                          {formatDateTime(
                            row.registered_at
                          )}
                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}


        {filteredRegistrations.length > 100 && (

          <div style={styles.tableFootnote}>

            Đang hiển thị 100 /
            {" "}
            {filteredRegistrations.length}
            {" "}
            sinh viên.

          </div>

        )}

      </section>

    </div>

  );

}


// ======================================================
// SUMMARY BOX
// ======================================================

function SummaryBox({
  label,
  value,
  positive = false,
  negative = false,
}) {

  return (

    <div
      style={{
        ...styles.summaryBox,

        ...(positive
          ? styles.summaryPositive
          : {}),

        ...(negative
          ? styles.summaryNegative
          : {}),
      }}
    >

      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#64748b",
        }}
      >
        {label}
      </span>


      <strong
        style={{
          fontSize: "23px",
          lineHeight: 1,
          color: negative
            ? "#b91c1c"
            : positive
              ? "#047857"
              : "#0f172a",
        }}
      >
        {value}
      </strong>

    </div>

  );

}


// ======================================================
// HELPERS
// ======================================================

function formatDate(
  value
) {

  if (!value) {

    return "Chưa cập nhật";

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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone:
        "Asia/Ho_Chi_Minh",
    }
  ).format(date);

}


function formatDateTime(
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone:
        "Asia/Ho_Chi_Minh",
    }
  ).format(date);

}


function formatFileSize(
  bytes
) {

  const value =
    Number(bytes) || 0;


  if (
    value < 1024
  ) {

    return `${value} B`;

  }


  if (
    value <
    1024 * 1024
  ) {

    return (
      `${(
        value / 1024
      ).toFixed(1)} KB`
    );

  }


  return (
    `${(
      value /
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`
  );

}


function formatErrors(
  errors
) {

  const mapping = {

    MISSING_MSSV:
      "Thiếu MSSV",

    INVALID_MSSV:
      "MSSV không hợp lệ",

    MISSING_FULL_NAME:
      "Thiếu họ tên",

    DUPLICATE_MSSV:
      "Trùng MSSV",

  };


  return (
    (errors || [])
      .map(
        (code) =>
          mapping[code] ||
          code
      )
      .join(", ") ||
    "Không hợp lệ"
  );

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
    lineHeight: 1.6,
  },

  refreshButton: {
    height: "42px",
    padding: "0 15px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #dbeafe",
    borderRadius: "11px",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: 700,
    cursor: "pointer",
  },

  flowNotice: {
    padding: "15px 17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    border: "1px solid #bfdbfe",
    borderRadius: "14px",
    background: "#eff6ff",
    color: "#1d4ed8",
  },

  flowText: {
    marginTop: "5px",
    fontSize: "12px",
    fontWeight: 700,
  },

  flowSubText: {
    marginTop: "5px",
    fontSize: "11px",
    color: "#475569",
  },

  successBox: {
    padding: "13px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #a7f3d0",
    borderRadius: "12px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "13px",
    fontWeight: 650,
  },

  errorBox: {
    padding: "13px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "13px",
  },

  iconButton: {
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    display: "inline-flex",
  },

  card: {
    padding: "20px",
    border: "1px solid #dbe5f1",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow:
      "0 8px 24px rgba(15, 23, 42, 0.04)",
  },

  stepHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "17px",
  },

  stepNumber: {
    width: "32px",
    height: "32px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "13px",
  },

  cardTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "17px",
  },

  cardDescription: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  select: {
    width: "100%",
    minHeight: "45px",
    padding: "0 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  activityInfo: {
    marginTop: "12px",
    padding: "12px 14px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#475569",
  },

  uploadArea: {
    width: "100%",
    minHeight: "145px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "1px dashed #93c5fd",
    borderRadius: "14px",
    background: "#f8fbff",
    color: "#334155",
    cursor: "pointer",
  },

  uploadIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    background: "#dbeafe",
    color: "#2563eb",
  },

  fileActions: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  fileName: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#475569",
  },

  previewButton: {
    minHeight: "40px",
    padding: "0 14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    marginBottom: "18px",
  },

 summaryBox: {
  padding: "14px 16px",

  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "6px",

  minHeight: "72px",

  border: "1px solid #e2e8f0",
  borderRadius: "12px",

  background: "#f8fafc",
},

  summaryPositive: {
    borderColor: "#a7f3d0",
    background: "#ecfdf5",
  },

  summaryNegative: {
    borderColor: "#fecaca",
    background: "#fef2f2",
  },

  portalSection: {
    marginBottom: "20px",
  },

  portalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "10px",
    color: "#0f172a",
  },

  requiredBadge: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#fff7ed",
    color: "#c2410c",
    fontSize: "10px",
    fontWeight: 800,
  },

  portalList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  portalOption: {
    width: "100%",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    border: "1px solid #e2e8f0",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
  },

  portalOptionActive: {
    borderColor: "#60a5fa",
    background: "#eff6ff",
    color: "#1d4ed8",
  },

  radio: {
    width: "18px",
    height: "18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #cbd5e1",
    borderRadius: "999px",
  },

  radioActive: {
    borderColor: "#2563eb",
  },

  radioDot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#2563eb",
  },

  tableTitle: {
    margin: "8px 0 10px",
    color: "#0f172a",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
    fontSize: "11px",
  },

  th: {
    padding: "11px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "11px",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  },

  validBadge: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#047857",
    fontWeight: 700,
  },

  invalidBadge: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontWeight: 700,
  },

  importFooter: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  importNotice: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
    color: "#c2410c",
    fontSize: "11px",
  },

  importButton: {
    minHeight: "42px",
    padding: "0 16px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    borderRadius: "10px",
    background: "#059669",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },

  currentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  currentTitle: {
    margin: "4px 0 0",
    color: "#0f172a",
    fontSize: "19px",
  },

  currentTotal: {
    padding: "9px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: 700,
    fontSize: "12px",
  },

  importHistory: {
    marginBottom: "14px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "11px",
  },

  searchBox: {
    marginBottom: "12px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
  },

  searchInput: {
    width: "100%",
    height: "40px",
    border: "none",
    outline: "none",
    color: "#0f172a",
    background: "transparent",
  },

  loadingBox: {
    minHeight: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#64748b",
  },

  warningBox: {
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "10px",
    background: "#fff7ed",
    color: "#c2410c",
  },

  emptyBox: {
    minHeight: "150px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    color: "#94a3b8",
    textAlign: "center",
  },

  tableFootnote: {
    marginTop: "10px",
    textAlign: "right",
    color: "#94a3b8",
    fontSize: "10px",
  },

};


export default ImportPage;
