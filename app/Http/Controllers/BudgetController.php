<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Budget;
use App\Models\LineItem;

class BudgetController extends Controller
{
    public function index()
    {
        return Inertia::render('Budget/index');
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

        $budget = Budget::create([
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'balance' => $validated['balance'],
        ]);

        if (!empty($validated['line_items'])) {
            foreach ($validated['line_items'] as $item) {
                $budget->lineItems()->create($item);
            }
        }

        return redirect()->back()->with('success', 'Budget saved successfully');
    }

    public function show(Budget $budget)
    {
        return Inertia::render('Budget/Show', ['budget' => $budget]);
    }
}
