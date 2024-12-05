<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\User;
use App\Http\Resources\ReviewResource;
use App\Models\Product;

class ReviewController extends Controller
{
    public function index(Request $request, $id)
    {
        $review = Product::find($id)->reviews;
        return ReviewResource::collection($review);
    }

    public function store(Request $request, $id)
    {
        $review_data = $request->only('rating', 'content');
        $review_data['user_id'] = $request->user()->id;
        $review_data['product_id'] = $id;

        $review = Review::create($review_data);
        return new ReviewResource($review);
    }

}
