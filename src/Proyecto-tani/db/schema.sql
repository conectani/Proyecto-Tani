-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- Limpieza preventiva de tablas previas para evitar colisiones
drop table if exists public.hitos_completados_bebe cascade;
drop table if exists public.hitos_desarrollo cascade;
drop table if exists public.materiales_educativos cascade;
drop table if exists public.anuncios cascade;
drop table if exists public.notas_cita cascade;
drop table if exists public.citas cascade;
drop table if exists public.bebes cascade;
drop table if exists public.usuarios cascade;
drop function if exists public.handle_new_user() cascade;


-- =========================================================================
-- TABLA: usuarios
-- Guarda el perfil público del usuario registrado (vinculado a auth.users)
-- =========================================================================
create table public.usuarios (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  nombre text not null,
  apellido text not null,
  dni text unique not null,
  telefono text,
  rol text default 'madre' check (rol in ('madre', 'admin')) not null,
  fecha_registro timestamp with time zone default timezone('utc'::text, now()) not null,
  token_push text
);

-- Habilitar Row Level Security (RLS)
alter table public.usuarios enable row level security;

-- Helper para verificar rol de administrador en RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', 'madre') = 'admin';
$$;

-- Políticas de Seguridad RLS para "usuarios"
create policy "Usuarios pueden ver su propio perfil" 
  on public.usuarios for select 
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil" 
  on public.usuarios for update 
  using (auth.uid() = id);

create policy "Admins pueden ver todos los perfiles de usuario"
  on public.usuarios for select
  using (
    public.is_admin()
  );

create policy "Admins pueden modificar cualquier usuario"
  on public.usuarios for all
  using (
    public.is_admin()
  );

-- Trigger para crear el perfil automáticamente cuando se registre en Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, email, nombre, apellido, dni, telefono, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', 'Mariana'),
    coalesce(new.raw_user_meta_data->>'apellido', 'Garcia'),
    coalesce(new.raw_user_meta_data->>'dni', '00000000'),
    new.raw_user_meta_data->>'telefono',
    coalesce(new.raw_user_meta_data->>'rol', 'madre')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =========================================================================
-- TABLA: bebes
-- Guarda los perfiles de los bebés asociados a cada familia
-- =========================================================================
create table public.bebes (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  nombre text not null,
  fecha_nacimiento date not null,
  peso_inicial text, -- Ej: "7.2 kg"
  foto_url text,
  es_favorito boolean default false,
  es_activo boolean default false,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bebes enable row level security;

-- Políticas RLS para "bebes"
create policy "Usuarios pueden ver sus propios bebes" 
  on public.bebes for select 
  using (auth.uid() = usuario_id);

create policy "Usuarios pueden registrar bebes" 
  on public.bebes for insert 
  with check (auth.uid() = usuario_id);

create policy "Usuarios pueden modificar sus propios bebes" 
  on public.bebes for update 
  using (auth.uid() = usuario_id);

create policy "Usuarios pueden eliminar sus propios bebes" 
  on public.bebes for delete 
  using (auth.uid() = usuario_id);

create policy "Admins pueden ver todos los bebes"
  on public.bebes for select
  using (
    public.is_admin()
  );

create policy "Admins pueden modificar cualquier bebe"
  on public.bebes for all
  using (
    public.is_admin()
  );


-- =========================================================================
-- TABLA: citas
-- Almacena las citas médicas, vacunación, controles y gestión de pagos
-- =========================================================================
create table public.citas (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  bebe_id uuid references public.bebes(id) on delete cascade not null,
  tipo text not null, -- 'TANI CONSULTORÍA', 'CITA EXTERNA', 'PEDIATRÍA', 'CRED', 'LACTANCIA', etc.
  color text not null, -- Código HEX de color
  titulo text not null,
  hora text not null, -- Horario formateado
  lugar text not null,
  nota text, -- Notas del paciente o síntomas principales
  tipo_icon text not null,
  doctor text,
  pago_estado text default 'Pendiente' check (pago_estado in ('Pendiente', 'Verificando', 'Confirmado')) not null,
  pago_monto text default 'S/. 0.00' not null,
  recibo_url text, -- Ruta en Supabase Storage del comprobante
  clinical_notes text, -- Notas redactadas por el administrador o especialista médico
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.citas enable row level security;

-- Políticas RLS para "citas"
create policy "Usuarios pueden ver sus propias citas" 
  on public.citas for select 
  using (auth.uid() = usuario_id);

create policy "Usuarios pueden crear citas" 
  on public.citas for insert 
  with check (auth.uid() = usuario_id);

create policy "Usuarios pueden actualizar sus citas" 
  on public.citas for update 
  using (auth.uid() = usuario_id);

create policy "Usuarios pueden eliminar sus citas" 
  on public.citas for delete 
  using (auth.uid() = usuario_id);

create policy "Admins pueden ver todas las citas de la plataforma"
  on public.citas for select
  using (
    public.is_admin()
  );

create policy "Admins pueden gestionar todas las citas"
  on public.citas for all
  using (
    public.is_admin()
  );


-- =========================================================================
-- TABLA: notas_cita
-- Detalles dinámicos, estado de ánimo o checklists de preparación para la cita
-- =========================================================================
create table public.notas_cita (
  id uuid default gen_random_uuid() primary key,
  cita_id uuid references public.citas(id) on delete cascade not null,
  mood text, -- 'great', 'ok', 'tired', 'sad', 'mom'
  priority text default 'normal' not null, -- 'normal', 'important'
  details jsonb not null default '[]'::jsonb, -- Array JSON: [{"id": "1", "text": "Pregunta...", "completed": false}]
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notas_cita enable row level security;

-- Políticas RLS para "notas_cita"
create policy "Usuarios pueden ver notas de sus citas" 
  on public.notas_cita for select 
  using (
    exists (
      select 1 from public.citas 
      where citas.id = notas_cita.cita_id 
      and citas.usuario_id = auth.uid()
    )
  );

create policy "Usuarios pueden crear notas en sus citas" 
  on public.notas_cita for insert 
  with check (
    exists (
      select 1 from public.citas 
      where citas.id = cita_id 
      and citas.usuario_id = auth.uid()
    )
  );

create policy "Usuarios pueden actualizar notas de sus citas" 
  on public.notas_cita for update 
  using (
    exists (
      select 1 from public.citas 
      where citas.id = notas_cita.cita_id 
      and citas.usuario_id = auth.uid()
    )
  );

create policy "Usuarios pueden eliminar notas de sus citas" 
  on public.notas_cita for delete 
  using (
    exists (
      select 1 from public.citas 
      where citas.id = notas_cita.cita_id 
      and citas.usuario_id = auth.uid()
    )
  );

create policy "Admins pueden ver todas las notas de citas"
  on public.notas_cita for select
  using (
    public.is_admin()
  );

create policy "Admins pueden gestionar todas las notas de citas"
  on public.notas_cita for all
  using (
    public.is_admin()
  );


-- =========================================================================
-- TABLA: anuncios
-- Campañas publicitarias, avisos e información difundida por el administrador
-- =========================================================================
create table public.anuncios (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  cuerpo text not null,
  target_grupo_edad text default 'Todos' not null, -- 'Todos', '0-3 meses', '4-6 meses', '7-12 meses', '12 meses+'
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.anuncios enable row level security;

-- Políticas RLS para "anuncios"
create policy "Cualquiera puede leer anuncios"
  on public.anuncios for select
  using (true);

create policy "Admins pueden gestionar anuncios"
  on public.anuncios for all
  using (
    public.is_admin()
  );


-- =========================================================================
-- TABLA: materiales_educativos
-- Contenido educativo interactivo segmentado para la pestaña "Aprende"
-- =========================================================================
create table public.materiales_educativos (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  tag text not null, -- 'LACTANCIA', 'APEGO', 'RECETA MINSA', 'NUTRICIÓN', etc.
  descripcion text not null,
  duracion text not null, -- ej: "5 pasos", "10 min lectura"
  icono text default 'book-outline' not null,
  imagen_url text,
  rango_edad_min integer default 0 not null, -- En meses
  rango_edad_max integer default 999 not null, -- En meses
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.materiales_educativos enable row level security;

-- Políticas RLS para "materiales_educativos"
create policy "Cualquiera puede leer los materiales educativos"
  on public.materiales_educativos for select
  using (true);

create policy "Admins pueden gestionar materiales educativos"
  on public.materiales_educativos for all
  using (
    public.is_admin()
  );


-- =========================================================================
-- TABLA: hitos_desarrollo
-- Hitos cognitivos, físicos y sociales configurados por el administrador
-- =========================================================================
create table public.hitos_desarrollo (
  id uuid default gen_random_uuid() primary key,
  rango_edad_min integer default 0 not null, -- En meses
  rango_edad_max integer default 999 not null, -- En meses
  rango_titulo text not null, -- Ej: "Meses 1-3: Adaptación y Apego"
  hito_codigo text not null, -- Ej: "c1", "c2", "c3"
  hito_texto text not null, -- Ej: "Sigue objetos en movimiento con la mirada"
  bento_cognitivo text,
  bento_social text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_hito_rango unique (rango_edad_min, rango_edad_max, hito_codigo)
);

alter table public.hitos_desarrollo enable row level security;

-- Políticas RLS para "hitos_desarrollo"
create policy "Cualquiera puede consultar los hitos de desarrollo"
  on public.hitos_desarrollo for select
  using (true);

create policy "Admins pueden gestionar los hitos de desarrollo"
  on public.hitos_desarrollo for all
  using (
    public.is_admin()
  );


-- =========================================================================
-- TABLA: hitos_completados_bebe
-- Persistencia de los hitos superados por cada bebé
-- =========================================================================
create table public.hitos_completados_bebe (
  id uuid default gen_random_uuid() primary key,
  bebe_id uuid references public.bebes(id) on delete cascade not null,
  hito_id uuid references public.hitos_desarrollo(id) on delete cascade not null,
  completado boolean default true not null,
  fecha_registro timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_bebe_hito unique (bebe_id, hito_id)
);

alter table public.hitos_completados_bebe enable row level security;

-- Políticas RLS para "hitos_completados_bebe"
create policy "Usuarios pueden ver hitos de sus bebes"
  on public.hitos_completados_bebe for select
  using (
    exists (
      select 1 from public.bebes
      where bebes.id = hitos_completados_bebe.bebe_id
      and bebes.usuario_id = auth.uid()
    )
  );

create policy "Usuarios pueden registrar hitos de sus bebes"
  on public.hitos_completados_bebe for insert
  with check (
    exists (
      select 1 from public.bebes
      where bebes.id = bebe_id
      and bebes.usuario_id = auth.uid()
    )
  );

create policy "Usuarios pueden actualizar hitos de sus bebes"
  on public.hitos_completados_bebe for update
  using (
    exists (
      select 1 from public.bebes
      where bebes.id = hitos_completados_bebe.bebe_id
      and bebes.usuario_id = auth.uid()
    )
  );

create policy "Usuarios pueden borrar hitos de sus bebes"
  on public.hitos_completados_bebe for delete
  using (
    exists (
      select 1 from public.bebes
      where bebes.id = hitos_completados_bebe.bebe_id
      and bebes.usuario_id = auth.uid()
    )
  );

create policy "Admins pueden ver todos los hitos completados de los bebes"
  on public.hitos_completados_bebe for select
  using (
    public.is_admin()
  );

create policy "Admins pueden modificar cualquier hito de bebe"
  on public.hitos_completados_bebe for all
  using (
    public.is_admin()
  );
