<?php

namespace App\Modules\Inventory\Web\Controllers;

use App\Core\AuditLog\AuditLog;
use App\Http\Controllers\Controller;
use App\Modules\Inventory\Application\UseCases\CreateProduct;
use App\Modules\Inventory\Domain\DTOs\CreateProductDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\Category;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Inventory\Infrastructure\Models\Unit;
use App\Modules\Inventory\Web\Requests\ProductRequest;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with(['category', 'unit'])
            ->withStock()
            ->when(request('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%"))
            ->when(request('category_id'), fn ($q, $c) => $q->where('category_id', $c))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Inventory/Products/Index', [
            'products'   => $products,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters'    => request()->only('search', 'category_id'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Products/Form', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'units'      => Unit::orderBy('name')->get(['id', 'name', 'symbol']),
        ]);
    }

    public function store(ProductRequest $request, CreateProduct $useCase)
    {
        $product = $useCase->execute(new CreateProductDTO(...$request->validated()));

        return redirect()->route('products.index')
            ->with('success', "تم إضافة المنتج {$product->name} بنجاح");
    }

    public function show(Product $product, InventoryService $inventoryService): Response
    {
        $movements = $product->stockMovements()
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Inventory/Products/Show', [
            'product'   => $product->load(['category', 'unit']),
            'movements' => $movements,
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Inventory/Products/Form', [
            'product'    => $product,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'units'      => Unit::orderBy('name')->get(['id', 'name', 'symbol']),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $old = $product->toArray();
        $product->update($request->validated());
        AuditLog::record('updated', $product, $old, $product->toArray());

        return redirect()->route('products.index')
            ->with('success', 'تم تحديث المنتج بنجاح');
    }

    public function destroy(Product $product)
    {
        AuditLog::record('deleted', $product, $product->toArray(), []);
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'تم حذف المنتج بنجاح');
    }
}
