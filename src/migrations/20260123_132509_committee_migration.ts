import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'secretariat', 'editor', 'teacher');
  CREATE TYPE "public"."enum_delegation_applications_prefers_double_delegations" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_delegation_applications_committee_interests" AS ENUM('advanced', 'press', 'novice', 'spanish');
  CREATE TYPE "public"."enum_delegation_applications_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_delegates_grade_level" AS ENUM('Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'paid', 'failed');
  CREATE TYPE "public"."enum_blog_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"roles" "enum_users_roles" DEFAULT 'teacher' NOT NULL,
  	"delegation_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "portraits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "delegation_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"delegation_name" varchar NOT NULL,
  	"country_of_origin" varchar NOT NULL,
  	"number_of_delegates" numeric NOT NULL,
  	"number_of_faculty_advisors" numeric NOT NULL,
  	"previous_experience" varchar NOT NULL,
  	"hmun_experience" varchar NOT NULL,
  	"preferred_regions" varchar,
  	"prefers_double_delegations" "enum_delegation_applications_prefers_double_delegations" NOT NULL,
  	"crisis_committee_requests" varchar,
  	"committee_interests" "enum_delegation_applications_committee_interests" NOT NULL,
  	"status" "enum_delegation_applications_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "delegations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"teacher_id" integer NOT NULL,
  	"application_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"max_delegates" numeric NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "delegates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"teacher_id" integer NOT NULL,
  	"delegation_id" integer NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"grade_level" "enum_delegates_grade_level" NOT NULL,
  	"phone_number" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faculty_advisors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"teacher_id" integer,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"teacher_id" integer NOT NULL,
  	"delegation_id" integer NOT NULL,
  	"delegate_slots_purchased" numeric NOT NULL,
  	"amount" numeric NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'pending',
  	"reference" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"snippet" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blog_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_snippet" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"committee_photo_id" integer,
  	"slug" varchar,
  	"committee_category_id" integer NOT NULL,
  	"committee_code" varchar NOT NULL,
  	"summary" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "committee_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "committee_team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"rank" numeric NOT NULL,
  	"photo_id" integer,
  	"committee_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"portraits_id" integer,
  	"delegation_applications_id" integer,
  	"delegations_id" integer,
  	"delegates_id" integer,
  	"faculty_advisors_id" integer,
  	"payments_id" integer,
  	"blog_id" integer,
  	"committees_id" integer,
  	"committee_categories_id" integer,
  	"committee_team_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "delegation_applications" ADD CONSTRAINT "delegation_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegations" ADD CONSTRAINT "delegations_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegations" ADD CONSTRAINT "delegations_application_id_delegation_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."delegation_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_delegation_id_delegations_id_fk" FOREIGN KEY ("delegation_id") REFERENCES "public"."delegations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculty_advisors" ADD CONSTRAINT "faculty_advisors_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_delegation_id_delegations_id_fk" FOREIGN KEY ("delegation_id") REFERENCES "public"."delegations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_parent_id_blog_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_committee_photo_id_media_id_fk" FOREIGN KEY ("committee_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_committee_category_id_committee_categories_id_fk" FOREIGN KEY ("committee_category_id") REFERENCES "public"."committee_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committee_team" ADD CONSTRAINT "committee_team_photo_id_portraits_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."portraits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committee_team" ADD CONSTRAINT "committee_team_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portraits_fk" FOREIGN KEY ("portraits_id") REFERENCES "public"."portraits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegation_applications_fk" FOREIGN KEY ("delegation_applications_id") REFERENCES "public"."delegation_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegations_fk" FOREIGN KEY ("delegations_id") REFERENCES "public"."delegations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegates_fk" FOREIGN KEY ("delegates_id") REFERENCES "public"."delegates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faculty_advisors_fk" FOREIGN KEY ("faculty_advisors_id") REFERENCES "public"."faculty_advisors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committees_fk" FOREIGN KEY ("committees_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committee_categories_fk" FOREIGN KEY ("committee_categories_id") REFERENCES "public"."committee_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committee_team_fk" FOREIGN KEY ("committee_team_id") REFERENCES "public"."committee_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "portraits_updated_at_idx" ON "portraits" USING btree ("updated_at");
  CREATE INDEX "portraits_created_at_idx" ON "portraits" USING btree ("created_at");
  CREATE UNIQUE INDEX "portraits_filename_idx" ON "portraits" USING btree ("filename");
  CREATE INDEX "delegation_applications_user_idx" ON "delegation_applications" USING btree ("user_id");
  CREATE INDEX "delegation_applications_updated_at_idx" ON "delegation_applications" USING btree ("updated_at");
  CREATE INDEX "delegation_applications_created_at_idx" ON "delegation_applications" USING btree ("created_at");
  CREATE INDEX "delegations_teacher_idx" ON "delegations" USING btree ("teacher_id");
  CREATE UNIQUE INDEX "delegations_application_idx" ON "delegations" USING btree ("application_id");
  CREATE INDEX "delegations_updated_at_idx" ON "delegations" USING btree ("updated_at");
  CREATE INDEX "delegations_created_at_idx" ON "delegations" USING btree ("created_at");
  CREATE INDEX "delegates_teacher_idx" ON "delegates" USING btree ("teacher_id");
  CREATE INDEX "delegates_delegation_idx" ON "delegates" USING btree ("delegation_id");
  CREATE INDEX "delegates_updated_at_idx" ON "delegates" USING btree ("updated_at");
  CREATE INDEX "delegates_created_at_idx" ON "delegates" USING btree ("created_at");
  CREATE INDEX "faculty_advisors_teacher_idx" ON "faculty_advisors" USING btree ("teacher_id");
  CREATE UNIQUE INDEX "faculty_advisors_email_idx" ON "faculty_advisors" USING btree ("email");
  CREATE UNIQUE INDEX "faculty_advisors_phone_number_idx" ON "faculty_advisors" USING btree ("phone_number");
  CREATE INDEX "faculty_advisors_updated_at_idx" ON "faculty_advisors" USING btree ("updated_at");
  CREATE INDEX "faculty_advisors_created_at_idx" ON "faculty_advisors" USING btree ("created_at");
  CREATE INDEX "payments_teacher_idx" ON "payments" USING btree ("teacher_id");
  CREATE INDEX "payments_delegation_idx" ON "payments" USING btree ("delegation_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX "blog_cover_image_idx" ON "blog" USING btree ("cover_image_id");
  CREATE INDEX "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX "blog__status_idx" ON "blog" USING btree ("_status");
  CREATE INDEX "_blog_v_parent_idx" ON "_blog_v" USING btree ("parent_id");
  CREATE INDEX "_blog_v_version_version_slug_idx" ON "_blog_v" USING btree ("version_slug");
  CREATE INDEX "_blog_v_version_version_cover_image_idx" ON "_blog_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_blog_v_version_version_updated_at_idx" ON "_blog_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_v_version_version_created_at_idx" ON "_blog_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_v_version_version__status_idx" ON "_blog_v" USING btree ("version__status");
  CREATE INDEX "_blog_v_created_at_idx" ON "_blog_v" USING btree ("created_at");
  CREATE INDEX "_blog_v_updated_at_idx" ON "_blog_v" USING btree ("updated_at");
  CREATE INDEX "_blog_v_latest_idx" ON "_blog_v" USING btree ("latest");
  CREATE INDEX "committees_committee_photo_idx" ON "committees" USING btree ("committee_photo_id");
  CREATE INDEX "committees_committee_category_idx" ON "committees" USING btree ("committee_category_id");
  CREATE UNIQUE INDEX "committees_committee_code_idx" ON "committees" USING btree ("committee_code");
  CREATE INDEX "committees_updated_at_idx" ON "committees" USING btree ("updated_at");
  CREATE INDEX "committees_created_at_idx" ON "committees" USING btree ("created_at");
  CREATE INDEX "committee_categories_updated_at_idx" ON "committee_categories" USING btree ("updated_at");
  CREATE INDEX "committee_categories_created_at_idx" ON "committee_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "committee_team_rank_idx" ON "committee_team" USING btree ("rank");
  CREATE INDEX "committee_team_photo_idx" ON "committee_team" USING btree ("photo_id");
  CREATE INDEX "committee_team_committee_idx" ON "committee_team" USING btree ("committee_id");
  CREATE INDEX "committee_team_updated_at_idx" ON "committee_team" USING btree ("updated_at");
  CREATE INDEX "committee_team_created_at_idx" ON "committee_team" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_portraits_id_idx" ON "payload_locked_documents_rels" USING btree ("portraits_id");
  CREATE INDEX "payload_locked_documents_rels_delegation_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("delegation_applications_id");
  CREATE INDEX "payload_locked_documents_rels_delegations_id_idx" ON "payload_locked_documents_rels" USING btree ("delegations_id");
  CREATE INDEX "payload_locked_documents_rels_delegates_id_idx" ON "payload_locked_documents_rels" USING btree ("delegates_id");
  CREATE INDEX "payload_locked_documents_rels_faculty_advisors_id_idx" ON "payload_locked_documents_rels" USING btree ("faculty_advisors_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX "payload_locked_documents_rels_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("committees_id");
  CREATE INDEX "payload_locked_documents_rels_committee_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("committee_categories_id");
  CREATE INDEX "payload_locked_documents_rels_committee_team_id_idx" ON "payload_locked_documents_rels" USING btree ("committee_team_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "portraits" CASCADE;
  DROP TABLE "delegation_applications" CASCADE;
  DROP TABLE "delegations" CASCADE;
  DROP TABLE "delegates" CASCADE;
  DROP TABLE "faculty_advisors" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "_blog_v" CASCADE;
  DROP TABLE "committees" CASCADE;
  DROP TABLE "committee_categories" CASCADE;
  DROP TABLE "committee_team" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_delegation_applications_prefers_double_delegations";
  DROP TYPE "public"."enum_delegation_applications_committee_interests";
  DROP TYPE "public"."enum_delegation_applications_status";
  DROP TYPE "public"."enum_delegates_grade_level";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_blog_status";
  DROP TYPE "public"."enum__blog_v_version_status";`)
}
