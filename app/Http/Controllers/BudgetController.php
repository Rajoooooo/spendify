<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Budget;
use App\Models\BudgetLineItem;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::with('lineItems')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'title' => $b->title,
                    'budget_title' => optional($b->lineItems->first())->Budget_title, // ✅ Added line
                    'amount' => $b->amount,
                    'balance' => $b->balance,
                    'date' => $b->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Budget/index', [
            'budgets' => $budgets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'balance' => 'required|numeric',
            'line_items' => 'array',
            'line_items.*.title' => 'nullable|string|max:255',
            'line_items.*.amount' => 'nullable|numeric',
        ]);

        // Create main budget
        $budget = Budget::create([
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'balance' => $validated['balance'],
        ]);

        // Create each line item with the budget title stored
        if (!empty($validated['line_items'])) {
            foreach ($validated['line_items'] as $item) {
                $budget->lineItems()->create([
                    'Budget_title' => $validated['title'],
                    'Item_title' => $item['title'],
                    'amount' => $item['amount'] ?? 0,
                ]);
            }
        }

        return redirect()->route('budget.index')->with('success', 'Budget saved successfully');
    }

    public function show(Budget $budget)
    {
        return Inertia::render('Budget/Show', [
            'budget' => $budget->load('lineItems')
        ]);
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();
        return redirect()->back()->with('success', 'Budget deleted successfully');
    }
}
