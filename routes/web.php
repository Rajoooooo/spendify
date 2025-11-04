<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ExpenseController;

Route::get('/', fn () => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::prefix('expense')->name('expense.')->group(function () {
        Route::get('/', [ExpenseController::class, 'index'])->name('index');

        Route::post('/', [ExpenseController::class, 'storeExpense'])->name('store');
        Route::put('/{expense}', [ExpenseController::class, 'updateExpense'])->name('update');
        Route::delete('/{expense}', [ExpenseController::class, 'destroyExpense'])->name('destroy');

        Route::post('/category', [ExpenseController::class, 'storeCategory'])->name('category.store');
        Route::put('/category/{category}', [ExpenseController::class, 'updateCategory'])->name('category.update');
        Route::delete('/category/{category}', [ExpenseController::class, 'destroyCategory'])->name('category.destroy');

        Route::put('/category/{category}/archive',   [ExpenseController::class, 'archiveCategory'])->name('category.archive');
        Route::put('/category/{category}/unarchive', [ExpenseController::class, 'unarchiveCategory'])->name('category.unarchive');
        Route::get('/categories', [ExpenseController::class, 'categories'])->name('category.index');
    });
});

require __DIR__.'/settings.php';
