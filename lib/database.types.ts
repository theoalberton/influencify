export type AccountType = "influencer" | "brand" | "admin";
export type PlanType = "free" | "influencer" | "brand" | "premium";
export type PlanStatus = "active" | "trialing" | "past_due" | "canceled";
export type DiscountType = "percentage" | "fixed" | "free_shipping" | "custom";
export type CampaignStatus = "active" | "paused" | "ended";
export type BrandInfluencerStatus = "invited" | "active" | "paused" | "removed";
export type LeadStatus = "new" | "sent" | "converted" | "lost";

export interface Profile {
  id: string;
  user_id: string;
  account_type: AccountType;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  plan_type: PlanType;
  plan_status: PlanStatus;
  created_at: string;
}

export interface Influencer {
  id: string;
  user_id: string;
  slug: string;
  display_name: string;
  bio: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  followers_count: number | null;
  niche: string | null;
  city: string | null;
  country: string | null;
  profile_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  company_name: string;
  slug: string;
  segment: string | null;
  website: string | null;
  instagram: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  slug: string;
  product_name: string | null;
  description: string | null;
  image_url: string | null;
  discount_type: DiscountType;
  discount_value: string | null;
  coupon_code: string | null;
  destination_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  required_fields: string[];
  meta_pixel_id: string | null;
  tiktok_pixel_id: string | null;
  google_tag_id: string | null;
  internal_notes: string | null;
  created_at: string;
}

export interface BrandInfluencer {
  id: string;
  brand_id: string;
  influencer_id: string;
  status: BrandInfluencerStatus;
  commission_type: string | null;
  commission_value: number | null;
  created_at: string;
}

export interface CampaignInfluencer {
  id: string;
  campaign_id: string;
  influencer_id: string;
  referral_code: string;
  public_url: string | null;
  status: "active" | "paused" | "removed";
  created_at: string;
}

export interface Referral {
  id: string;
  referral_code: string;
  influencer_id: string | null;
  campaign_id: string | null;
  parent_referral_code: string | null;
  clicks: number;
  leads_count: number;
  created_at: string;
}

export interface Lead {
  id: string;
  campaign_id: string | null;
  brand_id: string | null;
  influencer_id: string | null;
  referral_code: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  consent: boolean;
  source: string | null;
  medium: string | null;
  campaign_utm: string | null;
  status: LeadStatus;
  coupon_revealed: boolean;
  clicked_store: boolean;
  created_at: string;
}

export interface Click {
  id: string;
  campaign_id: string | null;
  influencer_id: string | null;
  referral_code: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  source: string | null;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  lead_limit: number | null;
  campaign_limit: number | null;
  ambassador_limit: number | null;
  features: string[];
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      influencers: { Row: Influencer; Insert: Partial<Influencer>; Update: Partial<Influencer> };
      brands: { Row: Brand; Insert: Partial<Brand>; Update: Partial<Brand> };
      campaigns: { Row: Campaign; Insert: Partial<Campaign>; Update: Partial<Campaign> };
      brand_influencers: {
        Row: BrandInfluencer;
        Insert: Partial<BrandInfluencer>;
        Update: Partial<BrandInfluencer>;
      };
      campaign_influencers: {
        Row: CampaignInfluencer;
        Insert: Partial<CampaignInfluencer>;
        Update: Partial<CampaignInfluencer>;
      };
      referrals: { Row: Referral; Insert: Partial<Referral>; Update: Partial<Referral> };
      leads: { Row: Lead; Insert: Partial<Lead>; Update: Partial<Lead> };
      clicks: { Row: Click; Insert: Partial<Click>; Update: Partial<Click> };
      plans: { Row: Plan; Insert: Partial<Plan>; Update: Partial<Plan> };
    };
  };
}
