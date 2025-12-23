<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-wrapper {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .message {
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #dc2626;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #b91c1c;
        }
        .warning-box {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .warning-text {
            color: #991b1b;
            font-size: 14px;
            margin: 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.5;
            margin: 5px 0;
        }
        .link-text {
            margin-top: 25px;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 6px;
            word-break: break-all;
            font-size: 13px;
            color: #6b7280;
        }
        .link-label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <h1>Reset Your Password</h1>
            </div>
            
            <div class="content">
                <p class="greeting">Hello {{ $userName }},</p>
                
                <p class="message">
                    We received a request to reset your password. Click the button below to create a new password:
                </p>
                
                <div class="button-container">
                    <a href="{{ $resetUrl }}" class="button">Reset My Password</a>
                </div>
                
                <div class="warning-box">
                    <p class="warning-text">
                        <strong>Important:</strong> This link will expire in 60 minutes for security reasons.
                    </p>
                </div>
                
                <p class="message">
                    If you didn't request a password reset, please ignore this email. 
                    Your password will remain unchanged and your account is secure.
                </p>
                
                <div class="link-text">
                    <span class="link-label">Or copy and paste this URL into your browser:</span>
                    {{ $resetUrl }}
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">This is an automated message, please do not reply.</p>
                <p class="footer-text">If you're having trouble, please contact support.</p>
                <p class="footer-text">© {{ date('Y') }} Your Application. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>