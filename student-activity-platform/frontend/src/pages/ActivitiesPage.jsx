import { useCallback, useEffect, useState, } from "react";
import { Plus, CalendarDays, MapPin, Users, RefreshCw, ArrowRight, Activity, AlertCircle, CheckCircle2, X, Send, BadgeCheck, Clock3, Pencil, Ban, Star, Trash2, } from "lucide-react";
import CreateActivityForm from "../components/CreateActivityForm";
import { getActivities, submitActivityForApproval, publishActivity, cancelActivity, setActivityFeatured, deleteActivity, } from "../services/api";
// ======================================================
// ACTIVITIES PAGE
// ======================================================
function ActivitiesPage({ onOpenAttendance, }) {
    // ====================================================
    // STATES
    // ====================================================
    const [activities, setActivities,] = useState([]);
    const [loading, setLoading,] = useState(true);
    const [refreshing, setRefreshing,] = useState(false);
    const [error, setError,] = useState("");
    const [successMessage, setSuccessMessage,] = useState("");
    const [showCreateForm, setShowCreateForm,] = useState(false);
    const [actionActivityId, setActionActivityId,] = useState(null);
    const [editingActivity, setEditingActivity,] = useState(null);
    const [activeTab, setActiveTab] = useState("CURRENT");
    const [academicYearFilter, setAcademicYearFilter] = useState("ALL");
    const [semesterFilter, setSemesterFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    // ====================================================
    // LOAD ACTIVITIES
    // ====================================================
    const loadActivities = useCallback(async (silent = false) => {
        try {
            if (silent) {
                setRefreshing(true);
            }
            else {
                setLoading(true);
            }
            setError("");
            const result = await getActivities();
            let list = [];
            if (Array.isArray(result)) {
                list = result;
            }
            else if (Array.isArray(result?.data)) {
                list =
                    result.data;
            }
            else if (Array.isArray(result?.data?.items)) {
                list =
                    result.data.items;
            }
            else {
                throw new Error("Dữ liệu danh sách hoạt động không hợp lệ.");
            }
            // ==============================================
            // SORT BY START TIME
            // ==============================================
            const sorted = [
                ...list,
            ].sort((a, b) => {
                const timeA = new Date(a.start_time || 0).getTime();
                const timeB = new Date(b.start_time || 0).getTime();
                if (Number.isNaN(timeA)
                    ||
                        Number.isNaN(timeB)) {
                    return 0;
                }
                return (timeA - timeB);
            });
            setActivities(sorted);
        }
        catch (err) {
            console.error("Load activities error:", err);
            setError(err.message ||
                "Không thể tải danh sách hoạt động.");
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);
    // ====================================================
    // INITIAL LOAD
    // ====================================================
    useEffect(() => {
        loadActivities();
    }, [loadActivities]);
    // ====================================================
    // CREATE FORM
    // ====================================================
    function openCreateForm() {
        setError("");
        setSuccessMessage("");
        setEditingActivity(null);
        setShowCreateForm(true);
    }
    function closeCreateForm() {
        setShowCreateForm(false);
        setEditingActivity(null);
    }
    // ====================================================
    // EDIT FORM
    // ====================================================
    function openEditForm(activity) {
        setError("");
        setSuccessMessage("");
        setEditingActivity(activity);
        setShowCreateForm(true);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
    // ====================================================
    // CREATED SUCCESSFULLY
    // ====================================================
    async function handleActivityCreated(activity) {
        setShowCreateForm(false);
        setEditingActivity(null);
        setSuccessMessage(`Đã tạo bản nháp: ${activity?.activity_name ||
            "Hoạt động mới"}.`);
        await loadActivities(true);
    }
    // ====================================================
    // UPDATED SUCCESSFULLY
    // ====================================================
    async function handleActivityUpdated(activity) {
        setShowCreateForm(false);
        setEditingActivity(null);
        setSuccessMessage(`Đã cập nhật hoạt động: ${activity?.activity_name ||
            "Hoạt động"}.`);
        await loadActivities(true);
    }
    // ====================================================
    // SUBMIT FOR APPROVAL
    // ====================================================
    async function handleSubmitApproval(activity) {
        const confirmed = window.confirm(`Bạn có chắc muốn gửi "${activity.activity_name}" để phê duyệt?`);
        if (!confirmed) {
            return;
        }
        try {
            setActionActivityId(activity.activity_id);
            setError("");
            setSuccessMessage("");
            const result = await submitActivityForApproval(activity.activity_id);
            setSuccessMessage(result?.message ||
                "Đã gửi hoạt động để phê duyệt.");
            await loadActivities(true);
        }
        catch (err) {
            console.error("Submit approval error:", err);
            setError(err.message ||
                "Không thể gửi hoạt động để phê duyệt.");
        }
        finally {
            setActionActivityId(null);
        }
    }
    // ====================================================
    // ADMIN PUBLISH
    // ====================================================
    async function handlePublish(activity) {
        const confirmed = window.confirm(`Phê duyệt và xuất bản "${activity.activity_name}"?`);
        if (!confirmed) {
            return;
        }
        try {
            setActionActivityId(activity.activity_id);
            setError("");
            setSuccessMessage("");
            const result = await publishActivity(activity.activity_id);
            setSuccessMessage(result?.message ||
                "Hoạt động đã được phê duyệt và xuất bản.");
            await loadActivities(true);
        }
        catch (err) {
            console.error("Publish activity error:", err);
            setError(err.message ||
                "Không thể phê duyệt và xuất bản hoạt động.");
        }
        finally {
            setActionActivityId(null);
        }
    }
    // ====================================================
    // ADMIN CANCEL ACTIVITY
    // ====================================================
    async function handleCancelActivity(activity) {
        const reason = window.prompt(`Nhập lý do hủy hoạt động "${activity.activity_name}":`);
        if (reason === null) {
            return;
        }
        const cleanReason = reason.trim();
        if (!cleanReason) {
            setError("Vui lòng nhập lý do hủy hoạt động.");
            return;
        }
        const confirmed = window.confirm(`Bạn có chắc muốn hủy "${activity.activity_name}"?\n\nLý do: ${cleanReason}`);
        if (!confirmed) {
            return;
        }
        try {
            setActionActivityId(activity.activity_id);
            setError("");
            setSuccessMessage("");
            const result = await cancelActivity(activity.activity_id, cleanReason);
            setSuccessMessage(result?.message ||
                "Đã hủy hoạt động.");
            if (editingActivity
                ?.activity_id ===
                activity.activity_id) {
                setEditingActivity(null);
                setShowCreateForm(false);
            }
            await loadActivities(true);
        }
        catch (err) {
            console.error("Cancel activity error:", err);
            setError(err.message ||
                "Không thể hủy hoạt động.");
        }
        finally {
            setActionActivityId(null);
        }
    }
    // ====================================================
    // ADMIN FEATURE ACTIVITY
    // ====================================================
    async function handleFeaturedActivity(activity) {
        const currentFeatured = Boolean(activity.is_featured);
        const nextFeatured = !currentFeatured;
        const actionText = nextFeatured
            ? "đặt làm nổi bật"
            : "bỏ khỏi danh sách nổi bật";
        const confirmed = window.confirm(`Bạn có chắc muốn ${actionText} hoạt động "${activity.activity_name}"?`);
        if (!confirmed) {
            return;
        }
        try {
            setActionActivityId(activity.activity_id);
            setError("");
            setSuccessMessage("");
            const result = await setActivityFeatured(activity.activity_id, nextFeatured);
            setSuccessMessage(result?.message ||
                (nextFeatured
                    ? "Đã đặt hoạt động làm nổi bật."
                    : "Đã bỏ đánh dấu nổi bật."));
            await loadActivities(true);
        }
        catch (err) {
            console.error("Featured activity error:", err);
            setError(err.message ||
                "Không thể cập nhật trạng thái nổi bật.");
        }
        finally {
            setActionActivityId(null);
        }
    }
    // ====================================================
    // ADMIN DELETE ACTIVITY
    // ====================================================
    async function handleDeleteActivity(activity) {
        const confirmed = window.confirm(
            `XÓA VĨNH VIỄN "${activity.activity_name}"?\n\n` +
            "Thao tác này không thể hoàn tác. Chỉ hoạt động chưa có Registration, " +
            "Attendance, Evidence hoặc kết quả đối soát mới được phép xóa."
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionActivityId(activity.activity_id);
            setError("");
            setSuccessMessage("");

            const result = await deleteActivity(
                activity.activity_id
            );

            if (
                editingActivity?.activity_id ===
                activity.activity_id
            ) {
                setEditingActivity(null);
                setShowCreateForm(false);
            }

            setSuccessMessage(
                result?.message ||
                "Đã xóa vĩnh viễn hoạt động."
            );

            await loadActivities(true);
        }
        catch (err) {
            console.error(
                "Delete activity error:",
                err
            );

            setError(
                err.message ||
                "Không thể xóa hoạt động."
            );
        }
        finally {
            setActionActivityId(null);
        }
    }

    // ====================================================
    // FILTERS
    // ====================================================
    const tabCounts = activities.reduce((counts, activity) => {
        const publicationStatus = resolvePublicationStatus(activity);
        const runtimeStatus = resolveRuntimeStatus(activity);
        if (publicationStatus === "CANCELLED") {
            counts.CANCELLED += 1;
        }
        else if (publicationStatus === "PUBLISHED"
            && runtimeStatus === "COMPLETED") {
            counts.COMPLETED += 1;
        }
        else {
            counts.CURRENT += 1;
        }
        return counts;
    }, { CURRENT: 0, COMPLETED: 0, CANCELLED: 0 });
    const academicYears = Array.from(new Set(activities
        .map((activity) => String(activity.academic_year || "").trim())
        .filter(Boolean))).sort((a, b) => b.localeCompare(a, "vi"));
    const semesters = Array.from(new Set(activities
        .map((activity) => normalizeSemester(activity.semester))
        .filter(Boolean))).sort(semesterSort);
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase("vi");
    const filteredActivities = activities
        .filter((activity) => {
        const publicationStatus = resolvePublicationStatus(activity);
        const runtimeStatus = resolveRuntimeStatus(activity);
        const group = publicationStatus === "CANCELLED"
            ? "CANCELLED"
            : publicationStatus === "PUBLISHED"
                && runtimeStatus === "COMPLETED"
                ? "COMPLETED"
                : "CURRENT";
        if (group !== activeTab) {
            return false;
        }
        if (academicYearFilter !== "ALL"
            && String(activity.academic_year || "").trim() !== academicYearFilter) {
            return false;
        }
        if (semesterFilter !== "ALL"
            && normalizeSemester(activity.semester) !== semesterFilter) {
            return false;
        }
        if (!normalizedSearch) {
            return true;
        }
        const searchable = [
            activity.activity_name,
            activity.activity_id,
            activity.location,
            activity.activity_type,
            activity.academic_year,
            semesterLabel(activity.semester),
        ]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("vi");
        return searchable.includes(normalizedSearch);
    })
        .sort((a, b) => {
        const timeA = new Date(a.start_time || 0).getTime();
        const timeB = new Date(b.start_time || 0).getTime();
        if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
            return 0;
        }
        return activeTab === "CURRENT"
            ? timeA - timeB
            : timeB - timeA;
    });
    // ====================================================
    // UI
    // ====================================================
    return (<div style={styles.page}>

      {/* ================================================
  
            HEADER
  
        ================================================= */}

      <div style={styles.header}>

        <div>

          <span style={styles.eyebrow}>

            QUẢN LÝ

          </span>

          <h2 style={styles.title}>

            Hoạt động

          </h2>

          <p style={styles.description}>

            Tạo, gửi duyệt, xuất bản

            và quản lý các hoạt động

            sinh viên trên hệ thống.

          </p>

        </div>

        <div style={styles.headerActions}>

          {/* REFRESH */}

          <button type="button" style={styles.refreshButton} disabled={loading ||
            refreshing} onClick={() => loadActivities(true)}>

            <RefreshCw size={16}/>

            {refreshing
            ? "Đang tải..."
            : "Làm mới"}

          </button>

          {/* CREATE */}

          <button type="button" style={showCreateForm
            ? styles.closeFormButton
            : styles.createButton} onClick={showCreateForm
            ? closeCreateForm
            : openCreateForm}>

            {showCreateForm ? (<>

                <X size={17}/>

                Đóng biểu mẫu

              </>) : (<>

                <Plus size={17}/>

                Tạo hoạt động

              </>)}

          </button>

        </div>

      </div>

      {/* ================================================
  
            SUCCESS
  
        ================================================= */}

      {successMessage && (<div role="status" style={styles.successBox}>

          <CheckCircle2 size={20}/>

          <span style={{
                flex: 1,
            }}>

            {successMessage}

          </span>

          <button type="button" style={styles.dismissButton} onClick={() => setSuccessMessage("")} aria-label="Đóng thông báo">

            <X size={17}/>

          </button>

        </div>)}

      {/* ================================================
  
            ERROR
  
        ================================================= */}

      {error && (<div role="alert" style={styles.errorBox}>

          <AlertCircle size={21}/>

          <div style={{
                flex: 1,
            }}>

            <strong>

              Có lỗi xảy ra

            </strong>

            <p style={styles.errorText}>

              {error}

            </p>

          </div>

          <button type="button" style={styles.dismissButton} onClick={() => setError("")} aria-label="Đóng thông báo lỗi">

            <X size={17}/>

          </button>

        </div>)}

      {/* ================================================
  
            CREATE / EDIT FORM
  
        ================================================= */}

      {showCreateForm && (<CreateActivityForm activityToEdit={editingActivity} onCancel={closeCreateForm} onCreated={handleActivityCreated} onUpdated={handleActivityUpdated}/>)}

      {/* SUMMARY */}
      <div style={styles.summary}>
        <div style={styles.summaryIcon}>
          <Activity size={22}/>
        </div>
        <div>
          <strong style={styles.summaryValue}>
            {loading ? "..." : activities.length}
          </strong>
          <span style={styles.summaryLabel}>hoạt động trên hệ thống</span>
        </div>
      </div>

      {/* TABS + FILTERS */}
      {!loading && activities.length > 0 && (<section style={styles.filterPanel}>
          <div style={styles.tabs}>
            {[
                ["CURRENT", "Đang & sắp diễn ra", tabCounts.CURRENT],
                ["COMPLETED", "Đã diễn ra", tabCounts.COMPLETED],
                ["CANCELLED", "Đã hủy", tabCounts.CANCELLED],
            ].map(([key, label, count]) => (<button key={key} type="button" style={{
                    ...styles.tabButton,
                    ...(activeTab === key ? styles.tabButtonActive : {}),
                }} onClick={() => setActiveTab(key)}>
                {label}
                <span style={{
                    ...styles.tabCount,
                    ...(activeTab === key ? styles.tabCountActive : {}),
                }}>
                  {count}
                </span>
              </button>))}
          </div>

          <div style={styles.filters}>
            <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tìm theo tên, mã, địa điểm..." style={styles.searchInput}/>

            <select value={academicYearFilter} onChange={(event) => setAcademicYearFilter(event.target.value)} style={styles.filterSelect}>
              <option value="ALL">Tất cả năm học</option>
              {academicYears.map((year) => (<option key={year} value={year}>
                  {year}
                </option>))}
            </select>

            <select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)} style={styles.filterSelect}>
              <option value="ALL">Tất cả học kỳ</option>
              {semesters.map((semester) => (<option key={semester} value={semester}>
                  {semesterLabel(semester)}
                </option>))}
            </select>

            {(searchQuery
                || academicYearFilter !== "ALL"
                || semesterFilter !== "ALL") && (<button type="button" style={styles.clearFilterButton} onClick={() => {
                    setSearchQuery("");
                    setAcademicYearFilter("ALL");
                    setSemesterFilter("ALL");
                }}>
                Xóa bộ lọc
              </button>)}
          </div>
        </section>)}

      {/* CONTENT */}
      {loading ? (<div style={styles.stateBox}>
          <RefreshCw size={22}/>
          <span>Đang tải danh sách hoạt động...</span>
        </div>) : activities.length === 0 ? (<div style={styles.emptyBox}>
          <CalendarDays size={38} color="#94a3b8"/>
          <h3 style={styles.emptyTitle}>Chưa có hoạt động</h3>
          <p style={styles.emptyDescription}>
            Hãy tạo hoạt động đầu tiên để bắt đầu quản lý chương trình.
          </p>
          <button type="button" style={styles.createButton} onClick={openCreateForm}>
            <Plus size={17}/>
            Tạo hoạt động
          </button>
        </div>) : filteredActivities.length === 0 ? (<div style={styles.emptyBox}>
          <CalendarDays size={38} color="#94a3b8"/>
          <h3 style={styles.emptyTitle}>Không có hoạt động phù hợp</h3>
          <p style={styles.emptyDescription}>
            Thử đổi tab, năm học, học kỳ hoặc từ khóa tìm kiếm.
          </p>
        </div>) : (<div style={styles.grid}>
          {filteredActivities.map((activity) => (<ActivityCard key={activity.activity_id} activity={activity} onAttendance={onOpenAttendance} onEdit={openEditForm} onSubmitApproval={handleSubmitApproval} onPublish={handlePublish} onCancelActivity={handleCancelActivity} onFeaturedActivity={handleFeaturedActivity} onDeleteActivity={handleDeleteActivity} actionLoading={actionActivityId === activity.activity_id}/>))}
        </div>)}

    </div>);
}
// ======================================================
// ACTIVITY CARD
// ======================================================
function ActivityCard({ activity, onAttendance, onEdit, onSubmitApproval, onPublish, onCancelActivity, onFeaturedActivity, onDeleteActivity, actionLoading, }) {
    const publicationStatus = resolvePublicationStatus(activity);
    const runtimeStatus = resolveRuntimeStatus(activity);
    const publicationInfo = getPublicationInfo(publicationStatus);
    const runtimeInfo = getRuntimeInfo(runtimeStatus);
    const isPublished = publicationStatus ===
        "PUBLISHED";
    const isCancelled = publicationStatus ===
        "CANCELLED";
    const isFeatured = Boolean(activity.is_featured);
    const canDelete = activity.can_delete === true;
    const canAttendance = isPublished &&
        canOpenAttendancePage(activity);
    const canCancel = !isCancelled &&
        runtimeStatus !==
            "COMPLETED";
    /*
  
      ADMIN có thể:
  
      - bật nổi bật nếu hoạt động PUBLISHED và chưa kết thúc.
  
      - bỏ nổi bật nếu hoạt động hiện đang nổi bật.
  
    */
    const canManageFeatured = isPublished &&
        (isFeatured ||
            runtimeStatus !==
                "COMPLETED");
    return (<article style={styles.card}>

      {/* ================================================
  
            BADGES
  
        ================================================= */}

      <div style={styles.cardTop}>

        <div style={styles.badges}>

          <span style={{
            ...styles.status,
            background: publicationInfo.background,
            color: publicationInfo.color,
        }}>

            {publicationInfo.label}

          </span>

          {isPublished && (<span style={{
                ...styles.status,
                background: runtimeInfo.background,
                color: runtimeInfo.color,
            }}>

              {runtimeInfo.label}

            </span>)}

          {isFeatured && (<span style={styles.featuredBadge}>

              <Star size={12} fill="currentColor"/>

              NỔI BẬT

            </span>)}

        </div>

        <span style={styles.id}>

          {activity.activity_id}

        </span>

      </div>

      {/* ================================================
  
            NAME
  
        ================================================= */}

      <h3 style={styles.cardTitle}>

        {activity.activity_name ||
            activity.name ||
            "Hoạt động chưa có tên"}

      </h3>

      {/* ================================================
  
            INFORMATION
  
        ================================================= */}

      <div style={styles.meta}>

        <span style={styles.metaItem}>

          <CalendarDays size={15}/>

          {formatDate(activity.start_time)}

        </span>

        <span style={styles.metaItem}>

          <MapPin size={15}/>

          {activity.location ||
            "Chưa cập nhật địa điểm"}

        </span>

        <span style={styles.metaItem}>

          <Users size={15}/>

          {activity.capacity ??
            "—"}

          {" "}

          sinh viên

        </span>

        <span style={styles.metaItem}>

          <Activity size={15}/>

          {formatActivityType(activity.activity_type)}

        </span>

        {activity.description && (<p style={styles.cardDescription}>

            {activity.description}

          </p>)}

      </div>

      {/* ================================================
  
            ACTIONS
  
        ================================================= */}

      <div style={styles.cardFooter}>

        {/* ============================================

            DRAFT

        ============================================= */}

        {publicationStatus ===
            "DRAFT" && (<div style={styles.draftActions}>

            <button type="button" style={styles.editButton} disabled={actionLoading} onClick={() => onEdit?.(activity)}>

              <Pencil size={16}/>

              Chỉnh sửa

            </button>

            <button type="button" style={styles.submitButton} disabled={actionLoading} onClick={() => onSubmitApproval(activity)}>

              <Send size={16}/>

              {actionLoading
                ? "Đang gửi..."
                : "Gửi duyệt"}

            </button>

          </div>)}

        {/* ============================================

            PENDING - ADMIN

        ============================================= */}

        {publicationStatus ===
            "PENDING_APPROVAL" && (<button type="button" style={styles.publishButton} disabled={actionLoading} onClick={() => onPublish(activity)}>

            <BadgeCheck size={16}/>

            {actionLoading
                ? "Đang xử lý..."
                : "Duyệt & xuất bản"}

          </button>)}

        {/* ============================================

            PUBLISHED - ATTENDANCE

        ============================================= */}

        {isPublished && (<button type="button" style={{
                ...styles.attendanceButton,
                ...(!canAttendance
                    ? styles.disabledButton
                    : {}),
            }} disabled={!canAttendance} onClick={() => onAttendance?.(activity)}>

            {canAttendance
                ? "Điểm danh"
                : runtimeStatus ===
                    "COMPLETED"
                    ? "Đã kết thúc"
                    : "Chưa đến giờ điểm danh"}

            <ArrowRight size={16}/>

          </button>)}

        {/* ============================================

            FEATURED

        ============================================= */}

        {canManageFeatured && (<button type="button" style={isFeatured
                ? styles.unfeatureButton
                : styles.featureButton} disabled={actionLoading} onClick={() => onFeaturedActivity(activity)}>

            <Star size={16} fill={isFeatured
                ? "currentColor"
                : "none"}/>

            {actionLoading
                ? "Đang xử lý..."
                : isFeatured
                    ? "Bỏ nổi bật"
                    : "Đặt nổi bật"}

          </button>)}

        {/* ============================================

            ADMIN CANCEL

        ============================================= */}

        {canCancel && (<button type="button" style={styles.cancelActivityButton} disabled={actionLoading} onClick={() => onCancelActivity(activity)}>

            <Ban size={16}/>

            {actionLoading
                ? "Đang xử lý..."
                : "Hủy hoạt động"}

          </button>)}

        {/* ============================================

            SAFE HARD DELETE

        ============================================= */}

        {canDelete && (<button type="button" style={styles.deleteActivityButton} disabled={actionLoading} onClick={() => onDeleteActivity(activity)}>

            <Trash2 size={16}/>

            {actionLoading
                ? "Đang xóa..."
                : "Xóa vĩnh viễn"}

          </button>)}

        {/* ============================================

            CANCELLED INFORMATION

        ============================================= */}

        {isCancelled && (<div style={styles.cancelledBox}>

            <Ban size={16}/>

            <div>

              <strong>

                Hoạt động đã bị hủy.

              </strong>

              {activity.cancel_reason && (<div style={{
                    marginTop: "4px",
                }}>

                  Lý do:{" "}

                  {activity.cancel_reason}

                </div>)}

              {activity.cancelled_at && (<div style={{
                    marginTop: "3px",
                }}>

                  Thời gian hủy:{" "}

                  {formatDate(activity.cancelled_at)}

                </div>)}

            </div>

          </div>)}

        {/* ============================================

            DRAFT NOTE

        ============================================= */}

        {publicationStatus ===
            "DRAFT" && (<span style={styles.cardNote}>

            Hoạt động đang ở dạng bản nháp.

          </span>)}

        {/* ============================================

            PENDING ADMIN NOTE

        ============================================= */}

        {publicationStatus ===
            "PENDING_APPROVAL" && (<span style={styles.cardNote}>

            Hoạt động đang chờ phê duyệt.

          </span>)}

        {/* ============================================

            UPCOMING NOTE

        ============================================= */}

        {isPublished &&
            !canAttendance &&
            runtimeStatus ===
                "UPCOMING" && (<span style={styles.cardNote}>

            <Clock3 size={13}/>

            Điểm danh mở 30 phút

            trước giờ bắt đầu.

          </span>)}

        {/* ============================================

            COMPLETED NOTE

        ============================================= */}

        {isPublished &&
            runtimeStatus ===
                "COMPLETED" && (<span style={styles.cardNote}>

            Hoạt động đã kết thúc.

          </span>)}

      </div>

    </article>);
}
// ======================================================
// RESOLVE PUBLICATION STATUS
// ======================================================
function resolvePublicationStatus(activity) {
    const publication = String(activity?.publication_status ||
        "").toUpperCase();
    if (publication) {
        return publication;
    }
    const oldStatus = String(activity?.status ||
        "").toUpperCase();
    if ([
        "UPCOMING",
        "ACTIVE",
        "COMPLETED",
    ].includes(oldStatus)) {
        return "PUBLISHED";
    }
    if (oldStatus ===
        "PENDING_APPROVAL") {
        return "PENDING_APPROVAL";
    }
    if (oldStatus ===
        "CANCELLED" ||
        oldStatus ===
            "CANCELED") {
        return "CANCELLED";
    }
    return "DRAFT";
}
// ======================================================
// RESOLVE RUNTIME STATUS
// ======================================================
function resolveRuntimeStatus(activity) {
    if (!activity?.start_time ||
        !activity?.end_time) {
        return "UPCOMING";
    }
    const start = new Date(activity.start_time);
    const end = new Date(activity.end_time);
    if (Number.isNaN(start.getTime())
        ||
            Number.isNaN(end.getTime())) {
        return String(activity.status ||
            "UPCOMING").toUpperCase();
    }
    const now = new Date();
    if (now < start) {
        return "UPCOMING";
    }
    if (now >= start &&
        now <= end) {
        return "ACTIVE";
    }
    return "COMPLETED";
}
// ======================================================
// CAN OPEN ATTENDANCE PAGE
// ======================================================
function canOpenAttendancePage(activity) {
    if (!activity?.start_time ||
        !activity?.end_time) {
        return false;
    }
    const start = new Date(activity.start_time);
    const end = new Date(activity.end_time);
    if (Number.isNaN(start.getTime())
        ||
            Number.isNaN(end.getTime())) {
        return false;
    }
    const now = new Date();
    const attendanceOpen = new Date(start.getTime() -
        30 * 60 * 1000);
    return (now >= attendanceOpen &&
        now <= end);
}
// ======================================================
// PUBLICATION DISPLAY
// ======================================================
function getPublicationInfo(status) {
    const mapping = {
        DRAFT: {
            label: "BẢN NHÁP",
            background: "#f1f5f9",
            color: "#475569",
        },
        PENDING_APPROVAL: {
            label: "CHỜ DUYỆT",
            background: "#fff7ed",
            color: "#c2410c",
        },
        PUBLISHED: {
            label: "ĐÃ XUẤT BẢN",
            background: "#eff6ff",
            color: "#2563eb",
        },
        CANCELLED: {
            label: "ĐÃ HỦY",
            background: "#fef2f2",
            color: "#b91c1c",
        },
    };
    return (mapping[status] ||
        {
            label: status ||
                "CHƯA CẬP NHẬT",
            background: "#f1f5f9",
            color: "#475569",
        });
}
// ======================================================
// RUNTIME DISPLAY
// ======================================================
function getRuntimeInfo(status) {
    const mapping = {
        UPCOMING: {
            label: "SẮP DIỄN RA",
            background: "#eff6ff",
            color: "#1d4ed8",
        },
        ACTIVE: {
            label: "ĐANG DIỄN RA",
            background: "#ecfdf5",
            color: "#047857",
        },
        COMPLETED: {
            label: "ĐÃ KẾT THÚC",
            background: "#f1f5f9",
            color: "#475569",
        },
    };
    return (mapping[status] ||
        {
            label: status ||
                "CHƯA XÁC ĐỊNH",
            background: "#f1f5f9",
            color: "#475569",
        });
}
// ======================================================
// SEMESTER
// ======================================================
function normalizeSemester(value) {
    const text = String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ");
    if (["1", "HK1", "HỌC KỲ 1", "HOC KY 1", "KỲ 1", "KY 1"].includes(text)) {
        return "1";
    }
    if (["2", "HK2", "HỌC KỲ 2", "HOC KY 2", "KỲ 2", "KY 2"].includes(text)) {
        return "2";
    }
    if (["3", "HE", "HÈ", "HỌC KỲ HÈ", "HOC KY HE", "KỲ HÈ", "KY HE"].includes(text)) {
        return "HE";
    }
    return text;
}
function semesterLabel(value) {
    const semester = normalizeSemester(value);
    if (semester === "1")
        return "Học kỳ 1";
    if (semester === "2")
        return "Học kỳ 2";
    if (semester === "HE")
        return "Học kỳ hè";
    return semester || "Chưa xác định";
}
function semesterSort(a, b) {
    const order = { "1": 1, "2": 2, HE: 3 };
    return (order[a] || 99) - (order[b] || 99) || a.localeCompare(b, "vi");
}
// ======================================================
// ACTIVITY TYPE
// ======================================================
function formatActivityType(value) {
    const mapping = {
        WORKSHOP: "Workshop",
        TECHNOLOGY: "Công nghệ",
        ANNUAL: "Chương trình thường niên",
        POLITICAL: "Sinh hoạt chính trị",
        OTHER: "Khác",
    };
    const key = String(value || "").toUpperCase();
    return (mapping[key] ||
        value ||
        "Khác");
}
// ======================================================
// FORMAT DATE
// ======================================================
function formatDate(value) {
    if (!value) {
        return ("Chưa cập nhật thời gian");
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return String(value);
    }
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);
}
// ======================================================
// STYLES
// ======================================================
const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        gap: "22px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "20px",
    },
    headerActions: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
    },
    eyebrow: {
        color: "#2563eb",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "1px",
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
    createButton: {
        height: "42px",
        padding: "0 16px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: "none",
        borderRadius: "11px",
        background: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
    },
    closeFormButton: {
        height: "42px",
        padding: "0 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        border: "1px solid #fecaca",
        borderRadius: "11px",
        background: "#fff1f2",
        color: "#be123c",
        fontWeight: 700,
        cursor: "pointer",
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
        padding: "14px 16px",
        display: "flex",
        gap: "10px",
        border: "1px solid #fecaca",
        borderRadius: "12px",
        background: "#fef2f2",
        color: "#991b1b",
    },
    errorText: {
        margin: "5px 0 0",
        fontSize: "12px",
        lineHeight: 1.5,
    },
    dismissButton: {
        padding: "3px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "transparent",
        color: "inherit",
        cursor: "pointer",
    },
    summary: {
        width: "fit-content",
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        border: "1px solid #dbeafe",
        borderRadius: "16px",
        background: "#ffffff",
    },
    summaryIcon: {
        width: "45px",
        height: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "13px",
        background: "#dbeafe",
        color: "#2563eb",
    },
    summaryValue: {
        display: "block",
        fontSize: "22px",
        color: "#0f172a",
    },
    summaryLabel: {
        display: "block",
        color: "#64748b",
        fontSize: "11px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: "17px",
    },
    card: {
        padding: "20px",
        border: "1px solid #dbe5f1",
        borderRadius: "18px",
        background: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "10px",
    },
    badges: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },
    status: {
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "10px",
        fontWeight: 800,
    },
    featuredBadge: {
        padding: "6px 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        borderRadius: "999px",
        background: "#fef3c7",
        color: "#b45309",
        fontSize: "10px",
        fontWeight: 800,
    },
    id: {
        color: "#94a3b8",
        fontSize: "10px",
        overflowWrap: "anywhere",
    },
    cardTitle: {
        margin: "18px 0 15px",
        color: "#0f172a",
        fontSize: "18px",
        lineHeight: 1.5,
    },
    cardDescription: {
        margin: "6px 0 0",
        color: "#64748b",
        fontSize: "12px",
        lineHeight: 1.6,
    },
    meta: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        color: "#64748b",
        fontSize: "12px",
    },
    metaItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    cardFooter: {
        marginTop: "20px",
        paddingTop: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        borderTop: "1px solid #edf2f7",
    },
    draftActions: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
    },
    editButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "1px solid #bfdbfe",
        borderRadius: "10px",
        background: "#eff6ff",
        color: "#2563eb",
        fontWeight: 700,
        cursor: "pointer",
    },
    submitButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "none",
        borderRadius: "10px",
        background: "#f59e0b",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
    },
    publishButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "none",
        borderRadius: "10px",
        background: "#059669",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
    },
    attendanceButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
    },
    featureButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "1px solid #fde68a",
        borderRadius: "10px",
        background: "#fffbeb",
        color: "#b45309",
        fontWeight: 700,
        cursor: "pointer",
    },
    unfeatureButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "1px solid #fcd34d",
        borderRadius: "10px",
        background: "#fef3c7",
        color: "#92400e",
        fontWeight: 700,
        cursor: "pointer",
    },
    deleteActivityButton: {
        minHeight: "38px",
        padding: "0 14px",
        borderRadius: "10px",
        border: "1px solid #fecaca",
        background: "#fff1f2",
        color: "#be123c",
        fontSize: "13px",
        fontWeight: 800,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        cursor: "pointer",
    },

    cancelActivityButton: {
        minHeight: "40px",
        padding: "0 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        background: "#fff1f2",
        color: "#be123c",
        fontWeight: 700,
        cursor: "pointer",
    },
    disabledButton: {
        background: "#e2e8f0",
        color: "#94a3b8",
        cursor: "not-allowed",
    },
    cardNote: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "#94a3b8",
        fontSize: "11px",
    },
    waitingBox: {
        padding: "9px 11px",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        border: "1px solid #fed7aa",
        borderRadius: "9px",
        background: "#fff7ed",
        color: "#c2410c",
        fontSize: "11px",
        fontWeight: 650,
    },
    cancelledBox: {
        padding: "10px 12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        background: "#fef2f2",
        color: "#b91c1c",
        fontSize: "11px",
        lineHeight: 1.5,
    },
    stateBox: {
        minHeight: "250px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        borderRadius: "16px",
        background: "#ffffff",
        color: "#64748b",
    },
    emptyBox: {
        minHeight: "240px",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        textAlign: "center",
        border: "1px dashed #cbd5e1",
        borderRadius: "16px",
        background: "#ffffff",
        color: "#64748b",
    },
    emptyTitle: {
        margin: 0,
        fontSize: "18px",
        color: "#0f172a",
    },
    emptyDescription: {
        margin: "0 0 8px",
        fontSize: "12px",
        color: "#64748b",
    },
    filterPanel: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "14px",
        border: "1px solid #dbeafe",
        borderRadius: "16px",
        background: "#ffffff",
    },
    tabs: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
    },
    tabButton: {
        minHeight: "38px",
        padding: "0 13px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        background: "#f8fafc",
        color: "#475569",
        fontSize: "13px",
        fontWeight: 800,
        cursor: "pointer",
    },
    tabButtonActive: {
        borderColor: "#2563eb",
        background: "#eff6ff",
        color: "#1d4ed8",
    },
    tabCount: {
        minWidth: "22px",
        height: "22px",
        padding: "0 6px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "999px",
        background: "#e2e8f0",
        color: "#475569",
        fontSize: "11px",
        fontWeight: 800,
    },
    tabCountActive: {
        background: "#2563eb",
        color: "#ffffff",
    },
    filters: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
    },
    searchInput: {
        minWidth: "240px",
        flex: "1 1 280px",
        height: "40px",
        padding: "0 12px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        outline: "none",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: "13px",
    },
    filterSelect: {
        minWidth: "160px",
        height: "40px",
        padding: "0 10px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        outline: "none",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: "13px",
        fontWeight: 600,
    },
    clearFilterButton: {
        height: "40px",
        padding: "0 12px",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        background: "#fff7f7",
        color: "#b91c1c",
        fontSize: "12px",
        fontWeight: 800,
        cursor: "pointer",
    },
};
export default ActivitiesPage;
