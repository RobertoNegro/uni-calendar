DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

SET TIMEZONE='Europe/Rome';

-- ----------------------------
-- Sequence structure for Authentication_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "Authentication_id_seq";
CREATE SEQUENCE "Authentication_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Session_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "Session_id_seq";
CREATE SEQUENCE "Session_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for Credentials
-- ----------------------------
DROP TABLE IF EXISTS "Credentials";
CREATE TABLE "Credentials" (
  "userId" int4 NOT NULL,
  "secret" varchar(16) COLLATE "pg_catalog"."default" NOT NULL,
  "expires" timestamp(6) NOT NULL,
  "id" int4 NOT NULL DEFAULT nextval('"Authentication_id_seq"'::regclass)
)
;

-- ----------------------------
-- Table structure for Session
-- ----------------------------
DROP TABLE IF EXISTS "Session";
CREATE TABLE "Session" (
  "userId" int4 NOT NULL,
  "chatId" int4 NOT NULL,
  "id" int4 NOT NULL DEFAULT nextval('"Session_id_seq"'::regclass)
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "Authentication_id_seq"
OWNED BY "Credentials"."id";
SELECT setval('"Authentication_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "Session_id_seq"
OWNED BY "Session"."id";
SELECT setval('"Session_id_seq"', 2, false);

-- ----------------------------
-- Primary Key structure for table Credentials
-- ----------------------------
ALTER TABLE "Credentials" ADD CONSTRAINT "Authentication_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Session
-- ----------------------------
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");
