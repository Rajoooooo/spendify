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
                'category_color'  => $e->category?->color,
                'amount'          => (float) $e->amount,
            ]);

        $categories = Category::where('archived', false)
            ->orderBy('name')
            ->get(['id','name','color']);

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

    public function updateExpense(Request $request, Expense $expense)
    {
        $data = $request->validate([
            'date'        => ['required','date'],
            'description' => ['required','string','max:255'],
            'amount'      => ['required','numeric','min:0'],
            'category_id' => ['nullable','exists:categories,id'],
        ]);

        $expense->update($data);

        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }
        return back()->with('success', 'Expense updated.');
    }

    public function destroyExpense(Request $request, Expense $expense)
    {
        // hard delete
        $expense->delete();

        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }
        return back()->with('success', 'Expense deleted.');
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

        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }
        return back()->with('success', 'Category updated.');
    }

    public function archiveCategory(Request $request, Category $category)
    {
        $category->update(['archived' => true]);
        return response()->json(['ok' => true]);
    }

    public function unarchiveCategory(Request $request, Category $category)
    {
        $category->update(['archived' => false]);
        return response()->json(['ok' => true]);
    }

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

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Category removed.');
    }
}
