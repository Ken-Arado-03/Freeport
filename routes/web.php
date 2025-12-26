<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Laravel API is running. The React frontend is served separately (e.g. http://localhost:3000).',
    ]);
});