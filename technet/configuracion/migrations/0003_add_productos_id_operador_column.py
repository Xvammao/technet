from django.db import migrations


class Migration(migrations.Migration):
    """
    Agrega la columna id_operador a la tabla productos.

    El modelo Productos.id_operador (FK a Operadores) ya existia en el
    codigo, pero la columna nunca se creo en algunas bases de datos
    (p.ej. produccion en Railway), lo que causaba:
        ProgrammingError: column productos.id_operador does not exist
    en /productos/ y en /instalaciones/ (por el select_related a Productos).

    Usa IF NOT EXISTS / comprobaciones para ser idempotente y no fallar
    en entornos donde la columna ya exista.
    """

    dependencies = [
        ('configuracion', '0002_alter_instalaciones_tipo_orden_set_null'),
    ]

    operations = [
        migrations.RunSQL(
            sql=[
                "ALTER TABLE productos ADD COLUMN IF NOT EXISTS id_operador integer NULL;",
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints tc
                        JOIN information_schema.key_column_usage kcu
                            ON tc.constraint_name = kcu.constraint_name
                        WHERE tc.table_name = 'productos'
                          AND tc.constraint_type = 'FOREIGN KEY'
                          AND kcu.column_name = 'id_operador'
                    ) THEN
                        ALTER TABLE productos
                        ADD CONSTRAINT productos_id_operador_fk
                        FOREIGN KEY (id_operador)
                        REFERENCES operadores(id_ope);
                    END IF;
                END $$;
                """,
            ],
            reverse_sql=[
                "ALTER TABLE productos DROP CONSTRAINT IF EXISTS productos_id_operador_fk;",
                "ALTER TABLE productos DROP COLUMN IF EXISTS id_operador;",
            ],
        ),
    ]
