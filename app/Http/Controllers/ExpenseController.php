<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('category')
            ->latest('date')->latest('id')
            ->take(200)->get()
            ->map(fn ($e) => [
                'id'          => $e->id,
                'date'        => $e->date->toDateString(),
                'description' => $e->description,
                'category'    => $e->category?->name,
                'amount'      => (float) $e->amount,
            ]);

        $categories = Category::orderBy('name')->get(['id','name','color']);

        return Inertia::render('Expense/index', [
            'expenses'   => $expenses,
            'categories' => $categories,
        ]);
    }

    public function storeExpense(Request $request)
    {
        $data = $request->validate([
            'date'        => ['required','date'],
            'description' => ['required','string','max:255'],
            'amount'      => ['required','numeric','min:0'],
            'category_id' => ['nullable','exists:categories,id'],
        ]);

        Expense::create($data);
        return back()->with('success', 'Expense added.');
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name'  => ['required','string','max:80','unique:categories,name'],
            'color' => ['nullable','string','max:16'],
        ]);

        Category::create($data);
        return back()->with('success', 'Category added.');
    }

    // NEW: JSON for modal
    public function categories()
    {
        return response()->json(
            Category::orderBy('name')->get(['id', 'name', 'color'])
        );
    }
}
