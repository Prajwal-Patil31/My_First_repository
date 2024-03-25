CREATE SCHEMA noa AUTHORIZATION postgres;

CREATE TYPE noa."_audit_info" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.audit_info,
	DELIMITER = ',');

-- DROP TYPE noa."_fault_ack";

CREATE TYPE noa."_fault_ack" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.fault_ack,
	DELIMITER = ',');

-- DROP TYPE noa."_fault_config";

CREATE TYPE noa."_fault_config" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.fault_config,
	DELIMITER = ',');

-- DROP TYPE noa."_fault_esc";

CREATE TYPE noa."_fault_esc" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.fault_esc,
	DELIMITER = ',');

-- DROP TYPE noa."_faults";

CREATE TYPE noa."_faults" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.faults,
	DELIMITER = ',');

-- DROP TYPE noa."_feature_info";

CREATE TYPE noa."_feature_info" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.feature_info,
	DELIMITER = ',');

-- DROP TYPE noa."_heartbeat";

CREATE TYPE noa."_heartbeat" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.heartbeat,
	DELIMITER = ',');

-- DROP TYPE noa."_password_policy";

CREATE TYPE noa."_password_policy" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.password_policy,
	DELIMITER = ',');

-- DROP TYPE noa."_privilege";

CREATE TYPE noa."_privilege" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.privilege,
	DELIMITER = ',');

-- DROP TYPE noa."_resource";

CREATE TYPE noa."_resource" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.resource,
	DELIMITER = ',');

-- DROP TYPE noa."_resource_group";

CREATE TYPE noa."_resource_group" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.resource_group,
	DELIMITER = ',');

-- DROP TYPE noa."_resource_privilege";

CREATE TYPE noa."_resource_privilege" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.resource_privilege,
	DELIMITER = ',');

-- DROP TYPE noa."_resourcegroup_resource";

CREATE TYPE noa."_resourcegroup_resource" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.resourcegroup_resource,
	DELIMITER = ',');

-- DROP TYPE noa."_role";

CREATE TYPE noa."_role" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa."role",
	DELIMITER = ',');

-- DROP TYPE noa."_role_feature";

CREATE TYPE noa."_role_feature" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.role_feature,
	DELIMITER = ',');

-- DROP TYPE noa."_spring_session";

CREATE TYPE noa."_spring_session" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.spring_session,
	DELIMITER = ',');

-- DROP TYPE noa."_spring_session_attributes";

CREATE TYPE noa."_spring_session_attributes" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.spring_session_attributes,
	DELIMITER = ',');

-- DROP TYPE noa."_uri_feature";

CREATE TYPE noa."_uri_feature" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.uri_feature,
	DELIMITER = ',');

-- DROP TYPE noa."_user_account";

CREATE TYPE noa."_user_account" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.user_account,
	DELIMITER = ',');

-- DROP TYPE noa."_user_group";

CREATE TYPE noa."_user_group" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.user_group,
	DELIMITER = ',');

-- DROP TYPE noa."_user_role";

CREATE TYPE noa."_user_role" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.user_role,
	DELIMITER = ',');

-- DROP TYPE noa."_usergroup_user";

CREATE TYPE noa."_usergroup_user" (
	INPUT = array_in,
	OUTPUT = array_out,
	RECEIVE = array_recv,
	SEND = array_send,
	ANALYZE = array_typanalyze,
	ALIGNMENT = 8,
	STORAGE = any,
	CATEGORY = A,
	ELEMENT = noa.usergroup_user,
	DELIMITER = ',');

-- DROP SEQUENCE noa.audit_info_audit_id_seq;

CREATE SEQUENCE noa.audit_info_audit_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.audit_info_audit_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.audit_info_audit_id_seq TO noadba;

-- DROP SEQUENCE noa.fault_ack_policy_id_seq;

CREATE SEQUENCE noa.fault_ack_policy_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.fault_ack_policy_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.fault_ack_policy_id_seq TO noadba;

-- DROP SEQUENCE noa.fault_config_fault_id_seq;

CREATE SEQUENCE noa.fault_config_fault_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.fault_config_fault_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.fault_config_fault_id_seq TO noadba;

-- DROP SEQUENCE noa.fault_esc_policy_id_seq;

CREATE SEQUENCE noa.fault_esc_policy_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.fault_esc_policy_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.fault_esc_policy_id_seq TO noadba;

-- DROP SEQUENCE noa.faults_fault_id_seq;

CREATE SEQUENCE noa.faults_fault_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.faults_fault_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.faults_fault_id_seq TO noadba;

-- DROP SEQUENCE noa.feature_info_feature_id_seq;

CREATE SEQUENCE noa.feature_info_feature_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.feature_info_feature_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.feature_info_feature_id_seq TO noadba;

-- DROP SEQUENCE noa.heartbeat_hb_id_seq;

CREATE SEQUENCE noa.heartbeat_hb_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.heartbeat_hb_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.heartbeat_hb_id_seq TO noadba;

-- DROP SEQUENCE noa.password_policy_policy_id_seq;

CREATE SEQUENCE noa.password_policy_policy_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.password_policy_policy_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.password_policy_policy_id_seq TO noadba;

-- DROP SEQUENCE noa.privilege_privilege_id_seq;

CREATE SEQUENCE noa.privilege_privilege_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.privilege_privilege_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.privilege_privilege_id_seq TO noadba;

-- DROP SEQUENCE noa.resource_group_resource_group_id_seq;

CREATE SEQUENCE noa.resource_group_resource_group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.resource_group_resource_group_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.resource_group_resource_group_id_seq TO noadba;

-- DROP SEQUENCE noa.resource_resource_id_seq;

CREATE SEQUENCE noa.resource_resource_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.resource_resource_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.resource_resource_id_seq TO noadba;

-- DROP SEQUENCE noa.role_role_id_seq;

CREATE SEQUENCE noa.role_role_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.role_role_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.role_role_id_seq TO noadba;

-- DROP SEQUENCE noa.uri_feature_uri_id_seq;

CREATE SEQUENCE noa.uri_feature_uri_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.uri_feature_uri_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.uri_feature_uri_id_seq TO noadba;

-- DROP SEQUENCE noa.user_account_account_id_seq;

CREATE SEQUENCE noa.user_account_account_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.user_account_account_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.user_account_account_id_seq TO noadba;

-- DROP SEQUENCE noa.user_group_group_id_seq;

CREATE SEQUENCE noa.user_group_group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE noa.user_group_group_id_seq OWNER TO noadba;
GRANT ALL ON SEQUENCE noa.user_group_group_id_seq TO noadba;
-- noa.audit_info definition

-- Drop table

-- DROP TABLE noa.audit_info;

CREATE TABLE noa.audit_info (
	audit_id serial NOT NULL,
	user_name varchar(200) NOT NULL,
	"time" timestamp NOT NULL,
	operation varchar(200) NOT NULL,
	status varchar(200) NOT NULL,
	host varchar(45) NOT NULL,
	activity varchar(200) NULL DEFAULT NULL::character varying,
	api_name varchar(45) NULL DEFAULT NULL::character varying,
	change_description varchar(500) NULL DEFAULT NULL::character varying,
	CONSTRAINT audit_info_pkey PRIMARY KEY (audit_id)
);

-- Permissions

ALTER TABLE noa.audit_info OWNER TO noadba;
GRANT ALL ON TABLE noa.audit_info TO noadba;


-- noa.fault_ack definition

-- Drop table

-- DROP TABLE noa.fault_ack;

CREATE TABLE noa.fault_ack (
	policy_id serial NOT NULL,
	policy_name varchar(200) NULL DEFAULT NULL::character varying,
	no_of_hrs_older int4 NOT NULL,
	no_of_days_older int4 NOT NULL DEFAULT 0,
	severity varchar(50) NOT NULL,
	retain_min_faults int4 NOT NULL DEFAULT 0,
	CONSTRAINT alarm_ack_pkey PRIMARY KEY (policy_id)
);

-- Permissions

ALTER TABLE noa.fault_ack OWNER TO noadba;
GRANT ALL ON TABLE noa.fault_ack TO noadba;


-- noa.fault_config definition

-- Drop table

-- DROP TABLE noa.fault_config;

CREATE TABLE noa.fault_config (
	fault_id serial NOT NULL,
	error_code int4 NOT NULL DEFAULT 0,
	severity int4 NOT NULL DEFAULT 0,
	related_error_code int4 NOT NULL DEFAULT 0,
	trap_category int4 NOT NULL DEFAULT 0,
	CONSTRAINT alarm_config_error_code_key UNIQUE (error_code),
	CONSTRAINT alarm_config_pkey PRIMARY KEY (fault_id)
);

-- Permissions

ALTER TABLE noa.fault_config OWNER TO noadba;
GRANT ALL ON TABLE noa.fault_config TO noadba;


-- noa.fault_esc definition

-- Drop table

-- DROP TABLE noa.fault_esc;

CREATE TABLE noa.fault_esc (
	policy_id serial NOT NULL,
	policy_name varchar(200) NULL DEFAULT NULL::character varying,
	no_of_hrs_older int4 NOT NULL,
	no_of_days_older int4 NOT NULL,
	from_severity varchar(50) NOT NULL,
	to_severity varchar(50) NOT NULL,
	CONSTRAINT alarm_esc_pkey PRIMARY KEY (policy_id)
);

-- Permissions

ALTER TABLE noa.fault_esc OWNER TO noadba;
GRANT ALL ON TABLE noa.fault_esc TO noadba;


-- noa.faults definition

-- Drop table

-- DROP TABLE noa.faults;

CREATE TABLE noa.faults (
	fault_id serial NOT NULL,
	fault_date timestamp NULL,
	count int4 NULL,
	error_code int4 NOT NULL,
	related_fault_id int4 NULL,
	severity int4 NOT NULL,
	status_code int4 NOT NULL,
	fault_content varchar(500) NOT NULL,
	fault_system_id int4 NOT NULL,
	clr_username varchar(200) NULL DEFAULT NULL::character varying,
	clr_date timestamp NULL,
	ack_username varchar(200) NULL DEFAULT NULL::character varying,
	ack_date timestamp NULL,
	fault_hostname varchar(200) NULL DEFAULT NULL::character varying,
	site_id int4 NULL DEFAULT '-1'::integer,
	CONSTRAINT alarms_pkey PRIMARY KEY (fault_id)
);

-- Permissions

ALTER TABLE noa.faults OWNER TO noadba;
GRANT ALL ON TABLE noa.faults TO noadba;


-- noa.feature_info definition

-- Drop table

-- DROP TABLE noa.feature_info;

CREATE TABLE noa.feature_info (
	feature_id serial NOT NULL,
	feature_name varchar(50) NULL DEFAULT NULL::character varying,
	subsystem_id varchar(50) NULL DEFAULT NULL::character varying,
	service_id float8 NOT NULL,
	CONSTRAINT feature_info_pkey PRIMARY KEY (feature_id)
);

-- Permissions

ALTER TABLE noa.feature_info OWNER TO noadba;
GRANT ALL ON TABLE noa.feature_info TO noadba;


-- noa.heartbeat definition

-- Drop table

-- DROP TABLE noa.heartbeat;

CREATE TABLE noa.heartbeat (
	hb_id serial NOT NULL,
	comp_id int4 NOT NULL,
	comp_type varchar(10) NOT NULL,
	"timestamp" timestamp NOT NULL,
	status float8 NOT NULL,
	CONSTRAINT heartbeat_pkey PRIMARY KEY (hb_id)
);

-- Permissions

ALTER TABLE noa.heartbeat OWNER TO noadba;
GRANT ALL ON TABLE noa.heartbeat TO noadba;


-- noa.password_policy definition

-- Drop table

-- DROP TABLE noa.password_policy;

CREATE TABLE noa.password_policy (
	policy_id serial NOT NULL,
	policy_name varchar(50) NOT NULL,
	max_fail_attempt int4 NOT NULL,
	passwd_exp_days int4 NOT NULL,
	min_len int4 NOT NULL DEFAULT 1,
	min_digits int4 NOT NULL DEFAULT 0,
	min_spl_char int4 NOT NULL DEFAULT 0,
	min_uppr_char int4 NOT NULL DEFAULT 0,
	min_low_char int4 NOT NULL DEFAULT 0,
	num_multiple_login int4 NOT NULL DEFAULT 3,
	num_old_passwd int4 NOT NULL DEFAULT 3,
	min_reuse_days int4 NOT NULL DEFAULT 30,
	CONSTRAINT password_policy_pkey PRIMARY KEY (policy_id)
);

-- Permissions

ALTER TABLE noa.password_policy OWNER TO noadba;
GRANT ALL ON TABLE noa.password_policy TO noadba;


-- noa.privilege definition

-- Drop table

-- DROP TABLE noa.privilege;

CREATE TABLE noa.privilege (
	privilege_id serial NOT NULL,
	privilege_code varchar(50) NULL,
	privilege_name varchar(50) NULL
);

-- Permissions

ALTER TABLE noa.privilege OWNER TO noadba;
GRANT ALL ON TABLE noa.privilege TO noadba;


-- noa.resource definition

-- Drop table

-- DROP TABLE noa.resource;

CREATE TABLE noa.resource (
	resource_id serial NOT NULL,
	resource_name varchar(50) NULL DEFAULT NULL::character varying,
	resource_type varchar(50) NULL,
	resource_code varchar(50) NULL,
	resource_uri varchar NULL,
	CONSTRAINT resource_pkey PRIMARY KEY (resource_id)
);

-- Permissions

ALTER TABLE noa.resource OWNER TO noadba;
GRANT ALL ON TABLE noa.resource TO noadba;


-- noa.resource_group definition

-- Drop table

-- DROP TABLE noa.resource_group;

CREATE TABLE noa.resource_group (
	resource_group_id serial NOT NULL,
	resource_group_name varchar(50) NULL DEFAULT NULL::character varying,
	resource_group_code varchar(50) NULL,
	resource_group_type varchar(50) NULL,
	CONSTRAINT resource_group_pkey PRIMARY KEY (resource_group_id)
);

-- Permissions

ALTER TABLE noa.resource_group OWNER TO noadba;
GRANT ALL ON TABLE noa.resource_group TO noadba;


-- noa.resource_privilege definition

-- Drop table

-- DROP TABLE noa.resource_privilege;

CREATE TABLE noa.resource_privilege (
	resource_id int4 NULL,
	privilege_id int4 NULL
);

-- Permissions

ALTER TABLE noa.resource_privilege OWNER TO noadba;
GRANT ALL ON TABLE noa.resource_privilege TO noadba;


-- noa.resourcegroup_resource definition

-- Drop table

-- DROP TABLE noa.resourcegroup_resource;

CREATE TABLE noa.resourcegroup_resource (
	resource_id int4 NOT NULL,
	resource_group_id int4 NOT NULL
);

-- Permissions

ALTER TABLE noa.resourcegroup_resource OWNER TO noadba;
GRANT ALL ON TABLE noa.resourcegroup_resource TO noadba;


-- noa."role" definition

-- Drop table

-- DROP TABLE noa."role";

CREATE TABLE noa."role" (
	service_id int4 NOT NULL,
	role_name varchar(50) NOT NULL DEFAULT NULL::character varying,
	role_id serial NOT NULL,
	last_update_id varchar(64) NULL DEFAULT NULL::character varying,
	last_update_timestamp timestamp NULL,
	role_code varchar NULL,
	CONSTRAINT role_info_pkey PRIMARY KEY (role_id)
);

-- Permissions

ALTER TABLE noa."role" OWNER TO noadba;
GRANT ALL ON TABLE noa."role" TO noadba;


-- noa.role_feature definition

-- Drop table

-- DROP TABLE noa.role_feature;

CREATE TABLE noa.role_feature (
	feature_id int4 NOT NULL,
	role_id int4 NOT NULL
);

-- Permissions

ALTER TABLE noa.role_feature OWNER TO noadba;
GRANT ALL ON TABLE noa.role_feature TO noadba;


-- noa.spring_session definition

-- Drop table

-- DROP TABLE noa.spring_session;

CREATE TABLE noa.spring_session (
	primary_id bpchar(36) NOT NULL,
	session_id bpchar(36) NOT NULL,
	creation_time int8 NOT NULL,
	last_access_time int8 NOT NULL,
	max_inactive_interval int4 NOT NULL,
	expiry_time int8 NOT NULL,
	principal_name varchar(100) NULL,
	CONSTRAINT spring_session_pk PRIMARY KEY (primary_id)
);
CREATE UNIQUE INDEX spring_session_ix1 ON noa.spring_session USING btree (session_id);
CREATE INDEX spring_session_ix2 ON noa.spring_session USING btree (expiry_time);
CREATE INDEX spring_session_ix3 ON noa.spring_session USING btree (principal_name);

-- Permissions

ALTER TABLE noa.spring_session OWNER TO noadba;
GRANT ALL ON TABLE noa.spring_session TO noadba;


-- noa.user_account definition

-- Drop table

-- DROP TABLE noa.user_account;

CREATE TABLE noa.user_account (
	account_id serial NOT NULL,
	user_name varchar(64) NOT NULL,
	"password" varchar(64) NOT NULL,
	tui_password varchar(32) NULL DEFAULT NULL::character varying,
	first_name varchar(50) NULL DEFAULT NULL::character varying,
	middle_initial varchar(10) NULL DEFAULT NULL::character varying,
	last_name varchar(50) NULL DEFAULT NULL::character varying,
	activation_date timestamp NULL,
	expiration_date timestamp NULL,
	preferred_lang_code varchar(10) NULL DEFAULT NULL::character varying,
	time_zone varchar(50) NULL DEFAULT NULL::character varying,
	status bool NULL DEFAULT true,
	auth_type float8 NULL,
	failed_attempts int4 NULL,
	last_login_timestamp timestamp NULL,
	num_current_sessions int4 NULL,
	policy_id int4 NULL,
	last_update_id varchar(64) NULL DEFAULT NULL::character varying,
	last_update_timestamp timestamp NULL,
	options_flag float8 NULL,
	locked_timestamp float8 NULL,
	mobile_number varchar NULL,
	email varchar NULL,
	"Role" varchar NULL,
	logged_time varchar NULL,
	pwd_question varchar NULL,
	pwd_answer varchar NULL,
	CONSTRAINT user_account_pkey PRIMARY KEY (account_id),
	CONSTRAINT user_account_user_id_key UNIQUE (user_name)
);

-- Permissions

ALTER TABLE noa.user_account OWNER TO noadba;
GRANT ALL ON TABLE noa.user_account TO noadba;


-- noa.user_group definition

-- Drop table

-- DROP TABLE noa.user_group;

CREATE TABLE noa.user_group (
	group_id serial NOT NULL,
	group_name varchar(50) NULL DEFAULT NULL::character varying,
	group_code varchar NULL,
	"role" varchar NULL,
	resource varchar NULL,
	CONSTRAINT user_group_pkey PRIMARY KEY (group_id)
);

-- Permissions

ALTER TABLE noa.user_group OWNER TO noadba;
GRANT ALL ON TABLE noa.user_group TO noadba;


-- noa.user_role definition

-- Drop table

-- DROP TABLE noa.user_role;

CREATE TABLE noa.user_role (
	account_id int4 NOT NULL,
	role_id int4 NOT NULL,
	subsystem_id varchar(50) NULL DEFAULT NULL::character varying,
	component_id numeric(10) NULL DEFAULT NULL::numeric,
	activation_date timestamp NULL,
	expiration_date timestamp NULL,
	last_update_id varchar(64) NULL DEFAULT NULL::character varying,
	last_update_timestamp timestamp NULL,
	lu_seq numeric(30) NULL DEFAULT NULL::numeric
);

-- Permissions

ALTER TABLE noa.user_role OWNER TO noadba;
GRANT ALL ON TABLE noa.user_role TO noadba;


-- noa.usergroup_user definition

-- Drop table

-- DROP TABLE noa.usergroup_user;

CREATE TABLE noa.usergroup_user (
	account_id float8 NOT NULL,
	group_id float8 NOT NULL
);

-- Permissions

ALTER TABLE noa.usergroup_user OWNER TO noadba;
GRANT ALL ON TABLE noa.usergroup_user TO noadba;


-- noa.spring_session_attributes definition

-- Drop table

-- DROP TABLE noa.spring_session_attributes;

CREATE TABLE noa.spring_session_attributes (
	session_primary_id bpchar(36) NOT NULL,
	attribute_name varchar(200) NOT NULL,
	attribute_bytes bytea NOT NULL,
	CONSTRAINT spring_session_attributes_pk PRIMARY KEY (session_primary_id, attribute_name),
	CONSTRAINT spring_session_attributes_fk FOREIGN KEY (session_primary_id) REFERENCES noa.spring_session(primary_id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE noa.spring_session_attributes OWNER TO noadba;
GRANT ALL ON TABLE noa.spring_session_attributes TO noadba;


-- noa.uri_feature definition

-- Drop table

-- DROP TABLE noa.uri_feature;

CREATE TABLE noa.uri_feature (
	uri_id serial NOT NULL,
	uri_path varchar(45) NULL DEFAULT NULL::character varying,
	feature_id int4 NULL,
	CONSTRAINT uri_feature_pkey PRIMARY KEY (uri_id),
	CONSTRAINT feature_id FOREIGN KEY (feature_id) REFERENCES noa.feature_info(feature_id)
);

-- Permissions

ALTER TABLE noa.uri_feature OWNER TO noadba;
GRANT ALL ON TABLE noa.uri_feature TO noadba;




-- Permissions

GRANT ALL ON SCHEMA noa TO postgres;
GRANT ALL ON SCHEMA noa TO noadba;
