<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShopResource;
use Illuminate\Http\Request;
use App\Models\Shop as ShopModel;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $shops = ShopModel::all();

        return response()->json(['data' => ShopResource::collection($shops)]);
    }

    public function store(Request $request)
    {
        $shop_data = $request->only(['name', 'description', 'address', 'phone_number']);
        $shop_data['user_id'] = $request->user()->id;

        if ($request->hasFile('logo')) {
            $shop_data['logo'] = asset('storage/' . $request->file('logo')->store('uploads', 'public'));
        } else {
            $shop_data['logo'] = asset('storage/uploads/default-profile-photo.png');
        }

        $shop = ShopModel::create($shop_data);

        return new ShopResource($shop);
    }

    public function show(Request $request, $id)
    {
        $shop = ShopModel::findOrFail($id);

        return new ShopResource($shop);
    }

    public function update(Request $request, $id)
    {
        $shop = ShopModel::findOrFail($id);

        $shop_data = $request->only(['name', 'description', 'address', 'phone_number']);

        if ($request->hasFile('logo')) {
            $shop_data['logo'] = asset('storage/' . $request->file('logo')->store('uploads', 'public'));
        }

        $shop->update($shop_data);

        return new ShopResource($shop);
    }

    public function destroy(Request $request, $id)
    {
        $shop = ShopModel::findOrFail($id);

        $shop->delete();

        return response()->json(['message' => 'Shop deleted successfully']);
    }

    public function search(Request $request)
    {
        $shops = ShopModel::where('name', 'like', '%' . $request->query('q') . '%')->get();

        return ShopResource::collection($shops);
    }

}
