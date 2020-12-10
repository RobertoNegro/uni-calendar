/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 130001
 Source Host           : localhost:5432
 Source Catalog        : unicalendar
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 130001
 File Encoding         : 65001

 Date: 10/12/2020 15:32:43
*/


-- ----------------------------
-- Sequence structure for EmailNotification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."EmailNotification_id_seq";
CREATE SEQUENCE "public"."EmailNotification_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."EmailNotification_id_seq" OWNER TO "robertonegro";

-- ----------------------------
-- Sequence structure for FollowedCourse_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."FollowedCourse_id_seq";
CREATE SEQUENCE "public"."FollowedCourse_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."FollowedCourse_id_seq" OWNER TO "robertonegro";

-- ----------------------------
-- Sequence structure for TelegramNotification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TelegramNotification_id_seq";
CREATE SEQUENCE "public"."TelegramNotification_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."TelegramNotification_id_seq" OWNER TO "robertonegro";

-- ----------------------------
-- Sequence structure for User_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."User_id_seq";
CREATE SEQUENCE "public"."User_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."User_id_seq" OWNER TO "robertonegro";

-- ----------------------------
-- Sequence structure for User_universityId_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."User_universityId_seq";
CREATE SEQUENCE "public"."User_universityId_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."User_universityId_seq" OWNER TO "robertonegro";

-- ----------------------------
-- Table structure for EmailNotification
-- ----------------------------
DROP TABLE IF EXISTS "public"."EmailNotification";
CREATE TABLE "public"."EmailNotification" (
  "id" int4 NOT NULL DEFAULT nextval('"EmailNotification_id_seq"'::regclass),
  "followedCourseId" int4 NOT NULL,
  "time" date NOT NULL,
  "subject" varchar(65535) COLLATE "pg_catalog"."default" NOT NULL,
  "message" varchar(65535) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."EmailNotification" OWNER TO "robertonegro";

-- ----------------------------
-- Table structure for FollowedCourse
-- ----------------------------
DROP TABLE IF EXISTS "public"."FollowedCourse";
CREATE TABLE "public"."FollowedCourse" (
  "id" int4 NOT NULL DEFAULT nextval('"FollowedCourse_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "courseId" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "universitySlug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "asynchronous" bool NOT NULL,
  "link" varchar(255) COLLATE "pg_catalog"."default",
  "bgColour" varchar(9) COLLATE "pg_catalog"."default",
  "fgColour" varchar(9) COLLATE "pg_catalog"."default",
  "notifyBefore" int8,
  "notifyEmail" varchar(255) COLLATE "pg_catalog"."default",
  "notifyTelegram" bool
)
;
ALTER TABLE "public"."FollowedCourse" OWNER TO "robertonegro";

-- ----------------------------
-- Table structure for TelegramNotification
-- ----------------------------
DROP TABLE IF EXISTS "public"."TelegramNotification";
CREATE TABLE "public"."TelegramNotification" (
  "id" int4 NOT NULL DEFAULT nextval('"TelegramNotification_id_seq"'::regclass),
  "followedCourseId" int4 NOT NULL,
  "time" date NOT NULL,
  "message" varchar(65535) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."TelegramNotification" OWNER TO "robertonegro";

-- ----------------------------
-- Table structure for University
-- ----------------------------
DROP TABLE IF EXISTS "public"."University";
CREATE TABLE "public"."University" (
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "shortName" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "fullName" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "serverURI" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."University" OWNER TO "robertonegro";

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "public"."User";
CREATE TABLE "public"."User" (
  "id" int4 NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
  "googleId" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "universitySlug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT nextval('"User_universityId_seq"'::regclass),
  "telegramToken" varchar(255) COLLATE "pg_catalog"."default",
  "firstName" varchar(255) COLLATE "pg_catalog"."default",
  "lastName" varchar(255) COLLATE "pg_catalog"."default",
  "picture" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."User" OWNER TO "robertonegro";

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."EmailNotification_id_seq"
OWNED BY "public"."EmailNotification"."id";
SELECT setval('"public"."EmailNotification_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."FollowedCourse_id_seq"
OWNED BY "public"."FollowedCourse"."id";
SELECT setval('"public"."FollowedCourse_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TelegramNotification_id_seq"
OWNED BY "public"."TelegramNotification"."id";
SELECT setval('"public"."TelegramNotification_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."User_id_seq"
OWNED BY "public"."User"."id";
SELECT setval('"public"."User_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."User_universityId_seq"
OWNED BY "public"."User"."universitySlug";
SELECT setval('"public"."User_universityId_seq"', 2, false);

-- ----------------------------
-- Primary Key structure for table EmailNotification
-- ----------------------------
ALTER TABLE "public"."EmailNotification" ADD CONSTRAINT "EmailNotification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table FollowedCourse
-- ----------------------------
ALTER TABLE "public"."FollowedCourse" ADD CONSTRAINT "FollowedCourse_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table TelegramNotification
-- ----------------------------
ALTER TABLE "public"."TelegramNotification" ADD CONSTRAINT "TelegramNotification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table University
-- ----------------------------
ALTER TABLE "public"."University" ADD CONSTRAINT "University_pkey" PRIMARY KEY ("slug");

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table EmailNotification
-- ----------------------------
ALTER TABLE "public"."EmailNotification" ADD CONSTRAINT "fkFollowedCourseId" FOREIGN KEY ("followedCourseId") REFERENCES "public"."FollowedCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table FollowedCourse
-- ----------------------------
ALTER TABLE "public"."FollowedCourse" ADD CONSTRAINT "fkUniversitySlug" FOREIGN KEY ("universitySlug") REFERENCES "public"."University" ("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."FollowedCourse" ADD CONSTRAINT "fkUserId" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TelegramNotification
-- ----------------------------
ALTER TABLE "public"."TelegramNotification" ADD CONSTRAINT "fkFollowedCourseId" FOREIGN KEY ("followedCourseId") REFERENCES "public"."FollowedCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "fkUniversitySlug" FOREIGN KEY ("universitySlug") REFERENCES "public"."University" ("slug") ON DELETE CASCADE ON UPDATE CASCADE;
