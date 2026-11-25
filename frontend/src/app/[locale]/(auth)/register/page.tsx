import RegisterForm from './register-form';

export default function RegisterPage() {
  return <RegisterForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} zaloEnabled={Boolean(process.env.ZALO_APP_ID && process.env.ZALO_APP_SECRET)} />;
}
