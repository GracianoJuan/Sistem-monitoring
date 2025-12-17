<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        // Add `role` column only if it doesn't already exist
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('viewer')->after('password');
            });
            // add index separately to avoid issues on some MySQL configs
            Schema::table('users', function (Blueprint $table) {
                $table->index('role');
            });
        }

        // Backfill from user_metadata if present. If `user_metadata` column doesn't exist
        // just leave default 'viewer' values.
        if (Schema::hasColumn('users', 'user_metadata')) {
            $users = DB::table('users')->select('id', 'user_metadata')->get();
            foreach ($users as $u) {
                if (!empty($u->user_metadata)) {
                    $meta = json_decode($u->user_metadata, true) ?? [];
                    if (!empty($meta['role'])) {
                        DB::table('users')->where('id', $u->id)->update(['role' => $meta['role']]);
                    }
                }
            }
        }
    }

    public function down()
    {
        // Drop `role` column only if it exists
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }
};
