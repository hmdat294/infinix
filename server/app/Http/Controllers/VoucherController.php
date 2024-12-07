<?php

namespace App\Http\Controllers;

use App\Http\Resources\VoucherResource;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\Voucher;
use App\Models\Shop;

class VoucherController extends Controller
{
    public function index()
    {

    }

    public function store(Request $request)
    {
        $voucher_data = $request->only(['shop_id', 'code', 'discount', 'min_price', 'max_discount', 'usage_limit', 'valid_from', 'valid_until', 'stock', 'is_active', 'is_unlimited']);
        $voucher = Voucher::create($voucher_data);

        if ($request->has('apply_to_products')) {
            $voucher->products()->sync($request->apply_to_products);
        }

        return new VoucherResource($voucher);
    }

    public function show($id)
    {
        $voucher = Voucher::findOrFail($id);
        return new VoucherResource($voucher);
    }

    public function update(Request $request, $id)
    {
        $voucher = Voucher::findOrFail($id);
        $update_data = $request->only('shop_id', 'code', 'discount', 'min_price', 'max_discount', 'usage_limit', 'valid_from', 'valid_until', 'stock', 'is_active', 'is_unlimited');
        $voucher->update($update_data);
        if ($request->has('apply_to_products')) {
            $voucher->products()->sync($request->apply_to_products);
        }

        return new VoucherResource($voucher);
    }

    public function destroy($id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->products()->detach();
        $voucher->delete();
        
        return response()->json(['message' => 'Voucher deleted successfully']);
    }

    public function byShop(Request $request)
    {
        $shop = Shop::findOrFail($request->shop_id);
        $vouchers = $shop->vouchers;

        return VoucherResource::collection($vouchers);
    }

    public function byCode(Request $request, $code)
    {
        $voucher = Voucher::where('code', $code)->first();
        return new VoucherResource($voucher);
    }
}
