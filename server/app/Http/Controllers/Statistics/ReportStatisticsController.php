<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report as ReportModel;
use \Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReportStatisticsController extends Controller
{
    /**
     * Thống kê tổng số báo cáo
     *
     * @param Request $request
     * 
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        // statistics by type
        $statistics = ReportModel::select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->get();
        
        return response()->json(['data' => $statistics]);
    }


    /**
     * Thống kê báo cáo theo loại
     *
     * @param Request $request
     * 
     * @paramBody type : Loại báo cáo (user, post, comment, message)
     * 
     * @return JsonResponse
     */
    public function show(Request $request, string $type)
    {

        $reports = ReportModel::where('type', $type)->get();
        return response()->json(['data' => $reports]);
    }
}
