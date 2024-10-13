<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation as ConversationModel;

class ConversationGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $conversations = $request->user()->conversations;

        return ConversationResource::collection($conversations);
    }

    
    public function store(Request $request)
    {
        $conversation_data = $request->only(['name', 'image']);
        $conversation_data['is_group'] = true;
        $conversation_data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $conversation_data['image'] = asset('storage/' . $request->file('image')->store('uploads', 'public'));
        }

        $conversation = ConversationModel::create($conversation_data);
        $conversation->users()->attach($request->user()->id);

        return new ConversationResource($conversation);
    }

    
    public function show(string $id)
    {
        $conversation = ConversationModel::find($id);
        return new ConversationResource($conversation);
    }

    
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

    
    public function destroy(string $id)
    {
        $conversation = ConversationModel::find($id);
        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully'], 200);
    }
}
