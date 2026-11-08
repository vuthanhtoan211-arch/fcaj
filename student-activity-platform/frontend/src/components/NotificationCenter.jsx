import {

  useCallback,

  useEffect,

  useRef,

  useState,

} from "react";



import {

  Bell,

  CalendarDays,

  CheckCheck,

  CircleCheck,

  CircleDot,

  Inbox,

  RefreshCw,

  X,

} from "lucide-react";



import {

  getNotifications,

  markAllNotificationsRead,

  markNotificationRead,

} from "../services/notifications";





function formatNotificationTime(

  value

) {

  if (!value) {

    return "";

  }



  const date =

    new Date(value);



  if (

    Number.isNaN(

      date.getTime()

    )

  ) {

    return "";

  }



  return new Intl.DateTimeFormat(

    "vi-VN",

    {

      day: "2-digit",

      month: "2-digit",

      hour: "2-digit",

      minute: "2-digit",

    }

  ).format(date);

}





function categoryIcon(

  category

) {

  const value =

    String(

      category || ""

    ).toUpperCase();



  if (

    value === "RESULT"

    || value === "FINAL"

  ) {

    return CircleCheck;

  }



  if (

    value === "ACTIVITY"

    || value === "REMINDER"

    || value === "REGISTRATION"

  ) {

    return CalendarDays;

  }



  return CircleDot;

}





function NotificationCenter({
  onNotificationClick,
}) {

  const [open, setOpen] =

    useState(false);



  const [loading, setLoading] =

    useState(false);



  const [rows, setRows] =

    useState([]);



  const [unreadCount, setUnreadCount] =

    useState(0);



  const [error, setError] =

    useState("");



  const wrapRef =

    useRef(null);





  const load =

    useCallback(

      async (

        showLoading = false

      ) => {

        try {

          if (showLoading) {

            setLoading(true);

          }



          const result =

            await getNotifications(30);



          setRows(

            Array.isArray(result?.data)

              ? result.data

              : []

          );



          setUnreadCount(

            Number(

              result?.unread_count

              || 0

            )

          );



          setError("");

        } catch (loadError) {

          console.error(

            "Notification error:",

            loadError

          );



          if (showLoading) {

            setError(

              loadError?.message

              || "Không thể tải thông báo."

            );

          }

        } finally {

          if (showLoading) {

            setLoading(false);

          }

        }

      },

      []

    );





  useEffect(() => {

    load(false);



    const timer =

      window.setInterval(

        () => load(false),

        15000

      );



    return () =>

      window.clearInterval(

        timer

      );

  }, [load]);





  useEffect(() => {

    function handleOutsideClick(

      event

    ) {

      if (

        wrapRef.current

        && !wrapRef.current.contains(

          event.target

        )

      ) {

        setOpen(false);

      }

    }



    document.addEventListener(

      "mousedown",

      handleOutsideClick

    );



    return () =>

      document.removeEventListener(

        "mousedown",

        handleOutsideClick

      );

  }, []);





  async function toggleOpen() {

    const nextOpen =

      !open;



    setOpen(nextOpen);



    if (nextOpen) {

      await load(true);

    }

  }





  async function handleRead(

    item

  ) {

    if (item.is_read) {

      return;

    }



    try {

      await markNotificationRead(

        item.notification_id

      );



      setRows(

        (current) =>

          current.map(

            (row) =>

              row.notification_id

              === item.notification_id

                ? {

                    ...row,

                    is_read: true,

                  }

                : row

          )

      );



      setUnreadCount(

        (current) =>

          Math.max(

            0,

            current - 1

          )

      );

    } catch (readError) {

      setError(

        readError?.message

        || "Không thể cập nhật thông báo."

      );

    }

  }





  async function handleItemClick(
    item
  ) {
    await handleRead(item);

    setOpen(false);

    if (
      typeof onNotificationClick === "function"
    ) {
      onNotificationClick(item);
    }
  }



  async function handleReadAll() {

    if (unreadCount <= 0) {

      return;

    }



    try {

      await markAllNotificationsRead();



      setRows(

        (current) =>

          current.map(

            (row) => ({

              ...row,

              is_read: true,

            }))

      );



      setUnreadCount(0);

    } catch (readError) {

      setError(

        readError?.message

        || "Không thể đánh dấu tất cả đã đọc."

      );

    }

  }





  return (

    <div

      ref={wrapRef}

      style={styles.wrap}

    >

      <button

        type="button"

        aria-label="Thông báo"

        title="Thông báo"

        onClick={toggleOpen}

        style={styles.bellButton}

      >

        <Bell size={18} />



        {unreadCount > 0 && (

          <span

            style={styles.badge}

          >

            {unreadCount > 99

              ? "99+"

              : unreadCount}

          </span>

        )}

      </button>



      {open && (

        <div

          style={styles.panel}

        >

          <div

            style={styles.header}

          >

            <div>

              <span

                style={styles.eyebrow}

              >

                TRUNG TÂM THÔNG BÁO

              </span>



              <h3

                style={styles.title}

              >

                Thông báo

              </h3>

            </div>



            <div

              style={styles.headerActions}

            >

              <button

                type="button"

                title="Tải lại"

                onClick={() => load(true)}

                style={styles.smallButton}

              >

                <RefreshCw size={15} />

              </button>



              <button

                type="button"

                title="Đóng"

                onClick={() => setOpen(false)}

                style={styles.smallButton}

              >

                <X size={16} />

              </button>

            </div>

          </div>



          <div

            style={styles.summary}

          >

            <span>

              {unreadCount > 0

                ? `${unreadCount} thông báo chưa đọc`

                : "Bạn đã đọc hết thông báo"}

            </span>



            <button

              type="button"

              onClick={handleReadAll}

              disabled={unreadCount <= 0}

              style={{

                ...styles.readAllButton,

                ...(unreadCount <= 0

                  ? styles.disabled

                  : {}),

              }}

            >

              <CheckCheck size={14} />

              Đọc tất cả

            </button>

          </div>



          {error && (

            <div

              style={styles.error}

            >

              {error}

            </div>

          )}



          <div

            style={styles.list}

          >

            {loading && rows.length === 0 ? (

              <div

                style={styles.empty}

              >

                <RefreshCw

                  size={21}

                />

                Đang tải thông báo...

              </div>

            ) : rows.length === 0 ? (

              <div

                style={styles.empty}

              >

                <Inbox size={26} />



                <strong>

                  Chưa có thông báo

                </strong>



                <span>

                  Thông báo hoạt động, đăng ký,

                  nhắc lịch và kết quả sẽ xuất hiện tại đây.

                </span>

              </div>

            ) : (

              rows.map(

                (item) => {

                  const Icon =

                    categoryIcon(

                      item.category

                    );



                  return (

                    <button

                      type="button"

                      key={item.notification_id}

                      onClick={() =>

                        handleRead(item)

                      }

                      style={{

                        ...styles.item,

                        ...(!item.is_read

                          ? styles.unreadItem

                          : {}),

                      }}

                    >

                      <span

                        style={styles.itemIcon}

                      >

                        <Icon size={17} />

                      </span>



                      <span

                        style={styles.itemBody}

                      >

                        <span

                          style={styles.itemTitleRow}

                        >

                          <strong>

                            {item.title}

                          </strong>



                          {!item.is_read && (

                            <i

                              style={styles.unreadDot}

                            />

                          )}

                        </span>



                        <span

                          style={styles.itemMessage}

                        >

                          {item.message}

                        </span>



                        <span

                          style={styles.itemTime}

                        >

                          {formatNotificationTime(

                            item.created_at

                          )}

                        </span>

                      </span>

                    </button>

                  );

                }

              )

            )}

          </div>

        </div>

      )}

    </div>

  );

}





const styles = {

  wrap: {

    position: "relative",

  },



  bellButton: {

    position: "relative",

    width: 39,

    height: 39,

    display: "grid",

    placeItems: "center",

    border: "1px solid #dce7f3",

    borderRadius: 11,

    background: "#ffffff",

    color: "#4b6079",

    cursor: "pointer",

  },



  badge: {

    position: "absolute",

    top: -6,

    right: -7,

    minWidth: 19,

    height: 19,

    padding: "0 5px",

    display: "grid",

    placeItems: "center",

    border: "2px solid #ffffff",

    borderRadius: 999,

    background: "#dc2626",

    color: "#ffffff",

    fontSize: 8,

    fontWeight: 800,

  },



  panel: {

    position: "absolute",

    top: 48,

    right: 0,

    zIndex: 300,

    width: "min(420px, calc(100vw - 28px))",

    overflow: "hidden",

    border: "1px solid #dbe6f2",

    borderRadius: 17,

    background: "#ffffff",

    boxShadow: "0 24px 55px rgba(28, 57, 96, 0.20)",

  },



  header: {

    padding: "16px 17px 13px",

    display: "flex",

    alignItems: "flex-start",

    justifyContent: "space-between",

    gap: 12,

    borderBottom: "1px solid #edf2f7",

  },



  eyebrow: {

    color: "#2563b7",

    fontSize: 8,

    fontWeight: 800,

    letterSpacing: "0.11em",

  },



  title: {

    margin: "4px 0 0",

    color: "#172b46",

    fontSize: 18,

  },



  headerActions: {

    display: "flex",

    gap: 7,

  },



  smallButton: {

    width: 32,

    height: 32,

    display: "grid",

    placeItems: "center",

    border: "1px solid #dce6f0",

    borderRadius: 9,

    background: "#ffffff",

    color: "#5c7088",

    cursor: "pointer",

  },



  summary: {

    padding: "10px 17px",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: 10,

    background: "#f8fbff",

    color: "#6a7d93",

    fontSize: 10,

  },



  readAllButton: {

    padding: 0,

    display: "inline-flex",

    alignItems: "center",

    gap: 5,

    border: 0,

    background: "transparent",

    color: "#2368ba",

    fontSize: 10,

    fontWeight: 800,

    cursor: "pointer",

  },



  disabled: {

    opacity: 0.45,

    cursor: "default",

  },



  error: {

    margin: "10px 12px 0",

    padding: "9px 10px",

    border: "1px solid #fecaca",

    borderRadius: 9,

    background: "#fef2f2",

    color: "#b91c1c",

    fontSize: 10,

  },



  list: {

    maxHeight: 430,

    overflowY: "auto",

  },



  item: {

    width: "100%",

    padding: "13px 15px",

    display: "flex",

    alignItems: "flex-start",

    gap: 11,

    border: 0,

    borderBottom: "1px solid #eef3f8",

    background: "#ffffff",

    textAlign: "left",

    cursor: "pointer",

  },



  unreadItem: {

    background: "#f3f8ff",

  },



  itemIcon: {

    width: 34,

    height: 34,

    flex: "0 0 34px",

    display: "grid",

    placeItems: "center",

    borderRadius: 10,

    background: "#e5f0ff",

    color: "#2167bd",

  },



  itemBody: {

    minWidth: 0,

    flex: 1,

    display: "grid",

    gap: 5,

  },



  itemTitleRow: {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: 8,

    color: "#223750",

    fontSize: 11,

  },



  unreadDot: {

    width: 7,

    height: 7,

    flex: "0 0 7px",

    borderRadius: "50%",

    background: "#2563eb",

  },



  itemMessage: {

    color: "#63758b",

    fontSize: 10,

    lineHeight: 1.55,

  },



  itemTime: {

    color: "#9aa8b8",

    fontSize: 8,

  },



  empty: {

    minHeight: 180,

    padding: 24,

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    color: "#8090a4",

    textAlign: "center",

    fontSize: 10,

    lineHeight: 1.6,

  },

};





export default NotificationCenter;
