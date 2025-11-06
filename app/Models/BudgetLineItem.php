<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetLineItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'Budget_title',
        'Item_title',
        'amount'
    ];

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }
}
