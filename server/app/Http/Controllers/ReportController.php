<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report as ReportModel;
use App\Models\Post as PostModel;
use App\Models\Message as MessageModel;
use App\Models\PostComment as PostCommentModel;
use App\Http\Resources\ReportResource;
class ReportController extends Controller
{
    
    public function index()
    {
        $reports = ReportModel::orderBy('created_at', 'desc')->paginate(10);
        return ReportResource::collection($reports)->additional([
            'meta' => [
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->only(['content']);

        $data['sender_id'] = $request->user()->id;
        $data['status'] = 'pending';

        if ($request->has('user_id')) {
            $data['type'] = 'user';
            $data['user_id'] = $request->input('user_id');
        } else if ($request->has('post_id')) {
            $data['type'] = 'post';
            $data['post_id'] = $request->input('post_id');
            $post = PostModel::find($data['post_id']);
            $data['user_id'] = $post->user_id;
        } else if ($request->has('comment_id')) {
            $data['type'] = 'comment';
            $data['comment_id'] = $request->input('comment_id');
            $comment = PostCommentModel::find($data['comment_id']);
            $data['user_id'] = $comment->user_id;
        } else {
            $data['type'] = 'message';
            $data['message_id'] = $request->input('message_id');
            $message = MessageModel::find($data['message_id']);
            $data['user_id'] = $message->user_id;
        }
        

        $report = ReportModel::create($data);
        return new ReportResource($report);
    }


    public function show(string $id)
    {
        $report = ReportModel::find($id);
        return new ReportResource($report);
    }

    /**
     * Cập nhật trạng thái báo cáo
     * 
     * @param Request $request
     * @param string $id
     * 
     * @bodyParam status : Trạng thái báo cáo (pending, resolved)
     * 
     * @return ReportResource
     */
    public function update(Request $request, string $id)
    {
        $report = ReportModel::find($id);
        $report->status = $request->input('status');
        $report->save();
        return new ReportResource($report);
    }


    public function destroy(string $id)
    {
        $report = ReportModel::find($id);
        $report->delete();
        return response()->json([
            'message' => 'Report deleted successfully.',
        ]);
    }
}
