# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Acometidas(models.Model):
    id_acometida = models.AutoField(primary_key=True)
    nombre_acometida = models.CharField(unique=True, max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'acometidas'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class Descuentos(models.Model):
    id_descuento = models.AutoField(primary_key=True)
    valor_descuento = models.DecimalField(max_digits=10, decimal_places=2)
    id_instalacion = models.ForeignKey('Instalaciones', models.DO_NOTHING, db_column='id_instalacion')

    class Meta:
        managed = False
        db_table = 'descuentos'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Dr(models.Model):
    id_dr = models.AutoField(primary_key=True)
    nombre_dr = models.CharField(unique=True, max_length=100)
    valor_dr = models.DecimalField(max_digits=10, decimal_places=2)
    valor_dr_empresa = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'dr'


class Instalaciones(models.Model):
    id_instalacion = models.AutoField(primary_key=True)
    fecha_instalacion = models.DateField()
    id_tecnico = models.ForeignKey('Tecnicos', models.DO_NOTHING, db_column='id_tecnico')
    id_operador = models.ForeignKey('Operadores', models.DO_NOTHING, db_column='id_operador')
    direccion = models.TextField()
    numero_ot = models.CharField(unique=True, max_length=50)
    producto_serie = models.ForeignKey('Productos', models.DO_NOTHING, db_column='producto_serie', to_field='producto_serie')
    id_dr = models.ForeignKey(Dr, models.DO_NOTHING, db_column='id_dr')
    eq_reutilizado = models.CharField(blank=True, null=True)
    eq_retirado = models.CharField(blank=True, null=True)
    id_tipo_orden = models.ForeignKey('Tipodeordenes', models.DO_NOTHING, db_column='id_tipo_orden')
    metros_cable = models.DecimalField(max_digits=10, decimal_places=2)
    id_acometida = models.ForeignKey(Acometidas, models.DO_NOTHING, db_column='id_acometida')
    observaciones = models.TextField(blank=True, null=True)
    valor_añadido = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_opcional_empresa = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_dr = models.DecimalField(max_digits=10, decimal_places=2)
    valor_orden = models.DecimalField(max_digits=10, decimal_places=2)
    valor_orden_empresa = models.DecimalField(max_digits=10, decimal_places=2)
    valor_dr_empresa = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    instalacion_compartida = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_total_empresa = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'instalaciones'


class Operadores(models.Model):
    id_ope = models.AutoField(primary_key=True)
    nombre_operador = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'operadores'


class Productos(models.Model):
    id_producto = models.AutoField(primary_key=True)
    categoria = models.CharField(max_length=100)
    nombre_producto = models.CharField(max_length=100)
    producto_serie = models.CharField(unique=True, max_length=100)
    cantidad = models.IntegerField()
    id_tecnico = models.ForeignKey('Tecnicos', models.DO_NOTHING, db_column='id_tecnico')
    fecha_asignacion = models.DateField()

    class Meta:
        managed = False
        db_table = 'productos'


class Tecnicos(models.Model):
    id_unico_tecnico = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    id_tecnico = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'tecnicos'


class Tipodeordenes(models.Model):
    id_tipo_orden = models.AutoField(primary_key=True)
    nombre_orden = models.CharField(max_length=100)
    valor_orden = models.DecimalField(max_digits=10, decimal_places=2)
    valor_orden_empresa = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'tipodeordenes'
