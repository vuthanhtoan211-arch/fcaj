
export const ASSETS = {
  huflit:
    "/images/logos/huflit-logo.png",

  doan:
    "/images/logos/doan-logo.png",

  itdayLogo:
    "/images/logos/itday-logo.jpg",

  techconnectLogo:
    "/images/logos/techconnect-logo.jpg",

  awsPoster:
    "/images/activities/aws-workshop.jpg",

  politicalPoster:
    "/images/activities/sinh-hoat-chinh-tri.jpg",

  itdayPoster:
    "/images/activities/it-day.jpg",

  techconnectPoster:
    "/images/activities/techconnect.jpg",

  biThu:
    "/images/hero/hero-1.jpg",

  phoBiThu:
    "/images/hero/hero-2.jpg",
};


export const heroSlides = [
  {
    id:
      "system",

    visualType:
      "logo",

    eyebrow:
      "ĐOÀN KHOA CÔNG NGHỆ THÔNG TIN · HUFLIT",

    title:
      "Một nơi quản lý, nhiều trải nghiệm sinh viên",

    description:
      (
        "Theo dõi hoạt động, điểm danh "
        + "và kết quả tham gia trong một "
        + "không gian làm việc thống nhất."
      ),

    label:
      "Hệ thống quản lý hoạt động sinh viên",

    logo:
      ASSETS.huflit,

    logoAlt:
      "Logo HUFLIT",

    mark:
      "HUFLIT",
  },


  {
    id:
      "youth-union",

    visualType:
      "logo",

    eyebrow:
      "HOẠT ĐỘNG ĐOÀN – HỘI",

    title:
      "Kết nối sinh viên qua từng hoạt động",

    description:
      (
        "Từ sinh hoạt chính trị đến các "
        + "chương trình học thuật và phong "
        + "trào, mọi thông tin được theo dõi "
        + "rõ ràng."
      ),

    label:
      "Đoàn Khoa Công nghệ Thông tin",

    logo:
      ASSETS.doan,

    logoAlt:
      "Logo Đoàn Thanh niên",

    mark:
      "ĐOÀN – HỘI",
  },


  {
    id:
      "itday",

    visualType:
      "feature",

    imageMode:
      "program",

    eyebrow:
      "CHƯƠNG TRÌNH THƯỜNG NIÊN",

    tag:
      "ITDAY",

    title:
      "ITDAY – Ngày hội của sinh viên công nghệ",

    description:
      (
        "Không gian học thuật, sáng tạo, "
        + "trải nghiệm công nghệ và kết nối "
        + "cộng đồng sinh viên Công nghệ "
        + "Thông tin."
      ),

    label:
      "Ngày hội Công nghệ Thông tin",

    image:
      ASSETS.itdayLogo,

    backdrop:
      ASSETS.itdayPoster,

    imageAlt:
      "Logo ITDAY",

    fallbackImage:
      ASSETS.huflit,

    mark:
      "ITDAY",

    visualLabel:
      "NGÀY HỘI CÔNG NGHỆ THÔNG TIN",
  },


  {
    id:
      "techconnect",

    visualType:
      "feature",

    imageMode:
      "program",

    eyebrow:
      "CHUỖI HOẠT ĐỘNG CÔNG NGHỆ",

    tag:
      "TECHCONNECT",

    title:
      "TechConnect – Kết nối tri thức số",

    description:
      (
        "Cùng sinh viên khám phá công nghệ, "
        + "chia sẻ kiến thức và phát triển "
        + "kỹ năng qua các hoạt động kết nối "
        + "thực tế."
      ),

    label:
      "Chuỗi hoạt động TechConnect",

    image:
      ASSETS.techconnectLogo,

    backdrop:
      ASSETS.techconnectPoster,

    imageAlt:
      "Logo TechConnect",

    fallbackImage:
      ASSETS.huflit,

    mark:
      "TECHCONNECT",

    visualLabel:
      "KẾT NỐI · CÔNG NGHỆ · TRI THỨC",
  },


  {
    id:
      "bi-thu",

    visualType:
      "feature",

    imageMode:
      "portrait",

    eyebrow:
      "BAN CHẤP HÀNH ĐOÀN KHOA CNTT",

    tag:
      "BÍ THƯ",

    title:
      "Bí thư Đoàn Khoa Công nghệ Thông tin",

    description:
      (
        "Đồng hành cùng sinh viên trong các "
        + "hoạt động Đoàn – Hội, học thuật, "
        + "phong trào và kết nối cộng đồng."
      ),

    label:
      "Bí thư Đoàn Khoa",

    image:
      ASSETS.biThu,

    imageFallbacks: [
      "/images/banner-bi-thu.jpg",
    ],

    imageAlt:
      "Bí thư Đoàn Khoa Công nghệ Thông tin",

    fallbackImage:
      ASSETS.doan,

    mark:
      "BÍ THƯ",

    visualLabel:
      "ĐOÀN KHOA CÔNG NGHỆ THÔNG TIN",
  },


  {
    id:
      "pho-bi-thu",

    visualType:
      "feature",

    imageMode:
      "portrait",

    eyebrow:
      "BAN CHẤP HÀNH ĐOÀN KHOA CNTT",

    tag:
      "PHÓ BÍ THƯ",

    title:
      "Phó Bí thư Đoàn Khoa Công nghệ Thông tin",

    description:
      (
        "Cùng Ban Chấp hành tổ chức và "
        + "phát triển các chương trình "
        + "dành cho sinh viên Khoa Công "
        + "nghệ Thông tin."
      ),

    label:
      "Phó Bí thư Đoàn Khoa",

    image:
      ASSETS.phoBiThu,

    imageFallbacks: [
      "/images/banner-pho-bi-thu.jpg",
    ],

    imageAlt:
      "Phó Bí thư Đoàn Khoa Công nghệ Thông tin",

    fallbackImage:
      ASSETS.doan,

    mark:
      "PHÓ BÍ THƯ",

    visualLabel:
      "ĐOÀN KHOA CÔNG NGHỆ THÔNG TIN",
  },
];


// Chỉ dùng nếu backend offline.
// Khi backend chạy, mục nổi bật lấy
// trực tiếp từ activity.is_featured.

export const featuredPrograms = [
  {
    id:
      "political",

    category:
      "Đoàn – Hội",

    title:
      "Sinh hoạt chính trị",

    description:
      (
        "Các chương trình sinh hoạt "
        + "và hoạt động Đoàn của "
        + "Đoàn Khoa CNTT."
      ),

    image:
      ASSETS.politicalPoster,

    date:
      "15/10/2026",

    location:
      "Hội trường HUFLIT",
  },

  {
    id:
      "itday",

    category:
      "Sự kiện thường niên",

    title:
      "ITDAY",

    description:
      (
        "Ngày hội học thuật, sáng tạo "
        + "và kết nối sinh viên CNTT."
      ),

    image:
      ASSETS.itdayPoster,

    date:
      "20/11/2026",

    location:
      "HUFLIT",
  },

  {
    id:
      "techconnect",

    category:
      "Kết nối công nghệ",

    title:
      "TechConnect",

    description:
      (
        "Chuỗi hoạt động chia sẻ kiến "
        + "thức và trải nghiệm công nghệ."
      ),

    image:
      ASSETS.techconnectPoster,

    date:
      "08/12/2026",

    location:
      "HUFLIT",
  },
];


export const demoActivities = [
  {
    activity_id:
      "ACT#AWS2026",

    activity_name:
      "AWS Cloud Workshop",

    activity_type:
      "WORKSHOP",

    start_time:
      "2026-10-10T08:00:00+07:00",

    location:
      "Phòng Lab",

    capacity:
      200,

    status:
      "ACTIVE",

    poster:
      ASSETS.awsPoster,
  },


  {
    activity_id:
      "ACT#POLI2026",

    activity_name:
      "Chuyên đề tháng 10",

    activity_type:
      "POLITICAL",

    start_time:
      "2026-10-15T08:00:00+07:00",

    location:
      "Hội trường HUFLIT",

    capacity:
      180,

    status:
      "UPCOMING",

    poster:
      ASSETS.politicalPoster,
  },


  {
    activity_id:
      "ACT#ITDAY2026",

    activity_name:
      "ITDAY 2026",

    activity_type:
      "ANNUAL",

    start_time:
      "2026-11-20T08:00:00+07:00",

    location:
      "Khuôn viên HUFLIT",

    capacity:
      1000,

    status:
      "UPCOMING",

    poster:
      ASSETS.itdayPoster,
  },


  {
    activity_id:
      "ACT#TECH2026",

    activity_name:
      "TechConnect 2026",

    activity_type:
      "TECHNOLOGY",

    start_time:
      "2026-12-08T08:00:00+07:00",

    location:
      "HUFLIT",

    capacity:
      1200,

    status:
      "UPCOMING",

    poster:
      ASSETS.techconnectPoster,
  },
];
