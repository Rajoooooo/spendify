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
                return [
                    'id'           => $b->id,
                    'title'        => $b->title,
                    'amount'       => $b->amount,
                    'balance'      => $b->balance,
                    'date'         => $b->created_at->format('Y-m-d'),
                    'budget_title' => optional($b->lineItems->first())->Budget_title,
                    'lineItems'    => $b->lineItems->map(function ($item) {
                        return [
                            'id'           => $item->id,
                            'Item_title'   => $item->Item_title,
                            'amount'       => $item->amount,
                        ];
                    }),
                ];
            });

        return Inertia::render('Budget/index', [
            'budgets' => $budgets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'amount'       => 'required|numeric',
            'balance'      => 'required|numeric',

            // Accept BOTH formats
            'line_items'                => 'array',
            'line_items.*.title'        => 'nullable|string|max:255',
            'line_items.*.amount'       => 'nullable|numeric',
        ]);

        $lineItems = $validated['line_items'] ?? [];

        $budget = Budget::create([
            'title'   => $validated['title'],
            'amount'  => $validated['amount'],
            'balance' => $validated['balance'],
        ]);

        foreach ($lineItems as $item) {
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
            'budget' => $budget->load('lineItems')
        ]);
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();
        return redirect()->back()->with('success', 'Budget deleted successfully');
    }

    public function edit(Budget $budget)
    {
        return Inertia::render('Budget/Edit', [
            'budget' => $budget->load('lineItems')
        ]);
    }

    public function update(Request $request, Budget $budget)
    {
        // Accept both create/update formats
        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'amount'    => 'required|numeric',
            'balance'   => 'required|numeric',

            'lineItems'               => 'array',
            'lineItems.*.Item_title'  => 'nullable|string',
            'lineItems.*.amount'      => 'nullable|numeric',
        ]);

        $budget->update([
            'title'   => $validated['title'],
            'amount'  => $validated['amount'],
            'balance' => $validated['balance'],
        ]);

        $budget->lineItems()->delete();

        foreach ($validated['lineItems'] as $item) {
            $budget->lineItems()->create([
                'Budget_title' => $validated['title'],
                'Item_title'   => $item['Item_title'],
                'amount'       => $item['amount'],
            ]);
        }

        return redirect()->back()
            ->with('success', 'Budget updated successfully');
    }
}
