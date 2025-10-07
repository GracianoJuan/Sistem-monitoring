<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="logo.ico" type="image/x-icon">
    
    <title>Pengadaan & Amandemen Dashboard</title>
    @viteReactRefresh
    @vite(['resources/js/main.jsx'])
</head>

<body>
    <div id="app"></div>
</body>

</html>
