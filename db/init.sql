DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

SET TIMEZONE='Europe/Rome';

-- ----------------------------
-- Sequence structure for EmailNotification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "EmailNotification_id_seq";
CREATE SEQUENCE "EmailNotification_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for FollowedCourse_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "FollowedCourse_id_seq";
CREATE SEQUENCE "FollowedCourse_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TelegramNotification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "TelegramNotification_id_seq";
CREATE SEQUENCE "TelegramNotification_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for User_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "User_id_seq";
CREATE SEQUENCE "User_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for User_universityId_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "User_universityId_seq";
CREATE SEQUENCE "User_universityId_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for EmailNotification
-- ----------------------------
DROP TABLE IF EXISTS "EmailNotification";
CREATE TABLE "EmailNotification" (
  "id" int4 NOT NULL DEFAULT nextval('"EmailNotification_id_seq"'::regclass),
  "followedCourseId" int4 NOT NULL,
  "time" timestamp(6) NOT NULL,
  "subject" varchar(65535) COLLATE "pg_catalog"."default" NOT NULL,
  "message" varchar(65535) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for FollowedCourse
-- ----------------------------
DROP TABLE IF EXISTS "FollowedCourse";
CREATE TABLE "FollowedCourse" (
  "id" int4 NOT NULL DEFAULT nextval('"FollowedCourse_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "courseId" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "universitySlug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "asynchronous" bool NOT NULL DEFAULT FALSE,
  "link" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "colourId" varchar(9) NOT NULL COLLATE "pg_catalog"."default" DEFAULT '0',
  "notifyBefore" int4 NOT NULL DEFAULT 5,
  "notifyEmail" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL,
  "notifyTelegram" bool NOT NULL DEFAULT FALSE
)
;

-- ----------------------------
-- Table structure for TelegramNotification
-- ----------------------------
DROP TABLE IF EXISTS "TelegramNotification";
CREATE TABLE "TelegramNotification" (
  "id" int4 NOT NULL DEFAULT nextval('"TelegramNotification_id_seq"'::regclass),
  "followedCourseId" int4 NOT NULL,
  "time" timestamp(6) NOT NULL,
  "message" varchar(65535) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for University
-- ----------------------------
DROP TABLE IF EXISTS "University";
CREATE TABLE "University" (
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "shortName" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "fullName" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "serverURI" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "lastActivity" timestamp(6) NOT NULL DEFAULT NOW()
)
;

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "User";
CREATE TABLE "User" (
  "id" int4 NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "googleAccessToken" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "googleExpiringTime" timestamp(6) NOT NULL,
  "googleRefreshToken" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "universitySlug" varchar(255) COLLATE "pg_catalog"."default",
  "telegramToken" varchar(255) COLLATE "pg_catalog"."default",
  "firstName" varchar(255) COLLATE "pg_catalog"."default",
  "lastName" varchar(255) COLLATE "pg_catalog"."default",
  "picture" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "EmailNotification_id_seq"
OWNED BY "EmailNotification"."id";
SELECT setval('"EmailNotification_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "FollowedCourse_id_seq"
OWNED BY "FollowedCourse"."id";
SELECT setval('"FollowedCourse_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "TelegramNotification_id_seq"
OWNED BY "TelegramNotification"."id";
SELECT setval('"TelegramNotification_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "User_id_seq"
OWNED BY "User"."id";
SELECT setval('"User_id_seq"', 2, false);

-- ----------------------------
-- Primary Key structure for table EmailNotification
-- ----------------------------
ALTER TABLE "EmailNotification" ADD CONSTRAINT "EmailNotification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table FollowedCourse
-- ----------------------------
ALTER TABLE "FollowedCourse" ADD CONSTRAINT "FollowedCourse_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table TelegramNotification
-- ----------------------------
ALTER TABLE "TelegramNotification" ADD CONSTRAINT "TelegramNotification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table University
-- ----------------------------
ALTER TABLE "University" ADD CONSTRAINT "University_pkey" PRIMARY KEY ("slug");

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table EmailNotification
-- ----------------------------
ALTER TABLE "EmailNotification" ADD CONSTRAINT "fkFollowedCourseId" FOREIGN KEY ("followedCourseId") REFERENCES "FollowedCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table FollowedCourse
-- ----------------------------
ALTER TABLE "FollowedCourse" ADD CONSTRAINT "fkUniversitySlug" FOREIGN KEY ("universitySlug") REFERENCES "University" ("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FollowedCourse" ADD CONSTRAINT "fkUserId" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TelegramNotification
-- ----------------------------
ALTER TABLE "TelegramNotification" ADD CONSTRAINT "fkFollowedCourseId" FOREIGN KEY ("followedCourseId") REFERENCES "FollowedCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table User
-- ----------------------------
ALTER TABLE "User" ADD CONSTRAINT "fkUniversitySlug" FOREIGN KEY ("universitySlug") REFERENCES "University" ("slug") ON DELETE CASCADE ON UPDATE CASCADE;
