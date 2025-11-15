<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBudgetsTable extends Migration
{
    public function up()
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);  // Budget amount
            $table->decimal('balance', 10, 2); // Balance (same as amount initially)
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('budgets');
    }
}
