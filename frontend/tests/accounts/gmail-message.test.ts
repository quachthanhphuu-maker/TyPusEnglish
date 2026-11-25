import { describe, expect, it } from 'vitest';
import { encodeGmailRawMessage } from '../../src/modules/accounts/lib/gmail-message';

describe('encodeGmailRawMessage', () => {
  it('encodes UTF-8 headers and body into a Gmail API raw message', () => {
    const raw = encodeGmailRawMessage({
      to: 'learner@example.test',
      from: 'TyPusEnglish <sender@gmail.com>',
      subject: 'Xác minh email TyPusEnglish',
      text: 'Mở liên kết này để xác minh tài khoản.',
    });
    const message = Buffer.from(raw, 'base64url').toString('utf8');
    const [headers, body] = message.split('\r\n\r\n');

    expect(headers).toContain('To: learner@example.test');
    expect(headers).toContain('From: TyPusEnglish <sender@gmail.com>');
    expect(headers).toContain('Subject: =?UTF-8?B?');
    expect(Buffer.from(body.replace(/\r\n/g, ''), 'base64').toString('utf8')).toBe('Mở liên kết này để xác minh tài khoản.');
  });

  it('rejects line breaks in message headers', () => {
    expect(() => encodeGmailRawMessage({
      to: 'learner@example.test\r\nBcc: attacker@example.test',
      from: 'TyPusEnglish <sender@gmail.com>',
      subject: 'Verify email',
      text: 'Open the link.',
    })).toThrow('INVALID_GMAIL_HEADER');
  });
});
