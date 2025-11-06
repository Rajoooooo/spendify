<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBudgetLineItemsTable extends Migration
{
    public function up()
    {
        Schema::create('budget_line_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_id')->constrained()->onDelete('cascade'); // Reference to the budget
            $table->string('title'); // Line item title
            $table->decimal('amount', 10, 2); // Line item amount
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('budget_line_items');
    }
}
