<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('budget_line_items', function (Blueprint $table) {
            if (!Schema::hasColumn('budget_line_items', 'Budget_title')) {
                $table->string('Budget_title')->nullable()->after('budget_id');
            }
            if (Schema::hasColumn('budget_line_items', 'title')) {
                $table->renameColumn('title', 'Item_title');
            }
        });
    }

    public function down(): void {
        Schema::table('budget_line_items', function (Blueprint $table) {
            if (Schema::hasColumn('budget_line_items', 'Item_title')) {
                $table->renameColumn('Item_title', 'title');
            }
            if (Schema::hasColumn('budget_line_items', 'Budget_title')) {
                $table->dropColumn('Budget_title');
            }
        });
    }
};
