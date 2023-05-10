drop database if exists managebd;

create database managebd;
use managebd;

/* --------------------- ----------------- -------------*/

drop table if exists permisos_grupos;

create table permisos_grupos(
id_permiso_grupos int primary key,
nombre varchar(20) not null);

insert into permisos_grupos ( id_permiso_grupos, nombre ) values (1, 'ADMIN');
insert into permisos_grupos ( id_permiso_grupos, nombre ) values (2, 'EDITOR');
insert into permisos_grupos ( id_permiso_grupos, nombre ) values (3, 'VIEWER');

/* --------------------- ----------------- -------------*/

drop table if exists permisos_usuarios;

create table permisos_usuarios(
id_permiso_usuario int primary key,
nombre varchar(20) not null);

insert into permisos_usuarios ( id_permiso_usuario, nombre ) values (1, 'ADMINISTRATOR');
insert into permisos_usuarios ( id_permiso_usuario, nombre ) values (2, 'USER');

/* --------------------- ----------------- -------------*/

drop table if exists usuarios;

create table usuarios(
id_usuario INT primary key auto_increment,
nombre varchar(20),
apellidos varchar(60),
usuario_chat varchar(20),
email varchar(60),
contrasenya varchar(200),
permisos int not null,
fecha_creacion date,
vigencia date,
constraint fk_usuario_permisos foreign key (permisos) references permisos_usuarios(id_permiso_usuario) );

insert into usuarios ( id_usuario, nombre, apellidos, usuario_chat, email, contrasenya, permisos, fecha_creacion, vigencia )
values ( null, 'admin', 'administrator', 'admin00', 'admin@gmail.com', '1234567890', 1, null, null);
/* --------------------- ----------------- -------------*/

drop table if exists grupos;

create table grupos(
id_grupo INT primary key auto_increment,
nombre varchar(60),
administrador_grupo varchar(20),
descripcion varchar(200),
fecha_creacion date);

insert into grupos ( id_grupo, nombre, administrador_grupo, descripcion, fecha_creacion ) values ( null, 'AdminGrup00', 1, 'Primer grupo de la aplicacion', null);

/* --------------------- ----------------- -------------*/

drop table if exists miembros_grupos;

create table miembros_grupos(
cod_miembros int primary key auto_increment,
id_grup int not null,
id_usuario int not null,
permisos_grupo int not null,
fecha_creacion date,
constraint fk_grupo foreign key (id_grup) references grupos(id_grupo),
constraint fk_usuario foreign key (id_usuario ) references usuarios(id_usuario),
constraint fk_permisos_grupo foreign key (permisos_grupo) references permisos_grupos(id_permiso_grupos) );


insert into miembros_grupos ( cod_miembros, id_grup, id_usuario, permisos_grupo, fecha_creacion ) values ( null, 1, 1, 1, null);

/* --------------------- ----------------- -------------*/