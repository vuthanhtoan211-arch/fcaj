// =========================================
// PERMISSION CONFIGURATION
//
// Quyền truy cập trang và quyền thao tác
// được tách riêng.
//
// Có thể nhìn thấy một trang KHÔNG đồng nghĩa
// với việc được phép thực hiện mọi thao tác
// trên trang đó.
//
// Hệ thống hiện chỉ có 2 vai trò:
// - ADMIN
// - STUDENT
// =========================================


// =========================================
// PERMISSIONS
// =========================================

export const PERMISSIONS =
  Object.freeze({

    // =====================================
    // GENERAL
    // =====================================

    HOME_VIEW:
      "home.view",

    ACTIVITIES_VIEW:
      "activities.view",

    ANALYTICS_VIEW:
      "analytics.view",

    NOTIFICATIONS_VIEW:
      "notifications.view",

    PROFILE_VIEW:
      "profile.view",


    // =====================================
    // ACTIVITY MANAGEMENT
    // =====================================

    ACTIVITY_CREATE:
      "activities.create",

    ACTIVITY_EDIT:
      "activities.edit",

    ACTIVITY_SUBMIT:
      "activities.submit",

    ACTIVITY_APPROVE:
      "activities.approve",

    ACTIVITY_PUBLISH:
      "activities.publish",

    ACTIVITY_CANCEL:
      "activities.cancel",

    ACTIVITY_FEATURE:
      "activities.feature",


    // =====================================
    // DATA IMPORT
    // =====================================

    IMPORT_VIEW:
      "import.view",

    REGISTRATION_IMPORT:
      "registrations.import",

    EVIDENCE_IMPORT:
      "evidence.import",


    // =====================================
    // ATTENDANCE
    // =====================================

    ATTENDANCE_VIEW:
      "attendance.view",

    ATTENDANCE_CHECK_IN:
      "attendance.checkin",

    ATTENDANCE_CHECK_OUT:
      "attendance.checkout",

    ATTENDANCE_CHECKOUT_CONTROL:
      "attendance.checkout_control",


    // =====================================
    // RECONCILIATION
    // =====================================

    RECONCILIATION_VIEW:
      "reconciliation.view",

    RECONCILIATION_RUN:
      "reconciliation.run",

    RECONCILIATION_DECIDE:
      "reconciliation.decide",

    FINAL_VIEW:
      "final.view",

    FINALIZE:
      "final.finalize",


    // =====================================
    // EXPORT
    // =====================================

    EXPORT_VIEW:
      "export.view",

    EXPORT_USE:
      "export.use",


    // =====================================
    // STUDENT ACCOUNT MANAGEMENT
    // =====================================

    ACCOUNTS_VIEW:
      "accounts.view",


    // =====================================
    // STUDENT PERSONAL DATA
    // =====================================

    MY_RESULTS_VIEW:
      "my_results.view",

  });


// =========================================
// ROLE PERMISSIONS
// =========================================
//
// Hệ thống chỉ còn 2 vai trò:
//
// ADMIN
// - Quản lý toàn bộ hoạt động
// - Import dữ liệu
// - Check-in / Check-out
// - Đối soát
// - Chốt danh sách
// - Xuất dữ liệu
// - Quản lý tài khoản sinh viên
//
// STUDENT
// - Xem các chức năng dành cho sinh viên
// - Không được truy cập các chức năng quản trị
// =========================================

const ROLE_PERMISSIONS = {

  // =======================================
  // STUDENT
  // =======================================

  STUDENT:
    new Set([

      PERMISSIONS.HOME_VIEW,

      PERMISSIONS.ACTIVITIES_VIEW,

      PERMISSIONS.MY_RESULTS_VIEW,

      PERMISSIONS.ANALYTICS_VIEW,

      PERMISSIONS.NOTIFICATIONS_VIEW,

      PERMISSIONS.PROFILE_VIEW,

    ]),


  // =======================================
  // ADMIN
  // =======================================

  ADMIN:
    new Set([

      // -----------------------------------
      // General
      // -----------------------------------

      PERMISSIONS.HOME_VIEW,

      PERMISSIONS.ACTIVITIES_VIEW,

      PERMISSIONS.ANALYTICS_VIEW,

      PERMISSIONS.NOTIFICATIONS_VIEW,

      PERMISSIONS.PROFILE_VIEW,


      // -----------------------------------
      // Activity management
      // -----------------------------------

      PERMISSIONS.ACTIVITY_CREATE,

      PERMISSIONS.ACTIVITY_EDIT,

      PERMISSIONS.ACTIVITY_SUBMIT,

      PERMISSIONS.ACTIVITY_APPROVE,

      PERMISSIONS.ACTIVITY_PUBLISH,

      PERMISSIONS.ACTIVITY_CANCEL,

      PERMISSIONS.ACTIVITY_FEATURE,


      // -----------------------------------
      // Import
      // -----------------------------------

      PERMISSIONS.IMPORT_VIEW,

      PERMISSIONS.REGISTRATION_IMPORT,

      PERMISSIONS.EVIDENCE_IMPORT,


      // -----------------------------------
      // Attendance
      // -----------------------------------

      PERMISSIONS.ATTENDANCE_VIEW,

      PERMISSIONS.ATTENDANCE_CHECK_IN,

      PERMISSIONS.ATTENDANCE_CHECK_OUT,

      PERMISSIONS.ATTENDANCE_CHECKOUT_CONTROL,


      // -----------------------------------
      // Reconciliation
      // -----------------------------------

      PERMISSIONS.RECONCILIATION_VIEW,

      PERMISSIONS.RECONCILIATION_RUN,

      PERMISSIONS.RECONCILIATION_DECIDE,

      PERMISSIONS.FINAL_VIEW,

      PERMISSIONS.FINALIZE,


      // -----------------------------------
      // Export
      // -----------------------------------

      PERMISSIONS.EXPORT_VIEW,

      PERMISSIONS.EXPORT_USE,


      // -----------------------------------
      // Student account management
      // -----------------------------------

      PERMISSIONS.ACCOUNTS_VIEW,

    ]),

};


// =========================================
// PAGE PERMISSIONS
// =========================================

export const PAGE_PERMISSIONS =
  Object.freeze({

    home:
      PERMISSIONS.HOME_VIEW,

    activities:
      PERMISSIONS.ACTIVITIES_VIEW,

    import:
      PERMISSIONS.IMPORT_VIEW,

    attendance:
      PERMISSIONS.ATTENDANCE_VIEW,

    reconciliation:
      PERMISSIONS.RECONCILIATION_VIEW,

    final:
      PERMISSIONS.FINAL_VIEW,

    export:
      PERMISSIONS.EXPORT_VIEW,

    analytics:
      PERMISSIONS.ANALYTICS_VIEW,

    accounts:
      PERMISSIONS.ACCOUNTS_VIEW,

    "admin-users":
      PERMISSIONS.ACCOUNTS_VIEW,

    "my-results":
      PERMISSIONS.MY_RESULTS_VIEW,

    profile:
      PERMISSIONS.PROFILE_VIEW,

  });


// =========================================
// NORMALIZE ROLE
// =========================================

function normalizeRole(
  role
) {

  return String(
    role || ""
  )
    .trim()
    .toUpperCase();

}


// =========================================
// CAN
// =========================================

export function can(
  role,
  permission
) {

  const normalizedRole =
    normalizeRole(
      role
    );


  const permissions =
    ROLE_PERMISSIONS[
      normalizedRole
    ];


  if (!permissions) {

    return false;

  }


  return permissions.has(
    permission
  );

}


// =========================================
// CAN ACCESS PAGE
// =========================================

export function canAccessPage(
  role,
  pageId
) {

  const permission =
    PAGE_PERMISSIONS[
      pageId
    ];


  if (!permission) {

    return false;

  }


  return can(
    role,
    permission
  );

}


// =========================================
// FILTER MENU
// =========================================

export function filterMenuByRole(
  role,
  menuItems
) {

  if (
    !Array.isArray(
      menuItems
    )
  ) {

    return [];

  }


  return menuItems.filter(
    (item) =>
      canAccessPage(
        role,
        item.id
      )
  );

}


// =========================================
// ROLE HELPERS
// =========================================

export function roleLabel(
  role
) {

  const normalized =
    normalizeRole(
      role
    );


  const labels = {

    STUDENT:
      "Sinh viên",

    ADMIN:
      "Quản trị viên",

  };


  return (
    labels[
      normalized
    ]
    ||
    normalized
    ||
    "Người dùng"
  );

}
