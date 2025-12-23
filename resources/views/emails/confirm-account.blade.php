<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Akun</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px 16px;
        }

        .email-wrapper {
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
        }

        .header {
            padding: 32px 24px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.2px;
        }

        .content {
            padding: 32px 28px;
        }

        .greeting {
            font-size: 17px;
            font-weight: 500;
            margin-bottom: 16px;
        }

        .message {
            font-size: 15px;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 20px;
        }

        .button-container {
            text-align: center;
            margin: 32px 0;
        }

        .button {
            display: inline-block;
            padding: 14px 36px;
            background-color: #111827;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.2px;
        }

        .note {
            font-size: 14px;
            color: #6b7280;
            margin-top: 24px;
        }

        .link-box {
            margin-top: 28px;
            padding: 16px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 13px;
            color: #6b7280;
            word-break: break-all;
        }

        .link-box strong {
            display: block;
            margin-bottom: 6px;
            color: #374151;
            font-weight: 600;
        }

        .footer {
            padding: 24px;
            text-align: center;
            background-color: #fafafa;
            border-top: 1px solid #e5e7eb;
        }

        .footer-text {
            font-size: 13px;
            color: #9ca3af;
            margin: 6px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <h1>Konfirmasi Akun</h1>
            </div>

            <div class="content">
                <p class="greeting">Halo {{ $userName }},</p>

                <p class="message">
                    Terima kasih telah mendaftar. Untuk menyelesaikan proses pendaftaran dan
                    mengaktifkan akun Anda, silakan lakukan konfirmasi dengan menekan tombol di bawah ini.
                </p>

                <div class="button-container">
                    <a href="{{ $confirmUrl }}" class="button">Konfirmasi Akun</a>
                </div>

                <p class="note">
                    Tautan konfirmasi ini akan kedaluwarsa dalam waktu <strong>60 menit</strong>
                    demi menjaga keamanan akun Anda.
                </p>

                <p class="note">
                    Jika Anda merasa tidak pernah membuat akun ini, silakan abaikan email ini.
                </p>

                <div class="link-box">
                    <strong>Atau salin dan tempel tautan berikut ke browser Anda:</strong>
                    {{ $confirmUrl }}
                </div>
            </div>

            <div class="footer">
                <p class="footer-text">Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
                <p class="footer-text">© {{ date('Y') }} Aplikasi Anda. Seluruh hak cipta dilindungi.</p>
            </div>
        </div>
    </div>
</body>
</html>
