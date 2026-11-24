export interface ZaloOAuthProfile {
  id: string;
  name?: string | null;
  picture?: { data?: { url?: string | null } } | null;
}

export function mapZaloProfile(profile: ZaloOAuthProfile) {
  return {
    id: profile.id,
    name: profile.name ?? null,
    email: null,
    image: profile.picture?.data?.url ?? null,
  };
}
