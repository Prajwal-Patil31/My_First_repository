INSERT INTO noa.user_account (user_name,"password",tui_password,first_name,middle_initial,last_name,activation_date,expiration_date,preferred_lang_code,time_zone,status,auth_type,failed_attempts,last_login_timestamp,num_current_sessions,policy_id,last_update_id,last_update_timestamp,options_flag,locked_timestamp,mobile_number,email,"Role",logged_time,pwd_question,pwd_answer) VALUES
	 ('admin','$2a$10$NvOKyzpKEIYsExJpm2uUFuR8F3vUN.5uLcIFLGcM/bqIiBZ7R98oO',NULL,'Administrator',NULL,'NOA',NULL,NULL,NULL,NULL,true,0.0,0,NULL,0,1,NULL,NULL,0.0,0.0,NULL,NULL,NULL,NULL,NULL,NULL),
	 ('user','$2a$10$K6VZTEE9hboUURqqavJ9NOROKNp0VrUD4ODcW1ENRcid86P9YrQCm',NULL,'User',NULL,'NOA',NULL,NULL,NULL,NULL,true,0.0,0,NULL,0,1,NULL,NULL,0.0,0.0,NULL,NULL,NULL,NULL,NULL,NULL),
	 ('noaadmin','$2a$10$6AqeKjSdcvpHxgAKNKXk3.yD6Kha53PSASlAcx4QJpdibZu2lJ/MG',NULL,'NOA',NULL,'Administrator',NULL,NULL,NULL,NULL,true,0.0,0,NULL,0,1,NULL,NULL,0.0,0.0,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO noa."role" (service_id,role_name,last_update_id,last_update_timestamp,role_code) VALUES
	 (0,'Administrator',NULL,NULL,NULL),
	 (0,'DefaultRole',NULL,NULL,NULL);
INSERT INTO noa.user_role (account_id,role_id,subsystem_id,component_id,activation_date,expiration_date,last_update_id,last_update_timestamp,lu_seq) VALUES
	 (1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
	 (2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
	 (3,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO noa.feature_info (feature_name,subsystem_id,service_id) VALUES
	 ('AlarmManagement',NULL,0.0),
	 ('ElementManagement',NULL,0.0),
	 ('TopologyManagement',NULL,0.0),
	 ('ConfigManagement',NULL,0.0),
	 ('PerformanceManagement',NULL,0.0),
	 ('SecurityManagement',NULL,0.0),
	 ('LogManagement',NULL,0.0),
	 ('DiagnosticsManagement',NULL,0.0),
	 ('InventoryManagement',NULL,0.0),
	 ('MeasurementCountersAndThresholdManagement',NULL,0.0);
INSERT INTO noa.feature_info (feature_name,subsystem_id,service_id) VALUES
	 ('ElementManagementViewOnly',NULL,0.0),
	 ('TopologyManagementViewOnly',NULL,0.0),
	 ('ConfigManagementViewOnly',NULL,0.0),
	 ('PerformanceManagementViewOnly',NULL,0.0),
	 ('SecurityManagementViewOnly',NULL,0.0),
	 ('LogManagementViewOnly',NULL,0.0),
	 ('AlarmManagementViewOnly',NULL,0.0),
	 ('DiagnosticsManagementViewOnly',NULL,0.0),
	 ('InventoryManagementViewOnly',NULL,0.0);
INSERT INTO noa.role_feature (feature_id,role_id) VALUES
	 (1,1),
	 (2,1),
	 (3,1),
	 (4,1),
	 (5,1),
	 (6,1),
	 (7,1),
	 (8,1),
	 (9,1),
	 (10,1);
INSERT INTO noa.role_feature (feature_id,role_id) VALUES
	 (11,2),
	 (12,2),
	 (13,2),
	 (14,2),
	 (15,2),
	 (16,2),
	 (17,2),
	 (18,2),
	 (19,2);
INSERT INTO noa.uri_feature (uri_path,feature_id) VALUES
	 ('faults',1),
	 ('faultgroups',1),
	 ('faults-policies-acknowledge',1),
	 ('faults-policies-escalate',1),
	 ('faults-config',1),
	 ('security-audit',6),
	 ('security-users',6),
	 ('security-policies-password',6),
	 ('security-groups',6),
	 ('elements',2);
INSERT INTO noa.uri_feature (uri_path,feature_id) VALUES
	 ('elements-groups',2),
	 ('security-roles',6),
	 ('element-switches',2),
	 ('restconf',2),
	 ('features',4),
	 ('products',9),
	 ('softwares',9),
	 ('measurementsets',5),
	 ('tracecalls',8),
	 ('calltraces',8);
INSERT INTO noa.uri_feature (uri_path,feature_id) VALUES
	 ('compstatus',8);