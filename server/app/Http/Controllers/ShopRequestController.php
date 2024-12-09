<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShopRequestResource;
use Illuminate\Http\Request;
use App\Models\ShopRequest;

class ShopRequestController extends Controller
{
    public function index()
    {
        $shop_requests = ShopRequest::all();
        return ShopRequestResource::collection($shop_requests);
    }

    public function store(Request $request)
    {
        $shop_request_data = $request->only(['shop_id']);
        $shop_request_data['user_id'] = $request->user()->id;

        $shop_request = ShopRequest::create($shop_request_data);
        return new ShopRequestResource($shop_request);
    }

    public function show(Request $request, $id)
    {
        $shop_request = ShopRequest::findOrFail($id);
        return new ShopRequestResource($shop_request);
    }

    public function destroy(Request $request, $id)
    {
        $shop_request = ShopRequest::findOrFail($id);
        $shop_request->delete();
    }
}
