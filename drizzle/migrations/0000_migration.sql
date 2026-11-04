create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- first registered user becomes the owner/admin
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles(user_id, role) values (new.id, 'user');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_role after insert on auth.users for each row execute function public.handle_new_user_role();

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin write settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.bots (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_fa text not null default '', title_en text not null default '',
  short_fa text not null default '', short_en text not null default '',
  features_fa text[] not null default '{}', features_en text[] not null default '{}',
  image_url text not null default '',
  link text not null default 'https://t.me/Siavashska',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.bots to anon, authenticated;
grant insert, update, delete on public.bots to authenticated;
grant all on public.bots to service_role;
alter table public.bots enable row level security;
create policy "public read bots" on public.bots for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin write bots" on public.bots for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title_fa text not null default '', title_en text not null default '',
  desc_fa text not null default '', desc_en text not null default '',
  icon text not null default 'Bot',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public read services" on public.services for select to anon, authenticated using (true);
create policy "admin write services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null, contact text not null, body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "anyone can send" on public.messages for insert to anon, authenticated with check (char_length(name) between 1 and 100 and char_length(contact) between 1 and 200 and char_length(body) between 1 and 3000);
create policy "admin reads messages" on public.messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin updates messages" on public.messages for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin deletes messages" on public.messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));

insert into public.site_settings(key, value) values
('general', '{"hero_title_fa":"با SK Team به آینده سفر کنید","hero_title_en":"Travel to the Future with SK Team","hero_desc_fa":"تیم SK Team با طراحی ربات‌های هوشمند و سایت‌های اختصاصی، به رشد و رونق کسب و کار شما سرعت می‌بخشد.","hero_desc_en":"SK Team accelerates your business growth by designing smart bots and custom websites.","about_fa":"تیم SK Team متشکل از برنامه‌نویسان متخصص و خلاق است که با هدف رونق کسب و کارها در فضای مجازی شکل گرفته است. ما با طراحی ربات‌های هوشمند و اتوماسیون‌های پیشرفته، ابزارهای لازم برای رشد و مدیریت آسان‌تر شبکه‌های اجتماعی شما را فراهم می‌کنیم. تخصص ما ساخت ربات‌های سفارشی و اختصاصی برای شماست.","about_en":"SK Team consists of expert and creative programmers formed to boost businesses in cyberspace. We provide tools to grow and easily manage your social networks with smart bots and automations. Our specialty is building custom bots for you.","telegram_support":"https://t.me/Siavashska","telegram_channel":"https://t.me/Skteamchnl","email":"sk.team.it@gmail.com","instagram":"https://instagram.com/","website":"https://skteam.ir"}');

insert into public.bots(slug,title_fa,title_en,short_fa,short_en,features_fa,features_en,image_url,sort_order) values
('music-player','ربات موزیک پلیر','Music Player Bot','پخش و دانلود آنلاین موزیک با کیفیت ۳۲۰، همراه با ۴۰ اسکین اختصاصی.','Stream and download high-quality 320kbps music with 40+ custom skins.',array['🎧 پخش و دانلود با کیفیت ۳۲۰','🌐 پشتیبانی از یوتیوب و ساندکلود','🎨 بیش از ۴۰ اسکین قابل تغییر','🎛 اکولایزر حرفه‌ای','📂 آرشیو کامل فایل‌ها'],array['🎧 Stream & Download in 320kbps','🌐 Supports YouTube & SoundCloud','🎨 40+ customizable skins','🎛 Professional Equalizer','📂 Complete file archive'],'/__l5e/assets-v1/d8feff13-8662-4521-9af4-a67ff155af57/robot_headphones_transparent.png',1),
('video-player','ربات ویدیو پلیر','Video Player Bot','پخش آنلاین شبکه‌های تلویزیونی و فایل‌های تصویری در گروه.','Stream live TV channels and video files directly in your group.',array['📺 پخش زنده تلویزیون','🎬 پخش فایل‌های ویدیویی','🚀 استریم بدون لگ'],array['📺 Live TV Streaming','🎬 Video File Playback','🚀 Lag-free streaming'],'/__l5e/assets-v1/3736d3bf-a87b-4904-8d18-9b8dec557bca/logo_video_player.png',2),
('group-manager','ربات مدیریت گروه','Group Manager Bot','کامل‌ترین سیستم مدیریت گروه با هوش مصنوعی، فیلتر و ربات موزیک.','The most complete group management OS with AI, NSFW filter, and music bot.',array['🔐 سیستم کامل اخطار، بن، سکوت','🤖 هوش مصنوعی پاسخگو','💎 سیستم فروش اشتراک','🎵 مجهز به موزیک‌پلیر و رکوردر','🎮 مجموعه کامل بازی‌ها','📢 کانال لاگ اختصاصی'],array['🔐 Complete warn, ban, mute system','🤖 Automatic AI replies','💎 Subscription system','🎵 Music player & recorder','🎮 Complete game collection','📢 Dedicated log channel'],'/__l5e/assets-v1/8ac083ee-7a27-476e-bd96-1f5de3a48a78/logo_white2_transparent.png',3),
('voice-recorder','ریکوردر ویس‌کال','Voice Call Recorder','ضبط خودکار مکالمات ویس‌کال و ارسال به پیوی مدیر.','Auto-record voice call conversations and send to admin PV.',array['🎧 ضبط کامل مکالمات','⏱ تنظیم بازه زمانی کلیپ','🎛 روشن/خاموش توسط مدیر','📥 ارسال امن به پیوی'],array['🎧 Full conversation recording','⏱ Custom clip intervals','🎛 Admin on/off control','📥 Secure PV delivery'],'/__l5e/assets-v1/acb8bdf4-ee73-43a4-afb6-669860041d88/logo_voice_recorder_robot_mic_wave.png',4),
('content-guard','ربات گارد محتوا (+18)','Content Guard Bot (+18)','فیلتر هوشمند محتوای نامناسب با ۳ سطح حساسیت.','Smart inappropriate content filter with 3 sensitivity levels.',array['🎚 ۳ سطح حساسیت','🖼 شناسایی عکس و فیلم','🗑 حذف و اخطار خودکار','⚖️ سیستم تنبیه (سکوت/بن)','⚠️ ارائه به صورت اشتراک جداگانه'],array['🎚 3 sensitivity levels','🖼 Image & video detection','🗑 Auto-delete & warn','⚖️ Punishment system (mute/ban)','⚠️ Offered as a separate subscription'],'/__l5e/assets-v1/bef7530a-2211-4e78-afc9-5ebc5c132776/logo_nsfw_robot_icon1.png',5),
('self-bot','ربات سلف','Self Bot','نصب روی اکانت شخصی با امکانات منشی هوشمند و پاسخ خودکار.','Installed on your personal account with smart assistant features.',array['⚠️ نصب روی اکانت شخصی','⛔️ ساعت و فونت روی بیو','❈ خواندن خودکار پیام‌ها','⚙️ پاسخ خودکار','📖 امکانات بیشتر پس از خرید'],array['⚠️ Installs on personal account','⛔️ Bio clocks and fonts','❈ Auto-read messages','⚙️ Auto reply','📖 More features after purchase'],'/__l5e/assets-v1/06e64d71-002f-4e05-8dd8-7b2da33dc70f/logo_watch_spy_robot.png',6);

insert into public.services(title_fa,title_en,desc_fa,desc_en,icon,sort_order) values
('ربات‌های پیام‌رسان','Messenger Bots','طراحی و ساخت ربات برای تلگرام، ایتا، بله و روبیکا بر اساس نیاز شما.','Design and build bots for Telegram, Eitaa, Bale, and Rubika based on your needs.','Bot',1),
('طراحی وب‌سایت','Web Design','طراحی انواع سایت شرکتی، فروشگاهی و شخصی با بالاترین کیفیت.','Designing corporate, e-commerce, and personal websites with the highest quality.','Globe',2),
('مدیریت شبکه‌های مجازی','Social Media Management','مدیریت و رونق کسب و کار شما با ربات‌های منشی و پاسخگوی خودکار.','Manage and boost your business with intelligent assistant bots.','MessagesSquare',3);