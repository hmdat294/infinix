<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use App\Models\DisabledNotification as DisabledNotificationModel;
use App\Models\User as UserModel;
use App\Models\Conversation as ConversationModel;
use App\Models\Notification as NotificationModel;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\isEmpty;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();

        return NotificationResource::collection($notifications);
    }
    

    public function show(string $id)
    {
        $notification = NotificationModel::find($id);
        return new NotificationResource($notification);
    }

    public function update(Request $request, string $id)
    {
        $notification = NotificationModel::find($id);
        $notification->is_read = true;
        $notification->save();

        return new NotificationResource(NotificationModel::find($id));
    }

    public function update_all(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()->get();
        foreach ($notifications as $notification) {
            $notification->is_read = true;
            $notification->save();
        }
    }

    public function update_by_conversation(Request $request)
    {
        $conversation_id = $request->get('conversation_id');
        $user = $request->user();
        $notifications = $user->notifications()->where('conversation_id', $conversation_id)->get();
        foreach ($notifications as $notification) {
            $notification->is_read = true;
            $notification->save();
        }
    }

    public function destroy(string $id)
    {
        $notification = NotificationModel::find($id);
        $notification->delete();

        return response()->json([
            'data' => $notification
        ], 200);
    }

    public function destroy_all(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()->get();
        foreach ($notifications as $notification) {
            $notification->delete();
        }
    }

    public function destroy_by_conversation(Request $request)
    {
        $conversation_id = $request->get('conversation_id');
        $user = $request->user();
        $notifications = $user->notifications()->where('conversation_id', $conversation_id)->get();
        foreach ($notifications as $notification) {
            $notification->delete();
        }
    }
}
