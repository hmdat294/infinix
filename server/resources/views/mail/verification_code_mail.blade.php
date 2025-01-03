ng <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Code</title>
    <style>
        * {
            font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        #logo {
            display: block;
            margin: 25px auto;
            width: 200px;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #0000001A;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px;
            background-color: #005FB8FF;
            color: white;
            border-radius: 8px 8px 0 0;
        }

        .header > h2 {
            font-size: 20px;
            line-height: 24px;
            letter-spacing: 0%;
            font-weight: 600;
            margin: 0px;
        }

        .content {
            padding: 20px;
            text-align: center;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #003E92FF;
            padding: 10px;
            background-color: #f0f8ff;
            display: inline-block;
            border-radius: 8px;
        }
        .footer {
            padding: 10px;
            text-align: center;
            color: #0000009E;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <img id="logo" src="{{ url('image/logo.png') }}" alt="">
    <div class="container">
        <div class="header">
            <h2>Xác thực địa chỉ email</h2>
        </div>
        <div class="content">
            <p>Xin chào,</p>
            <p>Để tiếp tục việc thiết lập tài khoản, vui lòng sử dụng mã xác minh gồm 6 chữ số sau:</p>
            <div class="code">{{$verification_code}}</div>
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Infinix. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
