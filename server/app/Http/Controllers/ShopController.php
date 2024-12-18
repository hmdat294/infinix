<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShopResource;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\Shop as ShopModel;
use App\Events\NotificationEvent;

use function Psy\sh;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $shops = ShopModel::all()->sortByDesc('created_at');

        return ShopResource::collection($shops);
    }

    public function store(Request $request)
    {
        $shop = ShopModel::where('user_id', $request->user()->id)->first();

        if ($shop) {
            return response()->json(['message' => 'User already has a shop']);
        }

        $shop_data = $request->only(['name', 'description', 'address', 'phone_number', 'bank_name', 'bank_account_number', 'is_active']);
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

        $shop_data = $request->only(['name', 'description', 'address', 'phone_number', 'bank_name', 'bank_account_number', 'is_active']);

        if ($request->hasFile('logo')) {
            $shop_data['logo'] = asset('storage/' . $request->file('logo')->store('uploads', 'public'));
        }

        if ($request->has('is_active')) {
            if ($shop->is_active == false && $request->is_active == true) {
                $notification = Notification::create([
                    'user_id' => $shop->user_id,
                    'action_type' => 'shop_active',
                    'target_user_id' => $request->user()->id,
                    'shop_id' => $shop->id
                ]);
                event(new NotificationEvent($notification));
            }
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
