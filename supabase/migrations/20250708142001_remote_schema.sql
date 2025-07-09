create table "public"."company_deals" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "deal_type" text not null,
    "value" text,
    "terms" text,
    "start_date" timestamp with time zone default now(),
    "end_date" timestamp with time zone,
    "is_active" boolean default true,
    "click_count" integer default 0,
    "conversion_rate" numeric default 0,
    "affiliate_link" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."company_deals" enable row level security;

create table "public"."contact_messages" (
    "id" uuid not null default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "subject" text not null,
    "message" text not null,
    "status" text default 'new'::text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."contact_messages" enable row level security;

create table "public"."deals" (
    "id" uuid not null default gen_random_uuid(),
    "merchant_name" text not null,
    "title" text not null,
    "description" text not null,
    "terms" text,
    "commission_rate" numeric(5,2),
    "tracking_link" text not null,
    "start_date" timestamp with time zone default now(),
    "end_date" timestamp with time zone,
    "category" text not null default 'crypto'::text,
    "status" text not null default 'active'::text,
    "bonus_amount" text,
    "rating" numeric(2,1) default 4.5,
    "features" jsonb default '[]'::jsonb,
    "image_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."deals" enable row level security;

create table "public"."email_subscribers" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "subscribed_at" timestamp with time zone default now(),
    "status" text default 'active'::text
);


alter table "public"."email_subscribers" enable row level security;

create table "public"."ratings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "company_id" uuid not null,
    "review_id" uuid,
    "overall_rating" numeric not null,
    "platform_usability" numeric,
    "customer_support" numeric,
    "fees_commissions" numeric,
    "security_trust" numeric,
    "educational_resources" numeric,
    "mobile_app" numeric,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."ratings" enable row level security;

create table "public"."review_votes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "review_id" uuid not null,
    "vote_type" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."review_votes" enable row level security;

create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "company_id" uuid not null,
    "title" text not null,
    "content" text not null,
    "pros" text[],
    "cons" text[],
    "trading_experience_level" text,
    "account_type" text,
    "usage_duration" text,
    "would_recommend" boolean,
    "verified_user" boolean default false,
    "helpful_votes" integer default 0,
    "status" text default 'published'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."reviews" enable row level security;

create table "public"."trading_companies" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "slug" text not null,
    "description" text not null,
    "logo_url" text,
    "website_url" text not null,
    "founded_year" integer,
    "headquarters" text,
    "regulation" text[],
    "supported_markets" text[],
    "minimum_deposit" numeric,
    "commission_structure" text,
    "features" text[],
    "pros" text[],
    "cons" text[],
    "overall_rating" numeric default 0,
    "total_reviews" integer default 0,
    "category" text not null,
    "status" text default 'active'::text,
    "affiliate_link" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."trading_companies" enable row level security;

create table "public"."user_profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "avatar_url" text,
    "bio" text,
    "location" text,
    "trading_experience" text,
    "preferred_markets" text[],
    "email_notifications" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_profiles" enable row level security;

CREATE UNIQUE INDEX company_deals_pkey ON public.company_deals USING btree (id);

CREATE UNIQUE INDEX contact_messages_pkey ON public.contact_messages USING btree (id);

CREATE UNIQUE INDEX deals_pkey ON public.deals USING btree (id);

CREATE UNIQUE INDEX email_subscribers_email_key ON public.email_subscribers USING btree (email);

CREATE UNIQUE INDEX email_subscribers_pkey ON public.email_subscribers USING btree (id);

CREATE UNIQUE INDEX ratings_pkey ON public.ratings USING btree (id);

CREATE UNIQUE INDEX ratings_user_id_company_id_key ON public.ratings USING btree (user_id, company_id);

CREATE UNIQUE INDEX review_votes_pkey ON public.review_votes USING btree (id);

CREATE UNIQUE INDEX review_votes_user_id_review_id_key ON public.review_votes USING btree (user_id, review_id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX reviews_user_id_company_id_key ON public.reviews USING btree (user_id, company_id);

CREATE UNIQUE INDEX trading_companies_name_key ON public.trading_companies USING btree (name);

CREATE UNIQUE INDEX trading_companies_pkey ON public.trading_companies USING btree (id);

CREATE UNIQUE INDEX trading_companies_slug_key ON public.trading_companies USING btree (slug);

CREATE UNIQUE INDEX user_profiles_email_key ON public.user_profiles USING btree (email);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

alter table "public"."company_deals" add constraint "company_deals_pkey" PRIMARY KEY using index "company_deals_pkey";

alter table "public"."contact_messages" add constraint "contact_messages_pkey" PRIMARY KEY using index "contact_messages_pkey";

alter table "public"."deals" add constraint "deals_pkey" PRIMARY KEY using index "deals_pkey";

alter table "public"."email_subscribers" add constraint "email_subscribers_pkey" PRIMARY KEY using index "email_subscribers_pkey";

alter table "public"."ratings" add constraint "ratings_pkey" PRIMARY KEY using index "ratings_pkey";

alter table "public"."review_votes" add constraint "review_votes_pkey" PRIMARY KEY using index "review_votes_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."trading_companies" add constraint "trading_companies_pkey" PRIMARY KEY using index "trading_companies_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."company_deals" add constraint "company_deals_company_id_fkey" FOREIGN KEY (company_id) REFERENCES trading_companies(id) ON DELETE CASCADE not valid;

alter table "public"."company_deals" validate constraint "company_deals_company_id_fkey";

alter table "public"."company_deals" add constraint "company_deals_deal_type_check" CHECK ((deal_type = ANY (ARRAY['bonus'::text, 'discount'::text, 'free_trial'::text, 'cashback'::text, 'promotion'::text]))) not valid;

alter table "public"."company_deals" validate constraint "company_deals_deal_type_check";

alter table "public"."email_subscribers" add constraint "email_subscribers_email_key" UNIQUE using index "email_subscribers_email_key";

alter table "public"."ratings" add constraint "ratings_company_id_fkey" FOREIGN KEY (company_id) REFERENCES trading_companies(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_company_id_fkey";

alter table "public"."ratings" add constraint "ratings_customer_support_check" CHECK (((customer_support >= (1)::numeric) AND (customer_support <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_customer_support_check";

alter table "public"."ratings" add constraint "ratings_educational_resources_check" CHECK (((educational_resources >= (1)::numeric) AND (educational_resources <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_educational_resources_check";

alter table "public"."ratings" add constraint "ratings_fees_commissions_check" CHECK (((fees_commissions >= (1)::numeric) AND (fees_commissions <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_fees_commissions_check";

alter table "public"."ratings" add constraint "ratings_mobile_app_check" CHECK (((mobile_app >= (1)::numeric) AND (mobile_app <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_mobile_app_check";

alter table "public"."ratings" add constraint "ratings_overall_rating_check" CHECK (((overall_rating >= (1)::numeric) AND (overall_rating <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_overall_rating_check";

alter table "public"."ratings" add constraint "ratings_platform_usability_check" CHECK (((platform_usability >= (1)::numeric) AND (platform_usability <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_platform_usability_check";

alter table "public"."ratings" add constraint "ratings_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_review_id_fkey";

alter table "public"."ratings" add constraint "ratings_security_trust_check" CHECK (((security_trust >= (1)::numeric) AND (security_trust <= (5)::numeric))) not valid;

alter table "public"."ratings" validate constraint "ratings_security_trust_check";

alter table "public"."ratings" add constraint "ratings_user_id_company_id_key" UNIQUE using index "ratings_user_id_company_id_key";

alter table "public"."ratings" add constraint "ratings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_user_id_fkey";

alter table "public"."review_votes" add constraint "review_votes_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."review_votes" validate constraint "review_votes_review_id_fkey";

alter table "public"."review_votes" add constraint "review_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."review_votes" validate constraint "review_votes_user_id_fkey";

alter table "public"."review_votes" add constraint "review_votes_user_id_review_id_key" UNIQUE using index "review_votes_user_id_review_id_key";

alter table "public"."review_votes" add constraint "review_votes_vote_type_check" CHECK ((vote_type = ANY (ARRAY['helpful'::text, 'not_helpful'::text]))) not valid;

alter table "public"."review_votes" validate constraint "review_votes_vote_type_check";

alter table "public"."reviews" add constraint "reviews_company_id_fkey" FOREIGN KEY (company_id) REFERENCES trading_companies(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_company_id_fkey";

alter table "public"."reviews" add constraint "reviews_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'moderated'::text, 'rejected'::text]))) not valid;

alter table "public"."reviews" validate constraint "reviews_status_check";

alter table "public"."reviews" add constraint "reviews_trading_experience_level_check" CHECK ((trading_experience_level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text, 'expert'::text]))) not valid;

alter table "public"."reviews" validate constraint "reviews_trading_experience_level_check";

alter table "public"."reviews" add constraint "reviews_user_id_company_id_key" UNIQUE using index "reviews_user_id_company_id_key";

alter table "public"."reviews" add constraint "reviews_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_user_id_fkey";

alter table "public"."trading_companies" add constraint "trading_companies_category_check" CHECK ((category = ANY (ARRAY['crypto_exchange'::text, 'stock_broker'::text, 'forex_broker'::text, 'multi_asset'::text]))) not valid;

alter table "public"."trading_companies" validate constraint "trading_companies_category_check";

alter table "public"."trading_companies" add constraint "trading_companies_name_key" UNIQUE using index "trading_companies_name_key";

alter table "public"."trading_companies" add constraint "trading_companies_overall_rating_check" CHECK (((overall_rating >= (0)::numeric) AND (overall_rating <= (5)::numeric))) not valid;

alter table "public"."trading_companies" validate constraint "trading_companies_overall_rating_check";

alter table "public"."trading_companies" add constraint "trading_companies_slug_key" UNIQUE using index "trading_companies_slug_key";

alter table "public"."trading_companies" add constraint "trading_companies_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text]))) not valid;

alter table "public"."trading_companies" validate constraint "trading_companies_status_check";

alter table "public"."user_profiles" add constraint "user_profiles_email_key" UNIQUE using index "user_profiles_email_key";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_trading_experience_check" CHECK ((trading_experience = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text, 'expert'::text]))) not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_trading_experience_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_company_rating()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE trading_companies 
  SET 
    overall_rating = (
      SELECT COALESCE(AVG(overall_rating), 0)
      FROM ratings 
      WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE company_id = COALESCE(NEW.company_id, OLD.company_id) AND status = 'published'
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.company_id, OLD.company_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$
;

grant delete on table "public"."company_deals" to "anon";

grant insert on table "public"."company_deals" to "anon";

grant references on table "public"."company_deals" to "anon";

grant select on table "public"."company_deals" to "anon";

grant trigger on table "public"."company_deals" to "anon";

grant truncate on table "public"."company_deals" to "anon";

grant update on table "public"."company_deals" to "anon";

grant delete on table "public"."company_deals" to "authenticated";

grant insert on table "public"."company_deals" to "authenticated";

grant references on table "public"."company_deals" to "authenticated";

grant select on table "public"."company_deals" to "authenticated";

grant trigger on table "public"."company_deals" to "authenticated";

grant truncate on table "public"."company_deals" to "authenticated";

grant update on table "public"."company_deals" to "authenticated";

grant delete on table "public"."company_deals" to "service_role";

grant insert on table "public"."company_deals" to "service_role";

grant references on table "public"."company_deals" to "service_role";

grant select on table "public"."company_deals" to "service_role";

grant trigger on table "public"."company_deals" to "service_role";

grant truncate on table "public"."company_deals" to "service_role";

grant update on table "public"."company_deals" to "service_role";

grant delete on table "public"."contact_messages" to "anon";

grant insert on table "public"."contact_messages" to "anon";

grant references on table "public"."contact_messages" to "anon";

grant select on table "public"."contact_messages" to "anon";

grant trigger on table "public"."contact_messages" to "anon";

grant truncate on table "public"."contact_messages" to "anon";

grant update on table "public"."contact_messages" to "anon";

grant delete on table "public"."contact_messages" to "authenticated";

grant insert on table "public"."contact_messages" to "authenticated";

grant references on table "public"."contact_messages" to "authenticated";

grant select on table "public"."contact_messages" to "authenticated";

grant trigger on table "public"."contact_messages" to "authenticated";

grant truncate on table "public"."contact_messages" to "authenticated";

grant update on table "public"."contact_messages" to "authenticated";

grant delete on table "public"."contact_messages" to "service_role";

grant insert on table "public"."contact_messages" to "service_role";

grant references on table "public"."contact_messages" to "service_role";

grant select on table "public"."contact_messages" to "service_role";

grant trigger on table "public"."contact_messages" to "service_role";

grant truncate on table "public"."contact_messages" to "service_role";

grant update on table "public"."contact_messages" to "service_role";

grant delete on table "public"."deals" to "anon";

grant insert on table "public"."deals" to "anon";

grant references on table "public"."deals" to "anon";

grant select on table "public"."deals" to "anon";

grant trigger on table "public"."deals" to "anon";

grant truncate on table "public"."deals" to "anon";

grant update on table "public"."deals" to "anon";

grant delete on table "public"."deals" to "authenticated";

grant insert on table "public"."deals" to "authenticated";

grant references on table "public"."deals" to "authenticated";

grant select on table "public"."deals" to "authenticated";

grant trigger on table "public"."deals" to "authenticated";

grant truncate on table "public"."deals" to "authenticated";

grant update on table "public"."deals" to "authenticated";

grant delete on table "public"."deals" to "service_role";

grant insert on table "public"."deals" to "service_role";

grant references on table "public"."deals" to "service_role";

grant select on table "public"."deals" to "service_role";

grant trigger on table "public"."deals" to "service_role";

grant truncate on table "public"."deals" to "service_role";

grant update on table "public"."deals" to "service_role";

grant delete on table "public"."email_subscribers" to "anon";

grant insert on table "public"."email_subscribers" to "anon";

grant references on table "public"."email_subscribers" to "anon";

grant select on table "public"."email_subscribers" to "anon";

grant trigger on table "public"."email_subscribers" to "anon";

grant truncate on table "public"."email_subscribers" to "anon";

grant update on table "public"."email_subscribers" to "anon";

grant delete on table "public"."email_subscribers" to "authenticated";

grant insert on table "public"."email_subscribers" to "authenticated";

grant references on table "public"."email_subscribers" to "authenticated";

grant select on table "public"."email_subscribers" to "authenticated";

grant trigger on table "public"."email_subscribers" to "authenticated";

grant truncate on table "public"."email_subscribers" to "authenticated";

grant update on table "public"."email_subscribers" to "authenticated";

grant delete on table "public"."email_subscribers" to "service_role";

grant insert on table "public"."email_subscribers" to "service_role";

grant references on table "public"."email_subscribers" to "service_role";

grant select on table "public"."email_subscribers" to "service_role";

grant trigger on table "public"."email_subscribers" to "service_role";

grant truncate on table "public"."email_subscribers" to "service_role";

grant update on table "public"."email_subscribers" to "service_role";

grant delete on table "public"."ratings" to "anon";

grant insert on table "public"."ratings" to "anon";

grant references on table "public"."ratings" to "anon";

grant select on table "public"."ratings" to "anon";

grant trigger on table "public"."ratings" to "anon";

grant truncate on table "public"."ratings" to "anon";

grant update on table "public"."ratings" to "anon";

grant delete on table "public"."ratings" to "authenticated";

grant insert on table "public"."ratings" to "authenticated";

grant references on table "public"."ratings" to "authenticated";

grant select on table "public"."ratings" to "authenticated";

grant trigger on table "public"."ratings" to "authenticated";

grant truncate on table "public"."ratings" to "authenticated";

grant update on table "public"."ratings" to "authenticated";

grant delete on table "public"."ratings" to "service_role";

grant insert on table "public"."ratings" to "service_role";

grant references on table "public"."ratings" to "service_role";

grant select on table "public"."ratings" to "service_role";

grant trigger on table "public"."ratings" to "service_role";

grant truncate on table "public"."ratings" to "service_role";

grant update on table "public"."ratings" to "service_role";

grant delete on table "public"."review_votes" to "anon";

grant insert on table "public"."review_votes" to "anon";

grant references on table "public"."review_votes" to "anon";

grant select on table "public"."review_votes" to "anon";

grant trigger on table "public"."review_votes" to "anon";

grant truncate on table "public"."review_votes" to "anon";

grant update on table "public"."review_votes" to "anon";

grant delete on table "public"."review_votes" to "authenticated";

grant insert on table "public"."review_votes" to "authenticated";

grant references on table "public"."review_votes" to "authenticated";

grant select on table "public"."review_votes" to "authenticated";

grant trigger on table "public"."review_votes" to "authenticated";

grant truncate on table "public"."review_votes" to "authenticated";

grant update on table "public"."review_votes" to "authenticated";

grant delete on table "public"."review_votes" to "service_role";

grant insert on table "public"."review_votes" to "service_role";

grant references on table "public"."review_votes" to "service_role";

grant select on table "public"."review_votes" to "service_role";

grant trigger on table "public"."review_votes" to "service_role";

grant truncate on table "public"."review_votes" to "service_role";

grant update on table "public"."review_votes" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."trading_companies" to "anon";

grant insert on table "public"."trading_companies" to "anon";

grant references on table "public"."trading_companies" to "anon";

grant select on table "public"."trading_companies" to "anon";

grant trigger on table "public"."trading_companies" to "anon";

grant truncate on table "public"."trading_companies" to "anon";

grant update on table "public"."trading_companies" to "anon";

grant delete on table "public"."trading_companies" to "authenticated";

grant insert on table "public"."trading_companies" to "authenticated";

grant references on table "public"."trading_companies" to "authenticated";

grant select on table "public"."trading_companies" to "authenticated";

grant trigger on table "public"."trading_companies" to "authenticated";

grant truncate on table "public"."trading_companies" to "authenticated";

grant update on table "public"."trading_companies" to "authenticated";

grant delete on table "public"."trading_companies" to "service_role";

grant insert on table "public"."trading_companies" to "service_role";

grant references on table "public"."trading_companies" to "service_role";

grant select on table "public"."trading_companies" to "service_role";

grant trigger on table "public"."trading_companies" to "service_role";

grant truncate on table "public"."trading_companies" to "service_role";

grant update on table "public"."trading_companies" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

create policy "Anyone can view active deals"
on "public"."company_deals"
as permissive
for select
to anon, authenticated
using ((is_active = true));


create policy "Anyone can send contact messages"
on "public"."contact_messages"
as permissive
for insert
to public
with check (true);


create policy "Anyone can read active deals"
on "public"."deals"
as permissive
for select
to public
using ((status = 'active'::text));


create policy "Anyone can subscribe to newsletter"
on "public"."email_subscribers"
as permissive
for insert
to public
with check (true);


create policy "Anyone can view ratings"
on "public"."ratings"
as permissive
for select
to anon, authenticated
using (true);


create policy "Users can create ratings"
on "public"."ratings"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can delete own ratings"
on "public"."ratings"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Users can update own ratings"
on "public"."ratings"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Users can create votes"
on "public"."review_votes"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can delete own votes"
on "public"."review_votes"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Users can update own votes"
on "public"."review_votes"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Users can view all votes"
on "public"."review_votes"
as permissive
for select
to authenticated
using (true);


create policy "Anyone can view published reviews"
on "public"."reviews"
as permissive
for select
to anon, authenticated
using ((status = 'published'::text));


create policy "Users can create reviews"
on "public"."reviews"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can delete own reviews"
on "public"."reviews"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Users can update own reviews"
on "public"."reviews"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Anyone can view trading companies"
on "public"."trading_companies"
as permissive
for select
to anon, authenticated
using ((status = 'active'::text));


create policy "Users can insert own profile"
on "public"."user_profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Users can update own profile"
on "public"."user_profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id));


create policy "Users can view all profiles"
on "public"."user_profiles"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER update_company_rating_on_rating_change AFTER INSERT OR DELETE OR UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION update_company_rating();

CREATE TRIGGER update_company_rating_on_review_change AFTER INSERT OR DELETE OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_company_rating();


