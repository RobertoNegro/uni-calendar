DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

SET TIMEZONE='Europe/Rome';

-- ----------------------------
-- Sequence structure for Course_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "Course_id_seq";
CREATE SEQUENCE "Course_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Event_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "Event_id_seq";
CREATE SEQUENCE "Event_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for Course
-- ----------------------------
DROP TABLE IF EXISTS "Course";
CREATE TABLE "Course" (
  "id" int4 NOT NULL DEFAULT nextval('"Course_id_seq"'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "professor" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for Event
-- ----------------------------
DROP TABLE IF EXISTS "Event";
CREATE TABLE "Event" (
  "id" int4 NOT NULL DEFAULT nextval('"Event_id_seq"'::regclass),
  "courseId" int4 NOT NULL,
  "start" timestamp NOT NULL,
  "end" timestamp NOT NULL,
  "location" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "Course_id_seq"
OWNED BY "Course"."id";
SELECT setval('"Course_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "Event_id_seq"
OWNED BY "Event"."id";
SELECT setval('"Event_id_seq"', 2, false);

-- ----------------------------
-- Primary Key structure for table Course
-- ----------------------------
ALTER TABLE "Course" ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Event
-- ----------------------------
ALTER TABLE "Event" ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Event
-- ----------------------------
ALTER TABLE "Event" ADD CONSTRAINT "courseIdFk" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
