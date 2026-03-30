<?php

namespace App\Modules\Inventory\Web\Controllers;

use App\Core\AuditLog\AuditLog;
use App\Http\Controllers\Controller;
use App\Modules\Inventory\Application\UseCases\CreateItem;
use App\Modules\Inventory\Domain\DTOs\CreateItemDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\Item;
use App\Modules\Inventory\Infrastructure\Models\ItemGroup;
use App\Modules\Inventory\Infrastructure\Models\Unit;
use App\Modules\Inventory\Web\Requests\ItemRequest;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(): Response
    {
        $items = Item::with(['itemGroup', 'unit'])
            ->withStock()
            ->when(request('search'), fn($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%"))
            ->when(request('item_group_id'), fn($q, $g) => $q->where('item_group_id', $g))
            ->when(request('item_type'), fn($q, $t) => $q->where('item_type', $t))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Inventory/Items/Index', [
            'items'       => $items,
            'itemGroups'  => ItemGroup::orderBy('name')->get(['id', 'name']),
            'filters'     => request()->only('search', 'item_group_id', 'item_type'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Items/Form', [
            'itemGroups' => ItemGroup::withDepth()->defaultOrder()->get(['id', 'name', 'depth']),
            'units'      => Unit::orderBy('name')->get(['id', 'name', 'symbol']),
        ]);
    }

    public function store(ItemRequest $request, CreateItem $useCase)
    {
        $item = $useCase->execute(new CreateItemDTO(...$request->validated()));

        return redirect()->route('items.index')
            ->with('success', "تم إضافة الصنف {$item->name} بنجاح");
    }

    public function show(Item $item): Response
    {
        $movements = $item->stockMovements()
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Inventory/Items/Show', [
            'item'      => $item->load(['itemGroup', 'unit']),
            'movements' => $movements,
        ]);
    }

    public function edit(Item $item): Response
    {
        return Inertia::render('Inventory/Items/Form', [
            'item'       => $item,
            'itemGroups' => ItemGroup::withDepth()->defaultOrder()->get(['id', 'name', 'depth']),
            'units'      => Unit::orderBy('name')->get(['id', 'name', 'symbol']),
        ]);
    }

    public function update(ItemRequest $request, Item $item)
    {
        $old = $item->toArray();
        $item->update($request->validated());
        AuditLog::record('updated', $item, $old, $item->toArray());

        return redirect()->route('items.index')
            ->with('success', 'تم تحديث الصنف بنجاح');
    }

    public function destroy(Item $item)
    {
        AuditLog::record('deleted', $item, $item->toArray(), []);
        $item->delete();

        return redirect()->route('items.index')
            ->with('success', 'تم حذف الصنف بنجاح');
    }
}
