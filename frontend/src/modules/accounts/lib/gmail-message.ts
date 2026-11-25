interface GmailMessageInput {
  to: string;
  from: string;
  subject: string;
  text: string;
}

function assertSafeHeader(value: string): void {
  if (/[\r\n\0]/.test(value)) throw new Error('INVALID_GMAIL_HEADER');
}

function encodeHeader(value: string): string {
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
}

function wrapBase64(value: string): string {
  return value.match(/.{1,76}/g)?.join('\r\n') ?? '';
}

export function encodeGmailRawMessage({ to, from, subject, text }: GmailMessageInput): string {
  for (const header of [to, from, subject]) assertSafeHeader(header);

  const mimeMessage = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(Buffer.from(text, 'utf8').toString('base64')),
  ].join('\r\n');

  return Buffer.from(mimeMessage, 'utf8').toString('base64url');
}
