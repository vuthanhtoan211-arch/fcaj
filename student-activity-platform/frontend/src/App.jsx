import {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";

import {

  Activity,

  ArrowLeft,

  ArrowRight,

  BarChart3,

  Bell,

  CalendarDays,

  ChevronDown,

  ChevronLeft,

  ChevronRight,

  ClipboardList,

  Download,

  Home,

  LogIn,

  LogOut,

  MapPin,

  RefreshCw,

  Radio,

  Sparkles,

  ScanLine,

  SearchCheck,

  Upload,

  UserRound,

  Users,

  X,

} from "lucide-react";

import "./App.css";

import ActivitiesPage from "./pages/ActivitiesPage";

import AttendancePage from "./pages/AttendancePage";

import ImportPage from "./pages/ImportPage";

import ReconciliationPage from "./pages/ReconciliationPage";

import FinalListPage from "./pages/FinalListPage";

import ExportPage from "./pages/ExportPage";

import AnalyticsPage from "./pages/AnalyticsPage";

import AdminUsersPage from "./pages/AdminUsersPage";

import LoginPage from "./pages/LoginPage";

import ChangePasswordPage from "./pages/ChangePasswordPage";

import ProfilePage from "./pages/ProfilePage";

import MyResultsPage from "./pages/MyResultsPage";

import StudentAnalyticsPage from "./pages/StudentAnalyticsPage";

import NotificationCenter from "./components/NotificationCenter";

import {

  getActivities,

  getAttendance,

  getMyActivities,

  getActivityPosterUrl,

} from "./services/api";

import {

  getCurrentUser,

  logout,

  resolveBackendUrl,

  restoreSession,

  subscribeAuthChange,

} from "./services/auth";

import {

  canAccessPage,

  filterMenuByRole,

  roleLabel,

} from "./config/permissions";

import {

  ASSETS,

  heroSlides,

  featuredPrograms,

  demoActivities,

} from "./data/homeContent";

// =====================================================

// CONFIGURATION

// =====================================================

const FALLBACK_IMAGE =

  ASSETS?.huflit ||

  "/images/logos/huflit-logo.png";

const MENU = [

  {

    id: "home",

    label: "Trang chủ",

    icon: Home,

  },

  {

    id: "activities",

    label: "Hoạt động",

    icon: CalendarDays,

  },

  {

    id: "my-results",

    label: "Kết quả của tôi",

    icon: ClipboardList,

  },

  {

    id: "import",

    label: "Nhập dữ liệu",

    icon: Upload,

  },

  {

    id: "attendance",

    label: "Điểm danh",

    icon: ScanLine,

  },

  {

    id: "reconciliation",

    label: "Đối soát",

    icon: SearchCheck,

  },

  {

    id: "final",

    label: "Danh sách cuối",

    icon: ClipboardList,

  },

  {

    id: "export",

    label: "Xuất dữ liệu",

    icon: Download,

  },

  {

    id: "analytics",

    label: "Phân tích",

    icon: BarChart3,

  },

  {

    id: "accounts",

    label: "Tài khoản sinh viên",

    icon: Users,

  },

];

const ADMIN_QUICK = [

  {

    id: "checkin",

    title: "Check-in",

    description:

      "Mở màn quét Check-in realtime.",

    icon: LogIn,

    color: "blue",

  },

  {

    id: "checkout",

    title: "Check-out",

    description:

      "Mở/đóng và vận hành Check-out realtime.",

    icon: LogOut,

    color: "green",

  },

  {

    id: "import",

    title: "Nhập dữ liệu",

    description:

      "Nhập Registration và Evidence.",

    icon: Upload,

    color: "orange",

  },

  {

    id: "reconciliation",

    title: "Đối soát",

    description:

      "Kiểm tra dữ liệu và xác nhận tham gia.",

    icon: SearchCheck,

    color: "purple",

  },

];

const STUDENT_QUICK = [

  {

    id: "activities",

    title: "Xem hoạt động",

    description:

      "Theo dõi các hoạt động đã được công bố.",

    icon: CalendarDays,

    color: "blue",

  },

  {

    id: "my-results",

    title: "Kết quả của tôi",

    description:

      "Theo dõi Check-in, Check-out, Evidence và kết quả.",

    icon: ClipboardList,

    color: "green",

  },

  {

    id: "analytics",

    title: "Phân tích",

    description:

      "Xem thống kê hoạt động dành cho sinh viên.",

    icon: BarChart3,

    color: "purple",

  },

];

// =====================================================

// COMMON COMPONENTS

// =====================================================

function Poster({

  src,

  alt,

  className = "",

  activity = null,

}) {

  const [failed, setFailed] = useState(false);
  const [signedUrl, setSignedUrl] = useState("");

  const activityId = activity?.activity_id || "";
  const imageKey = String(activity?.image_key || "");
  const imageUrl = String(activity?.image_url || "");

  // Local uploads already have an image_url. S3 private posters
  // use image_key without a public URL (or an s3:// key).
  const needsSignedUrl = Boolean(
    activityId && imageKey &&
    (!imageUrl || imageKey.startsWith("s3://"))
  );

  useEffect(() => {
    let cancelled = false;
    let refreshTimer;

    setSignedUrl("");

    if (!needsSignedUrl) {
      return () => { cancelled = true; };
    }

    async function refresh() {
      try {
        const response = await getActivityPosterUrl(activityId);
        const url = response?.data?.image_url || response?.data?.url || "";
        if (!url) {
          throw new Error("Không nhận được URL poster.");
        }
        if (!cancelled) setSignedUrl(url);
      } catch (error) {
        if (!cancelled) {
          setSignedUrl("");
          console.warn("Không tải được poster S3:", error?.message);
        }
      } finally {
        if (!cancelled) {
          // Backend currently signs URLs for 15 minutes.
          refreshTimer = window.setTimeout(refresh, 12 * 60 * 1000);
        }
      }
    }

    refresh();

    return () => {
      cancelled = true;
      window.clearTimeout(refreshTimer);
    };
  }, [activityId, imageKey, needsSignedUrl]);

  const candidateSrc = needsSignedUrl ? signedUrl : src;
  const actualSrc = failed ? FALLBACK_IMAGE : (candidateSrc || FALLBACK_IMAGE);

  useEffect(() => {
    setFailed(false);
  }, [candidateSrc]);

  return (
    <div className={`poster ${className}`}>
      <div
        className="poster-backdrop"
        style={{ backgroundImage: `url("${actualSrc}")` }}
        aria-hidden="true"
      />
      <img
        className="poster-image"
        src={actualSrc}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function HeroVisual({ slide }) {

  const [imageIndex, setImageIndex] =

    useState(0);

  useEffect(() => {

    setImageIndex(0);

  }, [slide.id]);

  if (

    slide.visualType === "logo"

  ) {

    return (

      <div className="logo-display">

        <div className="logo-display-label">

          BIỂU TRƯNG CHƯƠNG TRÌNH

        </div>

        <img

          key={slide.logo}

          src={slide.logo}

          alt={slide.logoAlt}

          onError={(event) => {

            if (

              !event.currentTarget.src

                .endsWith(

                  FALLBACK_IMAGE

                )

            ) {

              event.currentTarget.src =

                FALLBACK_IMAGE;

            }

          }}

        />

        <div className="logo-display-footer">

          <strong>

            {slide.mark}

          </strong>

          <span>

            {slide.label}

          </span>

        </div>

      </div>

    );

  }

  const imageCandidates = [

    slide.image,

    ...(slide.imageFallbacks || []),

    slide.fallbackImage,

    ASSETS.doan,

    FALLBACK_IMAGE,

  ].filter(Boolean);

  const safeImageIndex =

    Math.min(

      imageIndex,

      imageCandidates.length - 1

    );

  const primaryImage =

    imageCandidates[

      safeImageIndex

    ]

    || FALLBACK_IMAGE;

  const backdropImage =

    slide.backdrop

    || primaryImage;

  return (

    <div className="hero-feature-card">

      <div

        className="hero-feature-backdrop"

        style={{

          backgroundImage:

            `url("${backdropImage}")`,

        }}

        aria-hidden="true"

      />

      <div className="hero-feature-shade" />

      <div className="hero-feature-label">

        <Sparkles size={14} />

        {slide.visualLabel

          || "ĐOÀN KHOA CNTT · HUFLIT"}

      </div>

      <img

        key={`${slide.id}-${safeImageIndex}`}

        src={primaryImage}

        alt={

          slide.imageAlt

          || slide.title

        }

        className={`hero-feature-image ${

          slide.imageMode === "portrait"

            ? "portrait"

            : "program"

        }`}

        onError={() => {

          if (

            safeImageIndex

            < imageCandidates.length - 1

          ) {

            setImageIndex(

              safeImageIndex + 1

            );

          }

        }}

      />

      <div className="hero-feature-footer">

        <span>

          <Radio size={13} />

          {slide.tag || slide.mark}

        </span>

        <strong>

          {slide.label}

        </strong>

      </div>

    </div>

  );

}

function SectionHeading({

  eyebrow,

  title,

  subtitle,

  action,

  onAction,

}) {

  return (

    <div className="section-heading">

      <div>

        <span className="eyebrow">

          {eyebrow}

        </span>

        <h2>{title}</h2>

        <p>{subtitle}</p>

      </div>

      {action && (

        <button

          className="text-action"

          type="button"

          onClick={onAction}

        >

          {action}

          <ArrowRight size={17} />

        </button>

      )}

    </div>

  );

}

function StatCard({

  icon: Icon,

  color,

  label,

  value,

  subtitle,

  percentage,

  note,

}) {

  return (

    <article

      className={`stat-card stat-${color}`}

    >

      <div className="stat-top">

        <span className="stat-icon">

          <Icon size={22} />

        </span>

        {note && (

          <span className="stat-note">

            {note}

          </span>

        )}

      </div>

      <p className="stat-label">

        {label}

      </p>

      <strong className="stat-value">

        {value}

      </strong>

      <p className="stat-subtitle">

        {subtitle}

      </p>

      <div className="stat-line">

        <span

          style={{

            width:

              `${percentage == null ? 100 : percentage}%`,

          }}

        />

      </div>

    </article>

  );

}

function Info({

  icon: Icon,

  children,

}) {

  return (

    <span className="event-info">

      <Icon

        size={15}

        aria-hidden="true"

      />

      {children}

    </span>

  );

}

function DetailModal({

  item,

  onClose,

}) {

  useEffect(() => {

    if (!item) {

      return undefined;

    }

    const handleKey = (event) => {

      if (event.key === "Escape") {

        onClose();

      }

    };

    window.addEventListener(

      "keydown",

      handleKey

    );

    return () =>

      window.removeEventListener(

        "keydown",

        handleKey

      );

  }, [item, onClose]);

  if (!item) {

    return null;

  }

  return (

    <div

      className="modal-backdrop"

      onMouseDown={(event) => {

        if (

          event.target ===

          event.currentTarget

        ) {

          onClose();

        }

      }}

    >

      <section

        className="detail-modal"

        role="dialog"

        aria-modal="true"

        aria-label={`Chi tiết ${item.title}`}

      >

        <button

          className="modal-close"

          aria-label="Đóng"

          onClick={onClose}

          type="button"

        >

          <X size={21} />

        </button>

        <Poster

          key={item.image}

          src={item.image}

          activity={item.sourceActivity}
          alt={item.title}

          className="modal-poster"

        />

        <div className="modal-content">

          <span className="eyebrow">

            {item.category}

          </span>

          <h2>{item.title}</h2>

          {item.description && (

            <p>{item.description}</p>

          )}

          <div className="event-meta">

            <Info icon={CalendarDays}>

              {item.date ||

                "Chưa cập nhật"}

            </Info>

            <Info icon={MapPin}>

              {item.location || "HUFLIT"}

            </Info>

          </div>

        </div>

      </section>

    </div>

  );

}

// =====================================================

// STUDENT READ-ONLY VIEWS

// =====================================================

function StudentActivitiesView({ activities, onDetails }) {
  const [tab, setTab] = useState("CURRENT");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");

  const normalized = useMemo(() => {
    return [...activities].map((activity) => ({
      ...activity,
      runtime_status: resolveRuntimeStatus(activity),
      registered_flag:
        activity.registered === true ||
        String(activity.registered || "").toLowerCase() === "true",
    }));
  }, [activities]);

  const currentActivities = useMemo(() => {
    return normalized
      .filter((activity) =>
        ["UPCOMING", "ACTIVE"].includes(activity.runtime_status)
      )
      .sort((a, b) => {
        const aTime = new Date(a.start_time || 0).getTime();
        const bTime = new Date(b.start_time || 0).getTime();
        return aTime - bTime;
      });
  }, [normalized]);

  const historyActivities = useMemo(() => {
    return normalized
      .filter((activity) => activity.runtime_status === "COMPLETED")
      .sort((a, b) => {
        const aTime = new Date(a.start_time || 0).getTime();
        const bTime = new Date(b.start_time || 0).getTime();
        return bTime - aTime;
      });
  }, [normalized]);

  const academicYears = useMemo(() => {
    return [...new Set(
      historyActivities
        .map((activity) => String(activity.academic_year || "").trim())
        .filter(Boolean)
    )].sort((a, b) => b.localeCompare(a, "vi"));
  }, [historyActivities]);

  const semesters = useMemo(() => {
    return [...new Set(
      historyActivities
        .map((activity) => String(activity.semester || "").trim())
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));
  }, [historyActivities]);

  const semesterLabel = (value) => {
    const normalizedValue = String(value || "").trim().toUpperCase();
    if (["1", "HK1", "SEMESTER_1"].includes(normalizedValue)) return "Học kỳ 1";
    if (["2", "HK2", "SEMESTER_2"].includes(normalizedValue)) return "Học kỳ 2";
    if (
      ["3", "HE", "HÈ", "SUMMER", "HKHE", "HK_HE"].includes(normalizedValue)
    ) {
      return "Học kỳ hè";
    }
    return value ? `Học kỳ ${value}` : "Chưa xác định";
  };

  const filteredHistory = useMemo(() => {
    return historyActivities.filter((activity) => {
      const year = String(activity.academic_year || "").trim();
      const semester = String(activity.semester || "").trim();
      const matchesYear = yearFilter === "ALL" || year === yearFilter;
      const matchesSemester =
        semesterFilter === "ALL" || semester === semesterFilter;
      return matchesYear && matchesSemester;
    });
  }, [historyActivities, yearFilter, semesterFilter]);

  const historyGroups = useMemo(() => {
    const groups = new Map();
    filteredHistory.forEach((activity) => {
      const year = String(activity.academic_year || "").trim() || "Chưa xác định";
      const semester = String(activity.semester || "").trim() || "UNKNOWN";
      const key = `${year}__${semester}`;
      if (!groups.has(key)) {
        groups.set(key, { year, semester, items: [] });
      }
      groups.get(key).items.push(activity);
    });
    return [...groups.values()].sort((a, b) => {
      const yearCompare = b.year.localeCompare(a.year, "vi");
      if (yearCompare !== 0) return yearCompare;
      return String(a.semester).localeCompare(String(b.semester), "vi", {
        numeric: true,
      });
    });
  }, [filteredHistory]);

  function renderActivityCard(activity) {
    const registered = activity.registered_flag;
    return (
      <article className="recent-card" key={activity.activity_id}>
        <Poster
          key={posterFor(activity)}
          src={posterFor(activity)}
          activity={activity}
          alt={`Poster ${activity.activity_name}`}
          className="recent-poster"
        />
        <div className="recent-details">
          <div className="recent-type-row">
            <span className="eyebrow">{typeLabel(activity.activity_type)}</span>
            <span
              className={`status status-${String(
                activity.runtime_status || activity.status || ""
              ).toLowerCase()}`}
            >
              {statusLabel(activity.runtime_status || activity.status)}
            </span>
          </div>

          <h3>{activity.activity_name}</h3>

          <div className="event-meta">
            <Info icon={CalendarDays}>{formatDate(activity.start_time)}</Info>
            <Info icon={MapPin}>{activity.location || "HUFLIT"}</Info>
          </div>

          <div
            style={
              registered
                ? studentStyles.registeredBox
                : studentStyles.notRegisteredBox
            }
          >
            <strong
              style={
                registered
                  ? studentStyles.registeredTitle
                  : studentStyles.notRegisteredTitle
              }
            >
              {registered
                ? "✓ Đã đăng ký trên Portal"
                : "Chưa có trong danh sách đăng ký"}
            </strong>
            <span style={studentStyles.registrationHint}>
              {registered
                ? "Ban Tổ chức đã ghi nhận MSSV của bạn trong danh sách đăng ký được import từ Portal."
                : "Bạn chưa có tên trong danh sách đăng ký được import từ Portal của trường."}
            </span>
          </div>

          <button
            type="button"
            className="recent-detail"
            onClick={() => onDetails(detailsForActivity(activity))}
          >
            Xem chi tiết
            <ArrowRight size={16} />
          </button>
        </div>
      </article>
    );
  }

  const visibleCurrent = currentActivities.length;

  return (
    <div style={studentStyles.page}>
      <div style={studentStyles.header}>
        <span style={studentStyles.eyebrow}>HOẠT ĐỘNG SINH VIÊN</span>
        <h2 style={studentStyles.title}>Hoạt động đã công bố</h2>
        <p style={studentStyles.description}>
          Trạng thái đăng ký được đối chiếu từ danh sách Portal do Ban Tổ chức
          import vào hệ thống.
        </p>
      </div>

      <div style={studentStyles.activityToolbar}>
        <div style={studentStyles.activityTabs}>
          <button
            type="button"
            style={{
              ...studentStyles.activityTab,
              ...(tab === "CURRENT" ? studentStyles.activityTabActive : {}),
            }}
            onClick={() => setTab("CURRENT")}
          >
            Đang & sắp diễn ra
            <span style={studentStyles.activityCount}>{visibleCurrent}</span>
          </button>

          <button
            type="button"
            style={{
              ...studentStyles.activityTab,
              ...(tab === "HISTORY" ? studentStyles.activityTabActive : {}),
            }}
            onClick={() => setTab("HISTORY")}
          >
            Lịch sử
            <span style={studentStyles.activityCount}>
              {historyActivities.length}
            </span>
          </button>
        </div>

        {tab === "HISTORY" && (
          <div style={studentStyles.historyFilters}>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              style={studentStyles.historySelect}
              aria-label="Lọc theo năm học"
            >
              <option value="ALL">Tất cả năm học</option>
              {academicYears.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={semesterFilter}
              onChange={(event) => setSemesterFilter(event.target.value)}
              style={studentStyles.historySelect}
              aria-label="Lọc theo học kỳ"
            >
              <option value="ALL">Tất cả học kỳ</option>
              {semesters.map((semester) => (
                <option value={semester} key={semester}>
                  {semesterLabel(semester)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {tab === "CURRENT" &&
        (currentActivities.length === 0 ? (
          <div style={studentStyles.empty}>
            Hiện chưa có hoạt động nào đang hoặc sắp diễn ra.
          </div>
        ) : (
          <div className="recent-grid">
            {currentActivities.map(renderActivityCard)}
          </div>
        ))}

      {tab === "HISTORY" &&
        (historyGroups.length === 0 ? (
          <div style={studentStyles.empty}>
            Không có hoạt động lịch sử phù hợp với bộ lọc.
          </div>
        ) : (
          <div style={studentStyles.historyGroups}>
            {historyGroups.map((group) => (
              <section
                key={`${group.year}-${group.semester}`}
                style={studentStyles.historyGroup}
              >
                <div style={studentStyles.historyGroupHeader}>
                  <div>
                    <span style={studentStyles.historyYear}>
                      Năm học {group.year}
                    </span>
                    <strong style={studentStyles.historySemester}>
                      {semesterLabel(group.semester)}
                    </strong>
                  </div>
                  <span style={studentStyles.historyGroupCount}>
                    {group.items.length} hoạt động
                  </span>
                </div>

                <div className="recent-grid">
                  {group.items.map(renderActivityCard)}
                </div>
              </section>
            ))}
          </div>
        ))}
    </div>
  );
}

function StudentAnalyticsView({

  activities,

}) {

  const published =

    activities.length;

  const upcoming =

    activities.filter(

      (item) =>

        resolveRuntimeStatus(item) ===

        "UPCOMING"

    ).length;

  const active =

    activities.filter(

      (item) =>

        resolveRuntimeStatus(item) ===

        "ACTIVE"

    ).length;

  const types = new Set(

    activities

      .map((item) =>

        String(

          item.activity_type || ""

        ).trim()

      )

      .filter(Boolean)

  ).size;

  return (

    <div style={studentStyles.page}>

      <div style={studentStyles.header}>

        <span style={studentStyles.eyebrow}>

          PHÂN TÍCH SINH VIÊN

        </span>

        <h2 style={studentStyles.title}>

          Tổng quan hoạt động

        </h2>

        <p style={studentStyles.description}>

          Đây là bản phân tích an toàn dành

          cho sinh viên, không hiển thị dữ

          liệu cá nhân của người khác.

        </p>

      </div>

      <section className="stats">

        <StatCard

          icon={Activity}

          color="blue"

          label="Hoạt động"

          value={number(published)}

          subtitle="Đã được công bố"

        />

        <StatCard

          icon={CalendarDays}

          color="amber"

          label="Sắp diễn ra"

          value={number(upcoming)}

          subtitle="Hoạt động sắp tới"

        />

        <StatCard

          icon={RefreshCw}

          color="mint"

          label="Đang diễn ra"

          value={number(active)}

          subtitle="Theo thời gian hiện tại"

        />

        <StatCard

          icon={BarChart3}

          color="violet"

          label="Nhóm hoạt động"

          value={number(types)}

          subtitle="Loại hoạt động đã công bố"

        />

      </section>

    </div>

  );

}

function MyResultsPlaceholder({

  currentUser,

}) {

  return (

    <div style={studentStyles.resultCard}>

      <div style={studentStyles.resultIcon}>

        <UserRound size={28} />

      </div>

      <span style={studentStyles.eyebrow}>

        KẾT QUẢ CỦA TÔI

      </span>

      <h2 style={studentStyles.title}>

        {currentUser.full_name}

      </h2>

      <p style={studentStyles.description}>

        MSSV: {currentUser.mssv || "Chưa liên kết"}

      </p>

      <div style={studentStyles.resultNotice}>

        Bước kế tiếp sẽ nối API

        <strong> /me/results </strong>

        để sinh viên chỉ xem Check-in,

        Check-out, Evidence và kết quả của

        chính mình.

      </div>

    </div>

  );

}

// =====================================================

// MAIN APPLICATION

// =====================================================

function App() {

  const [current, setCurrent] =

    useState(0);

  const [paused, setPaused] =

    useState(false);

  const [page, setPage] =

    useState("home");

  const [activities, setActivities] =

    useState([]);

  const [attendance, setAttendance] =

    useState(null);

  const [selectedActivity, setSelectedActivity] =

    useState(null);

  const [attendanceMode, setAttendanceMode] =

    useState("checkin");

  const [online, setOnline] =

    useState(false);

  const [loading, setLoading] =

    useState(true);

  const [details, setDetails] =

    useState(null);

  const [notice, setNotice] =

    useState("");

  const [accountOpen, setAccountOpen] =

    useState(false);

  const [authLoading, setAuthLoading] =

    useState(true);

  const [manualPasswordChange, setManualPasswordChange] =

    useState(false);

  const [currentUser, setCurrentUser] =

    useState(() => getCurrentUser());

  const featuredRef = useRef(null);

  const recentRef = useRef(null);

  const slide =

    heroSlides[current];

  const visibleMenu =

    useMemo(

      () =>

        filterMenuByRole(

          currentUser?.role,

          MENU

        ),

      [currentUser?.role]

    );

  const quickActions =

    currentUser?.role === "ADMIN"

      ? ADMIN_QUICK

      : STUDENT_QUICK;

  // ================================================

  // AUTH SESSION

  // ================================================

  useEffect(() => {

    let active = true;

    restoreSession()

      .then((user) => {

        if (active) {

          setCurrentUser(user);

        }

      })

      .finally(() => {

        if (active) {

          setAuthLoading(false);

        }

      });

    const unsubscribe =

      subscribeAuthChange(

        (user) => {

          if (!active) {

            return;

          }

          setCurrentUser(user);

          setAccountOpen(false);

          if (!user) {

            setPage("home");

            setManualPasswordChange(false);

          }

        }

      );

    return () => {

      active = false;

      unsubscribe();

    };

  }, []);

  // ================================================

  // PAGE GUARD

  // ================================================

  useEffect(() => {

    if (!currentUser) {

      return;

    }

    if (

      (page === "home" || page === "profile") || canAccessPage(

        currentUser.role,

        page

      )

    ) {

      return;

    }

    setPage("home");

  }, [currentUser, page]);

  // ================================================

  // LOAD DASHBOARD

  // ================================================

  const loadDashboard =

    useCallback(

      async () => {

        if (

          !currentUser

          || currentUser.must_change_password

        ) {

          return;

        }

        try {

          setLoading(true);

          const result =

            currentUser.role === "STUDENT"

              ? await getMyActivities()

              : await getActivities();

          const rows =

            normalizeListResponse(

              result

            );

          setActivities(rows);

          setOnline(true);

          const preferredActivity =

            chooseAttendanceActivity(

              rows

            );

          setSelectedActivity(

            (currentActivity) => {

              if (

                currentActivity

                &&

                rows.some(

                  (item) =>

                    item.activity_id ===

                    currentActivity.activity_id

                )

              ) {

                return currentActivity;

              }

              return preferredActivity;

            }

          );

          if (

            currentUser.role ===

              "STUDENT"

            ||

            !preferredActivity

          ) {

            setAttendance(null);

            return;

          }

          try {

            const attendanceResult =

              await getAttendance(

                preferredActivity.activity_id

              );

            setAttendance(

              attendanceResult?.data

              ??

              attendanceResult

              ??

              null

            );

          } catch {

            setAttendance(null);

          }

        } catch (error) {

          console.error(

            "Dashboard error:",

            error

          );

          setOnline(false);

          setActivities([]);

          setAttendance(null);

        } finally {

          setLoading(false);

        }

      },

      [currentUser]

    );

  useEffect(() => {

    loadDashboard();

    const refresh =

      window.setInterval(

        loadDashboard,

        12000

      );

    return () =>

      window.clearInterval(

        refresh

      );

  }, [loadDashboard]);

  // ================================================

  // REFRESH HOME ON ENTER

  useEffect(() => {

    if (page === "home") {

      loadDashboard();

    }

  }, [page, loadDashboard]);

  // HERO SLIDER

  // ================================================

  useEffect(() => {

    if (

      paused

      ||

      page !== "home"

    ) {

      return undefined;

    }

    const timer =

      window.setInterval(

        () =>

          setCurrent(

            (previous) =>

              (

                previous + 1

              ) % heroSlides.length

          ),

        6500

      );

    return () =>

      window.clearInterval(timer);

  }, [paused, page]);

  // ================================================

  // DERIVED DATA

  // ================================================

  const showDemo =

    !online

    &&

    currentUser?.role !== "STUDENT";

  const shownActivities =

    showDemo

      ? demoActivities

      : activities;

  const hasAttendance =

    Boolean(

      attendance

      &&

      Number.isFinite(

        Number(

          attendance.total_registered

        )

      )

    );

  const registered =

    hasAttendance

      ? Number(

          attendance.total_registered

        )

      : showDemo

        ? 180

        : null;

  const checkedIn =

    hasAttendance

      ? Number(

          attendance.total_checked_in

          || 0

        )

      : showDemo

        ? 0

        : null;

  const checkedOut =

    hasAttendance

      ? Number(

          attendance.total_checked_out

          || 0

        )

      : showDemo

        ? 0

        : null;

  const featuredItems =

    useMemo(

      () => {

        if (showDemo) {

          return featuredPrograms;

        }

        return activities

          .filter(

            (item) =>

              item?.is_featured === true

              ||

              String(

                item?.is_featured

                || ""

              ).toLowerCase() === "true"

          )

          .sort(

            (left, right) => {

              const leftTime =

                new Date(

                  left?.start_time

                  || 0

                ).getTime();

              const rightTime =

                new Date(

                  right?.start_time

                  || 0

                ).getTime();

              return (

                leftTime

                - rightTime

              );

            }

          )

          .map(

            (item) => ({

              id:

                item.activity_id,

              category:

                typeLabel(

                  item.activity_type

                ),

              title:

                item.activity_name,

              description:

                item.description

                ||

                (

                  "Hoạt động nổi bật của "

                  + "Đoàn Khoa Công nghệ "

                  + "Thông tin."

                ),

              image:

                posterFor(item),

              date:

                formatDate(

                  item.start_time

                ),

              location:

                item.location

                || "HUFLIT",

              sourceActivity:

                item,

            })

          );

      },

      [

        activities,

        showDemo,

      ]

    );

  const activeLabel =

    MENU.find(

      (item) =>

        item.id === page

    )?.label

    || "Trang chủ";

  // ================================================

  // NAVIGATION

  // ================================================

  function go(

    target,

    options = {}

  ) {

    const nextPage =

      target === "checkin"

      ||

      target === "checkout"

        ? "attendance"

        : target;

    if (

      !["home", "profile"].includes(nextPage) && !canAccessPage(

        currentUser?.role,

        nextPage

      )

    ) {

      setNotice(

        "Tài khoản hiện tại không có quyền truy cập chức năng này."

      );

      return;

    }

    if (

      nextPage === "attendance"

    ) {

      const activity =

        options.activity

        ||

        selectedActivity

        ||

        chooseAttendanceActivity(

          activities

        );

      if (!activity) {

        setNotice(

          "Chưa có hoạt động phù hợp để mở màn Điểm danh."

        );

        setPage("activities");

        return;

      }

      setSelectedActivity(

        activity

      );

      setAttendanceMode(

        target === "checkout"

        ||

        options.mode === "checkout"

          ? "checkout"

          : "checkin"

      );

    }

    setPage(nextPage);

    setAccountOpen(false);

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  }

  function openAttendance(

    activity

  ) {

    go("attendance", {

      activity,

      mode: "checkin",

    });

  }

  function handleNotificationClick() {

    const role =

      currentUser.role;

    if (role === "STUDENT") {

      setNotice(

        "Thông báo sinh viên sẽ gồm hoạt động mới, nhắc hoạt động đã đăng ký sau khi hệ thống đã có Registration, và kết quả tham gia."

      );

    } else {

      setNotice(

        "Thông báo ADMIN sẽ gồm hoạt động, dữ liệu nhập, điểm danh, đối soát và các sự kiện quản trị quan trọng."

      );

    }

  }

  // ================================================

  // PAGE CONTENT

  // ================================================

  function renderPage() {

    if (page === "activities") {

      if (

        currentUser.role ===

        "STUDENT"

      ) {

        return (

          <StudentActivitiesView

            activities={activities}

            onDetails={setDetails}

          />

        );

      }

      return (

        <ActivitiesPage

          onOpenAttendance={

            openAttendance

          }

        />

      );

    }

    if (page === "attendance") {

      return (

        <AttendancePage

          key={

            `${selectedActivity?.activity_id || "no-activity"}-${attendanceMode}`

          }

          activity={selectedActivity}

          initialMode={attendanceMode}

          onBack={() =>

            go("activities")

          }

        />

      );

    }

    if (page === "import") {

      return <ImportPage />;

    }

    if (

      page === "reconciliation"

    ) {

      return <ReconciliationPage />;

    }

    if (page === "final") {

      return <FinalListPage />;

    }

    if (page === "export") {

      return <ExportPage />;

    }

    if (page === "analytics") {

      if (

        currentUser.role ===

        "STUDENT"

      ) {

        return (

          <StudentAnalyticsPage />

        );

      }

      return <AnalyticsPage />;

    }

    if (page === "accounts") {

      return <AdminUsersPage />;

    }

    if (page === "profile") {

      return (

        <ProfilePage

          onRequestPasswordChange={() =>

            setManualPasswordChange(true)

          }

        />

      );

    }

    if (page === "my-results") {

      return <MyResultsPage />;

    }

    return renderHome();

  }

  function renderHome() {

    return (

      <main className="home-page">

        <section

          className="hero"

          aria-label="Giới thiệu chương trình"

          onMouseEnter={() =>

            setPaused(true)

          }

          onMouseLeave={() =>

            setPaused(false)

          }

          onFocus={() =>

            setPaused(true)

          }

          onBlur={(event) => {

            if (

              !event.currentTarget.contains(

                event.relatedTarget

              )

            ) {

              setPaused(false);

            }

          }}

        >

          <div className="hero-copy">

            <span className="hero-overline">

              {slide.eyebrow}

            </span>

            <h2>{slide.title}</h2>

            <p>{slide.description}</p>

            <div className="hero-buttons">

              <button

                type="button"

                className="btn btn-light"

                onClick={() =>

                  featuredRef.current

                    ?.scrollIntoView({

                      behavior:

                        "smooth",

                    })

                }

              >

                Khám phá hoạt động

                <ArrowRight size={17} />

              </button>

              <button

                type="button"

                className="btn btn-outline"

                onClick={() =>

                  recentRef.current

                    ?.scrollIntoView({

                      behavior:

                        "smooth",

                    })

                }

              >

                Xem hoạt động gần đây

              </button>

            </div>

            <div className="hero-bottom">

              <span className="hero-dash" />

              <span>

                ĐOÀN – HỘI · HỌC THUẬT ·

                CÔNG NGHỆ

              </span>

            </div>

          </div>

          <div className="hero-showcase">

            <HeroVisual slide={slide} />

            <div className="slider-controls">

              <button

                type="button"

                aria-label="Slide trước"

                onClick={() =>

                  setCurrent(

                    (previous) =>

                      (

                        previous - 1

                        + heroSlides.length

                      ) %

                      heroSlides.length

                  )

                }

              >

                <ChevronLeft size={19} />

              </button>

              <div className="slider-dots">

                {heroSlides.map(

                  (item, index) => (

                    <button

                      key={item.id}

                      type="button"

                      aria-label={`Đến slide ${index + 1}`}

                      aria-current={

                        index === current

                          ? "true"

                          : undefined

                      }

                      className={

                        index === current

                          ? "on"

                          : ""

                      }

                      onClick={() =>

                        setCurrent(index)

                      }

                    />

                  )

                )}

              </div>

              <button

                type="button"

                aria-label="Slide tiếp theo"

                onClick={() =>

                  setCurrent(

                    (previous) =>

                      (

                        previous + 1

                      ) %

                      heroSlides.length

                  )

                }

              >

                <ChevronRight size={19} />

              </button>

            </div>

          </div>

        </section>

        {showDemo && (

          <div className="demo-notice">

            <span>

              Đang dùng dữ liệu minh họa

              để xem giao diện.

            </span>

            Mở FastAPI để hiển thị dữ liệu

            từ backend.

          </div>

        )}

        {currentUser.role ===

        "STUDENT" ? (

          <section

            className="stats"

            aria-label="Thống kê nhanh"

          >

            <StatCard

              icon={Activity}

              color="blue"

              label="Hoạt động"

              value={

                loading

                  ? "…"

                  : number(

                      activities.length

                    )

              }

              subtitle="Đã được công bố"

            />

            <StatCard

              icon={CalendarDays}

              color="amber"

              label="Sắp diễn ra"

              value={number(

                activities.filter(

                  (item) =>

                    resolveRuntimeStatus(

                      item

                    ) ===

                    "UPCOMING"

                ).length

              )}

              subtitle="Hoạt động sắp tới"

            />

            <StatCard

              icon={RefreshCw}

              color="mint"

              label="Đang diễn ra"

              value={number(

                activities.filter(

                  (item) =>

                    resolveRuntimeStatus(

                      item

                    ) ===

                    "ACTIVE"

                ).length

              )}

              subtitle="Theo thời gian hiện tại"

            />

            <StatCard

              icon={ClipboardList}

              color="violet"

              label="Kết quả cá nhân"

              value="—"

              subtitle="Sẽ nối /me/results"

            />

          </section>

        ) : (

          <section

            className="stats"

            aria-label="Thống kê nhanh"

          >

            <StatCard

              icon={Activity}

              color="blue"

              label="Hoạt động"

              value={

                loading

                  ? "…"

                  : number(

                      shownActivities.length

                    )

              }

              subtitle={

                showDemo

                  ? "Hoạt động minh họa"

                  : "Hoạt động trong hệ thống"

              }

            />

            <StatCard

              icon={Users}

              color="amber"

              label="Đăng ký"

              value={showCount(

                registered

              )}

              subtitle={

                hasAttendance

                  ? "Hoạt động hiện tại"

                  : showDemo

                    ? "Số liệu mẫu"

                    : "Chưa có số liệu"

              }

            />

            <StatCard

              icon={LogIn}

              color="mint"

              label="Check-in"

              value={showCount(

                checkedIn

              )}

              subtitle={

                hasAttendance

                  ? "Làm mới mỗi 12 giây"

                  : showDemo

                    ? "Số liệu mẫu"

                    : "Chưa có số liệu"

              }

              percentage={ratio(

                checkedIn,

                registered

              )}

              note={

                hasAttendance

                  ? "ĐANG ĐỒNG BỘ"

                  : undefined

              }

            />

            <StatCard

              icon={LogOut}

              color="violet"

              label="Check-out"

              value={showCount(

                checkedOut

              )}

              subtitle={

                hasAttendance

                  ? "Làm mới mỗi 12 giây"

                  : showDemo

                    ? "Số liệu mẫu"

                    : "Chưa có số liệu"

              }

              percentage={ratio(

                checkedOut,

                registered

              )}

              note={

                hasAttendance

                  ? "ĐANG ĐỒNG BỘ"

                  : undefined

              }

            />

          </section>

        )}

        <section

          ref={featuredRef}

          className="section-block"

          id="featured"

        >

          <SectionHeading

            eyebrow="KHÁM PHÁ"

            title="Hoạt động nổi bật"

            subtitle="Những chương trình tiêu biểu của sinh viên Khoa Công nghệ Thông tin."

            action="Xem hoạt động"

            onAction={() =>

              go("activities")

            }

          />

          {featuredItems.length === 0 ? (

            <div className="empty-state">

              Chưa có hoạt động nào được

              đặt làm nổi bật. ADMIN có thể

              chọn một hoạt động đã xuất bản

              và bấm "Đặt làm nổi bật".

            </div>

          ) : (

            <div className="featured-grid">

              {featuredItems.map(

                (item) => (

                  <article

                    className="featured-card"

                    key={item.id}

                  >

                    <div className="featured-media">

                      <Poster

                        key={item.image}

                        src={item.image}

                        activity={item.sourceActivity}
          alt={`Poster ${item.title}`}

                        className="featured-poster"

                      />

                      <span className="media-category">

                        {item.category}

                      </span>

                    </div>

                    <div className="featured-text">

                      <h3>

                        {item.title}

                      </h3>

                      <p>

                        {item.description}

                      </p>

                      <div className="event-meta">

                        <Info icon={CalendarDays}>

                          {item.date}

                        </Info>

                        <Info icon={MapPin}>

                          {item.location}

                        </Info>

                      </div>

                      <button

                        className="detail-button"

                        type="button"

                        onClick={() =>

                          setDetails(item)

                        }

                      >

                        Xem chi tiết

                        <ArrowRight

                          size={16}

                        />

                      </button>

                    </div>

                  </article>

                )

              )}

            </div>

          )}

</section>

        <section

          ref={recentRef}

          className="section-block recent-section"

          id="recent"

        >

          <SectionHeading

            eyebrow={

              currentUser.role ===

                "STUDENT"

                ? "HOẠT ĐỘNG"

                : "QUẢN LÝ"

            }

            title="Hoạt động gần đây"

            subtitle={

              currentUser.role ===

                "STUDENT"

                ? "Các hoạt động đã được công bố cho sinh viên."

                : showDemo

                  ? "Danh sách minh họa để xem bố cục quản trị."

                  : "Các hoạt động đang được quản lý trong hệ thống."

            }

            action="Làm mới"

            onAction={loadDashboard}

          />

          {shownActivities.length === 0 ? (

            <div className="empty-state">

              Chưa có hoạt động nào.

            </div>

          ) : (

            <div className="recent-grid">

              {shownActivities

                .slice(0, 4)

                .map((item) => (

                  <article

                    className="recent-card"

                    key={item.activity_id}

                  >

                    <Poster

                      key={posterFor(item)}

                      src={posterFor(item)}

                      activity={item}
          alt={`Poster ${item.activity_name}`}

                      className="recent-poster"

                    />

                    <div className="recent-details">

                      <div className="recent-type-row">

                        <span className="eyebrow">

                          {typeLabel(

                            item.activity_type

                          )}

                        </span>

                        <span

                          className={`status status-${String(

                            item.status || ""

                          ).toLowerCase()}`}

                        >

                          {statusLabel(

                            item.status

                          )}

                        </span>

                      </div>

                      <h3>

                        {item.activity_name}

                      </h3>

                      <small className="activity-code">

                        {item.activity_id}

                      </small>

                      <div className="event-meta">

                        <Info icon={CalendarDays}>

                          {formatDate(

                            item.start_time

                          )}

                        </Info>

                        <Info icon={MapPin}>

                          {item.location ||

                            "HUFLIT"}

                        </Info>

                        {item.capacity && (

                          <Info icon={Users}>

                            {number(

                              item.capacity

                            )}{" "}

                            sinh viên

                          </Info>

                        )}

                      </div>

                      <button

                        type="button"

                        className="recent-detail"

                        onClick={() =>

                          setDetails(

                            detailsForActivity(

                              item

                            )

                          )

                        }

                      >

                        Xem chi tiết

                        <ArrowRight size={16} />

                      </button>

                    </div>

                  </article>

                ))}

            </div>

          )}

        </section>

        <section className="section-block quick-section">

          <SectionHeading

            eyebrow="TRUY CẬP NHANH"

            title="Bắt đầu công việc"

            subtitle={

              currentUser.role ===

                "STUDENT"

                ? "Các chức năng dành cho tài khoản sinh viên."

                : "Các tính năng thường sử dụng theo quyền tài khoản hiện tại."

            }

          />

          <div className="quick-grid">

            {quickActions.map(

              (item) => {

                const Icon =

                  item.icon;

                return (

                  <button

                    type="button"

                    className={`quick-tile quick-${item.color}`}

                    key={item.id}

                    onClick={() =>

                      go(item.id)

                    }

                  >

                    <span className="quick-icon">

                      <Icon size={22} />

                    </span>

                    <span>

                      <strong>

                        {item.title}

                      </strong>

                      <small>

                        {item.description}

                      </small>

                    </span>

                    <ArrowRight

                      className="quick-arrow"

                      size={18}

                    />

                  </button>

                );

              }

            )}

          </div>

        </section>

        <footer className="footer">

          Hệ thống Quản lý Hoạt động Sinh viên ·

          Khoa Công nghệ Thông tin · HUFLIT

          <span>

            Phiên bản chạy thử nội bộ

          </span>

        </footer>

      </main>

    );

  }

  // ================================================

  // AUTH GATES

  // ================================================

  if (authLoading) {

    return (

      <div style={authGateStyles.loadingPage}>

        <div style={authGateStyles.loadingCard}>

          <RefreshCw size={22} />

          Đang kiểm tra phiên đăng nhập...

        </div>

      </div>

    );

  }

  if (!currentUser) {

    return (

      <LoginPage

        onLoggedIn={(user) => {

          setCurrentUser(user);

          setPage("home");

        }}

      />

    );

  }

  if (

    currentUser.must_change_password

    || manualPasswordChange

  ) {

    return (

      <ChangePasswordPage

        user={currentUser}

        onChanged={(user) => {

          setCurrentUser(user);

          setManualPasswordChange(false);

          setPage("home");

        }}

      />

    );

  }

  // ================================================

  // MAIN UI

  // ================================================

  return (

    <div className="app-layout">

      <aside className="sidebar">

        <button

          type="button"

          className="brand"

          onClick={() => go("home")}

          aria-label="Về trang chủ"

        >

          <span className="brand-symbol">

            <img

              src={FALLBACK_IMAGE}

              alt="Logo HUFLIT"

            />

          </span>

          <span>

            <strong>

              Student Activity

            </strong>

            <small>

              Khoa Công nghệ Thông tin

            </small>

          </span>

        </button>

        <div className="nav-title">

          ĐIỀU HƯỚNG

        </div>

        <nav

          aria-label="Menu chính"

          className="nav-list"

        >

          {visibleMenu.map(

            (item) => {

              const Icon =

                item.icon;

              return (

                <button

                  key={item.id}

                  type="button"

                  title={item.label}

                  aria-current={

                    page === item.id

                      ? "page"

                      : undefined

                  }

                  className={`nav-link ${

                    page === item.id

                      ? "selected"

                      : ""

                  }`}

                  onClick={() =>

                    go(item.id)

                  }

                >

                  <Icon size={19} />

                  <span>

                    {item.label}

                  </span>

                </button>

              );

            }

          )}

        </nav>

        <div className="sidebar-profile">

          <UserAvatar

            user={currentUser}

            className="avatar"

          />

          <div>

            <strong>

              {currentUser.full_name}

            </strong>

            <small>

              {roleLabel(

                currentUser.role

              )}

            </small>

          </div>

        </div>

      </aside>

      <div className="main-area">

        <header className="topbar">

          <div className="header-brand">

            <img

              src={FALLBACK_IMAGE}

              alt="HUFLIT"

            />

            <div>

              <small>

                TRƯỜNG ĐẠI HỌC NGOẠI NGỮ –

                TIN HỌC TP.HCM

              </small>

              <h1>

                Hệ thống Quản lý Hoạt động Sinh viên

              </h1>

              <p>

                Khoa Công nghệ Thông tin

              </p>

            </div>

          </div>

          <div className="header-end">

            <span

              className={`connection ${

                online

                  ? "connected"

                  : "preview"

              }`}

            >

              <i />

              {online

                ? "Đã kết nối backend"

                : "Chế độ xem trước"}

            </span>

            <NotificationCenter />

            <div style={topStyles.accountWrap}>

              <button

                type="button"

                aria-label="Tài khoản"

                onClick={() =>

                  setAccountOpen(

                    (value) => !value

                  )

                }

                style={topStyles.accountButton}

              >

                <UserAvatar

                  user={currentUser}

                  className="avatar header-avatar"

                />

                <span style={topStyles.accountCopy}>

                  <strong>

                    {currentUser.full_name}

                  </strong>

                  <small>

                    {currentUser.role}

                  </small>

                </span>

                <ChevronDown size={16} />

              </button>

              {accountOpen && (

                <div style={topStyles.accountMenu}>

                  <div style={topStyles.accountMenuHeader}>

                    <strong>

                      {currentUser.full_name}

                    </strong>

                    <span>

                      {currentUser.email}

                    </span>

                    {currentUser.mssv && (

                      <span>

                        MSSV: {currentUser.mssv}

                      </span>

                    )}

                  </div>

                  <button

                    type="button"

                    style={topStyles.menuItem}

                    onClick={() =>

                      go("profile")

                    }

                  >

                    <UserRound size={16} />

                    Hồ sơ cá nhân

                  </button>

                  <button

                    type="button"

                    style={{

                      ...topStyles.menuItem,

                      color: "#b91c1c",

                    }}

                    onClick={async () => {

                      await logout();

                      setCurrentUser(null);

                      setPage("home");

                    }}

                  >

                    <LogOut size={16} />

                    Đăng xuất

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

        <div className="page-content">

          {notice && (

            <div style={topStyles.notice}>

              <span style={{ flex: 1 }}>

                {notice}

              </span>

              <button

                type="button"

                onClick={() =>

                  setNotice("")

                }

                style={topStyles.noticeClose}

              >

                Đóng

              </button>

            </div>

          )}

          {page !== "home" && (

            <button

              className="back-link"

              type="button"

              onClick={() =>

                go("home")

              }

            >

              <ArrowLeft size={17} />

              Quay lại trang chủ

            </button>

          )}

          {page !== "home" && (

            <div style={topStyles.pageContext}>

              <span>

                {activeLabel}

              </span>

              <small>

                {roleLabel(

                  currentUser.role

                )}

              </small>

            </div>

          )}

          {renderPage()}

        </div>

      </div>

      <DetailModal

        item={details}

        onClose={() =>

          setDetails(null)

        }

      />

    </div>

  );

}

// =====================================================

// HELPERS

// =====================================================

function normalizeListResponse(

  response

) {

  if (Array.isArray(response)) {

    return response;

  }

  if (

    Array.isArray(

      response?.data

    )

  ) {

    return response.data;

  }

  if (

    Array.isArray(

      response?.data?.items

    )

  ) {

    return response.data.items;

  }

  return [];

}

function chooseAttendanceActivity(

  activities

) {

  if (

    !Array.isArray(activities)

    ||

    activities.length === 0

  ) {

    return null;

  }

  const published =

    activities.filter(

      (activity) => {

        const publication =

          String(

            activity.publication_status

            || ""

          ).toUpperCase();

        return (

          publication === "PUBLISHED"

          ||

          !publication

        );

      }

    );

  const source =

    published.length

      ? published

      : activities;

  return (

    source.find(

      (activity) =>

        resolveRuntimeStatus(

          activity

        ) === "ACTIVE"

    )

    ||

    source.find(

      (activity) =>

        resolveRuntimeStatus(

          activity

        ) === "UPCOMING"

    )

    ||

    source[0]

  );

}

function resolveRuntimeStatus(activity) {
  const publicationStatus = String(
    activity?.publication_status || ""
  ).trim().toUpperCase();

  if (publicationStatus === "CANCELLED") {
    return "CANCELLED";
  }

  const start = new Date(activity?.start_time || "");
  const end = new Date(activity?.end_time || "");

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    const fallback = String(
      activity?.status || "UPCOMING"
    ).trim().toUpperCase();

    return ["UPCOMING", "ACTIVE", "COMPLETED"].includes(fallback)
      ? fallback
      : "UPCOMING";
  }

  const now = Date.now();

  if (now < start.getTime()) {
    return "UPCOMING";
  }

  if (now <= end.getTime()) {
    return "ACTIVE";
  }

  return "COMPLETED";
}

function formatDate(value) {

  if (!value) {

    return "Chưa cập nhật";

  }

  const date = new Date(value);

  return Number.isNaN(

    date.getTime()

  )

    ? String(value)

    : new Intl.DateTimeFormat(

        "vi-VN",

        {

          day: "2-digit",

          month: "2-digit",

          year: "numeric",

        }

      ).format(date);

}

function number(value) {

  return new Intl.NumberFormat(

    "vi-VN"

  ).format(

    Number(value) || 0

  );

}

function showCount(value) {

  return value == null

    ? "—"

    : number(value);

}

function ratio(

  value,

  total

) {

  return Number(total) > 0

    ? Math.max(

        0,

        Math.min(

          100,

          Math.round(

            (

              Number(value || 0)

              /

              Number(total)

            ) * 100

          )

        )

      )

    : 0;

}

function typeLabel(type) {

  return (

    {

      WORKSHOP:

        "Workshop",

      POLITICAL:

        "Sinh hoạt chính trị",

      ANNUAL:

        "Sự kiện thường niên",

      TECHNOLOGY:

        "Công nghệ",

      SEMINAR:

        "Seminar",

      COMPETITION:

        "Cuộc thi",

      RECREATIONAL:

        "Vui chơi",

    }[

      String(

        type || ""

      ).toUpperCase()

    ]

    ||

    type

    ||

    "Hoạt động"

  );

}

function statusLabel(status) {

  return (

    {

      ACTIVE:

        "Đang diễn ra",

      OPEN:

        "Đang mở",

      UPCOMING:

        "Sắp diễn ra",

      COMPLETED:

        "Đã kết thúc",

      DRAFT:

        "Bản nháp",

      PENDING_APPROVAL:

        "Chờ duyệt",

      PUBLISHED:

        "Đã xuất bản",

      CANCELLED:

        "Đã hủy",

    }[

      String(

        status || ""

      ).toUpperCase()

    ]

    ||

    status

    ||

    "Chưa cập nhật"

  );

}

function posterFor(activity) {

  if (activity?.image_url) {

    return resolveBackendUrl(activity.image_url) || activity.image_url;

  }

  if (activity?.poster) {

    return activity.poster;

  }

  const text =

    `${activity?.activity_name || ""} ${activity?.activity_type || ""}`

      .toLowerCase();

  if (text.includes("aws")) {

    return (

      ASSETS?.awsPoster

      ||

      FALLBACK_IMAGE

    );

  }

  if (

    text.includes("it day")

    ||

    text.includes("itday")

    ||

    text.includes("annual")

  ) {

    return (

      ASSETS?.itdayPoster

      ||

      FALLBACK_IMAGE

    );

  }

  if (

    text.includes("techconnect")

    ||

    text.includes("technology")

  ) {

    return (

      ASSETS?.techconnectPoster

      ||

      FALLBACK_IMAGE

    );

  }

  if (

    text.includes("chính trị")

    ||

    text.includes("political")

  ) {

    return (

      ASSETS?.politicalPoster

      ||

      FALLBACK_IMAGE

    );

  }

  return FALLBACK_IMAGE;

}

function detailsForActivity(item) {

  return {

    sourceActivity: item,

    title:

      item.activity_name,

    category:

      typeLabel(

        item.activity_type

      ),

    image:

      posterFor(item),

    date:

      formatDate(

        item.start_time

      ),

    location:

      item.location,

    description:

      item.description,

  };

}

function UserAvatar({

  user,

  className = "avatar",

}) {

  const avatarUrl =

    resolveBackendUrl(

      user?.avatar_url

    );

  if (avatarUrl) {

    return (

      <span

        className={className}

        style={{

          overflow: "hidden",

          padding: 0,

        }}

      >

        <img

          src={avatarUrl}

          alt={

            user?.full_name

            || "Ảnh đại diện"

          }

          style={{

            width: "100%",

            height: "100%",

            objectFit: "cover",

            display: "block",

          }}

        />

      </span>

    );

  }

  return (

    <span className={className}>

      {

        user?.initials

        || roleInitials(

          user?.role

        )

      }

    </span>

  );

}

function roleInitials(role) {

  if (role === "ADMIN") {

    return "AD";

  }

  if (role === "STUDENT") {

    return "SV";

  }

  return "SV";

}

// =====================================================

// LOCAL STYLES FOR NEW ROLE/AUTH UI

// =====================================================

const authGateStyles = {

  loadingPage: {

    minHeight: "100vh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#f8fafc",

  },

  loadingCard: {

    padding: "16px 20px",

    display: "flex",

    alignItems: "center",

    gap: 9,

    border: "1px solid #dbe5f1",

    borderRadius: 14,

    background: "#ffffff",

    color: "#475569",

    fontSize: 12,

    fontWeight: 700,

  },

};

const topStyles = {

  iconButton: {

    width: 40,

    height: 40,

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    border: "1px solid #e2e8f0",

    borderRadius: 10,

    background: "#ffffff",

    color: "#475569",

    cursor: "pointer",

  },

  accountWrap: {

    position: "relative",

  },

  accountButton: {

    minHeight: 44,

    padding: "4px 8px 4px 4px",

    display: "flex",

    alignItems: "center",

    gap: 8,

    border: "1px solid #e2e8f0",

    borderRadius: 12,

    background: "#ffffff",

    color: "#334155",

    cursor: "pointer",

  },

  accountCopy: {

    display: "flex",

    flexDirection: "column",

    alignItems: "flex-start",

    lineHeight: 1.15,

    fontSize: 11,

  },

  accountMenu: {

    position: "absolute",

    top: "calc(100% + 8px)",

    right: 0,

    zIndex: 50,

    width: 270,

    padding: 12,

    border: "1px solid #e2e8f0",

    borderRadius: 14,

    background: "#ffffff",

    boxShadow:

      "0 16px 45px rgba(15,23,42,0.14)",

  },

  accountMenuHeader: {

    padding: "3px 3px 11px",

    display: "flex",

    flexDirection: "column",

    gap: 3,

    borderBottom: "1px solid #f1f5f9",

    color: "#64748b",

    fontSize: 11,

  },

  roleLabel: {

    marginTop: 10,

    display: "flex",

    flexDirection: "column",

    gap: 6,

    color: "#64748b",

    fontSize: 10,

    fontWeight: 700,

  },

  roleSelect: {

    width: "100%",

    height: 38,

    padding: "0 9px",

    border: "1px solid #cbd5e1",

    borderRadius: 9,

    background: "#ffffff",

  },

  menuItem: {

    width: "100%",

    marginTop: 8,

    minHeight: 38,

    padding: "0 9px",

    display: "flex",

    alignItems: "center",

    gap: 8,

    border: "none",

    borderRadius: 9,

    background: "#f8fafc",

    color: "#334155",

    cursor: "pointer",

  },

  notice: {

    marginBottom: 14,

    padding: "11px 13px",

    display: "flex",

    alignItems: "center",

    gap: 10,

    border: "1px solid #bfdbfe",

    borderRadius: 11,

    background: "#eff6ff",

    color: "#1d4ed8",

    fontSize: 12,

  },

  noticeClose: {

    border: 0,

    background: "transparent",

    color: "inherit",

    cursor: "pointer",

    fontWeight: 700,

  },

  pageContext: {

    marginBottom: 14,

    display: "flex",

    justifyContent: "space-between",

    gap: 12,

    color: "#94a3b8",

    fontSize: 10,

  },

};

const studentStyles = {

  page: {

    display: "flex",

    flexDirection: "column",

    gap: 18,

  },

  header: {

    padding: "4px 0 2px",

  },

  eyebrow: {

    color: "#2563eb",

    fontSize: 10,

    fontWeight: 800,

    letterSpacing: 1,

  },

  title: {

    margin: "6px 0 4px",

    color: "#0f172a",

    fontSize: 28,

  },

  description: {

    margin: 0,

    color: "#64748b",

    fontSize: 12,

    lineHeight: 1.6,

  },

  empty: {

    minHeight: 220,

    padding: 30,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    border: "1px dashed #cbd5e1",

    borderRadius: 16,

    background: "#ffffff",

    color: "#94a3b8",

  },

  registeredBox: {

    marginTop: 12,

    padding: "10px 12px",

    display: "flex",

    flexDirection: "column",

    gap: 4,

    border: "1px solid #bbf7d0",

    borderRadius: 12,

    background: "#f0fdf4",

  },

  notRegisteredBox: {

    marginTop: 12,

    padding: "10px 12px",

    display: "flex",

    flexDirection: "column",

    gap: 4,

    border: "1px solid #e2e8f0",

    borderRadius: 12,

    background: "#f8fafc",

  },

  registeredTitle: {

    color: "#166534",

    fontSize: 12,

    fontWeight: 800,

  },

  notRegisteredTitle: {

    color: "#475569",

    fontSize: 12,

    fontWeight: 800,

  },

  registrationHint: {

    color: "#64748b",

    fontSize: 11,

    lineHeight: 1.5,

  },

  activityToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    padding: 12,
    border: "1px solid #dbeafe",
    borderRadius: 16,
    background: "#ffffff",
  },

  activityTabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  activityTab: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    background: "#ffffff",
    color: "#475569",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  activityTabActive: {
    borderColor: "#2563eb",
    background: "#eff6ff",
    color: "#1d4ed8",
  },

  activityCount: {
    minWidth: 20,
    height: 20,
    padding: "0 6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 10,
    fontWeight: 900,
  },

  historyFilters: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  historySelect: {
    minWidth: 150,
    padding: "9px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    background: "#ffffff",
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
    outline: "none",
  },

  historyGroups: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  historyGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  historyGroupHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    background: "#f8fafc",
  },

  historyYear: {
    display: "block",
    marginBottom: 3,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  historySemester: {
    color: "#0f172a",
    fontSize: 14,
  },

  historyGroupCount: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
  },

  resultCard: {

    minHeight: 360,

    padding: 34,

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    border: "1px solid #dbeafe",

    borderRadius: 20,

    background: "#ffffff",

  },

  resultIcon: {

    width: 58,

    height: 58,

    marginBottom: 15,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 16,

    background: "#eff6ff",

    color: "#2563eb",

  },

  resultNotice: {

    maxWidth: 650,

    marginTop: 18,

    padding: "13px 15px",

    borderRadius: 12,

    background: "#f8fafc",

    color: "#475569",

    fontSize: 12,

    lineHeight: 1.7,

  },

};

export default App;

