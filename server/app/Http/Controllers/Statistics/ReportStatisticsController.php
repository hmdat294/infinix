<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report as ReportModel;
use \Illuminate\Http\JsonResponse;

class ReportStatisticsController extends Controller
{
    /**
     * Thống kê tổng số báo cáo
     *
     * @param Request $request
     * 
     * @return JsonResponse
     */
    public function totalReports(Request $request)
    {
        $totalReports = ReportModel::count();
        return response()->json(['data' => $totalReports]);
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
    public function reportsByType(Request $request)
    {
        $type = $request->get('type', 'post');

        $reports = ReportModel::where('type', $type)->get();
        return response()->json(['data' => $reports]);
    }
}
