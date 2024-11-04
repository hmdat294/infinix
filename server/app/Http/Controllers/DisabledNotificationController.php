<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DisabledNotification as DisabledNotificationModel;

class DisabledNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data['user_id'] = $request->user()->id;
        $data['enable_at'] = now()->addHours($request->hours);

        if ($request->has('target_user_id')) {

            $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
                ->where('target_user_id', $request->target_user_id)
                ->first();

            if ($disabled_notification) {
                $disabled_notification->delete();
                return response()->json([
                    'message' => 'Đã bật thông báo',
                    'data' => $disabled_notification
                ], 200);
            } else {
                $data['target_user_id'] = $request->target_user_id;
                $data['type'] = 'user';

                $disabled_notification = DisabledNotificationModel::create($data);

                return response()->json([
                    'message' => 'Đã tắt thông báo',
                    'data' => $disabled_notification
                ], 200);
            }
        }

        else if ($request->has('conversation_id')) {
                
            $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
                ->where('conversation_id', $request->conversation_id)
                ->first();

            if ($disabled_notification) {
                $disabled_notification->delete();
                return response()->json([
                    'message' => 'Đã bật thông báo',
                    'data' => $disabled_notification
                ], 200);
            } else {
                $data['conversation_id'] = $request->conversation_id;
                $data['type'] = 'conversation';

                $disabled_notification = DisabledNotificationModel::create($data);

                return response()->json([
                    'message' => 'Đã tắt thông báo',
                    'data' => $disabled_notification
                ], 200);
            }
        }

        else {
                    
            $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
                ->where('post_id', $request->post_id)
                ->first();

            if ($disabled_notification) {
                $disabled_notification->delete();
                return response()->json([
                    'message' => 'Đã bật thông báo',
                    'data' => $disabled_notification
                ], 200);
            } else {
                $data['post_id'] = $request->post_id;
                $data['type'] = 'post';

                $disabled_notification = DisabledNotificationModel::create($data);

                return response()->json([
                    'message' => 'Đã tắt thông báo',
                    'data' => $disabled_notification
                ], 200);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
