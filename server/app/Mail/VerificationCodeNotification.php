<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeNotification extends Mailable
{
    use Queueable, SerializesModels;

    protected $verification_code;


    public function __construct($verification_code)
    {
        $this->verification_code = $verification_code;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Mã xác minh',
        );
    }


    public function content(): Content
    {
        return new Content(
            view: 'mail.verification_code_mail',
            with: [
                'verification_code' => $this->verification_code,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
