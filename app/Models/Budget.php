<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = ['amount', 'balance'];

    public function lineItems()
    {
        return $this->hasMany(BudgetLineItem::class);
    }
}
