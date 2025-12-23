<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfirmAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $confirmUrl;

    public function __construct($userName, $confirmUrl)
    {
        $this->userName = $userName;
        $this->confirmUrl = $confirmUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirm Your Account',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.confirm-account',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}