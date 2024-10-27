<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation as ConversationModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class ConversationGroupController extends Controller
{
    /**
     * Danh sách cuộc trò chuyện của người dùng
     * 
     * @param Request $request
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $conversations = $request->user()->conversations;

        return ConversationResource::collection($conversations);
    }

    /**
     * Tạo cuộc trò chuyện nhóm
     * 
     * @param Request $request
     * 
     * @bodyParam name : Tên cuộc trò chuyện
     * @bodyParam image : file Hình ảnh đại diện cho cuộc trò chuyện
     * 
     * @return ConversationResource
     */
    public function store(Request $request)
    {
        $conversation_data = $request->only(['name', 'image']);
        $conversation_data['is_group'] = true;
        $conversation_data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $conversation_data['image'] = asset('storage/' . $request->file('image')->store('uploads', 'public'));
        } else {
            $conversation_data['image'] = asset('storage/uploads/default-profile-photo.png');
        }

        $conversation = ConversationModel::create($conversation_data);
        $conversation->users()->attach($request->user()->id);

        return new ConversationResource($conversation);
    }

    
    /**
     * Xem thông tin cuộc trò chuyện nhóm
     * 
     * @param string $id
     * 
     * @return ConversationResource
     */
    public function show(string $id)
    {
        $conversation = ConversationModel::find($id);
        return new ConversationResource($conversation);
    }

    
    /**
     * Cập nhật thông tin cuộc trò chuyện nhóm
     * 
     * @param Request $request
     * @param string $id
     * 
     * @bodyParam name : Tên cuộc trò chuyện
     * @bodyParam image : file Hình ảnh đại diện cho cuộc trò chuyện
     * 
     * @return ConversationResource
     */
    public function update(Request $request, string $id)
    {
        $conversation = ConversationModel::find($id);
        $conversation->update($request->only(['name', 'image']));

        if ($request->hasFile('image')) {
            $conversation->image = asset('storage/' . $request->file('image')->store('uploads', 'public'));
            $conversation->save();
        }

        return new ConversationResource($conversation);
    }

    
    /**
     * Xóa cuộc trò chuyện nhóm
     * 
     * @param string $id
     * 
     * @return JsonResponse
     */
    public function destroy(string $id)
    {
        $conversation = ConversationModel::find($id);
        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully'], 200);
    }
}
