import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getAnalyticsSummary,
} from "../services/api";


// ======================================================
// CHART COLORS
// ======================================================

const CHART_COLORS = {

  registered:
    "#2563eb",

  checkIn:
    "#059669",

  checkOut:
    "#7c3aed",

  confirmed:
    "#f59e0b",

  rejected:
    "#ef4444",

  pending:
    "#f97316",

  evidence:
    "#0891b2",

};


const PIE_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#f59e0b",
  "#0891b2",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];


// ======================================================
// ANALYTICS PAGE
// ======================================================

function AnalyticsPage() {

  const [
    analytics,
    setAnalytics,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    academicYear,
    setAcademicYear,
  ] = useState("ALL");


  const [
    semester,
    setSemester,
  ] = useState("ALL");


  // ====================================================
  // LOAD ANALYTICS
  // ====================================================

  useEffect(() => {

    loadAnalytics();

  }, []);


  async function loadAnalytics() {

    try {

      setLoading(
        true
      );

      setError("");


      const result =
        await getAnalyticsSummary();


      setAnalytics(
        result?.data ||
        null
      );

    } catch (err) {

      console.error(
        "Analytics error:",
        err
      );


      setAnalytics(
        null
      );


      setError(
        err.message ||
        "Không thể tải dữ liệu phân tích."
      );

    } finally {

      setLoading(
        false
      );

    }

  }


  // ====================================================
  // ACTIVITIES
  // ====================================================

  const activities =
    Array.isArray(
      analytics?.activities
    )
      ? analytics.activities
      : [];


  // ====================================================
  // ACADEMIC YEARS
  // ====================================================

  const academicYears =
    useMemo(
      () => {

        return [
          ...new Set(
            activities
              .map(
                (item) =>
                  String(
                    item.academic_year ||
                    ""
                  ).trim()
              )
              .filter(Boolean)
          ),
        ].sort();

      },
      [activities]
    );


  // ====================================================
  // SEMESTERS
  // ====================================================

  const semesters =
    useMemo(
      () => {

        return [
          ...new Set(
            activities
              .map(
                (item) =>
                  String(
                    item.semester ||
                    ""
                  ).trim()
              )
              .filter(Boolean)
          ),
        ].sort();

      },
      [activities]
    );


  // ====================================================
  // FILTER ACTIVITIES
  // ====================================================

  const filteredActivities =
    useMemo(
      () => {

        return activities.filter(
          (item) => {

            const itemAcademicYear =
              String(
                item.academic_year ||
                ""
              ).trim();


            const itemSemester =
              String(
                item.semester ||
                ""
              ).trim();


            if (
              academicYear !==
                "ALL"
              &&
              itemAcademicYear !==
                academicYear
            ) {

              return false;

            }


            if (
              semester !==
                "ALL"
              &&
              itemSemester !==
                semester
            ) {

              return false;

            }


            return true;

          }
        );

      },
      [
        activities,
        academicYear,
        semester,
      ]
    );


  // ====================================================
  // SUMMARY
  // ====================================================

  const summary =
    useMemo(
      () => {

        const totals = {

          totalActivities:
            filteredActivities.length,

          registrations:
            0,

          checkIn:
            0,

          checkOut:
            0,

          evidence:
            0,

          confirmed:
            0,

          rejected:
            0,

          pending:
            0,

          locked:
            0,

          officialConfirmed: 0,
          lockedRegistrations: 0,
          notReconciled: 0,
          outsideAttendance: 0,
          outsideParticipation: 0,
          outsideEvidence: 0,

        };


        filteredActivities.forEach(
          (item) => {

            totals.registrations +=
              Number(
                item.registered
              ) || 0;


            totals.checkIn +=
              Number(
                item.check_in
              ) || 0;


            totals.checkOut +=
              Number(
                item.check_out
              ) || 0;


            totals.evidence +=
              Number(
                item.evidence
              ) || 0;


            totals.confirmed +=
              Number(
                item.confirmed
              ) || 0;


            totals.rejected +=
              Number(
                item.rejected
              ) || 0;


            totals.pending +=
              Number(
                item.pending
              ) || 0;


            totals.officialConfirmed += Number(item.official_confirmed) || 0;
            totals.lockedRegistrations += Number(item.registered_locked) || 0;
            totals.notReconciled += Number(item.not_reconciled) || 0;
            totals.outsideAttendance += Number(item.outside_registration_attendance) || 0;
            totals.outsideParticipation += Number(item.outside_registration_participation) || 0;
            totals.outsideEvidence += Number(item.outside_registration_evidence) || 0;

            if (
              item.final_list_locked
            ) {

              totals.locked +=
                1;

            }

          }
        );


        totals.attendanceRate =
          calculatePercent(
            totals.checkIn,
            totals.registrations
          );


        totals.checkoutRate =
          calculatePercent(
            totals.checkOut,
            totals.registrations
          );


        totals.completionRate =
          calculatePercent(
            totals.confirmed,
            totals.registrations
          );


        totals.officialCompletionRate = calculatePercent(
          totals.officialConfirmed,
          totals.lockedRegistrations
        );

        totals.lockedRate =
          calculatePercent(
            totals.locked,
            totals.totalActivities
          );


        return totals;

      },
      [filteredActivities]
    );


  // ====================================================
  // ACTIVITY BAR CHART DATA
  // ====================================================

  const activityChartData =
    useMemo(
      () => {

        return [
          ...filteredActivities,
        ]
          .sort(
            (a, b) =>
              (
                Number(
                  b.registered
                ) || 0
              )
              -
              (
                Number(
                  a.registered
                ) || 0
              )
          )
          .slice(
            0,
            8
          )
          .map(
            (item) => ({

              activityId:
                item.activity_id,

              name:
                item.activity_name ||
                "Hoạt động",

              shortName:
                shortenText(
                  item.activity_name ||
                  "Hoạt động",
                  18
                ),

              registered:
                Number(
                  item.registered
                ) || 0,

              checkIn:
                Number(
                  item.check_in
                ) || 0,

              checkOut:
                Number(
                  item.check_out
                ) || 0,

              confirmed:
                Number(
                  item.confirmed
                ) || 0,

            })
          );

      },
      [filteredActivities]
    );


  // ====================================================
  // FINAL STATUS PIE DATA
  // ====================================================

  const finalStatusData =
    useMemo(
      () => {

        return [

          {
            name:
              "Đã xác nhận",

            value:
              summary.confirmed,

            color:
              CHART_COLORS.checkIn,
          },

          {
            name:
              "Không xác nhận",

            value:
              summary.rejected,

            color:
              CHART_COLORS.rejected,
          },

          {
            name:
              "Chờ xử lý",

            value:
              summary.pending,

            color:
              CHART_COLORS.pending,
          },

        ].filter(
          (item) =>
            item.value > 0
        );

      },
      [
        summary.confirmed,
        summary.rejected,
        summary.pending,
      ]
    );


  // ====================================================
  // ACTIVITY TYPE PIE DATA
  // ====================================================

  const activityTypeData =
    useMemo(
      () => {

        const counts = {};


        filteredActivities.forEach(
          (item) => {

            const type =
              String(
                item.activity_type ||
                "OTHER"
              ).toUpperCase();


            counts[type] =
              (
                counts[type] ||
                0
              )
              + 1;

          }
        );


        return Object.entries(
          counts
        )
          .map(
            ([
              type,
              count,
            ]) => ({

              type,

              name:
                formatActivityType(
                  type
                ),

              value:
                count,

            })
          )
          .sort(
            (a, b) =>
              b.value -
              a.value
          );

      },
      [filteredActivities]
    );


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div style={styles.loadingPage}>

        <RefreshCw
          size={29}
        />


        <strong>
          Đang tổng hợp dữ liệu...
        </strong>

      </div>

    );

  }


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
            PHÂN TÍCH DỮ LIỆU
          </span>


          <h2 style={styles.title}>
            Tổng quan hoạt động sinh viên
          </h2>


          <p style={styles.description}>
            Theo dõi mức độ đăng ký,
            tham gia, điểm danh và kết quả
            cuối của các hoạt động.
          </p>

        </div>


        <button
          type="button"
          style={styles.refreshButton}
          onClick={
            loadAnalytics
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


          <span>
            {error}
          </span>

        </div>

      )}


      {/* ================================================
          FILTER
      ================================================= */}

      <section style={styles.filterCard}>

        <div style={styles.filterCopy}>

          <strong style={styles.filterTitle}>
            Bộ lọc thống kê
          </strong>


          <span style={styles.filterDescription}>
            Lọc theo năm học và học kỳ.
          </span>

        </div>


        <div style={styles.filters}>

          <select
            value={
              academicYear
            }
            onChange={
              (event) =>
                setAcademicYear(
                  event.target.value
                )
            }
            style={styles.select}
          >

            <option value="ALL">
              Tất cả năm học
            </option>


            {academicYears.map(
              (value) => (

                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>

              )
            )}

          </select>


          <select
            value={
              semester
            }
            onChange={
              (event) =>
                setSemester(
                  event.target.value
                )
            }
            style={styles.select}
          >

            <option value="ALL">
              Tất cả học kỳ
            </option>


            {semesters.map(
              (value) => (

                <option
                  key={value}
                  value={value}
                >
                  Học kỳ {value}
                </option>

              )
            )}

          </select>

        </div>

      </section>


      {(summary.notReconciled > 0 || summary.outsideAttendance > 0 || summary.outsideParticipation > 0 || summary.outsideEvidence > 0) && (
        <div style={styles.errorBox}>
          <AlertCircle size={19} />
          <span>
            Dữ liệu cần rà soát: {formatNumber(summary.notReconciled)} lượt đăng ký chưa đối soát;
            {" "}{formatNumber(summary.outsideAttendance)} bản ghi điểm danh,
            {" "}{formatNumber(summary.outsideParticipation)} bản ghi tham gia và
            {" "}{formatNumber(summary.outsideEvidence)} bản ghi minh chứng ngoài danh sách đăng ký.
            Các bản ghi ngoài danh sách không được tính vào tỷ lệ.
          </span>
        </div>
      )}

      {/* ================================================
          SUMMARY CARDS
      ================================================= */}

      <section style={styles.summaryGrid}>

        <SummaryCard
          icon={CalendarDays}
          label="Hoạt động"
          value={
            summary.totalActivities
          }
        />


        <SummaryCard
          icon={Users}
          label="Lượt đăng ký"
          value={
            summary.registrations
          }
          type="blue"
        />


        <SummaryCard
          icon={LogIn}
          label="Check-in"
          value={
            summary.checkIn
          }
          type="green"
        />


        <SummaryCard
          icon={LogOut}
          label="Check-out"
          value={
            summary.checkOut
          }
          type="purple"
        />

      </section>


      {/* ================================================
          RATE CARDS
      ================================================= */}

      <section style={styles.rateGrid}>

        <RateCard
          icon={Activity}
          title="Tỷ lệ Check-in"
          value={
            summary.attendanceRate
          }
          description={
            `${formatNumber(
              summary.checkIn
            )} / ${formatNumber(
              summary.registrations
            )} lượt đăng ký`
          }
        />


        <RateCard
          icon={LogOut}
          title="Tỷ lệ Check-out"
          value={
            summary.checkoutRate
          }
          description={
            `${formatNumber(
              summary.checkOut
            )} / ${formatNumber(
              summary.registrations
            )} lượt đăng ký`
          }
        />


        <RateCard
          icon={CheckCircle2}
          title="Tỷ lệ đã xác nhận qua đối soát"
          value={
            summary.completionRate
          }
          description={
            `${formatNumber(
              summary.confirmed
            )} lượt được xác nhận (gồm danh sách chưa khóa)`
          }
        />


        <RateCard
          icon={ShieldCheck}
          title="Tỷ lệ tham gia chính thức"
          value={summary.officialCompletionRate}
          description={`${formatNumber(summary.officialConfirmed)} / ${formatNumber(summary.lockedRegistrations)} lượt đăng ký thuộc các hoạt động đã khóa`}
        />

        <RateCard
          icon={ShieldCheck}
          title="Danh sách đã khóa"
          value={
            summary.lockedRate
          }
          description={
            `${summary.locked} / ${summary.totalActivities} hoạt động`
          }
        />

      </section>


      {/* ================================================
          MAIN BAR CHART
      ================================================= */}

      <section style={styles.largeChartCard}>

        <div style={styles.cardHeader}>

          <div>

            <span style={styles.smallEyebrow}>
              MỨC ĐỘ THAM GIA
            </span>


            <h3 style={styles.cardTitle}>
              Đăng ký và tham gia theo hoạt động
            </h3>


            <p style={styles.cardDescription}>
              So sánh số sinh viên đăng ký,
              Check-in, Check-out và số lượt
              đã xác nhận qua đối soát.
            </p>

          </div>


          <BarChart3
            size={23}
          />

        </div>


        {activityChartData.length === 0 ? (

          <EmptyState />

        ) : (

          <div style={styles.largeChartWrapper}>

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  activityChartData
                }
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 45,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />


                <XAxis
                  dataKey="shortName"
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={75}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />


                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />


                <Tooltip
                  content={
                    <ActivityTooltip />
                  }
                />


                <Legend
                  wrapperStyle={{
                    fontSize:
                      "12px",
                  }}
                />


                <Bar
                  name="Đăng ký"
                  dataKey="registered"
                  fill={
                    CHART_COLORS
                      .registered
                  }
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />


                <Bar
                  name="Check-in"
                  dataKey="checkIn"
                  fill={
                    CHART_COLORS
                      .checkIn
                  }
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />


                <Bar
                  name="Check-out"
                  dataKey="checkOut"
                  fill={
                    CHART_COLORS
                      .checkOut
                  }
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />


                <Bar
                  name="Đã đối soát: xác nhận"
                  dataKey="confirmed"
                  fill={
                    CHART_COLORS
                      .confirmed
                  }
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        )}

      </section>


      {/* ================================================
          DONUT CHARTS
      ================================================= */}

      <section style={styles.chartGrid}>

        {/* FINAL RESULT */}

        <div style={styles.chartCard}>

          <div style={styles.cardHeader}>

            <div>

              <span style={styles.smallEyebrow}>
                KẾT QUẢ ĐỐI SOÁT
              </span>


              <h3 style={styles.cardTitle}>
                Trạng thái đối soát hiện tại
              </h3>


              <p style={styles.cardDescription}>
                Bao gồm dữ liệu đối soát của
                cả hoạt động chưa khóa.
              </p>

            </div>


            <CheckCircle2
              size={21}
            />

          </div>


          {finalStatusData.length === 0 ? (

            <EmptyState />

          ) : (

            <>

              <div style={styles.pieWrapper}>

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={
                        finalStatusData
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={105}
                      paddingAngle={3}
                    >

                      {finalStatusData.map(
                        (
                          item,
                          index
                        ) => (

                          <Cell
                            key={
                              `${item.name}-${index}`
                            }
                            fill={
                              item.color
                            }
                          />

                        )
                      )}

                    </Pie>


                    <Tooltip
                      formatter={
                        (
                          value,
                          name
                        ) => [
                          formatNumber(
                            value
                          ),
                          name,
                        ]
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>


                <div style={styles.pieCenter}>

                  <strong>
                    {formatNumber(
                      summary.confirmed
                      +
                      summary.rejected
                      +
                      summary.pending
                    )}
                  </strong>


                  <span>
                    sinh viên
                  </span>

                </div>

              </div>


              <div style={styles.legendList}>

                {finalStatusData.map(
                  (item) => (

                    <ChartLegendItem
                      key={item.name}
                      color={
                        item.color
                      }
                      label={
                        item.name
                      }
                      value={
                        item.value
                      }
                    />

                  )
                )}

              </div>

            </>

          )}

        </div>


        {/* ACTIVITY TYPES */}

        <div style={styles.chartCard}>

          <div style={styles.cardHeader}>

            <div>

              <span style={styles.smallEyebrow}>
                CƠ CẤU HOẠT ĐỘNG
              </span>


              <h3 style={styles.cardTitle}>
                Phân bố theo loại
              </h3>


              <p style={styles.cardDescription}>
                Tỷ trọng các nhóm hoạt động
                đang được quản lý.
              </p>

            </div>


            <ClipboardCheck
              size={21}
            />

          </div>


          {activityTypeData.length === 0 ? (

            <EmptyState />

          ) : (

            <>

              <div style={styles.pieWrapper}>

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={
                        activityTypeData
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={105}
                      paddingAngle={3}
                    >

                      {activityTypeData.map(
                        (
                          item,
                          index
                        ) => (

                          <Cell
                            key={
                              item.type
                            }
                            fill={
                              PIE_COLORS[
                                index %
                                PIE_COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>


                    <Tooltip
                      formatter={
                        (
                          value,
                          name
                        ) => [
                          `${value} hoạt động`,
                          name,
                        ]
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>


                <div style={styles.pieCenter}>

                  <strong>
                    {summary.totalActivities}
                  </strong>


                  <span>
                    hoạt động
                  </span>

                </div>

              </div>


              <div style={styles.legendList}>

                {activityTypeData.map(
                  (
                    item,
                    index
                  ) => (

                    <ChartLegendItem
                      key={item.type}
                      color={
                        PIE_COLORS[
                          index %
                          PIE_COLORS.length
                        ]
                      }
                      label={
                        item.name
                      }
                      value={
                        item.value
                      }
                    />

                  )
                )}

              </div>

            </>

          )}

        </div>

      </section>


      {/* ================================================
          FINAL STATUS
      ================================================= */}

      <section style={styles.statusCard}>

        <div style={styles.cardHeader}>

          <div>

            <span style={styles.smallEyebrow}>
              TỔNG HỢP KẾT QUẢ
            </span>


            <h3 style={styles.cardTitle}>
              Trạng thái đối soát
            </h3>

          </div>

        </div>


        <div style={styles.finalStatusGrid}>

          <FinalStatus
            label="Đã xác nhận"
            value={
              summary.confirmed
            }
            type="success"
          />


          <FinalStatus
            label="Không xác nhận"
            value={
              summary.rejected
            }
            type="danger"
          />


          <FinalStatus
            label="Chờ xử lý"
            value={
              summary.pending
            }
            type="warning"
          />


          <FinalStatus
            label="Evidence"
            value={
              summary.evidence
            }
            type="blue"
          />

        </div>

      </section>


      {/* ================================================
          DETAIL TABLE
      ================================================= */}

      <section style={styles.card}>

        <div style={styles.cardHeader}>

          <div>

            <span style={styles.smallEyebrow}>
              CHI TIẾT
            </span>


            <h3 style={styles.cardTitle}>
              Hiệu quả từng hoạt động
            </h3>

          </div>


          <span style={styles.totalLabel}>

            {filteredActivities.length}
            {" "}
            hoạt động

          </span>

        </div>


        {filteredActivities.length === 0 ? (

          <EmptyState />

        ) : (

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}>
                    Hoạt động
                  </th>

                  <th style={styles.th}>
                    Loại
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

                  <th style={styles.thCenter}>
                    Đã xác nhận
                  </th>

                  <th style={styles.thCenter}>
                    Tỷ lệ
                  </th>

                  <th style={styles.thCenter}>
                    Trạng thái
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredActivities.map(
                  (item) => (

                    <tr
                      key={
                        item.activity_id
                      }
                    >

                      <td style={styles.td}>

                        <strong>
                          {item.activity_name}
                        </strong>


                        <span style={styles.subText}>
                          {formatDate(
                            item.start_time
                          )}
                        </span>

                      </td>


                      <td style={styles.td}>

                        {formatActivityType(
                          item.activity_type
                        )}

                      </td>


                      <td style={styles.tdCenter}>
                        {formatNumber(
                          item.registered
                        )}
                      </td>


                      <td style={styles.tdCenter}>
                        {formatNumber(
                          item.check_in
                        )}
                      </td>


                      <td style={styles.tdCenter}>
                        {formatNumber(
                          item.check_out
                        )}
                      </td>


                      <td style={styles.tdCenter}>
                        {formatNumber(
                          item.evidence
                        )}
                      </td>


                      <td style={styles.tdCenter}>
                        {formatNumber(item.confirmed)}
                        <span style={styles.subText}>
                          Chính thức: {formatNumber(item.official_confirmed)}
                        </span>
                      </td>


                      <td style={styles.tdCenter}>

                        <strong>
                          {Number(
                            item.completion_rate
                          ) || 0}%
                        </strong>

                      </td>


                      <td style={styles.tdCenter}>

                        {item.final_list_locked ? (

                          <span style={styles.lockedBadge}>
                            Đã khóa
                          </span>

                        ) : (

                          <span style={styles.openBadge}>
                            Đang xử lý
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>

  );

}


// ======================================================
// ACTIVITY TOOLTIP
// ======================================================

function ActivityTooltip({
  active,
  payload,
}) {

  if (
    !active ||
    !payload?.length
  ) {

    return null;

  }


  const source =
    payload[0]
      ?.payload;


  return (

    <div style={styles.tooltip}>

      <strong style={styles.tooltipTitle}>
        {source?.name}
      </strong>


      {payload.map(
        (item) => (

          <div
            key={
              item.dataKey
            }
            style={styles.tooltipRow}
          >

            <span
              style={{
                ...styles.tooltipDot,
                background:
                  item.color,
              }}
            />


            <span style={styles.tooltipLabel}>
              {item.name}
            </span>


            <strong>
              {formatNumber(
                item.value
              )}
            </strong>

          </div>

        )
      )}

    </div>

  );

}


// ======================================================
// CHART LEGEND ITEM
// ======================================================

function ChartLegendItem({
  color,
  label,
  value,
}) {

  return (

    <div style={styles.legendItem}>

      <div style={styles.legendLeft}>

        <span
          style={{
            ...styles.legendDot,
            background:
              color,
          }}
        />


        <span>
          {label}
        </span>

      </div>


      <strong>
        {formatNumber(
          value
        )}
      </strong>

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

        ...(type === "green"
          ? styles.summaryGreen
          : {}),

        ...(type === "purple"
          ? styles.summaryPurple
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
          {formatNumber(
            value
          )}
        </strong>

      </div>

    </div>

  );

}


// ======================================================
// RATE CARD
// ======================================================

function RateCard({
  icon: Icon,
  title,
  value,
  description,
}) {

  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );


  return (

    <article style={styles.rateCard}>

      <div style={styles.rateHeader}>

        <div style={styles.rateIcon}>

          <Icon
            size={19}
          />

        </div>


        <strong>
          {title}
        </strong>

      </div>


      <div style={styles.rateValue}>
        {safeValue}%
      </div>


      <div style={styles.rateTrack}>

        <div
          style={{
            ...styles.rateFill,
            width:
              `${safeValue}%`,
          }}
        />

      </div>


      <span style={styles.rateDescription}>
        {description}
      </span>

    </article>

  );

}


// ======================================================
// FINAL STATUS
// ======================================================

function FinalStatus({
  label,
  value,
  type,
}) {

  return (

    <div
      style={{
        ...styles.finalStatusItem,

        ...(type === "success"
          ? styles.finalSuccess
          : {}),

        ...(type === "danger"
          ? styles.finalDanger
          : {}),

        ...(type === "warning"
          ? styles.finalWarning
          : {}),

        ...(type === "blue"
          ? styles.finalBlue
          : {}),
      }}
    >

      <span style={styles.finalStatusLabel}>
        {label}
      </span>


      <strong style={styles.finalStatusValue}>
        {formatNumber(
          value
        )}
      </strong>

    </div>

  );

}


// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState() {

  return (

    <div style={styles.empty}>

      Chưa có dữ liệu phù hợp.

    </div>

  );

}


// ======================================================
// HELPERS
// ======================================================

function calculatePercent(
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
    * 100
  );

}


function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "vi-VN"
  ).format(
    Number(value) || 0
  );

}


function shortenText(
  value,
  maxLength = 20
) {

  const text =
    String(
      value || ""
    );


  if (
    text.length <=
    maxLength
  ) {

    return text;

  }


  return (
    `${text.slice(
      0,
      maxLength - 1
    )}…`
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


function formatActivityType(
  value
) {

  const mapping = {

    WORKSHOP:
      "Workshop",

    SEMINAR:
      "Seminar",

    POLITICAL:
      "Sinh hoạt chính trị",

    COMPETITION:
      "Cuộc thi",

    ANNUAL:
      "Chương trình thường niên",

    RECREATIONAL:
      "Văn hóa - Giải trí",

    TECHNOLOGY:
      "Công nghệ",

    OTHER:
      "Khác",

  };


  const key =
    String(
      value || ""
    ).toUpperCase();


  return (
    mapping[key] ||
    value ||
    "Khác"
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


  loadingPage: {
    minHeight:
      "420px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "center",

    justifyContent:
      "center",

    gap:
      "10px",

    color:
      "#64748b",
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

    fontSize:
      "30px",

    color:
      "#0f172a",
  },


  description: {
    margin:
      "7px 0 0",

    fontSize:
      "13px",

    lineHeight:
      1.5,

    color:
      "#64748b",
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


  // ====================================================
  // FILTER
  // ====================================================

  filterCard: {
    padding:
      "17px 20px",

    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap:
      "16px",

    flexWrap:
      "wrap",

    border:
      "1px solid #dbe5f1",

    borderRadius:
      "16px",

    background:
      "#ffffff",
  },


  filterCopy: {
    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "5px",
  },


  filterTitle: {
    display:
      "block",

    fontSize:
      "14px",

    lineHeight:
      1.3,

    fontWeight:
      700,

    color:
      "#0f172a",
  },


  filterDescription: {
    display:
      "block",

    fontSize:
      "12px",

    lineHeight:
      1.4,

    color:
      "#64748b",
  },


  filters: {
    display:
      "flex",

    gap:
      "9px",

    flexWrap:
      "wrap",
  },


  select: {
    minWidth:
      "170px",

    height:
      "40px",

    padding:
      "0 10px",

    border:
      "1px solid #cbd5e1",

    borderRadius:
      "10px",

    background:
      "#ffffff",

    color:
      "#0f172a",
  },


  // ====================================================
  // SUMMARY
  // ====================================================

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


  summaryBlue: {
    borderColor:
      "#bfdbfe",

    background:
      "#eff6ff",

    color:
      "#2563eb",
  },


  summaryGreen: {
    borderColor:
      "#a7f3d0",

    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  summaryPurple: {
    borderColor:
      "#ddd6fe",

    background:
      "#f5f3ff",

    color:
      "#7c3aed",
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
      "rgba(255,255,255,0.7)",
  },


  summaryCopy: {
    minWidth:
      0,

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "6px",
  },


  summaryLabel: {
    display:
      "block",

    fontSize:
      "13px",

    lineHeight:
      1.3,

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


  // ====================================================
  // RATE
  // ====================================================

  rateGrid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap:
      "12px",
  },


  rateCard: {
    padding:
      "16px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "14px",

    background:
      "#ffffff",
  },


  rateHeader: {
    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",

    color:
      "#475569",
  },


  rateIcon: {
    width:
      "34px",

    height:
      "34px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    borderRadius:
      "9px",

    background:
      "#eff6ff",

    color:
      "#2563eb",
  },


  rateValue: {
    marginTop:
      "14px",

    fontSize:
      "28px",

    fontWeight:
      800,

    color:
      "#0f172a",
  },


  rateTrack: {
    height:
      "7px",

    marginTop:
      "10px",

    overflow:
      "hidden",

    borderRadius:
      "999px",

    background:
      "#e2e8f0",
  },


  rateFill: {
    height:
      "100%",

    borderRadius:
      "999px",

    background:
      "#2563eb",
  },


  rateDescription: {
    display:
      "block",

    marginTop:
      "8px",

    fontSize:
      "11px",

    lineHeight:
      1.4,

    color:
      "#94a3b8",
  },


  // ====================================================
  // CHART CONTAINERS
  // ====================================================

  largeChartCard: {
    padding:
      "20px",

    border:
      "1px solid #dbe5f1",

    borderRadius:
      "18px",

    background:
      "#ffffff",
  },


  largeChartWrapper: {
    width:
      "100%",

    height:
      "390px",
  },


  chartGrid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(360px,1fr))",

    gap:
      "14px",
  },


  chartCard: {
    padding:
      "20px",

    minWidth:
      0,

    border:
      "1px solid #dbe5f1",

    borderRadius:
      "18px",

    background:
      "#ffffff",
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


  cardHeader: {
    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "flex-start",

    gap:
      "12px",

    marginBottom:
      "18px",

    color:
      "#475569",
  },


  smallEyebrow: {
    display:
      "block",

    fontSize:
      "10px",

    fontWeight:
      800,

    letterSpacing:
      "0.9px",

    color:
      "#2563eb",
  },


  cardTitle: {
    margin:
      "4px 0 0",

    fontSize:
      "18px",

    color:
      "#0f172a",
  },


  cardDescription: {
    margin:
      "6px 0 0",

    fontSize:
      "11px",

    lineHeight:
      1.5,

    color:
      "#94a3b8",
  },


  // ====================================================
  // PIE
  // ====================================================

  pieWrapper: {
    position:
      "relative",

    width:
      "100%",

    height:
      "270px",
  },


  pieCenter: {
    position:
      "absolute",

    top:
      "50%",

    left:
      "50%",

    transform:
      "translate(-50%, -50%)",

    pointerEvents:
      "none",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "center",

    gap:
      "3px",

    color:
      "#64748b",
  },


  legendList: {
    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "9px",

    marginTop:
      "6px",
  },


  legendItem: {
    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "space-between",

    gap:
      "12px",

    padding:
      "8px 10px",

    borderRadius:
      "9px",

    background:
      "#f8fafc",

    color:
      "#475569",

    fontSize:
      "12px",
  },


  legendLeft: {
    display:
      "flex",

    alignItems:
      "center",

    gap:
      "8px",
  },


  legendDot: {
    width:
      "9px",

    height:
      "9px",

    flexShrink:
      0,

    borderRadius:
      "50%",
  },


  // ====================================================
  // TOOLTIP
  // ====================================================

  tooltip: {
    minWidth:
      "180px",

    padding:
      "12px",

    border:
      "1px solid #e2e8f0",

    borderRadius:
      "11px",

    background:
      "#ffffff",

    boxShadow:
      "0 10px 30px rgba(15,23,42,0.12)",
  },


  tooltipTitle: {
    display:
      "block",

    marginBottom:
      "9px",

    color:
      "#0f172a",

    fontSize:
      "12px",
  },


  tooltipRow: {
    display:
      "flex",

    alignItems:
      "center",

    gap:
      "7px",

    marginTop:
      "5px",

    fontSize:
      "11px",

    color:
      "#475569",
  },


  tooltipDot: {
    width:
      "8px",

    height:
      "8px",

    borderRadius:
      "50%",
  },


  tooltipLabel: {
    flex:
      1,
  },


  // ====================================================
  // FINAL STATUS
  // ====================================================

  statusCard: {
    padding:
      "20px",

    border:
      "1px solid #dbe5f1",

    borderRadius:
      "18px",

    background:
      "#ffffff",
  },


  finalStatusGrid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(170px,1fr))",

    gap:
      "10px",
  },


  finalStatusItem: {
    minHeight:
      "74px",

    padding:
      "13px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "7px",

    borderRadius:
      "12px",

    background:
      "#f8fafc",

    color:
      "#475569",
  },


  finalStatusLabel: {
    display:
      "block",

    fontSize:
      "12px",

    lineHeight:
      1.3,
  },


  finalStatusValue: {
    display:
      "block",

    fontSize:
      "22px",

    lineHeight:
      1,

    fontWeight:
      800,
  },


  finalSuccess: {
    background:
      "#ecfdf5",

    color:
      "#047857",
  },


  finalDanger: {
    background:
      "#fef2f2",

    color:
      "#b91c1c",
  },


  finalWarning: {
    background:
      "#fffbeb",

    color:
      "#b45309",
  },


  finalBlue: {
    background:
      "#eff6ff",

    color:
      "#2563eb",
  },


  // ====================================================
  // TABLE
  // ====================================================

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
      "1000px",

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

    verticalAlign:
      "middle",
  },


  subText: {
    display:
      "block",

    marginTop:
      "3px",

    color:
      "#94a3b8",
  },


  lockedBadge: {
    display:
      "inline-block",

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
  },


  openBadge: {
    display:
      "inline-block",

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
  },


  totalLabel: {
    padding:
      "6px 9px",

    borderRadius:
      "999px",

    background:
      "#eff6ff",

    color:
      "#2563eb",

    fontSize:
      "11px",

    fontWeight:
      700,
  },


  empty: {
    minHeight:
      "180px",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    padding:
      "30px",

    textAlign:
      "center",

    color:
      "#94a3b8",
  },

};


export default AnalyticsPage;