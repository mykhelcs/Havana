<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Enter OTP</title>
    <style>
        body {font-family: Arial, sans-serif; background:#f5f5f5;}
        .container {max-width:400px;margin:80px auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
        .error {color:#d00;margin-top:8px;}
    </style>
</head>
<body>
<div class="container">
    <h2>Enter OTP</h2>
    @if ($errors->any())
        <div class="error">{{ $errors->first() }}</div>
    @endif
    <form method="POST" action="{{ route('otp.verify') }}">
        @csrf
        <div>
            <label for="otp">OTP Code</label><br>
            <input type="text" name="otp" id="otp" maxlength="6" required style="width:100%;padding:8px;margin-top:4px;"/>
        </div>
        <button type="submit" style="margin-top:12px;padding:8px 16px;">Verify</button>
    </form>
</div>
</body>
</html>
