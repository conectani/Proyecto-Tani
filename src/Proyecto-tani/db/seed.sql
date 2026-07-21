-- =========================================================================
-- SQL Seed de Datos de Prueba para Supabase (Tani App & Tani Admin)
-- Ejecutar este archivo completo en el SQL Editor después de correr schema.sql
-- =========================================================================

-- Asegurar extensiones necesarias
create extension if not exists pgcrypto;

-- Limpiar datos de prueba existentes (Opcional, en orden de dependencias)
truncate table public.hitos_completados_bebe cascade;
truncate table public.hitos_desarrollo cascade;
truncate table public.materiales_educativos cascade;
truncate table public.anuncios cascade;
truncate table public.notas_cita cascade;
truncate table public.citas cascade;
truncate table public.bebes cascade;
truncate table public.usuarios cascade;

-- Eliminar usuarios anteriores de auth si existen para evitar duplicados
delete from auth.users where email in (
  'admin@tani.app', 
  'estefany@tani.app', 
  'maria@tani.app', 
  'rosa@tani.app', 
  'sofia@tani.app'
);

-- Definir IDs fijos para poder relacionar la semilla perfectamente
do $$
declare
  admin_id uuid := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  mother_1_id uuid := 'f8c9d0e1-a2b3-4c5d-6e7f-8a9b0c1d2e3f'; -- Estefany
  mother_2_id uuid := 'f8c9d0e2-a2b3-4c5d-6e7f-8a9b0c1d2e3f'; -- Maria
  mother_3_id uuid := 'f8c9d0e3-a2b3-4c5d-6e7f-8a9b0c1d2e3f'; -- Rosa
  mother_4_id uuid := 'f8c9d0e4-a2b3-4c5d-6e7f-8a9b0c1d2e3f'; -- Sofia

  baby_1_id uuid := 'b0be1234-5678-1234-5678-1234567890ab'; -- Aitana
  baby_2_id uuid := 'b0be1234-5678-1234-5678-1234567890cd'; -- Mateo
  baby_3_id uuid := 'b0be1234-5678-1234-5678-1234567890ef'; -- Liam
  baby_4_id uuid := 'b0be1234-5678-1234-5678-1234567890gh'; -- Camila

  appointment_1 uuid := 'c1c2c3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c';
  appointment_2 uuid := 'c2c2c2c2-d2d2-2d2d-2d2d-2d2d2d2d2d2d';
  appointment_3 uuid := 'c3c3c3c3-d3d3-3d3d-3d3d-3d3d3d3d3d3d';
  appointment_4 uuid := 'c4c4c4c4-d4d4-4d4d-4d4d-4d4d4d4d4d4d';

  announcement_1 uuid := 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
  announcement_2 uuid := 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2';
  milestone_1 uuid := 'd1e1a1b1-1111-1111-1111-111111111111';
  milestone_2 uuid := 'd2e2a2b2-2222-2222-2222-222222222222';
  milestone_3 uuid := 'd3e3a3b3-3333-3333-3333-333333333333';
begin

  -- 1. REGISTRAR ADMINISTRADOR EN AUTH (Contraseña: Rodrigom@llqui)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, email_change, 
    email_change_token_new, recovery_token, email_change_token_current, phone_change_token
  ) values (
    admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin@tani.app', crypt('Rodrigom@llqui', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Rodrigo","apellido":"Mallqui","dni":"00000000","rol":"admin","telefono":"+51 987 654 321"}',
    now(), now(), '', '', '', '', '', ''
  );
  update public.usuarios set rol = 'admin' where id = admin_id;

  -- 2. REGISTRAR MADRE 1: Estefany Gomez (Contraseña: Estefany123)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, email_change, 
    email_change_token_new, recovery_token, email_change_token_current, phone_change_token
  ) values (
    mother_1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'estefany@tani.app', crypt('Estefany123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Estefany","apellido":"Gomez","dni":"12345678","rol":"madre","telefono":"+51 912 345 678"}',
    now(), now(), '', '', '', '', '', ''
  );

  -- 3. REGISTRAR MADRE 2: Maria Fernandez (Contraseña: Maria12345)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, email_change, 
    email_change_token_new, recovery_token, email_change_token_current, phone_change_token
  ) values (
    mother_2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'maria@tani.app', crypt('Maria12345', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Maria","apellido":"Fernandez","dni":"72819203","rol":"madre","telefono":"+51 981 234 567"}',
    now(), now(), '', '', '', '', '', ''
  );

  -- 4. REGISTRAR MADRE 3: Rosa Quispe (Contraseña: Rosa12345)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, email_change, 
    email_change_token_new, recovery_token, email_change_token_current, phone_change_token
  ) values (
    mother_3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'rosa@tani.app', crypt('Rosa12345', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Rosa","apellido":"Quispe","dni":"45892019","rol":"madre","telefono":"+51 974 561 238"}',
    now(), now(), '', '', '', '', '', ''
  );

  -- 5. REGISTRAR MADRE 4: Sofia Ramos (Contraseña: Sofia12345)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, email_change, 
    email_change_token_new, recovery_token, email_change_token_current, phone_change_token
  ) values (
    mother_4_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'sofia@tani.app', crypt('Sofia12345', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Sofia","apellido":"Ramos","dni":"61029384","rol":"madre","telefono":"+51 963 852 741"}',
    now(), now(), '', '', '', '', '', ''
  );

  -- REGISTRAR BEBÉS ASOCIADOS
  insert into public.bebes (id, usuario_id, nombre, fecha_nacimiento, peso_inicial, es_favorito, es_activo) values 
    (baby_1_id, mother_1_id, 'Aitana', '2025-10-15', '3.4 kg', true, true),
    (baby_2_id, mother_2_id, 'Mateo', '2025-05-10', '3.8 kg', true, true),
    (baby_3_id, mother_3_id, 'Liam', '2025-12-01', '2.9 kg', true, true),
    (baby_4_id, mother_4_id, 'Camila', '2026-04-15', '3.2 kg', true, true);

  -- REGISTRAR ANUNCIOS
  insert into public.anuncios (id, titulo, cuerpo, target_grupo_edad, fecha_creacion) values 
    (announcement_1, 'Taller de Lactancia Acompañada', 'Únete al taller presencial este sábado a las 10:00 AM en la sede central de Tani. ¡Aprende técnicas sin dolor!', '0-3 meses', now() - interval '2 days'),
    (announcement_2, 'Campaña Nacional contra la Anemia', 'Estaremos entregando suplementos de hierro gratuitos de forma coordinada con el MINSA.', 'Todos', now());

  -- REGISTRAR MATERIALES EDUCATIVOS
  insert into public.materiales_educativos (titulo, tag, descripcion, duracion, icono, imagen_url, rango_edad_min, rango_edad_max) values 
    ('Técnicas de Agarre Correcto', 'LACTANCIA', 'Aprende a evitar las grietas y optimizar la succión para una alimentación feliz y sin dolor.', 'Guía de 5 pasos', 'book-outline', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOSbzmn_xadKosD5dYU5zDT-ykmPIk_S638r5tkE_v_34rXeESoNwxVTa2CM2l4ofSLnyF5RWmn6t3pYotLy3BSaq960ljSfc22ij1PomCIyxfcmFRkrpYO2hgLKqo4cPBNKMHlJZCYdlE3-zV8-vZjn2ScocIuVC6MlCqCe_7aWiyhazJrE5-9bUutEjU3tHYVb_U8qoNpQ3rIpJkeJQthXThyqNcU0teibkejj4vg_aLIrwCgEd8gVBwyqQMU1EgJcBb4GAJGw', 0, 5),
    ('Beneficios del Piel a Piel', 'APEGO', 'Descubre cómo regula la temperatura, estabiliza el ritmo cardíaco y fomenta el vínculo materno.', '10 min lectura', 'time-outline', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4J2btLI94crP8TrUktNuXNS7Gi_ktU99dW9O6vKCQNM89-470s-bpF9lYV282DZwK9HObHxkfEo2_a5upxr8YAsDDZj6-v2Icu9p_jXYbrA0FwfMwNF2u6LrgcywdZIiqvpz0PC_83_t1-aqyNob-Dd1JVEYQ2dhjO9Pxzbw85yGH0oBiSqTbN_2xP-jmexUNWaGQkZe1lkECL0Px3LSSkPNjH1Qj9wAlw_nl4FIhnop5dwNmr4CyVxzheer8IhBMEbW1XwJYJFE', 0, 5);

  -- REGISTRAR CITAS CLÍNICAS
  insert into public.citas (id, usuario_id, bebe_id, tipo, color, titulo, hora, lugar, nota, tipo_icon, doctor, pago_estado, pago_monto) values 
    (appointment_1, mother_1_id, baby_1_id, 'CRED', '#499F86', 'Control CRED 6 Meses', '25 Oct, 09:30 AM', 'Tani Center - Sede Principal', 'Llevar carnet impreso', 'calendar-outline', 'Dr. Ramírez', 'Confirmado', 'S/. 50.00'),
    (appointment_2, mother_1_id, baby_1_id, 'LACTANCIA', '#006953', 'Asesoría Especializada', '08 Jun, 11:00 AM', 'Tani Center - Box A', 'Dificultad agarre', 'happy-outline', 'Lic. Gladys Torres', 'Verificando', 'S/. 40.00'),
    (appointment_3, mother_2_id, baby_2_id, 'CRED', '#499F86', 'Control CRED 12 Meses', '15 Nov, 10:00 AM', 'Tani Center - Sede SJL', 'Evaluación de marcha', 'calendar-outline', 'Dra. Carmen Pérez', 'Confirmado', 'S/. 50.00'),
    (appointment_4, mother_3_id, baby_3_id, 'ANEMIA', '#D9534F', 'Tamizaje de Hemoglobina', '20 Nov, 08:30 AM', 'Tani Center - Lab 2', 'Descarte de anemia', 'medkit-outline', 'Dr. Mendoza', 'Confirmado', 'Gratuito');

end $$;
