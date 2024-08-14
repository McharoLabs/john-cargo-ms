ALTER TABLE "stafs" RENAME TO "staffs";--> statement-breakpoint
ALTER TABLE "staffs" DROP CONSTRAINT "stafs_staff_id_users_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staffs" ADD CONSTRAINT "staffs_staff_id_users_user_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
