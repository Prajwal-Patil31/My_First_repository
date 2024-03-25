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


-- noa.resource definition

-- Drop table

-- DROP TABLE noa.resource;

CREATE TABLE noa.resource (
	resource_id serial NOT NULL,
	resource_name varchar(50) NULL DEFAULT NULL::character varying,
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
	CONSTRAINT resource_group_pkey PRIMARY KEY (resource_group_id)
);

-- Permissions

ALTER TABLE noa.resource_group OWNER TO noadba;
GRANT ALL ON TABLE noa.resource_group TO noadba;


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
	role_name varchar(50) NULL DEFAULT NULL::character varying,
	role_id serial NOT NULL,
	subsystem_id varchar(50) NULL DEFAULT NULL::character varying,
	last_update_id varchar(64) NULL DEFAULT NULL::character varying,
	last_update_timestamp timestamp NULL,
	lu_seq numeric(30) NULL DEFAULT NULL::numeric,
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
	customer_account_id varchar(100) NULL DEFAULT NULL::character varying,
	user_id varchar(64) NOT NULL,
	tui_user_id int4 NULL,
	"password" varchar(64) NOT NULL,
	tui_password varchar(32) NULL DEFAULT NULL::character varying,
	first_name varchar(50) NULL DEFAULT NULL::character varying,
	middle_initial varchar(10) NULL DEFAULT NULL::character varying,
	last_name varchar(50) NULL DEFAULT NULL::character varying,
	activation_date timestamp NULL,
	expiration_date timestamp NULL,
	preferred_lang_code varchar(10) NULL DEFAULT NULL::character varying,
	gui_password_expiry_date timestamp NULL,
	gui_password_question varchar(200) NULL DEFAULT NULL::character varying,
	gui_password_answer varchar(200) NULL DEFAULT NULL::character varying,
	tui_password_expirydate timestamp NULL,
	tui_password_answer varchar(200) NULL DEFAULT NULL::character varying,
	time_zone varchar(50) NULL DEFAULT NULL::character varying,
	parent_account_number float8 NULL,
	status int4 NULL,
	tui_password_question varchar(200) NULL DEFAULT NULL::character varying,
	subsystem_id varchar(50) NULL DEFAULT NULL::character varying,
	auth_type float8 NULL,
	failed_attempts int4 NULL,
	last_login_timestamp timestamp NULL,
	num_current_sessions int4 NULL,
	policy_id int4 NULL,
	last_update_id varchar(64) NULL DEFAULT NULL::character varying,
	last_update_timestamp timestamp NULL,
	lu_seq numeric(30) NULL DEFAULT NULL::numeric,
	options_flag float8 NULL,
	locked_timestamp float8 NULL,
	CONSTRAINT user_account_chk_1 CHECK ((status = ANY (ARRAY[0, 1, 2, 3, 4]))),
	CONSTRAINT user_account_pkey PRIMARY KEY (account_id),
	CONSTRAINT user_account_subsystem_id_key UNIQUE (subsystem_id),
	CONSTRAINT user_account_user_id_key UNIQUE (user_id)
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