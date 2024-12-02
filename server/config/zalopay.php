<?php

    return [
        'app_id' => env('ZALOPAY_APP_ID'),
        'key1' => env('ZALOPAY_KEY1'),
        'key2' => env('ZALOPAY_KEY2'),
        'endpoint' => env('ZALOPAY_ENDPOINT'),
        'endpoint_create' => env('ZALOPAY_ENDPOINT').'/v2/create',
        'endpoint_query' => env('ZALOPAY_ENDPOINT').'/v2/query',
        'endpoint_refund_order' => env('ZALOPAY_ENDPOINT').'/v2/refund',
        'endpoint_refund_order_status' => env('ZALOPAY_ENDPOINT').'/v2/query_refund',
        'callback_url' => env('ZALOPAY_CALLBACK_URL'),
    ];