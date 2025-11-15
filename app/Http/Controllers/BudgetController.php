<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Budget;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::with('lineItems')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($b) {
                // Take the budget "title" from the first line item
                $title = optional($b->lineItems->first())->Budget_title;

                return [
                    'id'           => $b->id,
                    'title'        => $title,          // used by table / modals
                    'budget_title' => $title,          // used by EditBudgetModal (fallback)
                    'amount'       => $b->amount,
                    'balance'      => $b->balance,
                    'date'         => $b->created_at->format('Y-m-d'),
                    'lineItems'    => $b->lineItems->map(function ($item) {
                        return [
                            'id'         => $item->id,
                            'Item_title' => $item->Item_title,
                            'amount'     => $item->amount,
                        ];
                    })->values(),
                ];
            });

        return Inertia::render('Budget/index', [
            'budgets' => $budgets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Budget title (saved as Budget_title on line items)
            'title'        => 'required|string|max:255',
            'amount'       => 'required|numeric',
            'balance'      => 'required|numeric',

            // line_items from create form
            'line_items'          => 'nullable|array',
            'line_items.*.title'  => 'nullable|string|max:255',
            'line_items.*.amount' => 'nullable|numeric',
        ]);

        // budgets table only has amount + balance
        $budget = Budget::create([
            'amount'  => $validated['amount'],
            'balance' => $validated['balance'],
        ]);

        foreach ($validated['line_items'] ?? [] as $item) {
            $budget->lineItems()->create([
                'Budget_title' => $validated['title'],
                'Item_title'   => $item['title'] ?? null,
                'amount'       => $item['amount'] ?? 0,
            ]);
        }

        return redirect()->route('budget.index')
            ->with('success', 'Budget saved successfully');
    }

    public function show(Budget $budget)
    {
        return Inertia::render('Budget/Show', [
            'budget' => $budget->load('lineItems'),
        ]);
    }

    public function edit(Budget $budget)
    {
        return Inertia::render('Budget/Edit', [
            'budget' => $budget->load('lineItems'),
        ]);
    }

    public function destroy(Budget $budget)
    {
        // Optional: delete line items manually if no ON DELETE CASCADE
        $budget->lineItems()->delete();

        $budget->delete();

        return redirect()->back()->with('success', 'Budget deleted successfully');
    }

    public function update(Request $request, Budget $budget)
    {
        $validated = $request->validate([
            // New budget title, still only used for Budget_title
            'title'     => 'required|string|max:255',
            'amount'    => 'required|numeric',
            'balance'   => 'required|numeric',

            // lineItems from EditBudgetModal
            'lineItems'               => 'nullable|array',
            'lineItems.*.Item_title'  => 'nullable|string',
            'lineItems.*.amount'      => 'nullable|numeric',
        ]);

        // 1) update only existing columns on budgets table
        $budget->update([
            'amount'  => $validated['amount'],
            'balance' => $validated['balance'],
        ]);

        // 2) rebuild line items
        $budget->lineItems()->delete();

        foreach ($validated['lineItems'] ?? [] as $item) {
            $budget->lineItems()->create([
                'Budget_title' => $validated['title'],
                'Item_title'   => $item['Item_title'] ?? null,
                'amount'       => $item['amount'] ?? 0,
            ]);
        }

        return redirect()->back()
            ->with('success', 'Budget updated successfully');
    }
}
