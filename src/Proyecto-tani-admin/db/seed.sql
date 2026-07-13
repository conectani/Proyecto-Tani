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

  -- NOTA: Supabase Auth gestiona los usuarios en auth.users. 
  -- Para evitar errores de sincronización y que los disparadores funcionen correctamente,
  -- crearemos directamente los usuarios en auth.users y el trigger insertará los perfiles correspondientes en public.usuarios.

  -- Eliminar usuarios anteriores de auth si existen para evitar duplicados
  delete from auth.users where email in ('admin@tani.app', 'estefany@tani.app');

  -- Definir IDs fijos para poder relacionar la semilla perfectamente
  do $$
  declare
    admin_id uuid := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
    mother_id uuid := 'f8c9d0e1-a2b3-4c5d-6e7f-8a9b0c1d2e3f';
    baby_id uuid := 'b0be1234-5678-1234-5678-1234567890ab';
    appointment_1 uuid := 'c1c2c3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c';
    appointment_2 uuid := 'c2c2c2c2-d2d2-2d2d-2d2d-2d2d2d2d2d2d';
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

    -- Actualizar el rol público a 'admin' (el trigger lo crea por defecto como madre)
    update public.usuarios set rol = 'admin' where id = admin_id;

    -- 2. REGISTRAR MADRE EN AUTH (Contraseña: Estefany123)
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password, 
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
      created_at, updated_at, confirmation_token, email_change, 
      email_change_token_new, recovery_token, email_change_token_current, phone_change_token
    ) values (
      mother_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'estefany@tani.app', crypt('Estefany123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}',
      '{"nombre":"Estefany","apellido":"Gomez","dni":"12345678","rol":"madre","telefono":"+51 912 345 678"}',
      now(), now(), '', '', '', '', '', ''
    );

    -- 3. REGISTRAR BEBÉ (Aitana, asociada a la Madre Estefany)
    insert into public.bebes (
      id, usuario_id, nombre, fecha_nacimiento, peso_inicial, es_favorito, es_activo
    ) values (
      baby_id, mother_id, 'Aitana', '2025-10-15', '3.4 kg', true, true
    );

    -- 4. REGISTRAR ANUNCIOS (Publicados por el administrador)
    insert into public.anuncios (id, titulo, cuerpo, target_grupo_edad, fecha_creacion)
    values 
      (announcement_1, 'Taller de Lactancia Acompañada', 'Únete al taller presencial este sábado a las 10:00 AM en la sede central de Tani. ¡Aprende técnicas sin dolor!', '0-3 meses', now() - interval '2 days'),
      (announcement_2, 'Campaña Nacional contra la Anemia', 'Estaremos entregando suplementos de hierro gratuitos de forma coordinada con el MINSA.', 'Todos', now());

    -- 5. REGISTRAR MATERIALES EDUCATIVOS ("Aprende")
    insert into public.materiales_educativos (titulo, tag, descripcion, duracion, icono, imagen_url, rango_edad_min, rango_edad_max)
    values 
      ('Técnicas de Agarre Correcto', 'LACTANCIA', 'Aprende a evitar las grietas y optimizar la succión para una alimentación feliz y sin dolor.', 'Guía de 5 pasos', 'book-outline', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzOSbzmn_xadKosD5dYU5zDT-ykmPIk_S638r5tkE_v_34rXeESoNwxVTa2CM2l4ofSLnyF5RWmn6t3pYotLy3BSaq960ljSfc22ij1PomCIyxfcmFRkrpYO2hgLKqo4cPBNKMHlJZCYdlE3-zV8-vZjn2ScocIuVC6MlCqCe_7aWiyhazJrE5-9bUutEjU3tHYVb_U8qoNpQ3rIpJkeJQthXThyqNcU0teibkejj4vg_aLIrwCgEd8gVBwyqQMU1EgJcBb4GAJGw', 0, 5),
      ('Beneficios del Piel a Piel', 'APEGO', 'Descubre cómo regula la temperatura, estabiliza el ritmo cardíaco y fomenta el vínculo materno.', '10 min lectura', 'time-outline', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4J2btLI94crP8TrUktNuXNS7Gi_ktU99dW9O6vKCQNM89-470s-bpF9lYV282DZwK9HObHxkfEo2_a5upxr8YAsDDZj6-v2Icu9p_jXYbrA0FwfMwNF2u6LrgcywdZIiqvpz0PC_83_t1-aqyNob-Dd1JVEYQ2dhjO9Pxzbw85yGH0oBiSqTbN_2xP-jmexUNWaGQkZe1lkECL0Px3LSSkPNjH1Qj9wAlw_nl4FIhnop5dwNmr4CyVxzheer8IhBMEbW1XwJYJFE', 0, 5),
      ('Papilla Nutritiva de Hígado', 'RECETA MINSA', 'La mejor receta a base de hígado de pollo y camote para prevenir la anemia a partir de los 6 meses.', '15 min preparación', 'time-outline', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4J2btLI94crP8TrUktNuXNS7Gi_ktU99dW9O6vKCQNM89-470s-bpF9lYV282DZwK9HObHxkfEo2_a5upxr8YAsDDZj6-v2Icu9p_jXYbrA0FwfMwNF2u6LrgcywdZIiqvpz0PC_83_t1-aqyNob-Dd1JVEYQ2dhjO9Pxzbw85yGH0oBiSqTbN_2xP-jmexUNWaGQkZe1lkECL0Px3LSSkPNjH1Qj9wAlw_nl4FIhnop5dwNmr4CyVxzheer8IhBMEbW1XwJYJFE', 6, 12);

    -- 6. REGISTRAR HITOS DE DESARROLLO ESTÁNDAR
    insert into public.hitos_desarrollo (id, rango_edad_min, rango_edad_max, rango_titulo, hito_codigo, hito_texto, bento_cognitivo, bento_social)
    values 
      (milestone_1, 6, 7, 'Meses 6-7: El Gran Cambio', 'c1', 'Se mantiene sentado sin apoyo', 'Exploración táctil activa', 'Primeros balbuceos'),
      (milestone_2, 6, 7, 'Meses 6-7: El Gran Cambio', 'c2', 'Inicia alimentación sólida (papillas)', 'Busca sabores nuevos', 'Interés en la comida familiar'),
      (milestone_3, 6, 7, 'Meses 6-7: El Gran Cambio', 'c3', 'Pasa objetos de una mano a otra', 'Coordinación visomotora', 'Juega de forma independiente');

    -- Registrar un hito como ya completado por Aitana (6 meses de edad)
    insert into public.hitos_completados_bebe (bebe_id, hito_id, completado)
    values (baby_id, milestone_1, true);

    -- 7. REGISTRAR CITAS DE PRUEBA
    -- Cita 1: Control CRED en Sede Principal (Confirmado)
    insert into public.citas (
      id, usuario_id, bebe_id, tipo, color, titulo, hora, lugar, nota, tipo_icon, doctor, pago_estado, pago_monto
    ) values (
      appointment_1, mother_id, baby_id, 'CRED', '#499F86', 'Control CRED 6 Meses', 
      '25 Oct, 09:30 AM', 'Tani Center - Sede Principal', 'Llevar carnet de vacunación impreso.', 
      'calendar-outline', 'Dr. Ramírez', 'Confirmado', 'S/. 50.00'
    );

    -- Nota de Cita para Cita 1
    insert into public.notas_cita (cita_id, mood, priority, details)
    values (
      appointment_1, 'ok', 'normal', 
      '[{"id": "1", "text": "Consultar si es normal que babee tanto por los dientes", "completed": true}, {"id": "2", "text": "Preguntar sobre la dosis de hierro en gotas", "completed": false}]'::jsonb
    );

    -- Cita 2: Asesoría de Lactancia (Verificando pago)
    insert into public.citas (
      id, usuario_id, bebe_id, tipo, color, titulo, hora, lugar, nota, tipo_icon, doctor, pago_estado, pago_monto
    ) values (
      appointment_2, mother_id, baby_id, 'LACTANCIA', '#006953', 'Asesoría Especializada de Lactancia', 
      '08 Jun, 11:00 AM', 'Tani Center - Box A', 'Presenta dificultad con el agarre del pecho izquierdo.', 
      'happy-outline', 'Lic. Gladys Torres', 'Verificando', 'S/. 40.00'
    );

  end $$;
