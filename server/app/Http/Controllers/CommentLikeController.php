<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\CommentLike;

class CommentLikeController extends Controller
{
    public function index() {

    }

    public function store(Request $request) {
        $comment = PostComment::find($request->comment_id);

        $comment_like = CommentLike::where('comment_id', $comment->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($comment_like) {
            $comment_like->delete();
            return response()->json([
                'type' => 'unlike',
                'data' => new CommentResource(PostComment::find($request->comment_id)),
            ]);
        } else {
            CommentLike::create([
                'comment_id' => $comment->id,
                'user_id' => $request->user()->id,
            ]);
            return response()->json([
                'type' => 'like',
                'data' => new CommentResource(PostComment::find($request->comment_id)),
            ]);
        }
    }
}
