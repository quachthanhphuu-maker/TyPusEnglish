import LoginForm from './login-form';

export default function LoginPage() {
  return <LoginForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} zaloEnabled={Boolean(process.env.ZALO_APP_ID && process.env.ZALO_APP_SECRET)} />;
}
