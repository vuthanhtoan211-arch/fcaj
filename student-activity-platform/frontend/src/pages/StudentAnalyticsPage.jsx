import {

  useEffect,

  useMemo,

  useState,

} from "react";

import {

  Activity,

  AlertCircle,

  Award,

  BadgeCheck,

  BarChart3,

  CalendarDays,

  CheckCircle2,

  Clock3,

  FileCheck2,

  LogIn,

  LogOut,

  MapPin,

  RefreshCw,

  TrendingUp,

} from "lucide-react";

import {

  getMyAnalytics,

} from "../services/studentAnalytics";

const TYPE_LABELS = {

  WORKSHOP: "Workshop",

  SEMINAR: "Seminar",

  POLITICAL_SESSION: "Sinh hoạt chính trị",

  COMPETITION: "Cuộc thi",

  ANNUAL_PROGRAM: "Chương trình thường niên",

  RECREATIONAL: "Hoạt động phong trào",

  TECHNOLOGY: "Công nghệ",

  OTHER: "Khác",

};

const FINAL_LABELS = {

  CONFIRMED: "Đã xác nhận",

  REJECTED: "Không xác nhận",

  PENDING: "Đang xử lý",

  NOT_AVAILABLE: "Chưa có kết quả",

};

function number(

  value

) {

  return Number(

    value || 0

  ).toLocaleString("vi-VN");

}

function percent(

  value

) {

  const parsed =

    Number(value || 0);

  return `${parsed.toLocaleString(

    "vi-VN",

    {

      maximumFractionDigits: 1,

    }

  )}%`;

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

  return date.toLocaleString(

    "vi-VN",

    {

      day: "2-digit",

      month: "2-digit",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",

    }

  );

}

function typeLabel(

  value

) {

  const key =

    String(

      value || "OTHER"

    )

      .trim()

      .toUpperCase();

  return (

    TYPE_LABELS[key]

    || key

    || "Khác"

  );

}

function SummaryCard({

  icon: Icon,

  label,

  value,

  note,

  tone = "blue",

}) {

  return (

    <article

      style={styles.summaryCard}

    >

      <div

        style={{

          ...styles.summaryIcon,

          ...styles[

            `${tone}Icon`

          ],

        }}

      >

        <Icon size={20} />

      </div>

      <div>

        <span

          style={styles.summaryLabel}

        >

          {label}

        </span>

        <strong

          style={styles.summaryValue}

        >

          {value}

        </strong>

        <small

          style={styles.summaryNote}

        >

          {note}

        </small>

      </div>

    </article>

  );

}

function RateRow({

  icon: Icon,

  label,

  value,

  current,

  total,

}) {

  const safeValue =

    Math.max(

      0,

      Math.min(

        100,

        Number(value || 0)

      )

    );

  return (

    <div

      style={styles.rateRow}

    >

      <div

        style={styles.rateTop}

      >

        <span

          style={styles.rateLabel}

        >

          <Icon size={15} />

          {label}

        </span>

        <span

          style={styles.rateValue}

        >

          {number(current)} / {number(total)}

          {" · "}

          {percent(value)}

        </span>

      </div>

      <div

        style={styles.progressTrack}

      >

        <span

          style={{

            ...styles.progressFill,

            width:

              `${safeValue}%`,

          }}

        />

      </div>

    </div>

  );

}

function ResultBadge({

  status,

}) {

  const normalized =

    String(

      status || "NOT_AVAILABLE"

    ).toUpperCase();

  const tone =

    normalized === "CONFIRMED"

      ? styles.badgeConfirmed

      : normalized === "REJECTED"

        ? styles.badgeRejected

        : styles.badgePending;

  return (

    <span

      style={{

        ...styles.badge,

        ...tone,

      }}

    >

      {FINAL_LABELS[normalized]

        || normalized}

    </span>

  );

}

function StudentAnalyticsPage() {

  const [data, setData] =

    useState(null);

  const [loading, setLoading] =

    useState(true);

  const [refreshing, setRefreshing] =

    useState(false);

  const [error, setError] =

    useState("");

  useEffect(() => {

    loadAnalytics();

  }, []);

  async function loadAnalytics(

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

        await getMyAnalytics();

      setData(

        result?.data

        ?? result

        ?? null

      );

    } catch (err) {

      setError(

        err?.message

        || "Không thể tải phân tích cá nhân."

      );

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  }

  const student =

    data?.student || {};

  const summary =

    data?.summary || {};

  const byType =

    Array.isArray(

      data?.by_type

    )

      ? data.by_type

      : [];

  const bySemester =

    Array.isArray(

      data?.by_semester

    )

      ? data.by_semester

      : [];

  const upcoming =

    Array.isArray(

      data?.upcoming

    )

      ? data.upcoming

      : [];

  const recent =

    Array.isArray(

      data?.recent

    )

      ? data.recent

      : [];

  const maxTypeTotal =

    useMemo(

      () =>

        Math.max(

          1,

          ...byType.map(

            (item) =>

              Number(

                item?.total

                || 0

              )

          )

        ),

      [byType]

    );

  if (loading) {

    return (

      <div

        style={styles.centerState}

      >

        <RefreshCw

          size={30}

          style={styles.spinIcon}

        />

        <strong>

          Đang tải phân tích của bạn...

        </strong>

      </div>

    );

  }

  return (

    <div style={styles.page}>

      <section

        style={styles.hero}

      >

        <div

          style={styles.heroIcon}

        >

          <BarChart3 size={27} />

        </div>

        <div

          style={styles.heroCopy}

        >

          <span

            style={styles.eyebrow}

          >

            PHÂN TÍCH CÁ NHÂN

          </span>

          <h2

            style={styles.title}

          >

            Tổng quan hoạt động của bạn

          </h2>

          <div

            style={styles.studentMeta}

          >

            <span>

              {student.full_name

                || "Sinh viên"}

            </span>

            <span>

              MSSV: {student.mssv || "—"}

            </span>

            {student.class_name && (

              <span>

                Lớp: {student.class_name}

              </span>

            )}

          </div>

          <p

            style={styles.description}

          >

            Các chỉ số bên dưới chỉ được tính từ

            Registration, Check-in, Check-out,

            Evidence và kết quả đối soát gắn với

            chính MSSV đang đăng nhập.

          </p>

        </div>

        <button

          type="button"

          style={styles.refreshButton}

          onClick={() =>

            loadAnalytics(true)

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

        <div

          style={styles.errorBox}

        >

          <AlertCircle size={18} />

          <span>{error}</span>

        </div>

      )}

      <section

        style={styles.summaryGrid}

      >

        <SummaryCard

          icon={CalendarDays}

          label="Đã đăng ký"

          value={number(

            summary.total_registered

          )}

          note={`${number(

            summary.upcoming_registered

          )} hoạt động sắp tới`}

          tone="blue"

        />

        <SummaryCard

          icon={BadgeCheck}

          label="Đã xác nhận"

          value={number(

            summary.confirmed

          )}

          note={`${number(

            summary.pending

          )} đang xử lý`}

          tone="green"

        />

        <SummaryCard

          icon={TrendingUp}

          label="Tỷ lệ tham gia"

          value={percent(

            summary.participation_rate

          )}

          note="Đã xác nhận / đã đăng ký"

          tone="violet"

        />

        <SummaryCard

          icon={Award}

          label="Điểm tích lũy"

          value={number(

            summary.total_points

          )}

          note="Từ hoạt động đã xác nhận"

          tone="amber"

        />

      </section>

      <section

        style={styles.twoColumn}

      >

        <article

          style={styles.card}

        >

          <div

            style={styles.cardHeader}

          >

            <div>

              <span

                style={styles.eyebrow}

              >

                MỨC ĐỘ HOÀN THÀNH

              </span>

              <h3

                style={styles.sectionTitle}

              >

                Quy trình tham gia

              </h3>

            </div>

            <Activity size={20} />

          </div>

          <div

            style={styles.rateList}

          >

            <RateRow

              icon={LogIn}

              label="Check-in"

              value={

                summary.attendance_rate

              }

              current={summary.checked_in}

              total={

                summary.total_registered

              }

            />

            <RateRow

              icon={LogOut}

              label="Check-out"

              value={

                summary.checkout_rate

              }

              current={summary.checked_out}

              total={

                summary.total_registered

              }

            />

            <RateRow

              icon={FileCheck2}

              label="Evidence"

              value={

                summary.evidence_rate

              }

              current={

                summary.evidence_submitted

              }

              total={

                summary.total_registered

              }

            />

            <RateRow

              icon={CheckCircle2}

              label="Xác nhận cuối"

              value={

                summary.participation_rate

              }

              current={summary.confirmed}

              total={

                summary.total_registered

              }

            />

          </div>

        </article>

        <article

          style={styles.card}

        >

          <div

            style={styles.cardHeader}

          >

            <div>

              <span

                style={styles.eyebrow}

              >

                PHÂN BỐ

              </span>

              <h3

                style={styles.sectionTitle}

              >

                Theo loại hoạt động

              </h3>

            </div>

            <BarChart3 size={20} />

          </div>

          {byType.length === 0 ? (

            <EmptyText>

              Chưa có dữ liệu hoạt động để phân tích.

            </EmptyText>

          ) : (

            <div

              style={styles.typeList}

            >

              {byType.map(

                (item) => {

                  const width =

                    Math.max(

                      7,

                      (

                        Number(

                          item.total || 0

                        )

                        / maxTypeTotal

                      ) * 100

                    );

                  return (

                    <div

                      key={item.activity_type}

                      style={styles.typeRow}

                    >

                      <div

                        style={styles.typeTop}

                      >

                        <strong>

                          {typeLabel(

                            item.activity_type

                          )}

                        </strong>

                        <span>

                          {number(item.total)} hoạt động

                        </span>

                      </div>

                      <div

                        style={styles.typeTrack}

                      >

                        <span

                          style={{

                            ...styles.typeFill,

                            width:

                              `${width}%`,

                          }}

                        />

                      </div>

                      <div

                        style={styles.typeMeta}

                      >

                        <span>

                          {number(item.confirmed)} xác nhận

                        </span>

                        <span>

                          {number(item.points)} điểm

                        </span>

                        <span>

                          {percent(

                            item.participation_rate

                          )}

                        </span>

                      </div>

                    </div>

                  );

                }

              )}

            </div>

          )}

        </article>

      </section>

      <section

        style={styles.twoColumn}

      >

        <article

          style={styles.card}

        >

          <div

            style={styles.cardHeader}

          >

            <div>

              <span

                style={styles.eyebrow}

              >

                SẮP DIỄN RA

              </span>

              <h3

                style={styles.sectionTitle}

              >

                Hoạt động bạn đã đăng ký

              </h3>

            </div>

            <Clock3 size={20} />

          </div>

          {upcoming.length === 0 ? (

            <EmptyText>

              Hiện chưa có hoạt động đã đăng ký nào sắp diễn ra.

            </EmptyText>

          ) : (

            <div

              style={styles.upcomingList}

            >

              {upcoming.map(

                (item) => (

                  <div

                    key={item.activity_id}

                    style={styles.upcomingItem}

                  >

                    <div

                      style={styles.upcomingIcon}

                    >

                      <CalendarDays size={17} />

                    </div>

                    <div

                      style={styles.upcomingCopy}

                    >

                      <strong>

                        {item.activity_name}

                      </strong>

                      <span>

                        {typeLabel(

                          item.activity_type

                        )}

                      </span>

                      <div

                        style={styles.smallMeta}

                      >

                        <span>

                          <Clock3 size={12} />

                          {formatDateTime(

                            item.start_time

                          )}

                        </span>

                        <span>

                          <MapPin size={12} />

                          {item.location || "HUFLIT"}

                        </span>

                      </div>

                    </div>

                  </div>

                )

              )}

            </div>

          )}

        </article>

        <article

          style={styles.card}

        >

          <div

            style={styles.cardHeader}

          >

            <div>

              <span

                style={styles.eyebrow}

              >

                THEO HỌC KỲ

              </span>

              <h3

                style={styles.sectionTitle}

              >

                Tiến độ theo giai đoạn

              </h3>

            </div>

            <CalendarDays size={20} />

          </div>

          {bySemester.length === 0 ? (

            <EmptyText>

              Chưa có dữ liệu học kỳ.

            </EmptyText>

          ) : (

            <div

              style={styles.semesterList}

            >

              {bySemester.map(

                (item) => (

                  <div

                    key={

                      `${item.academic_year}-${item.semester}`

                    }

                    style={styles.semesterRow}

                  >

                    <div>

                      <strong>

                        Học kỳ {item.semester}

                      </strong>

                      <span>

                        {item.academic_year}

                      </span>

                    </div>

                    <div

                      style={styles.semesterNumbers}

                    >

                      <strong>

                        {number(item.confirmed)}

                        /{number(item.total)}

                      </strong>

                      <span>

                        {number(item.points)} điểm

                      </span>

                    </div>

                  </div>

                )

              )}

            </div>

          )}

        </article>

      </section>

      <section

        style={styles.card}

      >

        <div

          style={styles.cardHeader}

        >

          <div>

            <span

              style={styles.eyebrow}

            >

              GẦN ĐÂY

            </span>

            <h3

              style={styles.sectionTitle}

            >

              Kết quả hoạt động gần nhất

            </h3>

          </div>

          <BadgeCheck size={20} />

        </div>

        {recent.length === 0 ? (

          <EmptyText>

            Chưa có lịch sử hoạt động cá nhân.

          </EmptyText>

        ) : (

          <div

            style={styles.recentList}

          >

            {recent.map(

              (item) => (

                <div

                  key={item.activity_id}

                  style={styles.recentRow}

                >

                  <div

                    style={styles.recentMain}

                  >

                    <strong>

                      {item.activity_name}

                    </strong>

                    <span>

                      {typeLabel(

                        item.activity_type

                      )}

                      {" · "}

                      {formatDateTime(

                        item.start_time

                      )}

                    </span>

                  </div>

                  <div

                    style={styles.recentChecks}

                  >

                    <span>

                      <LogIn size={13} />

                      {item.check_in ? "Có" : "Không"}

                    </span>

                    <span>

                      <LogOut size={13} />

                      {item.check_out ? "Có" : "Không"}

                    </span>

                    <span>

                      <FileCheck2 size={13} />

                      {item.evidence_status === "YES"

                        ? "Có"

                        : item.evidence_status === "NO"

                          ? "Không"

                          : "Chưa nhập"}

                    </span>

                  </div>

                  <div

                    style={styles.recentEnd}

                  >

                    <ResultBadge

                      status={item.final_status}

                    />

                    <strong>

                      +{number(

                        item.earned_points

                      )} điểm

                    </strong>

                  </div>

                </div>

              )

            )}

          </div>

        )}

      </section>

    </div>

  );

}

function EmptyText({

  children,

}) {

  return (

    <div

      style={styles.emptyText}

    >

      {children}

    </div>

  );

}

const styles = {

  page: {

    padding: "28px 0 40px",

    display: "grid",

    gap: "20px",

  },

  centerState: {

    minHeight: "420px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "12px",

    color: "#51657f",

  },

  spinIcon: {

    animation: "spin 0.9s linear infinite",

  },

  hero: {

    padding: "22px 24px",

    display: "flex",

    alignItems: "flex-start",

    gap: "16px",

    border: "1px solid #dce8f6",

    borderRadius: "18px",

    background: "#ffffff",

    boxShadow: "0 10px 28px rgba(35,72,123,0.07)",

  },

  heroIcon: {

    width: "52px",

    height: "52px",

    flex: "0 0 52px",

    display: "grid",

    placeItems: "center",

    borderRadius: "15px",

    background: "#e8f2ff",

    color: "#2167bd",

  },

  heroCopy: {

    minWidth: 0,

    flex: 1,

  },

  eyebrow: {

    color: "#2768b7",

    fontSize: "10px",

    fontWeight: 800,

    letterSpacing: "0.11em",

  },

  title: {

    margin: "5px 0 7px",

    color: "#172b46",

    fontSize: "26px",

  },

  description: {

    margin: "9px 0 0",

    maxWidth: "760px",

    color: "#6d7f95",

    fontSize: "12px",

    lineHeight: 1.7,

  },

  studentMeta: {

    display: "flex",

    flexWrap: "wrap",

    gap: "7px 14px",

    color: "#52677f",

    fontSize: "11px",

    fontWeight: 700,

  },

  refreshButton: {

    minHeight: "40px",

    padding: "0 13px",

    display: "inline-flex",

    alignItems: "center",

    gap: "7px",

    border: "1px solid #cddbed",

    borderRadius: "10px",

    background: "#f8fbff",

    color: "#245fa7",

    fontSize: "11px",

    fontWeight: 800,

    cursor: "pointer",

  },

  errorBox: {

    padding: "12px 14px",

    display: "flex",

    alignItems: "center",

    gap: "9px",

    border: "1px solid #fecaca",

    borderRadius: "12px",

    background: "#fff4f4",

    color: "#b42318",

    fontSize: "12px",

  },

  summaryGrid: {

    display: "grid",

    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",

    gap: "15px",

  },

  summaryCard: {

    minWidth: 0,

    padding: "17px",

    display: "flex",

    alignItems: "flex-start",

    gap: "12px",

    border: "1px solid #e0eaf5",

    borderRadius: "15px",

    background: "#ffffff",

    boxShadow: "0 8px 22px rgba(35,72,123,0.06)",

  },

  summaryIcon: {

    width: "43px",

    height: "43px",

    flex: "0 0 43px",

    display: "grid",

    placeItems: "center",

    borderRadius: "12px",

  },

  blueIcon: {

    background: "#e7f1ff",

    color: "#2167bd",

  },

  greenIcon: {

    background: "#e3f8ee",

    color: "#15825b",

  },

  violetIcon: {

    background: "#f0ebff",

    color: "#7356c7",

  },

  amberIcon: {

    background: "#fff1dc",

    color: "#c87d20",

  },

  summaryLabel: {

    display: "block",

    color: "#6f8095",

    fontSize: "10px",

    fontWeight: 700,

  },

  summaryValue: {

    display: "block",

    marginTop: "4px",

    color: "#172b46",

    fontSize: "24px",

    lineHeight: 1.2,

  },

  summaryNote: {

    display: "block",

    marginTop: "4px",

    color: "#8493a6",

    fontSize: "9px",

  },

  twoColumn: {

    display: "grid",

    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

    gap: "18px",

  },

  card: {

    minWidth: 0,

    padding: "20px",

    border: "1px solid #e0eaf5",

    borderRadius: "16px",

    background: "#ffffff",

    boxShadow: "0 8px 22px rgba(35,72,123,0.06)",

  },

  cardHeader: {

    marginBottom: "17px",

    display: "flex",

    alignItems: "flex-start",

    justifyContent: "space-between",

    gap: "12px",

    color: "#50709a",

  },

  sectionTitle: {

    margin: "4px 0 0",

    color: "#1d314d",

    fontSize: "17px",

  },

  rateList: {

    display: "grid",

    gap: "17px",

  },

  rateRow: {

    display: "grid",

    gap: "8px",

  },

  rateTop: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "12px",

  },

  rateLabel: {

    display: "inline-flex",

    alignItems: "center",

    gap: "7px",

    color: "#405873",

    fontSize: "11px",

    fontWeight: 800,

  },

  rateValue: {

    color: "#718299",

    fontSize: "10px",

    whiteSpace: "nowrap",

  },

  progressTrack: {

    height: "7px",

    overflow: "hidden",

    borderRadius: "999px",

    background: "#edf2f8",

  },

  progressFill: {

    display: "block",

    height: "100%",

    borderRadius: "999px",

    background: "linear-gradient(90deg,#3a7bd5,#55b9e8)",

  },

  typeList: {

    display: "grid",

    gap: "15px",

  },

  typeRow: {

    display: "grid",

    gap: "7px",

  },

  typeTop: {

    display: "flex",

    justifyContent: "space-between",

    gap: "10px",

    color: "#334b66",

    fontSize: "10px",

  },

  typeTrack: {

    height: "8px",

    overflow: "hidden",

    borderRadius: "999px",

    background: "#edf2f8",

  },

  typeFill: {

    display: "block",

    height: "100%",

    borderRadius: "999px",

    background: "linear-gradient(90deg,#7957d5,#4e8bd8)",

  },

  typeMeta: {

    display: "flex",

    flexWrap: "wrap",

    gap: "6px 14px",

    color: "#8493a6",

    fontSize: "9px",

  },

  upcomingList: {

    display: "grid",

    gap: "10px",

  },

  upcomingItem: {

    padding: "12px",

    display: "flex",

    alignItems: "flex-start",

    gap: "11px",

    border: "1px solid #e5edf6",

    borderRadius: "12px",

    background: "#fbfdff",

  },

  upcomingIcon: {

    width: "37px",

    height: "37px",

    flex: "0 0 37px",

    display: "grid",

    placeItems: "center",

    borderRadius: "10px",

    background: "#e9f3ff",

    color: "#2167bd",

  },

  upcomingCopy: {

    minWidth: 0,

    display: "grid",

    gap: "3px",

  },

  smallMeta: {

    marginTop: "5px",

    display: "flex",

    flexWrap: "wrap",

    gap: "6px 12px",

    color: "#7b8ba0",

    fontSize: "9px",

  },

  semesterList: {

    display: "grid",

    gap: "10px",

  },

  semesterRow: {

    padding: "12px 13px",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: "12px",

    border: "1px solid #e5edf6",

    borderRadius: "12px",

    background: "#fbfdff",

  },

  semesterNumbers: {

    textAlign: "right",

  },

  recentList: {

    display: "grid",

  },

  recentRow: {

    padding: "13px 0",

    display: "grid",

    gridTemplateColumns: "minmax(0,1.3fr) minmax(240px,0.9fr) auto",

    alignItems: "center",

    gap: "16px",

    borderBottom: "1px solid #edf2f7",

  },

  recentMain: {

    minWidth: 0,

    display: "grid",

    gap: "4px",

    color: "#1c324f",

    fontSize: "11px",

  },

  recentChecks: {

    display: "flex",

    flexWrap: "wrap",

    gap: "8px 12px",

    color: "#657990",

    fontSize: "9px",

  },

  recentEnd: {

    display: "flex",

    alignItems: "center",

    justifyContent: "flex-end",

    gap: "10px",

    color: "#17684d",

    fontSize: "10px",

    whiteSpace: "nowrap",

  },

  badge: {

    padding: "6px 8px",

    borderRadius: "999px",

    fontSize: "9px",

    fontWeight: 800,

  },

  badgeConfirmed: {

    background: "#e5f7ed",

    color: "#1d7a57",

  },

  badgeRejected: {

    background: "#fff0f0",

    color: "#b33a3a",

  },

  badgePending: {

    background: "#fff6df",

    color: "#9a6b17",

  },

  emptyText: {

    minHeight: "130px",

    padding: "20px",

    display: "grid",

    placeItems: "center",

    border: "1px dashed #c7d7e8",

    borderRadius: "12px",

    background: "#fbfdff",

    color: "#7d8fa5",

    textAlign: "center",

    fontSize: "11px",

    lineHeight: 1.6,

  },

};

export default StudentAnalyticsPage;
