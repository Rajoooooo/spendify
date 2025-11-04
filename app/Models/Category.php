<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    // ⬇️ add 'archived' and (optional) cast
    protected $fillable = ['name', 'color', 'archived'];

    protected $casts = [
        'archived' => 'boolean',
    ];

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }
}
