from django.db import migrations


class Migration(migrations.Migration):
    """
    Altera el constraint FK de instalaciones.id_tipo_orden para que sea:
    - Nullable (permite NULL)
    - ON DELETE SET NULL (en lugar de RESTRICT/CASCADE)
    
    Esto garantiza que al eliminar un tipo de orden, las instalaciones
    relacionadas no se eliminen, sino que su id_tipo_orden quede en NULL.
    """

    dependencies = [
        ('configuracion', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            # Forward: hacer la columna nullable y cambiar el constraint a SET NULL
            sql=[
                # 1. Eliminar el constraint FK existente
                """
                DO $$
                DECLARE
                    constraint_name TEXT;
                BEGIN
                    SELECT tc.constraint_name INTO constraint_name
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu
                        ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'instalaciones'
                      AND tc.constraint_type = 'FOREIGN KEY'
                      AND kcu.column_name = 'id_tipo_orden';
                    
                    IF constraint_name IS NOT NULL THEN
                        EXECUTE 'ALTER TABLE instalaciones DROP CONSTRAINT ' || quote_ident(constraint_name);
                    END IF;
                END $$;
                """,
                # 2. Hacer la columna nullable
                "ALTER TABLE instalaciones ALTER COLUMN id_tipo_orden DROP NOT NULL;",
                # 3. Agregar nuevo constraint con ON DELETE SET NULL
                """
                ALTER TABLE instalaciones
                ADD CONSTRAINT instalaciones_id_tipo_orden_fk
                FOREIGN KEY (id_tipo_orden)
                REFERENCES tipodeordenes(id_tipo_orden)
                ON DELETE SET NULL;
                """,
            ],
            # Reverse: restaurar el constraint original (NOT NULL, sin SET NULL)
            reverse_sql=[
                "ALTER TABLE instalaciones DROP CONSTRAINT IF EXISTS instalaciones_id_tipo_orden_fk;",
                "ALTER TABLE instalaciones ALTER COLUMN id_tipo_orden SET NOT NULL;",
                """
                ALTER TABLE instalaciones
                ADD CONSTRAINT instalaciones_id_tipo_orden_fk_orig
                FOREIGN KEY (id_tipo_orden)
                REFERENCES tipodeordenes(id_tipo_orden);
                """,
            ],
        ),
    ]
