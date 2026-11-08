import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileSpreadsheet,
  RefreshCw,
  Upload,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import {
  getEvidence,
  importEvidence,
  previewEvidenceImport,
} from "../services/api";


// ======================================================
// EVIDENCE IMPORT SECTION
// ======================================================

function EvidenceImportSection({
  activityId,
}) {

  const fileInputRef =
    useRef(null);


  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);


  const [
    preview,
    setPreview,
  ] = useState(null);


  const [
    evidenceData,
    setEvidenceData,
  ] = useState(null);


  const [
    loading,
    setLoading,
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
    success,
    setSuccess,
  ] = useState("");


  // ====================================================
  // ACTIVITY CHANGED
  // ====================================================

  useEffect(() => {

    resetLocalState();


    if (activityId) {

      loadEvidence(
        activityId
      );

    } else {

      setEvidenceData(
        null
      );

    }

  }, [activityId]);


  // ====================================================
  // RESET
  // ====================================================

  function resetLocalState() {

    setSelectedFile(
      null
    );

    setPreview(
      null
    );

    setError("");

    setSuccess("");


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }

  }


  // ====================================================
  // LOAD EVIDENCE
  // ====================================================

  async function loadEvidence(
    currentActivityId =
      activityId
  ) {

    if (
      !currentActivityId
    ) {

      return;

    }


    try {

      setLoading(
        true
      );


      const result =
        await getEvidence(
          currentActivityId
        );


      setEvidenceData(
        result?.data ||
        null
      );

    } catch (err) {

      console.error(
        "Load evidence error:",
        err
      );


      setEvidenceData(
        null
      );


      setError(
        err.message ||
        "Không thể tải dữ liệu Evidence."
      );

    } finally {

      setLoading(
        false
      );

    }

  }


  // ====================================================
  // IMPORTED STATUS
  // ====================================================

  const imported =
    useMemo(
      () => {

        if (
          evidenceData
            ?.dataset_status ===
          "IMPORTED"
        ) {

          return true;

        }


        if (
          evidenceData
            ?.imported === true
        ) {

          return true;

        }


        if (
          evidenceData
            ?.evidence_import
        ) {

          return true;

        }


        // Tương thích dữ liệu demo / dữ liệu cũ.
        return (
          evidenceData
            ?.items
            ?.length > 0
        );

      },
      [evidenceData]
    );


  // ====================================================
  // CURRENT DATA
  // ====================================================

  const currentItems =
    useMemo(
      () => {

        const rows =
          Array.isArray(
            evidenceData?.items
          )
            ? evidenceData.items
            : [];


        return [
          ...rows,
        ].sort(
          (a, b) => {

            const timeA =
              new Date(
                a?.submitted_at ||
                0
              ).getTime();


            const timeB =
              new Date(
                b?.submitted_at ||
                0
              ).getTime();


            return (
              timeA -
              timeB
            );

          }
        );

      },
      [evidenceData]
    );


  const registeredCount =
    Number(
      evidenceData
        ?.registered_count
      ??
      preview
        ?.registered_count
      ??
      0
    );


  const evidenceCount =
    Number(
      evidenceData?.total
      ??
      currentItems.length
      ??
      0
    );


  const missingCount =
    imported
      ? (
          evidenceData
            ?.missing_count
          ??
          Math.max(
            registeredCount -
            evidenceCount,
            0
          )
        )
      : null;


  const coverageRate =
    imported
      ? (
          evidenceData
            ?.coverage_rate
          ??
          calculateRate(
            evidenceCount,
            registeredCount
          )
        )
      : null;


  const importInfo =
    evidenceData
      ?.evidence_import ||
    null;


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

    setSuccess("");

    setPreview(
      null
    );


    if (!file) {

      setSelectedFile(
        null
      );

      return;

    }


    const name =
      file.name.toLowerCase();


    if (
      !name.endsWith(
        ".xlsx"
      )
      &&
      !name.endsWith(
        ".csv"
      )
    ) {

      setSelectedFile(
        null
      );


      setError(
        "Evidence chỉ hỗ trợ file .xlsx hoặc .csv."
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

    if (!activityId) {

      setError(
        "Vui lòng chọn hoạt động trước."
      );

      return;

    }


    if (!selectedFile) {

      setError(
        "Vui lòng chọn file Evidence."
      );

      return;

    }


    try {

      setPreviewing(
        true
      );

      setError("");

      setSuccess("");


      const result =
        await previewEvidenceImport(
          activityId,
          selectedFile
        );


      setPreview(
        result?.data ||
        null
      );

    } catch (err) {

      console.error(
        "Preview Evidence error:",
        err
      );


      setPreview(
        null
      );


      setError(
        err.message ||
        "Không thể đọc file Evidence."
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
      !activityId ||
      !selectedFile ||
      !preview
    ) {

      setError(
        "Vui lòng xem trước Evidence trước khi Import."
      );

      return;

    }


    if (
      Number(
        preview.valid_rows
      ) <= 0
    ) {

      setError(
        "File không có Evidence hợp lệ để Import."
      );

      return;

    }


    const confirmed =
      window.confirm(
        (
          `Xác nhận Import ${preview.valid_rows} Evidence hợp lệ?\n\n`
          +
          `File: ${selectedFile.name}\n\n`
          +
          (
            imported
              ? (
                  "Lưu ý: Dataset Evidence hiện tại "
                  +
                  "sẽ được thay thế bằng file mới."
                )
              : (
                  "Sau khi Import, hệ thống mới có thể "
                  +
                  "xác định sinh viên Có / Không Evidence."
                )
          )
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

      setSuccess("");


      const result =
        await importEvidence(
          activityId,
          selectedFile
        );


      setSuccess(
        result?.message ||
        "Import Evidence thành công."
      );


      await loadEvidence(
        activityId
      );


      setPreview(
        null
      );

      setSelectedFile(
        null
      );


      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

    } catch (err) {

      console.error(
        "Import Evidence error:",
        err
      );


      setError(
        err.message ||
        "Không thể Import Evidence."
      );

    } finally {

      setImporting(
        false
      );

    }

  }


  // ====================================================
  // PREVIEW ERROR SUMMARY
  // ====================================================

  const previewErrors =
    preview?.error_summary ||
    {};


  // ====================================================
  // UI
  // ====================================================

  return (

    <section style={styles.card}>

      {/* ================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>

          <span style={styles.eyebrow}>
            GOOGLE FORMS / GOOGLE SHEETS
          </span>


          <h3 style={styles.title}>
            Minh chứng và phản hồi
          </h3>


          <p style={styles.description}>
            Import câu trả lời Google Form
            sau hoạt động và ghép sinh viên
            theo MSSV.
          </p>

        </div>


        <div
          style={
            imported
              ? styles.importedBadge
              : styles.notImportedBadge
          }
        >

          {imported ? (

            <CheckCircle2
              size={16}
            />

          ) : (

            <AlertCircle
              size={16}
            />

          )}


          {imported
            ? "Đã nhập Evidence"
            : "Chưa nhập Evidence"}

        </div>

      </div>


      {/* ================================================
          DATASET STATUS
      ================================================= */}

      {loading ? (

        <div style={styles.loadingBox}>

          <RefreshCw
            size={17}
          />

          Đang kiểm tra dữ liệu Evidence...

        </div>

      ) : imported ? (

        <div style={styles.importedNotice}>

          <CheckCircle2
            size={20}
          />


          <div style={styles.noticeCopy}>

            <strong>
              Dataset Evidence đã được nhập
            </strong>


            <span>
              Hệ thống có thể xác định sinh viên
              nào có hoặc không có Evidence khi
              thực hiện đối soát.
            </span>

          </div>

        </div>

      ) : (

        <div style={styles.warningNotice}>

          <AlertCircle
            size={20}
          />


          <div style={styles.noticeCopy}>

            <strong>
              Chưa có dataset Evidence
            </strong>


            <span>
              Ở trạng thái này hệ thống chưa được
              kết luận sinh viên "Không có Evidence".
              Hãy Import dữ liệu Google Form trước
              khi đối soát cuối.
            </span>

          </div>

        </div>

      )}


      {/* ================================================
          CURRENT SUMMARY
      ================================================= */}

      <div style={styles.currentSummary}>

        <SummaryBox
          icon={Users}
          label="Đã đăng ký"
          value={
            registeredCount
          }
        />


        <SummaryBox
          icon={FileCheck2}
          label="Có Evidence"
          value={
            imported
              ? evidenceCount
              : "—"
          }
          type="success"
        />


        <SummaryBox
          icon={UserX}
          label="Thiếu Evidence"
          value={
            imported
              ? missingCount
              : "—"
          }
          type={
            imported &&
            missingCount > 0
              ? "danger"
              : "default"
          }
        />


        <SummaryBox
          icon={UserCheck}
          label="Tỷ lệ phản hồi"
          value={
            imported
              ? `${coverageRate}%`
              : "—"
          }
          type="blue"
        />

      </div>


      {/* ================================================
          IMPORT HISTORY
      ================================================= */}

      {imported && (

        <div style={styles.importHistory}>

          <div style={styles.historyIcon}>

            <Clock3
              size={18}
            />

          </div>


          <div style={styles.historyCopy}>

            <strong>
              Lần Import gần nhất
            </strong>


            <span>
              File:{" "}
              {importInfo
                ?.file_name ||
                "Dữ liệu Evidence hiện tại"}
            </span>


            <span>
              Thời gian:{" "}
              {formatDateTime(
                importInfo
                  ?.imported_at
              )}
            </span>


            {importInfo
              ?.valid_rows != null && (

              <span>
                Hợp lệ:{" "}
                {importInfo.valid_rows}
                {" / "}
                {importInfo.total_rows ??
                  importInfo.valid_rows}
                {" phản hồi"}
              </span>

            )}

          </div>

        </div>

      )}


      {/* ================================================
          REGISTRATION REQUIRED
      ================================================= */}

      {registeredCount <= 0 && (

        <div style={styles.registrationWarning}>

          <AlertCircle
            size={18}
          />


          <span>
            Hoạt động chưa có danh sách đăng ký.
            Hãy Import Registration từ Portal trước
            khi Import Evidence.
          </span>

        </div>

      )}


      {/* ================================================
          ERROR / SUCCESS
      ================================================= */}

      {success && (

        <div style={styles.successBox}>

          <CheckCircle2
            size={18}
          />

          <span>
            {success}
          </span>

        </div>

      )}


      {error && (

        <div style={styles.errorBox}>

          <AlertCircle
            size={18}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ================================================
          FLOW
      ================================================= */}

      <div style={styles.flowBox}>

        <strong>
          Luồng Evidence
        </strong>


        <span>
          Google Form
          {" → "}
          Google Sheets
          {" → "}
          Excel / CSV
          {" → "}
          Xem trước
          {" → "}
          Import
          {" → "}
          Đối soát theo MSSV
        </span>

      </div>


      {/* ================================================
          FILE INPUT
      ================================================= */}

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
            size={24}
          />

        </div>


        <strong>
          {selectedFile
            ? selectedFile.name
            : (
                imported
                  ? "Chọn file để Import lại Evidence"
                  : "Chọn file Evidence từ Google Sheets"
              )}
        </strong>


        <span>
          {selectedFile
            ? formatFileSize(
                selectedFile.size
              )
            : "Hỗ trợ .xlsx và .csv"}
        </span>

      </button>


      {/* ================================================
          FILE ACTION
      ================================================= */}

      {selectedFile && (

        <div style={styles.fileActions}>

          <div style={styles.fileInfo}>

            <FileSpreadsheet
              size={18}
            />


            <div style={styles.fileInfoCopy}>

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

                Đang đọc...

              </>

            ) : (

              <>

                <FileCheck2
                  size={16}
                />

                Xem trước Evidence

              </>

            )}

          </button>

        </div>

      )}


      {/* ================================================
          PREVIEW
      ================================================= */}

      {preview && (

        <div style={styles.previewSection}>

          <div style={styles.sectionHeader}>

            <div>

              <span style={styles.sectionEyebrow}>
                KIỂM TRA TRƯỚC KHI IMPORT
              </span>


              <h4 style={styles.sectionTitle}>
                Kết quả đọc file
              </h4>

            </div>


            <span style={styles.fileBadge}>
              {preview.file_name}
            </span>

          </div>


          {/* SUMMARY */}

          <div style={styles.previewSummary}>

            <MiniSummary
              label="Tổng phản hồi"
              value={
                preview.total_rows ||
                0
              }
            />


            <MiniSummary
              label="Hợp lệ"
              value={
                preview.valid_rows ||
                0
              }
              type="success"
            />


            <MiniSummary
              label="Có lỗi"
              value={
                preview.invalid_rows ||
                0
              }
              type={
                preview.invalid_rows > 0
                  ? "danger"
                  : "default"
              }
            />


            <MiniSummary
              label="Không đăng ký"
              value={
                previewErrors
                  .not_registered ||
                0
              }
              type={
                previewErrors
                  .not_registered > 0
                  ? "danger"
                  : "default"
              }
            />


            <MiniSummary
              label="Trùng MSSV"
              value={
                previewErrors
                  .duplicate_mssv ||
                0
              }
              type={
                previewErrors
                  .duplicate_mssv > 0
                  ? "warning"
                  : "default"
              }
            />


            <MiniSummary
              label="MSSV lỗi"
              value={
                previewErrors
                  .invalid_mssv ||
                0
              }
              type={
                previewErrors
                  .invalid_mssv > 0
                  ? "danger"
                  : "default"
              }
            />


            <MiniSummary
              label="Thiếu MSSV"
              value={
                previewErrors
                  .missing_mssv ||
                0
              }
              type={
                previewErrors
                  .missing_mssv > 0
                  ? "danger"
                  : "default"
              }
            />

          </div>


          {/* DETECTED COLUMNS */}

          {preview
            ?.detected_columns && (

            <div style={styles.detectedBox}>

              <strong>
                Các cột hệ thống đã nhận diện
              </strong>


              <div style={styles.detectedList}>

                {Object.entries(
                  preview.detected_columns
                ).map(
                  ([
                    field,
                    header,
                  ]) => (

                    <div
                      key={field}
                      style={styles.detectedItem}
                    >

                      <span>
                        {formatFieldName(
                          field
                        )}
                      </span>


                      <strong>
                        {header}
                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* PREVIEW TABLE */}

          <div style={styles.tableHeader}>

            <div>

              <strong>
                Dữ liệu xem trước
              </strong>


              <span>
                Hiển thị tối đa 30 phản hồi đầu tiên.
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
                    Lớp
                  </th>

                  <th style={styles.th}>
                    Thời gian gửi
                  </th>

                  <th style={styles.th}>
                    Đánh giá
                  </th>

                  <th style={styles.th}>
                    Trạng thái
                  </th>

                </tr>

              </thead>


              <tbody>

                {(preview.preview || [])
                  .map(
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
                            {row.mssv ||
                              "—"}
                          </strong>

                        </td>


                        <td style={styles.td}>
                          {row.full_name ||
                            "—"}
                        </td>


                        <td style={styles.td}>
                          {row.class_name ||
                            "—"}
                        </td>


                        <td style={styles.td}>
                          {formatDateTime(
                            row.submitted_at
                          )}
                        </td>


                        <td style={styles.td}>
                          {formatRating(
                            row.rating
                          )}
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

            <div style={styles.importMessage}>

              <AlertCircle
                size={17}
              />


              <span>
                Chỉ{" "}
                <strong>
                  {preview.valid_rows}
                </strong>
                {" "}
                Evidence hợp lệ sẽ được lưu.
                {imported
                  ? (
                      " Dataset Evidence hiện tại "
                      +
                      "sẽ được thay thế."
                    )
                  : ""}
              </span>

            </div>


            <button
              type="button"
              style={{
                ...styles.importButton,

                ...((
                  importing ||
                  Number(
                    preview.valid_rows
                  ) <= 0
                )
                  ? styles.disabledButton
                  : {}),
              }}
              disabled={
                importing ||
                Number(
                  preview.valid_rows
                ) <= 0
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

                  Đang Import...

                </>

              ) : (

                <>

                  <Upload
                    size={17}
                  />

                  Xác nhận Import Evidence

                </>

              )}

            </button>

          </div>

        </div>

      )}


      {/* ================================================
          SAVED EVIDENCE
      ================================================= */}

      <div style={styles.savedSection}>

        <div style={styles.sectionHeader}>

          <div>

            <span style={styles.sectionEyebrow}>
              DỮ LIỆU EVIDENCE HIỆN TẠI
            </span>


            <h4 style={styles.sectionTitle}>
              Danh sách phản hồi đã lưu
            </h4>

          </div>


          <div style={styles.totalBadge}>

            <Users
              size={16}
            />

            {loading
              ? "..."
              : evidenceCount}

            {" "}
            sinh viên

          </div>

        </div>


        {!imported ? (

          <div style={styles.emptyBox}>

            <FileSpreadsheet
              size={30}
            />


            <strong>
              Chưa nhập dữ liệu Evidence
            </strong>


            <span>
              Chọn file Google Form phía trên
              để bắt đầu.
            </span>

          </div>

        ) : currentItems.length === 0 ? (

          <div style={styles.emptyBox}>

            <FileSpreadsheet
              size={30}
            />


            <strong>
              Dataset chưa có phản hồi hợp lệ
            </strong>

          </div>

        ) : (

          <>

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
                      Lớp
                    </th>

                    <th style={styles.th}>
                      Email
                    </th>

                    <th style={styles.th}>
                      Thời gian gửi
                    </th>

                    <th style={styles.th}>
                      Đánh giá
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {currentItems
                    .slice(
                      0,
                      100
                    )
                    .map(
                      (
                        row,
                        index
                      ) => (

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
                            {row.full_name ||
                              "—"}
                          </td>


                          <td style={styles.td}>
                            {row.class_name ||
                              "—"}
                          </td>


                          <td style={styles.td}>
                            {row.email ||
                              "—"}
                          </td>


                          <td style={styles.td}>
                            {formatDateTime(
                              row.submitted_at
                            )}
                          </td>


                          <td style={styles.td}>
                            {formatRating(
                              row.rating
                            )}
                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>


            {currentItems.length > 100 && (

              <div style={styles.tableFootnote}>

                Đang hiển thị 100 /{" "}
                {currentItems.length}
                {" "}
                phản hồi.

              </div>

            )}

          </>

        )}

      </div>

    </section>

  );

}


// ======================================================
// SUMMARY BOX
// ======================================================

function SummaryBox({
  icon: Icon,
  label,
  value,
  type = "default",
}) {

  return (

    <div
      style={{
        ...styles.summaryBox,

        ...(type === "success"
          ? styles.summarySuccess
          : {}),

        ...(type === "danger"
          ? styles.summaryDanger
          : {}),

        ...(type === "blue"
          ? styles.summaryBlue
          : {}),
      }}
    >

      <div style={styles.summaryIcon}>

        <Icon
          size={18}
        />

      </div>


      <div style={styles.summaryCopy}>

        <span>
          {label}
        </span>


        <strong>
          {value}
        </strong>

      </div>

    </div>

  );

}


// ======================================================
// MINI SUMMARY
// ======================================================

function MiniSummary({
  label,
  value,
  type = "default",
}) {

  return (

    <div
      style={{
        ...styles.miniSummary,

        ...(type === "success"
          ? styles.miniSuccess
          : {}),

        ...(type === "danger"
          ? styles.miniDanger
          : {}),

        ...(type === "warning"
          ? styles.miniWarning
          : {}),
      }}
    >

      <span>
        {label}
      </span>


      <strong>
        {value}
      </strong>

    </div>

  );

}


// ======================================================
// HELPERS
// ======================================================

function calculateRate(
  value,
  total
) {

  const current =
    Number(value) || 0;


  const maximum =
    Number(total) || 0;


  if (
    maximum <= 0
  ) {

    return 0;

  }


  return Math.round(
    (
      current /
      maximum
    )
    * 1000
  ) / 10;

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
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

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

    return `${(
      value / 1024
    ).toFixed(1)} KB`;

  }


  return `${(
    value /
    (
      1024 *
      1024
    )
  ).toFixed(1)} MB`;

}


function formatRating(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return "—";

  }


  return `${value} / 5`;

}


function formatErrors(
  errors
) {

  const mapping = {

    MISSING_MSSV:
      "Thiếu MSSV",

    INVALID_MSSV:
      "MSSV không hợp lệ",

    DUPLICATE_MSSV:
      "Trùng MSSV",

    NOT_REGISTERED:
      "Chưa đăng ký",

  };


  return (
    (errors || [])
      .map(
        (code) =>
          mapping[code] ||
          code
      )
      .join(", ")
    ||
    "Không hợp lệ"
  );

}


function formatFieldName(
  field
) {

  const mapping = {

    mssv:
      "MSSV",

    full_name:
      "Họ và tên",

    class_name:
      "Lớp",

    personal_email:
      "Email cá nhân",

    response_email:
      "Email Google Form",

    submitted_at:
      "Dấu thời gian",

    reflection:
      "Cảm nghĩ",

    purpose:
      "Mục đích",

    improvement:
      "Góp ý",

    rating:
      "Đánh giá",

    future_content:
      "Nội dung mong muốn",

  };


  return (
    mapping[field] ||
    field
  );

}


// ======================================================
// STYLES
// ======================================================

const styles = {

  card: {
    padding: "20px",

    border:
      "1px solid #dbe5f1",

    borderRadius:
      "18px",

    background:
      "#ffffff",

    boxShadow:
      "0 8px 24px rgba(15,23,42,0.04)",
  },


  header: {
    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "flex-start",

    gap:
      "16px",

    flexWrap:
      "wrap",

    marginBottom:
      "16px",
  },


  eyebrow: {
    fontSize:
      "11px",

    fontWeight:
      800,

    letterSpacing:
      "1px",

    color:
      "#7c3aed",
  },


  title: {
    margin:
      "5px 0 0",

    color:
      "#0f172a",

    fontSize:
      "21px",
  },


  description: {
    margin:
      "6px 0 0",

    color:
      "#64748b",

    fontSize:
      "12px",

    lineHeight:
      1.5,
  },


  importedBadge: {
    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "6px",

    padding:
      "8px 11px",

    borderRadius:
      "999px",

    background:
      "#ecfdf5",

    color:
      "#047857",

    fontSize:
      "11px",

    fontWeight:
      800,
  },


  notImportedBadge: {
    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "6px",

    padding:
      "8px 11px",

    borderRadius:
      "999px",

    background:
      "#fffbeb",

    color:
      "#b45309",

    fontSize:
      "11px",

    fontWeight:
      800,
  },


  loadingBox: {
    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",

    borderRadius:
      "11px",

    background:
      "#f8fafc",

    color:
      "#64748b",

    fontSize:
      "12px",
  },


  importedNotice: {
    marginBottom:
      "15px",

    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "flex-start",

    gap:
      "10px",

    border:
      "1px solid #a7f3d0",

    borderRadius:
      "12px",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  warningNotice: {
    marginBottom:
      "15px",

    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "flex-start",

    gap:
      "10px",

    border:
      "1px solid #fde68a",

    borderRadius:
      "12px",

    background:
      "#fffbeb",

    color:
      "#92400e",
  },


  noticeCopy: {
    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "4px",

    fontSize:
      "12px",

    lineHeight:
      1.5,
  },


  currentSummary: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(165px,1fr))",

    gap:
      "10px",

    marginBottom:
      "15px",
  },


  summaryBox: {
    minHeight:
      "74px",

    padding:
      "13px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "10px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "12px",

    background:
      "#f8fafc",

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


  summaryDanger: {
    borderColor:
      "#fecaca",

    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },


  summaryBlue: {
    borderColor:
      "#bfdbfe",

    background:
      "#eff6ff",

    color:
      "#1d4ed8",
  },


  summaryIcon: {
    width:
      "36px",

    height:
      "36px",

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
      "rgba(255,255,255,0.8)",
  },


  summaryCopy: {
    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "4px",

    fontSize:
      "11px",
  },


  importHistory: {
    marginBottom:
      "15px",

    padding:
      "13px 15px",

    display:
      "flex",

    alignItems:
      "flex-start",

    gap:
      "10px",

    borderRadius:
      "12px",

    background:
      "#f8fafc",

    color:
      "#475569",
  },


  historyIcon: {
    width:
      "36px",

    height:
      "36px",

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
      "#ede9fe",

    color:
      "#7c3aed",
  },


  historyCopy: {
    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "3px",

    fontSize:
      "11px",
  },


  registrationWarning: {
    marginBottom:
      "15px",

    padding:
      "12px 14px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",

    borderRadius:
      "11px",

    background:
      "#fff7ed",

    color:
      "#c2410c",

    fontSize:
      "12px",
  },


  successBox: {
    marginBottom:
      "12px",

    padding:
      "11px 13px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",

    borderRadius:
      "10px",

    background:
      "#ecfdf5",

    color:
      "#047857",

    fontSize:
      "12px",
  },


  errorBox: {
    marginBottom:
      "12px",

    padding:
      "11px 13px",

    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",

    borderRadius:
      "10px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",

    fontSize:
      "12px",
  },


  flowBox: {
    marginBottom:
      "14px",

    padding:
      "12px 14px",

    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "4px",

    borderRadius:
      "11px",

    background:
      "#f5f3ff",

    color:
      "#6d28d9",

    fontSize:
      "11px",
  },


  uploadArea: {
    width:
      "100%",

    minHeight:
      "125px",

    padding:
      "20px",

    display:
      "flex",

    flexDirection:
      "column",

    justifyContent:
      "center",

    alignItems:
      "center",

    gap:
      "7px",

    border:
      "1px dashed #c4b5fd",

    borderRadius:
      "13px",

    background:
      "#fafaff",

    color:
      "#475569",

    cursor:
      "pointer",
  },


  uploadIcon: {
    width:
      "44px",

    height:
      "44px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    borderRadius:
      "12px",

    background:
      "#ede9fe",

    color:
      "#7c3aed",
  },


  fileActions: {
    marginTop:
      "12px",

    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap:
      "12px",

    flexWrap:
      "wrap",
  },


  fileInfo: {
    display:
      "flex",

    alignItems:
      "center",

    gap:
      "9px",

    color:
      "#475569",
  },


  fileInfoCopy: {
    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "2px",

    fontSize:
      "11px",
  },


  previewButton: {
    minHeight:
      "40px",

    padding:
      "0 14px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "7px",

    border:
      "none",

    borderRadius:
      "10px",

    background:
      "#7c3aed",

    color:
      "#ffffff",

    fontWeight:
      700,

    cursor:
      "pointer",
  },


  previewSection: {
    marginTop:
      "20px",

    paddingTop:
      "18px",

    borderTop:
      "1px solid #e2e8f0",
  },


  sectionHeader: {
    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap:
      "12px",

    flexWrap:
      "wrap",

    marginBottom:
      "14px",
  },


  sectionEyebrow: {
    display:
      "block",

    color:
      "#7c3aed",

    fontSize:
      "10px",

    fontWeight:
      800,

    letterSpacing:
      "0.8px",
  },


  sectionTitle: {
    margin:
      "4px 0 0",

    color:
      "#0f172a",

    fontSize:
      "16px",
  },


  fileBadge: {
    maxWidth:
      "360px",

    overflow:
      "hidden",

    textOverflow:
      "ellipsis",

    whiteSpace:
      "nowrap",

    padding:
      "6px 9px",

    borderRadius:
      "999px",

    background:
      "#f5f3ff",

    color:
      "#6d28d9",

    fontSize:
      "10px",

    fontWeight:
      700,
  },


  previewSummary: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(120px,1fr))",

    gap:
      "9px",

    marginBottom:
      "16px",
  },


  miniSummary: {
    padding:
      "12px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "5px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "11px",

    background:
      "#f8fafc",

    color:
      "#475569",

    fontSize:
      "11px",
  },


  miniSuccess: {
    borderColor:
      "#a7f3d0",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  miniDanger: {
    borderColor:
      "#fecaca",

    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },


  miniWarning: {
    borderColor:
      "#fde68a",

    background:
      "#fffbeb",

    color:
      "#b45309",
  },


  detectedBox: {
    marginBottom:
      "16px",

    padding:
      "13px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "12px",

    background:
      "#f8fafc",

    color:
      "#475569",

    fontSize:
      "11px",
  },


  detectedList: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap:
      "7px",

    marginTop:
      "10px",
  },


  detectedItem: {
    padding:
      "8px 9px",

    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "3px",

    borderRadius:
      "8px",

    background:
      "#ffffff",
  },


  tableHeader: {
    marginBottom:
      "9px",

    color:
      "#0f172a",

    fontSize:
      "12px",
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
      "900px",

    borderCollapse:
      "collapse",

    fontSize:
      "11px",
  },


  th: {
    padding:
      "10px",

    textAlign:
      "left",

    background:
      "#f8fafc",

    color:
      "#475569",

    borderBottom:
      "1px solid #e2e8f0",
  },


  td: {
    padding:
      "10px",

    color:
      "#475569",

    verticalAlign:
      "top",

    borderBottom:
      "1px solid #f1f5f9",
  },


  validBadge: {
    display:
      "inline-block",

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


  invalidBadge: {
    display:
      "inline-block",

    padding:
      "4px 8px",

    borderRadius:
      "999px",

    background:
      "#fef2f2",

    color:
      "#b91c1c",

    fontWeight:
      700,
  },


  importFooter: {
    marginTop:
      "15px",

    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap:
      "12px",

    flexWrap:
      "wrap",
  },


  importMessage: {
    display:
      "flex",

    alignItems:
      "center",

    gap:
      "7px",

    color:
      "#64748b",

    fontSize:
      "11px",
  },


  importButton: {
    minHeight:
      "42px",

    padding:
      "0 15px",

    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "7px",

    border:
      "none",

    borderRadius:
      "10px",

    background:
      "#7c3aed",

    color:
      "#ffffff",

    fontWeight:
      700,

    cursor:
      "pointer",
  },


  disabledButton: {
    opacity:
      0.55,

    cursor:
      "not-allowed",
  },


  savedSection: {
    marginTop:
      "22px",

    paddingTop:
      "18px",

    borderTop:
      "1px solid #e2e8f0",
  },


  totalBadge: {
    display:
      "inline-flex",

    alignItems:
      "center",

    gap:
      "6px",

    padding:
      "7px 10px",

    borderRadius:
      "999px",

    background:
      "#f5f3ff",

    color:
      "#6d28d9",

    fontSize:
      "11px",

    fontWeight:
      700,
  },


  emptyBox: {
    minHeight:
      "150px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "center",

    justifyContent:
      "center",

    gap:
      "7px",

    textAlign:
      "center",

    border:
      "1px dashed #cbd5e1",

    borderRadius:
      "12px",

    background:
      "#f8fafc",

    color:
      "#94a3b8",

    fontSize:
      "12px",
  },


  tableFootnote: {
    marginTop:
      "8px",

    textAlign:
      "right",

    color:
      "#94a3b8",

    fontSize:
      "10px",
  },

};


export default EvidenceImportSection;