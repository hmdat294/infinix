<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category as CategoryModel;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = CategoryModel::all()->sortByDesc('created_at');

        return CategoryResource::collection($categories);
    }

    public function store(Request $request)
    {
        $category_data = $request->only(['shop_id', 'name']);

        $category = CategoryModel::create($category_data);

        return new CategoryResource($category);
    }

    public function show(Request $request, $id)
    {
        $category = CategoryModel::findOrFail($id);

        return new CategoryResource($category);
    }

    public function update(Request $request, $id)
    {
        $category = CategoryModel::findOrFail($id);

        $category_data = $request->only(['name']);

        $category->update($category_data);

        return new CategoryResource($category);
    }

    public function destroy(Request $request, $id)
    {
        $category = CategoryModel::findOrFail($id);

        $category->delete();
    }

}
