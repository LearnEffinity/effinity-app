
declare global {
  type UserMetadata = {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
    first_name?: string;
    last_name?: string;
    name?: string;
  };

  interface Identity {
    identity_id: string;
    id: string;
    user_id: string;
    provider: string;
  }

  interface User {
    app_metadata: {
      provider: string;
      providers: string[];
    };
    aud: string;
    confirmed_at: string;
    created_at: string;
    email: string;
    email_confirmed_at: string;
    id: string;
    identities: Identity[];
    is_anonymous: boolean;
    last_sign_in_at: string;
    phone: string;
    role: string;
    updated_at: string;
    user_metadata: UserMetadata;
  }
}
export {};
