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
            ->latest('date')->latest('id')->take(200)->get()
            ->map(fn ($e) => [
                'id'              => $e->id,
                'date'            => $e->date->toDateString(),
                'description'     => $e->description,
                'category'        => $e->category?->name,
                'category_color'  => $e->category?->color,   // ← add color
                'amount'          => (float) $e->amount,
            ]);

        $categories = Category::where('archived', false)
            ->orderBy('name')
            ->get(['id','name','color']); // used by the modal

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

        // Inertia will refresh the page data on redirect back.
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

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'  => ['required','string','max:80','unique:categories,name,'.$category->id],
            'color' => ['nullable','string','max:16'],
        ]);

        $category->update($data);
        // for XHR
        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }
        return back()->with('success', 'Category updated.');
    }

    public function archiveCategory(Request $request, Category $category)
    {
        $category->update(['archived' => true]);

        // for XHR
        return response()->json(['ok' => true]);
    }

    public function unarchiveCategory(Request $request, Category $category)
    {
        $category->update(['archived' => false]);

        return response()->json(['ok' => true]);
    }

    // GET /expense/categories?archived=1
    public function categories(Request $request)
    {
        $archived = $request->boolean('archived');
        $rows = Category::query()
            ->when($archived, fn($q) => $q->where('archived', true),
                           fn($q) => $q->where('archived', false))
            ->orderBy('name')
            ->get(['id','name','color','archived']);

        return response()->json($rows);
    }

    // Optional clean-up endpoints; already present in your routes
    public function destroyCategory(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Category removed.');
    }

    public function updateExpense(Request $request, Expense $expense) {}
    public function destroyExpense(Expense $expense) {}
}
