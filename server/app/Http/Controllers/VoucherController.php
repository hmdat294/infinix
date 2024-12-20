<?php

namespace App\Http\Controllers;

use App\Http\Resources\VoucherResource;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\Voucher;
use App\Models\Shop;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VoucherController extends Controller
{
    public function index()
    {

    }

    public function store(Request $request)
    {

        if (Voucher::where('code', $request->code)->exists()) {
            return response()->json(['message' => 'Voucher code already exists']);
        }

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

        if ($request->has('code'))
        {
            if (!Voucher::where('code', $request->code)->exists()) {
                return response()->json(['message' => 'Voucher code not found']);
            }
        }

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
        $vouchers = $shop->vouchers()->orderBy('created_at', 'desc')->get();

        return VoucherResource::collection($vouchers);
    }

    public function byCode(Request $request, $code)
    {
        $voucher = Voucher::where('code', $code)->first();
        return new VoucherResource($voucher);
    }

    public function saveCode(Request $request)
    {
        $code = $request->code;
        $voucher = Voucher::where('code', $code)->first();
        Log::info($voucher);
        $voucher->user()->attach($request->user()->id, ['is_saved' => true]);
    }

    public function validVouchers(Request $request)
    {
        $vouchers = DB::table('vouchers')
        ->leftJoin('voucher_users', 'vouchers.id', '=', 'voucher_users.voucher_id')
        ->select('vouchers.*', DB::raw('SUM(voucher_users.use_count) as total_usage'))
        ->where('vouchers.valid_from', '<', Carbon::now())
        ->where('vouchers.valid_until', '>', Carbon::now())
        ->where('vouchers.stock', '>', 0)
        ->where('vouchers.is_active', true)
        ->groupBy('vouchers.id')
        ->havingRaw('(vouchers.usage_limit < 0 OR vouchers.usage_limit > total_usage)')
        ->get();

        return VoucherResource::collection($vouchers);
    }

    public function savedVouchers(Request $request)
    {
        $user = $request->user();
        
        $vouchers = $user->vouchers()->wherePivot('is_saved', true)->get();
        return VoucherResource::collection($vouchers);
    }
}
